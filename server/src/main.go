/**
 * Created with IntelliJ IDEA.
 * User: trungpham
 * Date: 9/22/12
 * Time: 8:32 PM
 * To change this template use File | Settings | File Templates.
 */
package main

import (
	"config"
	"controllers"
	"fmt"
	"io/ioutil"
	"net/http"
	"syscall"
	"time"
)

var Config = config.NewConfig("config/app.json")

type MaxAgeResponseWriter struct {
	http.ResponseWriter
	maxAge time.Duration // seconds
}

func (w MaxAgeResponseWriter) WriteHeader(code int) {
	if code == 200 { //only cache the response if it's successful
		w.Header().Add("Cache-Control", fmt.Sprintf("max-age=%d, public, must-revalidate, proxy-revalidate", w.maxAge))
	}
	w.ResponseWriter.WriteHeader(code)
}

func maxAgeHandler(maxAge time.Duration, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		pw := MaxAgeResponseWriter{w, time.Duration(maxAge.Seconds())}
		h.ServeHTTP(pw, r)
	})
}

func interceptor(handler func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {

	return func(response http.ResponseWriter, request *http.Request) {
		handler(response, request)
	}
}
func main() {
	pid := syscall.Getpid()
	fmt.Printf("Server started with pid: %d\n", pid)
	err := ioutil.WriteFile("./tmp/pid", []byte(fmt.Sprintf("%d", pid)), 0755)
	if err != nil {
		fmt.Printf("Cannot write to: /tmp/pid")
	}

	http.Handle("/assets/", maxAgeHandler(10*365*24*time.Hour, http.StripPrefix("/assets/", http.FileServer(http.Dir("public/assets/")))))
	http.HandleFunc("/api.js", interceptor(controllers.Api))
	http.ListenAndServe(":8080", nil)
}
