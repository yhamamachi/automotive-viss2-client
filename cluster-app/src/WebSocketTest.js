// Ref: https://qiita.com/_ytori/items/a92d69760e8e8a2047ac

import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

export const WebSocketTest = () => {
  const [message, setMessage] = React.useState()
  const socketRef = React.useRef()

  // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
  React.useEffect(() => {
    // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
    // const websocket = new ReconnectingWebSocket('ws://localhost:5000')
    const websocket = new ReconnectingWebSocket('ws://10.166.14.46:8080')
    socketRef.current = websocket

    // #2.メッセージ受信時のイベントハンドラを設定
    const onMessage = (event: MessageEvent) => {
      console.log(event)
      setMessage(event.data)

      let myArray = JSON.parse(event.data);
      if( myArray["action"] == "subscription"){
        console.log(myArray["data"]["dp"]["value"])
      }
    }
    websocket.addEventListener('message', onMessage)

    // #3.useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
    return () => {
      websocket.close()
      websocket.removeEventListener('message', onMessage)
    }
  }, [])

  return (
    <>
      <div>最後に受信したメッセージ: {message}</div>
      <button
        type="button"
        onClick={() => {
          // #4.WebSocketでメッセージを送信する場合は、イベントハンドラ内でsendメソッドを実行
          const item_path = "Vehicle.Speed"
          socketRef.current?.send(
            JSON.stringify({
              'action': 'subscribe',
              "filter": {
                  "type": "change",
                  "value": { "logic-op": "ne", "diff": "0" }
              },
              'path': item_path,
              'requestId': item_path
            })
          );
        }}
      >
        Subscribe
      </button>
    </>
  );
}