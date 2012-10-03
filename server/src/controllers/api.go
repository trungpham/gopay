/**
 * Created with IntelliJ IDEA.
 * User: trungpham
 * Date: 9/22/12
 * Time: 9:21 PM
 * To change this template use File | Settings | File Templates.
 */
package controllers

import (
	"net/http"
	"fmt"
	"utils/json"
	)
const bootStrapJS =
`(function(){
	var script = document.createElement('script');
	script.async = true;
	script.src = "/assets/%s";
	document.head.appendChild(script);
})();
`

func Api(w http.ResponseWriter, r *http.Request) {
	manifest, _ := json.ReadJsonFile("public/assets/manifest.json")
	clientFileName := manifest["assets"].(map[string]interface {})["client.js"]
	w.Header().Set("Content-Type", "text/javascript")
	w.Header().Add("Cache-Control", fmt.Sprintf("max-age=%d, public, must-revalidate, proxy-revalidate", 300))
	fmt.Fprintf(w, bootStrapJS, clientFileName)
}
