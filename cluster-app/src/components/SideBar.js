import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const styles = {
    // "backgroundColor": "red",
}

export const SideBar = (props) => {
    const [context,setContext] = useState(null)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)
    const [alc_flag, setAlcFlag] = React.useState(false)

    const CANVAS_WIDTH=Number(props.size)
    const CANVAS_HEIGHT=Number(props.size)

    const animationRef = React.useRef();

    const drawGaugeAnime = () => {
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
    
            let meter_scale_color = 'rgba(153,204,255, 1.00)';
            if(alc_flag) meter_scale_color = 'rgba(173,255,183, 1.00)';

            { // harf Circle
                // arc(x, y, radius, startAngle, endAngle, counterclockwise)
                context.scale(0.25, 1.0)
                context.beginPath();
                context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_HEIGHT/2, Math.PI*1.5, Math.PI * 2.5, true);
                context.strokeStyle = meter_scale_color;
                context.lineWidth = CANVAS_WIDTH*0.01;
                context.stroke();
            }
        }
        context.restore()
    };
    
    useEffect(()=>{ // update value
        if("mirror" in props) setMirrorFlag(1);
        if("alc" in props) {
            if (props.alc > -1 && alc_flag == false)
                setAlcFlag(true);
            else if (props.alc < 0 && alc_flag == true)
                setAlcFlag(false);
        }
    },[props])

    useEffect(()=>{ // After adding canvas component, context is created
        const canvas = document.getElementById(props.id)
        const canvasContext = canvas.getContext("2d")
        setContext(canvasContext)
    },[]) // executed at once

    useEffect(()=>{
        if(context!==null) {
            drawGaugeAnime();
        }
    },[context, props, alc_flag])

    return(
        <div>
            <canvas width={props.size} height={props.size} id={props.id} style={styles}></canvas>
        </div>
    )
}
