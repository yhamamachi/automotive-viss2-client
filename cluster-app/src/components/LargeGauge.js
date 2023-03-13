import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const moveValue = 2;
const fillColor = "#38c"

const styles = {
    //"backgroundColor": "red",
}
let test_val = 0;

export const LargeGauge = (props) => {
    const [context,setContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)
    const [updateFlag, setUpdateFlag] = React.useState(0)
    const [captionText, setCaptionText] = React.useState("")
    
    const CANVAS_WIDTH=Number(props.width)
    const CANVAS_HEIGHT=Number(props.height)

    const animationRef = React.useRef();
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
        context.fillStyle = 'rgba(255,255,255,0)'; 
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()
        {
            // mirror
            if(mirrorFlag){
                context.translate(CANVAS_WIDTH, 0);
                context.scale(-1, 1);
            } 
            // Gauge
            context.beginPath();
            // 100~50%は横方向のゲージ、50%~0%は縦方向のゲージ
            //upper_start_x = 0.8*CANVAS_WIDTH*(Math.max((test_val), 50)-50) + 0.2*CANVAS_WIDTH*(Math.max((test_val), 50))
            let upper_start_x  =  CANVAS_WIDTH - 0.2*CANVAS_WIDTH *(Math.min((gauge_val), 50)/50.0) - 0.8*CANVAS_WIDTH *(Math.max((gauge_val)-50, 0)/50.0)
            let upper_start_y  = CANVAS_HEIGHT - 0.8*CANVAS_HEIGHT*(Math.min((gauge_val), 50)/50.0) - 0.2*CANVAS_HEIGHT*(Math.max((gauge_val)-50, 0)/50.0)
            let bottom_start_x = upper_start_x
            let bottom_start_y = upper_start_y + (CANVAS_HEIGHT * 0.2)
            if (gauge_val <= 40) {
                bottom_start_x = upper_start_x - (CANVAS_WIDTH * 0.2)
                bottom_start_y = upper_start_y
            } else if(gauge_val <= 60) {
                bottom_start_x = CANVAS_WIDTH -  CANVAS_WIDTH * 0.2 * (1+4/5)
                bottom_start_y = CANVAS_HEIGHT - CANVAS_HEIGHT * 0.2 * 16/5             
            }

            context.moveTo(upper_start_x, upper_start_y)
            if(CANVAS_WIDTH*0.8 > upper_start_x) context.lineTo( CANVAS_WIDTH*0.8, CANVAS_HEIGHT*0.2 );
            context.lineTo( CANVAS_WIDTH*1.0, CANVAS_HEIGHT*1.0 );
            context.lineTo( CANVAS_WIDTH*0.8, CANVAS_HEIGHT*1.0 );
            if(CANVAS_WIDTH*0.8 > bottom_start_x) context.lineTo( CANVAS_WIDTH* (1-9/25) , CANVAS_HEIGHT*(1-16/25));
            context.lineTo(bottom_start_x, bottom_start_y);
            context.clip();

            let n = [0, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT-tan*CANVAS_WIDTH]
            let lineargradient = context.createLinearGradient(...n);
            lineargradient.addColorStop(0.0, "#00c");
            lineargradient.addColorStop(0.7, fillColor);
            lineargradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = lineargradient;
            context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形            
        }
        context.restore()
        {
            // Text
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_WIDTH*0.050 + "px serif"
            context.textAlign = "center"
            context.textBaseline = "bottom"
            if(mirrorFlag) {
                context.fillText(captionText, CANVAS_WIDTH*0.10, CANVAS_HEIGHT, CANVAS_WIDTH);
            } else {
                context.fillText(captionText, CANVAS_WIDTH*0.90, CANVAS_HEIGHT, CANVAS_WIDTH);
            }
        }
        // end process
        if (gauge_val == target_val) {
            cancelAnimationFrame(animationRef.current);
        }
    };
    
    useEffect(()=>{ // update value
        setTargetValue(props.val);
        if("text" in props) setCaptionText(props.text);
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
