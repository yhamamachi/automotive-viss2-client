// Ref: https://qiita.com/_ytori/items/a92d69760e8e8a2047ac

import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

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
  "Vehicle.Powertrain.FuelSystem.Level",
  "Vehicle.Powertrain.TractionBattery.StateOfCharge.Displayed",
]

export const ClusterApp = () => {
  const [message, setMessage] = React.useState()
  const [vspd, setVehicleSpeed] = React.useState(0)
  const [espd, setEngineSpeed] = React.useState(0)
  const [fuel, setFuelLevel] = React.useState(25)
  const [battery, setBatteryLevel] = React.useState(50)
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
          //console.log(myArray["data"]["dp"]["value"])
          setVehicleSpeed(parseInt(myArray["data"]["dp"]["value"]))
        }
        if ("Vehicle.OBD.EngineSpeed" === myArray["data"]["path"]) {
          //console.log(myArray["data"]["dp"]["value"])
          setEngineSpeed(myArray["data"]["dp"]["value"])
        }
        if ("Vehicle.Powertrain.FuelSystem.Level" === myArray["data"]["path"]) {
          console.log(myArray["data"]["dp"]["value"])
          setFuelLevel(myArray["data"]["dp"]["value"])
        }
        if ("Vehicle.Powertrain.TractionBattery.StateOfCharge.Displayed" === myArray["data"]["path"]) {
          console.log(myArray["data"]["dp"]["value"])
          setBatteryLevel(myArray["data"]["dp"]["value"])
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
        <div>
          For debug outputs:
          <p>Vehicle Speed:{vspd} km/h</p>
          <p>Engine Speed: {espd} rpm</p>
          <p>Fuel Meter:   {fuel/100.0} %</p>
          <p>Battery:      {battery} %</p>
        </div>
      </div>
    </>
  );
}
export default ClusterApp