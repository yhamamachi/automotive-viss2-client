import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

var moveValue = 4;
const fillColor = "#38c"

const styles = {
    // "backgroundColor": "red",
}
let test_val = 0;

function deg2rad(deg){
    let ret = deg * Math.PI/180.0;
    if (ret > 2*Math.PI) ret %= 2*Math.PI;
    return ret;
}

export const SideBar = (props) => {
    const [context,setContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [mirrorFlag, setMirrorFlag] = React.useState(0)
    const [captionText, setCaptionText] = React.useState("")
    const [captionSubText, setCaptionSubText] = React.useState("")
    const [max_val, setMaxValue] = React.useState(180)
    const [split_num, setSplitNum] = React.useState(20)
    const [split_val_flag, setSplitValFlag] = React.useState(0)

    const CANVAS_WIDTH=Number(props.size)
    const CANVAS_HEIGHT=Number(props.size)

    const animationRef = React.useRef();
    var gauge_val = val;
    let tan = (CANVAS_WIDTH/2) / CANVAS_HEIGHT
    let moveValue = max_val/50

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
        if (gauge_val > max_val) {
            cancelAnimationFrame(animationRef.current);
            return
        }
        setValue(gauge_val)

        // outer/inner circle config
        let base_radius = CANVAS_WIDTH/2
        let outer_line_width = 3
        let blur_line_width = 5// > outer_line_witdh
        let inner_radius_scale = 0.40

        let gaugeWidth = 0.20
        let upper_cross_point_x = 0.8 // -1/4x + ((1.0-gWidth)-0.2*-1/4) = -4x => 15/4x = ((1.0-gWidth)-0.05) => x= 1-4*(1.0-gWidth-0.05)/15
        let upper_cross_point_y = 0.2; // y= -1/4x
        let bottom_cross_point_x = 4.0*(1.0-gaugeWidth)/5 ; // -1/4x + (1.0-gWidth) = -4x - (1.0-gWidth) =>  15/4x = -2(1.0-gWidth) => x= 1- 8(1.0-gWidth)/15 
        let bottom_cross_point_y = 1/4.0*bottom_cross_point_x + gaugeWidth; // y=-1/4x -0.2
        // canvas
        context.restore()   
        context.fillStyle = 'rgba(255,255,255,0)'; 
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()

        // mirror
        if(mirrorFlag){
            context.translate(CANVAS_WIDTH, 0);
            context.scale(-1, 1);
        } 

        let meter_scale_color = 'rgba(153,204,255, 1.00)';
        { // harf Circle
            // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            context.scale(0.25, 1.0)
            context.beginPath();
            context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_HEIGHT/2, Math.PI*1.5, Math.PI * 2.5, true);
            context.strokeStyle = meter_scale_color;
            context.lineWidth = CANVAS_WIDTH*0.01;
            context.stroke();
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
            <canvas width={props.size} height={props.size} id={props.id} style={styles}></canvas>
        </div>
    )
}
