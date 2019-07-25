package main

import (
	"github.com/gorilla/mux"
	"net/http"	 
)

func NewRouter() *mux.Router {

	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler
		handler = route.FunctionName
		handler = Logger(handler, route.Name)
		router.
			Methods(route.Method, "OPTIONS").
			Path(route.Path).
			Name(route.Name).
			Handler(handler)
	}
	return router
}

type MyServer struct {
	r *mux.Router
}

func (s *MyServer) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	rw.Header().Set("Content-Type", "application/json; charset=UTF-8")
	rw.Header().Set("Access-Control-Allow-Origin", "*")
	rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	rw.Header().Set("Access-Control-Allow-Headers", "Content-Type, authorization")	
	s.r.ServeHTTP(rw, req)
}
