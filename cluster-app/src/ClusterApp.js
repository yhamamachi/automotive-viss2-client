// Ref: https://qiita.com/_ytori/items/a92d69760e8e8a2047ac

import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import queryString from 'query-string';

import "./ClusterApp.css"

/* import local components */
import {LargeGauge as SpeedGauge} from "./components/LargeGauge"
import {LargeGauge as EngineGauge} from "./components/LargeGauge"
import {Gauge as BatteryGauge} from "./components/Gauge"
import {Gauge as FuelGauge} from "./components/Gauge"
import {TextDisplay as SpeedDisplay} from "./components/TextDisplay"
import {HTMLViewer} from "./components/HTMLViewer"

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
  "Vehicle.Powertrain.Transmission.Gear",
]

const GearNumToStr = [
  "R", "N", "P", "L", "D"
]

export const ClusterApp = () => {
  const [message, setMessage] = React.useState()
  const [vspd, setVehicleSpeed] = React.useState(0)
  const [espd, setEngineSpeed] = React.useState(0)
  const [fuel, setFuelLevel] = React.useState(25)
  const [battery, setBatteryLevel] = React.useState(50)
  const [gear, setCurrentGear] = React.useState(0)
  const socketRef = React.useRef()

  let g_debugFlag = 0; // Switch using websocket or using dummy value.
  let g_serverAddr = "localhost"
  let g_serverPort = "8080"

  React.useLayoutEffect(() => { // Executed before useEffect.(useLayoutEffect -> useEffect)
    /**
     * URL query proc
     */
    const search = location.search;
    const query = queryString.parse(search);
    if("debug" in query) g_debugFlag = 1;
    if("serverAddr" in query) g_serverAddr = query['serverAddr'];
    if("serverPort" in query) g_serverPort = query['serverPort'];
  }, []);

  React.useEffect(() => {
    if(g_debugFlag){
    /**
     * For debug/demo purpose
    */
      const interval = setInterval(() => {
        setVehicleSpeed(Math.floor(Math.random()*180))
        setEngineSpeed(Math.floor(Math.random()*7000))
        setFuelLevel(Math.floor(Math.random()*10000))
        setBatteryLevel(Math.floor(Math.random()*100))
        setCurrentGear(Math.floor(Math.random()*5))
      }, 1000);
      return () => {clearTimeout(interval)};
    }
  }, []);
  // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
  React.useEffect(() => {
    if(!g_debugFlag){
      /**
       * Websocket proc
       */
      // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
      // const websocket = new ReconnectingWebSocket('ws://localhost:5000')
      const websocket = new ReconnectingWebSocket('ws://'+g_serverAddr+':'+g_serverPort)
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
          if ("Vehicle.Powertrain.Transmission.Gear" === myArray["data"]["path"]) {
            console.log(myArray["data"]["dp"]["value"])
            setCurrentGear(myArray["data"]["dp"]["value"])
          }
        }
      }
      websocket.addEventListener('message', onMessage)

      // #3.useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
      return () => {
        websocket.close()
        websocket.removeEventListener('message', onMessage)
      }
    }
  }, [])

  return (
    <>
      {/* <div>最後に受信したメッセージ: {message}</div> */}
      <div className="ClusterApp" style={{"display": "flex"}}>
        <SpeedGauge id="l_gauge_1" val={vspd/180*100.0}/>
        <BatteryGauge  id="gauge_1" val={battery}/>
        <div style={{"display": "flex"}}>
          <SpeedDisplay id="text_1" val={vspd} sub_val="km/h"/>
          <SpeedDisplay id="text_2" val={GearNumToStr[gear]} />
        </div>
        <HTMLViewer url="/dummy.html" id="html_1" width="240px" height="180px" />
        <FuelGauge id="gauge_2" val={fuel/100.0} mirror="True"/>
        <EngineGauge id="l_gauge_2" val={espd/7000*100.0} mirror/>
      </div>
      <p>
      For debug outputs:<br/>
      Vehicle Speed:{vspd} km/h<br/>
      Engine Speed: {espd} rpm<br/>
      Fuel Meter:   {fuel/100.0} %<br/>
      Battery:      {battery} %<br/>
      </p>
    </>
  );
}
export default ClusterApp