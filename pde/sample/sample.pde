import websockets.*;

WebsocketClient wsc;

String host = "ws://localhost:3334";
int lastKeepAliveTime = 0;

void settings() {
  size(200, 200); 
  wsc= new WebsocketClient(this, host);
  wsc.sendMessage("FETCH_TWEET:#ttrealtime");
}

void draw() {
  background(244);
  keepAlive();
}


void webSocketEvent(String msg) {
  println(msg);
}

void keepAlive() {
  // 30秒ごとにWebsocket サーバーに 接続維持メッセージを送信する
  if ((millis() - lastKeepAliveTime) > 30 * 1000) {
    lastKeepAliveTime = millis();
    wsc.sendMessage("KEEPALIVE");
  }  
}
