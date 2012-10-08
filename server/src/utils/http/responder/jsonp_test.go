/**
 * Created with IntelliJ IDEA.
 * User: trungpham
 * Date: 10/4/12
 * Time: 10:39 PM
 * To change this template use File | Settings | File Templates.
 */
package responder

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"strings"
)

func TestJsonpGetMethod(t *testing.T) {

	testData := map[string]string{"key": "test"}
	request , _ := http.NewRequest("GET", "http://localhost?_done=callme", strings.NewReader("test"))
	responseWriter := httptest.NewRecorder()

	Ok(testData, responseWriter, request)
	if responseWriter.Body.String() != `callme({"key":"test"})` {
		t.Errorf(`response body is %v, want callme({"key":"test"})`, responseWriter.Body.String())
	}
}

func TestJsonpPostMethod(t *testing.T) {

	testData := map[string]string{"key": "te'st"}
	request , _ := http.NewRequest("POST", "http://localhost?_done=callme&_xdUrl=http://example.com/xd", strings.NewReader("test"))
	responseWriter := httptest.NewRecorder()

	Ok(testData, responseWriter, request)
	if !strings.Contains(responseWriter.Body.String(), `var data = 'callme-{"key":"te'st"}';`) {
		t.Errorf(`response body is %v, want it to be in html wrapper`, responseWriter.Body.String())
	}
	if !strings.Contains(responseWriter.Body.String(), `var xdUrl = "http://example.com/xd";`) {
		t.Errorf(`response body is %v, want it to include xdUrl`, responseWriter.Body.String())
	}
}

