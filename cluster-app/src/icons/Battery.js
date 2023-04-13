import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const styles = {
    //"backgroundColor": "red",
}

export const Battery = (props) => {
    const [context,setContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    
    const CANVAS_WIDTH=Number(props.width)
    const CANVAS_HEIGHT=Number(props.height)

    const animationRef = React.useRef();
    var gauge_val = val;

    const drawGaugeAnime = () => {
        animationRef.current = requestAnimationFrame(drawGaugeAnime);

        // canvas
        context.fillStyle = 'rgba(255,255,255,0)'; 
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()
        {
            // Icon
            var _color = 'rgba(180,180,180, 1.00)';
            context.beginPath();
            context.fillStyle = _color;// 'rgba(255,255,0, 1.00)';

            context.fillRect(CANVAS_WIDTH*0.00, CANVAS_HEIGHT*0.0, CANVAS_WIDTH*0.86, CANVAS_HEIGHT*0.06)
            context.fillRect(CANVAS_WIDTH*0.00, CANVAS_HEIGHT*0.90, CANVAS_WIDTH*0.86, CANVAS_HEIGHT*0.06)
            context.fillRect(CANVAS_WIDTH*0.00, CANVAS_HEIGHT*0.05, CANVAS_WIDTH*0.06, CANVAS_HEIGHT*0.90)
            context.fillRect(CANVAS_WIDTH*0.80, CANVAS_HEIGHT*0.05, CANVAS_WIDTH*0.06, CANVAS_HEIGHT*0.90)
            
            context.fillRect(CANVAS_WIDTH*0.84, CANVAS_HEIGHT*0.20, CANVAS_WIDTH*0.15, CANVAS_HEIGHT*0.60)

            for(var i = 0; i<4; ++i) {
                context.fillStyle = _color;// 'rgba(0,255,0, 1.00)';
                context.fillRect(CANVAS_WIDTH*0.1+CANVAS_WIDTH*0.18*(i), CANVAS_HEIGHT*0.15, CANVAS_WIDTH*0.1, CANVAS_HEIGHT*0.7);//塗りつぶされた四角形
            }
        }
        context.restore()
        context.save()

        // end process
        if (gauge_val == target_val) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    useEffect(()=>{ // update value
        setTargetValue(props.val);
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
