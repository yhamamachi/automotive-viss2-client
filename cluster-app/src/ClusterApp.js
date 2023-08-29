// Ref: https://qiita.com/_ytori/items/a92d69760e8e8a2047ac

import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import queryString from 'query-string';

// based_size = 1920 x 720
import "./ClusterApp.css"

/* import local components */
import {TextDisplay} from "./components/TextDisplay"
import {CircleMeter} from './components/CircleMeter';
import {Battery as BatteryIcon} from './icons/Battery';
import {GaugeV2 as Gauge} from "./components/GaugeV2";
import {SideBar} from "./components/SideBar"
import {DemoAlertPopup} from "./components/DemoAlertPopup";
// import {AlcoholSensor} from "./components/AlcoholSensor";
import {AlcoholSensorV2} from "./components/AlcoholSensorV2";

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
  const [alc, setAlcoholSensor] = React.useState(-1)
  const [time, setCurrentTime] = React.useState("00:00")
  const socketRef = React.useRef()

  const SubscPathList = { // data_path: setValue function
    "Vehicle.Speed": setVehicleSpeed,
    "Vehicle.OBD.EngineSpeed": setEngineSpeed,
    "Vehicle.Powertrain.FuelSystem.Level": setFuelLevel,
    "Vehicle.Powertrain.TractionBattery.StateOfCharge.Displayed": setBatteryLevel,
    "Vehicle.Powertrain.Transmission.Gear": setCurrentGear,
    "Vehicle.Private.Safety.AlcoholSensor.value": setAlcoholSensor,
  }

  let g_debugFlag = 0; // Switch using websocket or using dummy value.
  let g_alcDebugFlag = 0;
  let g_serverAddr = "localhost"
  let g_serverPort = "8080"

  React.useLayoutEffect(() => { // Executed before useEffect.(useLayoutEffect -> useEffect)
    /**
     * URL query proc
     */
    const search = location.search;
    const query = queryString.parse(search);
    if("debug" in query) g_debugFlag = 1;
    if("alcdebug" in query) g_alcDebugFlag = 1;
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
        if(g_alcDebugFlag)setAlcoholSensor(Math.random())
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
      const on_connect = (websocket) => {
        // Subscribe
        Object.keys(SubscPathList).forEach(element => {
          console.log(GenerateSubscibeJson(SubscPathList[element]))
          websocket.send(GenerateSubscibeJson(element));
        });
      }
      on_connect(websocket)

      websocket.onopen = () => {
        console.log("Call onopen")
        console.log(socketRef.current.readyState)
        on_connect(socketRef.current);
      }

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
  let TextTimeWidth = 240;
  let GuageWidth = 200;
  let TextGauge = 80;
  let meter_size = 650
  let icon_size = 80
  let alert_width=1920
  let alert_height=720

  let css_class_name = "ClusterApp"
  /* sample: Turn red the background color 
  if (vspd > 200){
    //css_class_name = "ClusterAppError";
  }
  */

  const getAlcDebugButton = () => { 
      const query = queryString.parse(location.search)
      if ("alcdebugButton" in query) return "show"
      return "none";
  };

  return (
    <>
    <div style={{"display": getAlcDebugButton() }}>
      <button onClick={() => setAlcoholSensor(-1.0)}>ALC=-1</button>
      <button onClick={() => setAlcoholSensor(0.0)}>ALC= 0</button>
      <button onClick={() => setAlcoholSensor(1.0)}>ALC=+1</button>
    </div>

    <div className={css_class_name} style={{"width":scale*1920, "height":scale*720}}>
      <div className="component"  style={{"top": scale*30+"px", "left": scale*10+"px"}}>
        <SideBar id="SideBarLeft" width={scale*50+"px"} height={scale*700+"px"} size={scale*meter_size}/>
      </div>
      <div className="component"  style={{"top": scale*30+"px", "right": scale*10+"px"}}>
        <SideBar id="SideBarRight" width={scale*50+"px"} height={scale*700+"px"} size={scale*meter_size} mirror/>
      </div>

      <div className="component"  style={{"top": scale*150+"px", "left": scale*100+"px"}}>
        <Gauge id="bat_gauge" val={battery} text="Battery" width={scale*GuageWidth} height={scale*GuageWidth*2.0}/>
      </div>
      <div className="component" style={{"top": scale*560+"px", "left": scale*170+"px"}}>
          <BatteryIcon id="bat_icon" width={scale*icon_size} height={scale*icon_size*0.7} size={scale*icon_size} />
          <TextDisplay id="bat_text" val="Battery" width={scale*(TextGauge)} height={scale*(TextGauge*2/4)}/>
      </div>

      <div className="component"  style={{"top": scale*50+"px", "left": scale*280+"px"}}>
        <CircleMeter id="SpeedMeter" text="Speed" sub_text="km/h" max_val={200} split_num={10} val={vspd} size={scale*meter_size}/>
      </div>

      <div className="component"  style={{"top": scale*(50)+"px", "left": scale*(960-TextTimeWidth/2)+"px"}}>
        <TextDisplay id="timeCaption" val="Time" width={scale*(TextTimeWidth)} height={scale*(TextTimeWidth/4)}/>
        <TextDisplay id="timeValue" val={time} width={scale*(TextTimeWidth)} height={scale*(TextTimeWidth/4)}/>
      </div>

      <div className="component"  style={{"top": scale*50+"px", "right": scale*280+"px"}}>
        <CircleMeter id="EngineMeter" text="Engine" sub_text="rpm" max_val={10000} split_val={1000} val={espd} scale={1000} size={scale*meter_size}/>
      </div>

      <div className="component"  style={{"top": scale*150+"px", "right": scale*100+"px"}}>
        <Gauge id="fuel_gauge" val={fuel} text="Battery" width={scale*GuageWidth} height={scale*GuageWidth*2.0} mirror/>
      </div>
      <div className="component" style={{"top": scale*560+"px", "right": scale*170+"px"}}>
        <svg viewBox="60 38 5 20"  width={scale*icon_size} height={scale*icon_size*0.7} size={scale*icon_size} >
          <use href="img/fuel.svg#Fuel" style={{"fill": "#aaa"}}></use>
        </svg>
        <TextDisplay id="fuel_text" val="Fuel" width={scale*(TextGauge)} height={scale*(TextGauge*2/4)}/>
      </div>

      {/** Demo用: Alcohol表示をしてくれるコンポーネント */}
      {/* <AlcoholSensor val={alc} scale={scale}/> */}
      <AlcoholSensorV2 val={alc} max_val={0.15} width={alert_width*scale} height={alert_height*scale} scale={scale} />
      {/** Demo用: Popup表示をしてくれるコンポーネント */}
      <DemoAlertPopup val={vspd} max_val={200} width={alert_width*scale} height={alert_height*scale} scale={scale} />
    </div>
    </>
  );
}
export default ClusterApp
