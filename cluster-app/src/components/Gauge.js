import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const moveValue = 2;
const fillColor = "#38c"

const styles = {
    //"backgroundColor": "red",
}

export const Gauge = (props) => {
    const [context,setContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)
    const [updateFlag, setUpdateFlag] = React.useState(0)
    
    const animationRef = React.useRef();

    const CANVAS_WIDTH=props.width
    const CANVAS_HEIGHT=props.height    
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
        let value = gauge_val;
        let start_x = Math.floor(CANVAS_WIDTH * 0.5 * (100-gauge_val) / 100)
        let start_y = Math.floor(CANVAS_HEIGHT * (100-gauge_val) / 100)
        
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
            context.moveTo( start_x, start_y)
            context.lineTo( CANVAS_WIDTH/2, CANVAS_HEIGHT ) ;
            context.lineTo( CANVAS_WIDTH  , CANVAS_HEIGHT ) ;
            context.lineTo( start_x + CANVAS_WIDTH/2, start_y ) ;
            context.clip();
            let n = [0, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT-tan*CANVAS_WIDTH]
            let lineargradient = context.createLinearGradient(...n);
            lineargradient.addColorStop(0.0, "#00c");
            lineargradient.addColorStop(0.7, fillColor);
            lineargradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = lineargradient;
            context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//塗りつぶされた四角形
            
            // split line
            let split_num = 10;
            let line_width = 2
            for(var i=0; i<(gauge_val/split_num); i++){
                let lineargradient = context.createLinearGradient(...n);
                lineargradient.addColorStop(0.4, "#111");
                lineargradient.addColorStop(0.9, 'rgba(255,255,255,0)');
                context.fillStyle = lineargradient;
                context.fillRect(0, CANVAS_HEIGHT/split_num*(split_num-i), CANVAS_WIDTH, line_width);//塗りつぶされた四角形
            }
            
        }
        context.restore()
    
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
