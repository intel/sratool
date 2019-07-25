package main

import (
	"fmt"
	"log"
	"net/http"
)

var displayName, uniId, samAccount, jwtSigature string

func main() {
	defer func() {
		if r := recover(); r != nil {
			var ok bool
			err, ok := r.(error)
			if !ok {
				fmt.Errorf("RECOVER MAIN: %v", r)

			}
			if err != nil {
				fmt.Println(err.Error())
			}
		}

	}()
	mainOp()
}

func mainOp() {

	middleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			log.Println("middleware")
			token := ""
			tokens, ok := req.Header["Authorization"]
			if ok && len(tokens) >= 1 {
				token = tokens[0]
				//token = strings.TrimPrefix(token, "Bearer ")
			}
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, authorization")
			//Here inserting Auth routines if it turns ok the let the user go
			log.Println(req.URL.Path)
			//For Post Operation - Authorization is recommended by implementer
			if req.URL.Path == "/sra/getrole" || req.Method != "GET" {
				if authJWT(token) == true {
					log.Println("user: " + displayName)
					log.Println("uniId" + uniId)
					next.ServeHTTP(w, req)
				} else {
					log.Println("Open POST : TODO by implementer->Insert here auth mechanism")
					 
				}
			} else {

				next.ServeHTTP(w, req)
			}

		})
	}

	router := NewRouter()
	// To implement HTTPS, the line below inserting your certificate
	// log.Fatal(http.ListenAndServeTLS(":8089", "your_Cert.pem", "your_Cert.key", router))
	log.Fatal(http.ListenAndServe(":7089", middleware(router)))
}
