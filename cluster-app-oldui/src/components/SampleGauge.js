import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const CANVAS_WIDTH=320
const CANVAS_HEIGHT=240
var gauge_val = 0;
const moveValue = 2;

export const Gauge = (props) => {
    const [context,setContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [updateFlag, setUpdateFlag] = React.useState(0)
    
    const animationRef = React.useRef();
    

    const drawGaugeAnime = () => {
        animationRef.current = requestAnimationFrame(drawGaugeAnime);

        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = "red";
        
        if (target_val > gauge_val) {
            gauge_val += moveValue;
            if (target_val < gauge_val) gauge_val = target_val;
        }
        if (target_val < gauge_val) {
            gauge_val -= moveValue;
            if (target_val > gauge_val) gauge_val = target_val;
        }
        
        var startPoint = -200 + 220 * gauge_val / 100;
        context.arc(80, 80, 78, startPoint * Math.PI / 180, 160 * Math.PI / 180, true);
        context.stroke();
        
        let i = 0;
        for(i=0; i<gauge_val; ++i){
            let offset = Math.floor(i/10)
            context.fillRect(20+offset+i,150,1,20);//塗りつぶされた四角形
        }
        setValue(gauge_val)
        if (gauge_val == target_val) cancelAnimationFrame(animationRef.current);
    };
    
    useEffect(()=>{ // update value
        setTargetValue(props.val);
        console.log(target_val)
    },[props])

    useEffect(()=>{ // After adding canvas component, context is created
        const canvas = document.getElementById("SampleGauge")
        const canvasContext = canvas.getContext("2d")
        setContext(canvasContext)
    },[]) // executed at once
    
    useEffect(()=>{
        if(context!==null) {
            console.log("context", target_val, val)
            // animationRef.current = requestAnimationFrame(drawGaugeAnime);
            drawGaugeAnime();
            return () => {
                console.log("Canceled")
                cancelAnimationFrame(animationRef.current);
            }
        }
    },[context, target_val])

    return(
        <div>
            <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} id="SampleGauge"></canvas>
        </div>
    )
}
