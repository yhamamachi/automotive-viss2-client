import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const moveValue = 2;

const styles = {
    // "backgroundColor": "red",
}

export const GaugeV2 = (props) => {
    const [context,setContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)

    const animationRef = React.useRef();

    const CANVAS_WIDTH=props.width
    const CANVAS_HEIGHT=props.height
    const CANVAS_YOFFSET_START=(CANVAS_HEIGHT*0.125)
    const CANVAS_YOFFSET_END=(CANVAS_HEIGHT*0.022)
    var gauge_val = val;
    let tan = (CANVAS_WIDTH/2) / CANVAS_HEIGHT

    const drawGaugeAnime = () => {
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

        // canvas
        let tilt = 0.4;
        let start_x = Math.floor(CANVAS_WIDTH * tilt * (100-gauge_val) / 100)
        let start_y = CANVAS_YOFFSET_START + Math.floor((CANVAS_HEIGHT-(CANVAS_YOFFSET_START+CANVAS_YOFFSET_END)) * (100-gauge_val) / 100)

        let meter_color = 'rgba(0,102,255, 0.50)';
        let meter_scale_color = 'rgba(153,204,255, 1.00)';
        let white = 'rgba(255,255,255, 1.00)';
        let cursor_color = meter_scale_color;// 'rgba(255, 255, 0, 1.00)';

        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()
        {
            // debug
            // gauge_val = 100;
            // mirror
            if(mirrorFlag){
                context.translate(CANVAS_WIDTH, 0);
                context.scale(-1, 1);
                context.save()
            }
            { // Gauge Scale
                context.beginPath();
                context.moveTo( 0                , CANVAS_YOFFSET_START)
                context.lineTo( CANVAS_WIDTH*tilt, CANVAS_HEIGHT-CANVAS_YOFFSET_END ) ;
                context.lineTo( CANVAS_WIDTH*(tilt+0.15), CANVAS_HEIGHT-CANVAS_YOFFSET_END ) ;
                context.lineTo( CANVAS_WIDTH*(0.15), CANVAS_YOFFSET_START );
                context.clip();
                context.fillStyle = meter_scale_color;
                context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
                context.restore()
                context.save()
            }

            { // Gauge
                context.beginPath();
                context.moveTo( start_x, start_y)
                context.lineTo( CANVAS_WIDTH*tilt, CANVAS_HEIGHT-CANVAS_YOFFSET_END  ) ;
                context.lineTo( CANVAS_WIDTH*(tilt+0.3), CANVAS_HEIGHT-CANVAS_YOFFSET_END  ) ;
                context.lineTo( start_x + CANVAS_WIDTH*0.3, start_y ) ;
                context.clip();
                context.fillStyle = meter_color;
                context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
                context.restore()
                context.save()
            }

            { // split line
                let split_num = 10;
                let line_width = (CANVAS_WIDTH/200)*4
                context.strokeStyle = white;
                context.lineWidth = line_width ;
                context.beginPath();
                for(var i=0; i<=split_num; i++){
                    let _start_x = Math.floor(CANVAS_WIDTH * tilt * 1/split_num*i)
                    let _start_y = CANVAS_YOFFSET_START+Math.floor((CANVAS_HEIGHT-(CANVAS_YOFFSET_START+CANVAS_YOFFSET_END)) * i/(split_num))
                    context.moveTo( _start_x, _start_y ) ;
                    context.lineTo( _start_x+CANVAS_WIDTH*(tilt*0.6), _start_y )
                    context.stroke() ;
                }
            }

            if(mirrorFlag){
                context.restore()
            }
        }

        { // Value Cursor
            context.beginPath();
            context.moveTo( start_x + CANVAS_WIDTH*0.3, start_y)
            context.lineTo( start_x + CANVAS_WIDTH*0.3 + (CANVAS_WIDTH*0.3)/2, start_y + (CANVAS_WIDTH*0.1)/2 ) ;
            context.lineTo( start_x + CANVAS_WIDTH*0.3 + (CANVAS_WIDTH*0.3)/2, start_y - (CANVAS_WIDTH*0.1)/2  ) ;
            context.clip();
            context.fillStyle = cursor_color;
            context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
            context.restore()
            context.save()
        }
        context.restore()
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

        // end process
        if (gauge_val == target_val) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    useEffect(()=>{ // update value
        setTargetValue(props.val);
        if("mirror" in props) setMirrorFlag(1);
        console.log(target_val)
    },[props])

    useEffect(()=>{ // After adding canvas component, context is created
        const canvas = document.getElementById(props.id)
        const canvasContext = canvas.getContext("2d")
        setContext(canvasContext)
    },[]) // executed at once

    useEffect(()=>{
        if(context!==null) {
            drawGaugeAnime();
            return () => {
                cancelAnimationFrame(animationRef.current);
            }
        }
    },[context, target_val])

    return(
        <div>
            <canvas width={props.width} height={props.height} id={props.id} style={styles}></canvas>
        </div>
    )
}
