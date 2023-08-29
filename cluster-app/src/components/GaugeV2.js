import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const moveValue = 1;

const wrapper_styles = {
    "position": "relative",
}
const styles = { 
    //"backgroundColor": "red", /** For debug */
    "position": "absolute",
    "top": "0px",
    "left": "0px",
}
const bg_styles = { 
    //"backgroundColor": "yellow", /** For debug */
}

export const GaugeV2 = (props) => {
    const [context,setContext] = useState(null)
    const [bg_context,setBgContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)
    const [alc_flag, setAlcFlag] = React.useState(false)

    const animationRef = React.useRef();

    const CANVAS_WIDTH=props.width
    const CANVAS_HEIGHT=props.height
    const CANVAS_YOFFSET_START=(CANVAS_HEIGHT*0.125)
    const CANVAS_YOFFSET_END=(CANVAS_HEIGHT*0.022)
    var gauge_val = val;
    let tan = (CANVAS_WIDTH/2) / CANVAS_HEIGHT

    // canvas
    let tilt = 0.4;
    let meter_color = 'rgba(0,102,255, 0.50)';
    if(alc_flag) meter_color = 'rgba(0,255,102, 0.50)';
    let meter_scale_color = 'rgba(153,204,255, 1.00)';
    let white = 'rgba(255,255,255, 1.00)';
    let cursor_color = meter_scale_color;// 'rgba(255, 255, 0, 1.00)';

    const drawBackground = () => {
        bg_context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // mirror
        bg_context.save()
        if(mirrorFlag){
            bg_context.translate(CANVAS_WIDTH, 0);
            bg_context.scale(-1, 1);
            bg_context.save()
        }
        {
            // debug
            // gauge_val = 100;
            bg_context.save()
            { // Gauge Scale
                bg_context.beginPath();
                bg_context.moveTo( 0                , CANVAS_YOFFSET_START)
                bg_context.lineTo( CANVAS_WIDTH*tilt, CANVAS_HEIGHT-CANVAS_YOFFSET_END ) ;
                bg_context.lineTo( CANVAS_WIDTH*(tilt+0.15), CANVAS_HEIGHT-CANVAS_YOFFSET_END ) ;
                bg_context.lineTo( CANVAS_WIDTH*(0.15), CANVAS_YOFFSET_START );
                bg_context.clip();
                bg_context.fillStyle = meter_scale_color;
                bg_context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
            }
            bg_context.restore()

            bg_context.save()
            { // split line
                let split_num = 10;
                let line_width = (CANVAS_WIDTH/200)*4
                bg_context.strokeStyle = white;
                bg_context.lineWidth = line_width ;
                bg_context.beginPath();
                for(var i=0; i<=split_num; i++){
                    let _start_x = Math.floor(CANVAS_WIDTH * tilt * 1/split_num*i)
                    let _start_y = CANVAS_YOFFSET_START+Math.floor((CANVAS_HEIGHT-(CANVAS_YOFFSET_START+CANVAS_YOFFSET_END)) * i/(split_num))
                    bg_context.moveTo( _start_x, _start_y ) ;
                    bg_context.lineTo( _start_x+CANVAS_WIDTH*(tilt*0.6), _start_y )
                    bg_context.stroke() ;
                }
            }
            bg_context.restore()
        }
        if(mirrorFlag){
            bg_context.restore()
        }
        bg_context.restore()
    }

    const drawGaugeAnime = () => {
        const startTime = performance.now()
        animationRef.current = requestAnimationFrame(drawGaugeAnime);

        // animation用のupdate value
        if (target_val > gauge_val) {
            gauge_val += moveValue;
            if (target_val < gauge_val) gauge_val = target_val;
        }
        if (target_val < gauge_val) {
            gauge_val -= moveValue;
            if (target_val > gauge_val) gauge_val = target_val;
        }
        setValue(gauge_val)

        let start_x = Math.floor(CANVAS_WIDTH * tilt * (100-gauge_val) / 100)
        let start_y = CANVAS_YOFFSET_START + Math.floor((CANVAS_HEIGHT-(CANVAS_YOFFSET_START+CANVAS_YOFFSET_END)) * (100-gauge_val) / 100)
    
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // mirror
        context.save()
        if(mirrorFlag){
            context.translate(CANVAS_WIDTH, 0);
            context.scale(-1, 1);
            context.save()
        }
        {
            // debug
            // gauge_val = 100;
            context.save()
            { // Gauge
                context.beginPath();
                context.moveTo( start_x, start_y)
                context.lineTo( CANVAS_WIDTH*tilt, CANVAS_HEIGHT-CANVAS_YOFFSET_END  ) ;
                context.lineTo( CANVAS_WIDTH*(tilt+0.3), CANVAS_HEIGHT-CANVAS_YOFFSET_END  ) ;
                context.lineTo( start_x + CANVAS_WIDTH*0.3, start_y ) ;
                context.clip();
                context.fillStyle = meter_color;
                context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
            }
            context.restore()

            context.save()
            { // Value Cursor
                context.beginPath();
                context.moveTo( start_x + CANVAS_WIDTH*0.3, start_y)
                context.lineTo( start_x + CANVAS_WIDTH*0.3 + (CANVAS_WIDTH*0.3)/2, start_y + (CANVAS_WIDTH*0.1)/2 ) ;
                context.lineTo( start_x + CANVAS_WIDTH*0.3 + (CANVAS_WIDTH*0.3)/2, start_y - (CANVAS_WIDTH*0.1)/2  ) ;
                context.clip();
                context.fillStyle = cursor_color;
                context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
            }
            context.restore()
        }
        if(mirrorFlag){
            context.restore()
        }
        context.restore()

        context.save()
        { // Value Cursor Caption
            context.beginPath();
            let font_size_scale = 0.20
            let _text = gauge_val + "%"
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
            context.textBaseline = "bottom"
            context.textAlign = "center"
            if(mirrorFlag){
                context.fillText(_text, (CANVAS_WIDTH-start_x)-(CANVAS_WIDTH*0.45), start_y - (CANVAS_WIDTH*0.1)/2);
            } else {
                context.fillText(_text, start_x+(CANVAS_WIDTH*0.45), start_y - (CANVAS_WIDTH*0.1)/2);
            }
        }
        context.restore()

        // end process
        if (gauge_val == target_val) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        const endTime = performance.now(); // 終了時間
        console.log("ProcTime:", props.id, ":", endTime - startTime); // 何ミリ秒かかったかを表示する
    };

    useEffect(()=>{ // update value
        setTargetValue(props.val);
        if("mirror" in props) setMirrorFlag(1);
        if("alc" in props) {
            if (props.alc > -1 && alc_flag == false)
                setAlcFlag(true);
            else if (props.alc < 0 && alc_flag == true)
                setAlcFlag(false);
        }
        console.log(target_val)
    },[props])

    useEffect(()=>{ // After adding canvas component, context is created
        const canvas = document.getElementById(props.id)
        const canvasContext = canvas.getContext("2d")
        setContext(canvasContext)
        const bg_canvas = document.getElementById("bg"+props.id)
        const bg_canvasContext = bg_canvas.getContext("2d")
        setBgContext(bg_canvasContext)
    },[]) // executed at once

    useEffect(()=>{
        if(context!==null) {
            drawGaugeAnime();
            return () => {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }
    },[context, target_val, alc_flag])

    useEffect(()=>{
        if(bg_context!==null) {
            drawBackground();
        }
    },[bg_context, props.width, props.height])

    return(
        <div style={wrapper_styles}>
            <canvas width={props.width} height={props.height} id={props.id} style={styles}></canvas>
            <canvas width={props.width} height={props.height} id={"bg"+props.id} style={bg_styles}></canvas>
        </div>
    )
}
