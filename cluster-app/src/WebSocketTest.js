// Ref: https://qiita.com/_ytori/items/a92d69760e8e8a2047ac

import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { SpeedMeterBase as VehicleSpeedMeter} from './parts/SpeedMeter'
import { SpeedMeterBase as EngineSpeedMeter} from './parts/SpeedMeter'

const GenerateSubscibeJson = (DataPath) => {
  return (
    JSON.stringify({
      'action': 'subscribe',
      "filter": {
          "type": "change",
          "value": { "logic-op": "ne", "diff": "0" }
      },
      'path': DataPath,
      'requestId': DataPath
    })
  )
}

const SubscPathList = [
  "Vehicle.Speed",
  "Vehicle.OBD.EngineSpeed",
]

export const WebSocketTest = () => {
  const [message, setMessage] = React.useState()
  const [vspd, setVehicleSpeed] = React.useState(0)
  const [espd, setEngineSpeed] = React.useState(0)
  const socketRef = React.useRef()

  // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
  React.useEffect(() => {
    // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
    // const websocket = new ReconnectingWebSocket('ws://localhost:5000')
    const websocket = new ReconnectingWebSocket('ws://10.166.14.46:8080')
    socketRef.current = websocket
    SubscPathList.forEach(element => {
      console.log(GenerateSubscibeJson(SubscPathList[element]))
      socketRef.current?.send(GenerateSubscibeJson(element));
    });
    
    // #2.メッセージ受信時のイベントハンドラを設定
    const onMessage = (event: MessageEvent) => {
      console.log(event)
      setMessage(event.data)

      let myArray = JSON.parse(event.data);
      if( myArray["action"] == "subscription"){
        if ("Vehicle.Speed" === myArray["data"]["path"]) {
          console.log(myArray["data"]["dp"]["value"])
          setVehicleSpeed(parseInt(myArray["data"]["dp"]["value"]))
        }
        if ("Vehicle.OBD.EngineSpeed" === myArray["data"]["path"]) {
          console.log(myArray["data"]["dp"]["value"])
          setEngineSpeed(myArray["data"]["dp"]["value"])
        }
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
      {/* <div>最後に受信したメッセージ: {message}</div> */}
      <div style={{"display": "flex"}}>
        <VehicleSpeedMeter val={vspd} min={0} max={180} segment={10} unit={" km/h"} title={"Speed"}/>
        <EngineSpeedMeter val={espd} min={0} max={7000} segment={7} title={"Engine"}/>
      </div>
    </>
  );
}