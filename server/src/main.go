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
)

var Config = config.NewConfig("config/app.json")

type ResponseWriterProxy struct {
	realResponseWriter *http.ResponseWriter
	code               int
}

func (rwp *ResponseWriterProxy) Header() http.Header {
	return (*rwp.realResponseWriter).Header()
}
func (rwp *ResponseWriterProxy) Write(buf []byte) (int, error) {
	return (*rwp.realResponseWriter).Write(buf)
}
func (rwp *ResponseWriterProxy) WriteHeader(code int) {
	(*rwp.realResponseWriter).WriteHeader(code)
	rwp.code = code
}

func maxAgeHandler(seconds int, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		responseWriterProxy := &ResponseWriterProxy{realResponseWriter: &w}
		h.ServeHTTP(responseWriterProxy, r)
		if responseWriterProxy.code == 200 {
			w.Header().Add("Cache-Control", fmt.Sprintf("max-age=%d, public, must-revalidate, proxy-revalidate", seconds))
		}

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

	http.Handle("/assets/", maxAgeHandler(10*365*24*60*60, http.StripPrefix("/assets/", http.FileServer(http.Dir("public/assets/")))))
	http.HandleFunc("/api.js", interceptor(controllers.Api))
	http.ListenAndServe(":8080", nil)
}
