import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const moveValue = 2;
const fillColor = "#38c"

const styles = {
    // "backgroundColor": "red",
}

export const TextDisplay = (props) => {
    const [context,setContext] = useState(null)
    const [target_val, setTargetValue] = React.useState(0)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)
    const [width, setWidth] = React.useState(0)
    const [height, setHeight] = React.useState(0)
    
    const animationRef = React.useRef();
    
    const CANVAS_WIDTH=width
    const CANVAS_HEIGHT=height

    const drawGaugeAnime = () => {
        animationRef.current = requestAnimationFrame(drawGaugeAnime);

        // canvas
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()
        {
            // mirror
            if(mirrorFlag){
                context.translate(CANVAS_WIDTH, 0);
                context.scale(-1, 1);
            } 
            // Text
            context.beginPath();
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_HEIGHT*0.8 + "px serif"
            context.textAlign = "center"
            context.textBaseline = "middle"
            context.fillText(target_val, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH);
            if( "sub_val" in props) {
                context.font = "bold " + CANVAS_HEIGHT/4 + "px serif"
                context.textAlign = "center"
                context.textBaseline = "bottom"
                context.fillText(props.sub_val, CANVAS_WIDTH/2, CANVAS_HEIGHT, CANVAS_WIDTH);
            }
        }
        context.restore()
    
        // end process
        cancelAnimationFrame(animationRef.current);
    };
    
    useEffect(()=>{ // update value
        setTargetValue(props.val);
        setWidth(props.width)
        setHeight(props.height)
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
    },[context, target_val, width, height])

    return(
        <div>
            <canvas width={props.width} height={props.height} id={props.id} style={styles}></canvas>
        </div>
    )
}
