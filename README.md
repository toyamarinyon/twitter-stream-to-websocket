# twitter-stream-to-websocket
twitterのタイムラインをキーワードや投稿者で絞り込み、ライブでWebsocketに送信するサービスをherokuに立ち上げます
# 必要なもの
- herokuのアカウント
- twitterの開発者アカウント
- twitter連携アプリ

それぞれのアカウントの作り方は以下の通りです
## herokuアカウント
https://signup.heroku.com/jp から作成してください

## twitterの開発者アカウント
https://developer.twitter.com/en/portal/dashboard にアクセスして開発用のtwitterアカウントでログインします

個人利用と同じでよければいつものtwitterアカウントと同じで問題ありません
twitterアカウントを持っていない場合は作成してください

## twitter連携アプリ
https://developer.twitter.com/en/portal/dashboard にアクセスします

「+ Create Project」ボタンを押します
![step01](assets/step01.png)

4枚のウィザードが表示されるので、最初の3枚はそれぞれ以下のように入力してください

ウィザード|入力内容
--------|-------
1 Project Name | 適当な名前（例: TwitterStreamSample)
2 Use case | 該当するもの(`Doing academic research` か `student`）のどちらかになる場合が多いかなと思います
3 Project description | 利用目的（例: Create an application that broadcasts tweets containing specific content in real time via websocket.）

ウィザードの4枚目はプロジェクト紐付けるアプリを設定します
![step02](assets/step02.png)

画面右側の「Create new」を押してください

アプリ名の入力フォームが表示されます。世界で一意な名前にする必要があるので、単語や数字を混ぜでエラーにならない名前を入力してください

名前を登録すると、APIを実行するための秘匿情報が3つ表示されます
![step03](assets/step03.png)
この中の「Bearer Token」を控えておいてください。






