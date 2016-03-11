package main

func Filter(vs []*Message, f func(*Message) bool) []*Message {
	vsf := make([]*Message, 0)
	for _, v := range vs {
		if f(v) {
			vsf = append(vsf, v)
		}
	}
	return vsf
}
