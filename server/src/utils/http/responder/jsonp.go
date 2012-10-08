/**
 * Created with IntelliJ IDEA.
 * User: trungpham
 * Date: 10/4/12
 * Time: 10:35 PM
 * To change this template use File | Settings | File Templates.
 */
package responder

import(
	"net/http"
	"fmt"
	"encoding/json"
)

var getTemplate =
`%s(%s)`

var postTemplate =
`<html>
<head>
</head>
<body>
<div id="root"></div>
<script type="text/javascript">
var data = '%s-%s';
var xdUrl = "%s";
if (typeof window.postMessage != 'undefined') {
parent.postMessage(data, xdUrl.split('/', 3).join('/'));
} else if (xdUrl.indexOf(window.location.protocol) != 0) {
window.name = encodeURIComponent(data); window.location.href = xdUrl;
} else {
document.getElementById("root").innerHTML = '<iframe src="'+encodeURI(xdUrl)+'" name="'+encodeURIComponent(data)+'"></iframe>';
}
</script>
</body>
</html>`
func Ok(v interface{}, responseWriter http.ResponseWriter, request *http.Request) (err error){
	if output, err := json.Marshal(v); err == nil {
		if request.Method == "GET" {
			fmt.Fprintf(responseWriter, getTemplate, request.FormValue("_done"), output)
		} else {
			fmt.Fprintf(responseWriter, postTemplate, request.FormValue("_done"), output, request.FormValue("_xdUrl"))
		}
	}else {
		fmt.Printf("Unable to marshal to JSON: %v", v)
	}
	return
}

