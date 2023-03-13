// Ref: https://qiita.com/_ytori/items/a92d69760e8e8a2047ac

import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import queryString from 'query-string';

// based_size = 1920 x 720
import "./ClusterApp.css"

/* import local components */
import {LargeGauge as SpeedGauge} from "./components/LargeGauge"
import {LargeGauge as EngineGauge} from "./components/LargeGauge"
import {Gauge as BatteryGauge} from "./components/Gauge"
import {Gauge as FuelGauge} from "./components/Gauge"
import {TextDisplay} from "./components/TextDisplay"
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

const GearNumToStr = [
  "R", "N", "P", "L", "D"
]

export const ClusterApp = () => {
  const [message, setMessage] = React.useState()
  const [vspd, setVehicleSpeed] = React.useState(0)
  const [espd, setEngineSpeed] = React.useState(0)
  const [fuel, setFuelLevel] = React.useState(25)
  const [battery, setBatteryLevel] = React.useState(50)
  const [gear, setCurrentGear] = React.useState(4)
  const [time, setCurrentTime] = React.useState("00:00")
  const socketRef = React.useRef()

  const SubscPathList = { // data_path: setValue function
    "Vehicle.Speed": setVehicleSpeed,
    "Vehicle.OBD.EngineSpeed": setEngineSpeed,
    "Vehicle.Powertrain.FuelSystem.Level": setFuelLevel,
    "Vehicle.Powertrain.TractionBattery.StateOfCharge.Displayed": setBatteryLevel,
    "Vehicle.Powertrain.Transmission.Gear": setCurrentGear,
  }

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

    /**
     * Get current time intarval funcition
     */
    const interval = setInterval(() => {
      var dd = new Date();
      var yy = String("0" + dd.getHours()).slice(-2)
      var mm = String("0" + dd.getMinutes()).slice(-2)
      setCurrentTime(yy+":"+mm)
    }, 1000);
    return () => {clearTimeout(interval)};

  }, []);

  React.useEffect(() => {
    if(g_debugFlag){
    /**
     * For debug/demo purpose
    */
      const interval = setInterval(() => {
        setVehicleSpeed(Math.floor(Math.random()*180))
        setEngineSpeed(Math.floor(Math.random()*7000))
        setFuelLevel(Math.floor(Math.random()*100))
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
      Object.keys(SubscPathList).forEach(element => {
        console.log(GenerateSubscibeJson(SubscPathList[element]))
        socketRef.current?.send(GenerateSubscibeJson(element));
      });

      // #2.メッセージ受信時のイベントハンドラを設定
      const onMessage = (event: MessageEvent) => {
        console.log(event)
        setMessage(event.data)

        let myArray = JSON.parse(event.data);
        if( myArray["action"] == "subscription"){
          let recv_value = myArray["data"]["dp"]["value"]
          let data_path = myArray["data"]["path"]

          if (Object.keys(SubscPathList).includes(data_path)) {
            console.log(SubscPathList[data_path])
            SubscPathList[data_path](Number(recv_value))
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

  
  /** Calculate window scale */
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  let scale = width/1920.0
  if( width*720/1920 > height) scale = height/720.0

  /* config */
  let TextSpeedWidth = 240;
  let TextGearWidth = 120;
  let TextTimeWidth = 240;
  let GaugeWidth = 130

  return (
    <>
    <div className="ClusterApp" style={{"width":scale*1920, "height":scale*720}}>
      {/** Side component */}
      <div className="component"  style={{"top": scale*100+"px", "left": 0+"px"}}>
        <SpeedGauge className="component" id="l_gauge_1" text="Speed" val={vspd/180*100.0} width={scale*700} height={scale*560} />
      </div>
      <div className="component"  style={{"top": scale*100+"px", "left": scale*(1920-700)+"px"}}>
        <EngineGauge className="component" id="l_gauge_2" text="Engine" val={espd/7000*100.0}  width={scale*700} height={scale*560} mirror/>
      </div>
      <div className="component"  style={{"top": scale*(660-350)+"px", "left": scale*(960-700)+"px"}}>
        <BatteryGauge  id="gauge_1" val={battery} text="Battery" width={scale*GaugeWidth} height={scale*2*GaugeWidth} />
      </div>
      <div className="component"  style={{"top": scale*(660-350)+"px", "left": scale*(960+700-GaugeWidth)+"px"}}>
        <FuelGauge id="gauge_2" val={fuel} text="Fuel" width={scale*GaugeWidth} height={scale*2*GaugeWidth} mirror/>
      </div>

      {/** Center component */}
      <div className="component"  style={{"top": scale*(90)+"px", "left": scale*(960-TextSpeedWidth/2)+"px"}}>
        <TextDisplay id="text_1" val={vspd} sub_val="km/h" width={scale*(TextSpeedWidth)} height={scale*(TextSpeedWidth*3/4)}/>
      </div>
      <div className="component"  style={{"top": scale*(130)+"px", "left": scale*(960+130)+"px"}}>
        <TextDisplay id="text_2" val={GearNumToStr[gear]} width={scale*(TextGearWidth)} height={scale*(TextGearWidth)}/>
      </div>
      <div className="component"  style={{"top": (scale*350)+"px", "left": scale*(960-160)+"px"}}>
        <HTMLViewer url="/dummy.html" id="html1" width={scale*(320)+"px"} height={scale*(240)+"px"} />
      </div>
      <div className="component"  style={{"top": scale*(620)+"px", "left": scale*(960-TextTimeWidth/2)+"px"}}>
        <TextDisplay id="text_3" val={time} width={scale*(TextTimeWidth)} height={scale*(TextTimeWidth/3)}/>
      </div>
    </div>

    {/* for Debug */}
      {/* <div>最後に受信したメッセージ: {message}</div> */}
      <p style={{"display": "none"}}>
        For debug outputs:<br/>
        width, height, scale: {width} {height} {scale}<br/>
        Vehicle Speed:{vspd} km/h<br/>
        Engine Speed: {espd} rpm<br/>
        Fuel Meter:   {fuel} %<br/>
        Battery:      {battery} %<br/>
      </p>
    </>
  );
}
export default ClusterApp