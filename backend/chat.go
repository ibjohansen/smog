package main

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"github.com/gorilla/websocket"
	"encoding/json"
	"log"
	"time"
)

const A_INIT = "init"
const A_MESSAGE = "message"
const A_JOINED = "joined"
const A_CONNECTED = "connected"
const ACTION_POST = "post"

var backend Backend

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool { return true },
}

type User struct {
	conn *websocket.Conn
	UserId string		`json:"userId"`
	Name string		`json:"name"`
	Channels []*Channel	`json:"channels"`
}

type Message struct {
	UserId string	`json:"userId"`
	Channel string	`json:"channel"`
	Message string	`json:"message"`
	Name string	`json:"name"`
	Action string	`json:"action"`
	Type int
	At time.Time    `json:"at"`
	Log []*Message	`json:"log"`
}

type Channel struct {
	Name string		`json:"name"`
	Messages []*Message	`json:"messages"`
	Users []*User		`json:"users"`
}

func echoHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			return
		}
		var message *Message
		decodeJson(p, &message)
		message.At = time.Now()
		message.Type = messageType

		if message.Action == A_INIT {
			backend.JoinServerAndChannel(message, conn)
		} else if(message.Action == A_MESSAGE) {
			backend.PostToBackend(message, conn)
		}
	}
}

func messages(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	channel := ps.ByName("channel")
	if channel != "" {
		w.Write(encodeJson(backend.GetMessages(channel)))
	}
}

func users(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	channel := ps.ByName("channel")
	if channel != "" {
		w.Write(encodeJson(backend.GetUsers(channel)))
	}
}

func getUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username := ps.ByName("user")
	if username != "" {
		w.Write(encodeJson(backend.GetUser(username)))
	}
}

func decodeJson(b []byte, v interface{}) {
	err := json.Unmarshal(b, v)
	if err != nil {
		log.Print("Error decoding message ", err)
	}
}

func encodeJson(v interface{}) []byte {
	body, err := json.Marshal(v)

	if err != nil {
		log.Print("Error encoding json ", err)
	}
	return body
}

func withCors(w http.ResponseWriter, r *http.Request) {
	log.Print("here")
}

// func filserverWithCors(

func main() {

	backend = CreateInMemory()

	router := httprouter.New()
	router.GET("/echo", echoHandler)
	router.GET("/channel/:channel/messages", messages)
	router.GET("/channel/:channel/users", users)
	router.GET("/user/:user", getUser)
	router.NotFound = http.FileServer(http.Dir("../public"))

	handler := cors.Default().Handler(router)

	log.Print("Runs server on localhost:8080")

	log.Fatal(http.ListenAndServe(":8080", handler))
}
