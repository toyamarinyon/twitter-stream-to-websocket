import websockets.*;

WebsocketClient wsc;

String host = "ws://your-app-name.herokuapp.com";
int lastKeepAliveTime = 0;

void settings() {
  size(200, 200); 
  wsc= new WebsocketClient(this, host);
}

void draw() {
  background(244);
  // 30秒ごとにWebsocket サーバーに 接続維持メッセージを送信する
  if ((millis() - lastKeepAliveTime) > 30 * 1000) {
    lastKeepAliveTime = millis();
    wsc.sendMessage("KEEPALIVE");
  }  
}


void webSocketEvent(String msg) {
  println(msg);
}
