package main

import (
	"log"
	"github.com/gorilla/websocket"
// "fmt"
	"time"
)

type Backend interface {
	GetChannels() map[string]*Channel
	GetMessages(channelName string) []*Message
	GetUsers(channelName string) []*User
	GetUser(username string) *User
	JoinServerAndChannel(m *Message, conn *websocket.Conn)
	PostToBackend(m *Message, conn *websocket.Conn)
}

type InMemory struct {
	users map[string]*User
	channels map[string]*Channel
}

func (b *InMemory) GetChannels() map[string]*Channel {
	return b.channels
}

/** All messages for a channel */
func (b *InMemory) GetMessages(channelName string) []*Message {
	channel := b.channels[channelName]
	if channel == nil {
		log.Printf("Channel %s does not exist", channelName)
		return nil
	} else {
		return channel.Messages
	}
}

/** All users in a channel */
func (b *InMemory) GetUsers(channelName string) []*User {
	channel := b.channels[channelName]
	if channel == nil {
		log.Printf("Channel %s does not exist", channelName)
		return nil
	} else {
		return channel.Users
	}
}

func (b *InMemory) GetUser(username string) *User {
	user := b.users[username]
	log.Print(user)
	if(user == nil) {
		log.Printf("User %s does not exist", username)
		return nil
	} else {
		return user.withChannels()
	}
}

func (b *InMemory) getOrCreateUser(m *Message, conn *websocket.Conn) *User {
	user := b.users[m.UserId]

	if user == nil {
		userId := m.UserId
		// TODO: Check success
		user = &User{UserId: userId, conn: conn, Name: m.Name}
		b.users[userId] = user
		b.NotifyChannel(m, A_INIT)
	} else if user != nil && m.Action == A_INIT {
		// Already connected, reset connection
		user.conn = conn
		b.NotifyChannel(m, A_CONNECTED)
	}
	return user
}

func (b *InMemory) JoinServerAndChannel(m *Message, conn *websocket.Conn) {
	user := b.getOrCreateUser(m, conn)
	if user == nil {
		log.Print("Unable to get user ", m)
		return
	}
	b.Join(user, m)
}

func (b *InMemory) PostToBackend(m *Message, conn *websocket.Conn) {
	user := b.getOrCreateUser(m, conn)
	channel := b.getOrCreateChannel(m.Channel)

	if user == nil {
		log.Print("Unable to get user ", m)
		return
	}
	log.Printf("Posts %s to channel %s for user %s", m.Message, m.Channel, user.UserId)

	if !user.inChannel(channel) {
		b.Join(user, m)
	}
	b.NotifyChannel(m, A_MESSAGE)
}

func (u *User) inChannel(channel *Channel) bool {
	for _, channelUser := range channel.Users {
		if(channelUser.Name == u.Name) {
			return true;
		}
	}
	return false
}

func (u *User) withChannels() *User {
	channels := make([]*Channel, 0)
	for _, channel := range(channels) {
		if(u.inChannel(channel)) {
			channels = append(channels, channel)
		}
	}
	return &User{UserId: u.UserId, Name: u.Name, Channels: channels}
}

func (c *Channel) appendMessage(m *Message) {
	c.Messages = append(c.Messages, m)
	log.Print("Added message ", m)
}

func (b *InMemory) getOrCreateChannel(name string) *Channel {
	channel := b.channels[name]
	if channel == nil {
		b.channels[name] = &Channel{Name: name, Messages: make([]*Message, 0)}
	}
	return b.channels[name]
}

func (b *InMemory) Join(u *User, m *Message) {
	channel := b.getOrCreateChannel(m.Channel)
	if(!u.inChannel(channel)) {
		channel.Users = append(channel.Users, u)
	}
	// Create response with last log
	response := &Message{UserId: u.UserId, Action: A_CONNECTED, Log: Filter(channel.Messages, func(m *Message) bool {
		return m.Action == "message"
	})}
	err := u.conn.WriteMessage(1, encodeJson(response));
	if err != nil {
		log.Print("Error sending message ", err)
	}
	log.Printf("User %s joined channel %s", u.UserId, m.Channel)
}

func (b *InMemory) NotifyChannel(m *Message, action string) {
	channel := b.getOrCreateChannel(m.Channel)
	responseMessage := &Message{UserId: m.UserId, Name: m.Name, Action: action, Message: m.Message, At: time.Now()}
	response := encodeJson(responseMessage)

	for k, _ := range b.users {
		user := b.users[k]
		if(user.inChannel(channel)) {
			err := user.conn.WriteMessage(1, response);
			if  err != nil {
				log.Print("Unable to send message ", err)
			}
		}
	}
	channel.appendMessage(responseMessage)
}

func CreateInMemory() *InMemory {
	return &InMemory{users: make(map[string]*User), channels: make(map[string]*Channel)}
}
