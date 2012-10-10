#!/opt/local/bin/ruby
require 'sinatra'

set :protection, :except => :frame_options

post '/mock/jsonp/post' do
  <<-JSONP
<html>
<head>
</head>
<body>
<div id="root"></div>
<script type="text/javascript">
var data = '#{params[:_done]}-{"key": "value"}';
var xdUrl = "#{params[:_xdUrl]}";
if (typeof window.postMessage != 'undefined') {
parent.postMessage(data, xdUrl.split('/', 3).join('/'));
} else if (xdUrl.indexOf(window.location.protocol) != 0) {
window.name = encodeURIComponent(data); window.location.href = xdUrl;
} else {
document.getElementById("root").innerHTML = '<iframe src="'+encodeURI(xdUrl)+'" name="'+encodeURIComponent(data)+'"></iframe>';
}
</script>
</body>
</html>
  JSONP
end


get '/mock/jsonp/get' do
  <<-JSONP
#{params[:_done]}({
  key: 'value'
});
  JSONP
end


