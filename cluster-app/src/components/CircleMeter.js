import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

var moveValue = 4;
const fillColor = "#38c"

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

function deg2rad(deg){
    let ret = deg * Math.PI/180.0;
    if (ret > 2*Math.PI) ret %= 2*Math.PI;
    return ret;
}

export const CircleMeter = (props) => {
    const [context,setContext] = useState(null)
    const [bg_context,setBgContext] = useState(null)
    const [text_context,setTextContext] = useState(null)
    const [val, setValue] = React.useState(0)
    const [target_val, setTargetValue] = React.useState(0)
    const [captionText, setCaptionText] = React.useState("")
    const [captionSubText, setCaptionSubText] = React.useState("")
    const [max_val, setMaxValue] = React.useState(180)
    const [split_num, setSplitNum] = React.useState(20)
    const [split_val_flag, setSplitValFlag] = React.useState(0)
    const [alc_flag, setAlcFlag] = React.useState(false)

    const CANVAS_WIDTH=Number(props.size)
    const CANVAS_HEIGHT=Number(props.size)

    const animationRef = React.useRef();
    var gauge_val = val;
    let moveValue = max_val/200

    // outer/inner circle config
    let base_radius = CANVAS_WIDTH/2
    let outer_line_width = 3
    let blur_line_width = 15// > outer_line_witdh
    let inner_radius_scale = 0.40
    let arc_cut_degree = 100
    let meter_radius_scale = 0.70
    let meter_line_width = base_radius*(meter_radius_scale - inner_radius_scale)
    let meter_back_line_witdh = base_radius*(meter_radius_scale - inner_radius_scale) * 0.3

    const drawBackground = () => {
        // canvas
        bg_context.fillStyle = 'rgba(255,255,255,0)'; 
        bg_context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        bg_context.save()
        { 
            bg_context.save()
            { // Outer/inner Circle
                [base_radius, base_radius*inner_radius_scale].forEach(function (radius) {
                    // arc(x, y, radius, startAngle, endAngle, counterclockwise)
                    bg_context.beginPath();
                    bg_context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, radius - outer_line_width - blur_line_width/2, 0, Math.PI * 2, true);
                    bg_context.strokeStyle = 'rgba(179,214,255, 0.20)';
                    if(alc_flag) bg_context.strokeStyle = 'rgba(179,255,179, 0.20)';
                    bg_context.lineWidth = blur_line_width;
                    bg_context.stroke();

                    bg_context.beginPath();
                    bg_context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, radius - outer_line_width - blur_line_width/2, 0, Math.PI * 2, true);
                    bg_context.strokeStyle = 'rgba(179,214,255, 1.00)';
                    if(alc_flag) bg_context.strokeStyle = 'rgba(179,255,179, 1.20)';
                    bg_context.lineWidth = outer_line_width;
                    bg_context.stroke();
                });
            }
            bg_context.restore()

            bg_context.save()
            { // Caption Text
                let font_size_scale = 0.08
                bg_context.fillStyle = "#ccc"
                bg_context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
                bg_context.textBaseline = "center"
                bg_context.textAlign = "center"
                bg_context.fillText(captionText, CANVAS_WIDTH/2, CANVAS_HEIGHT*0.85);
            }
            bg_context.restore()

            bg_context.save()
            { // Inner Meter
                // Rotate canvas
                bg_context.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                bg_context.rotate(deg2rad(90-arc_cut_degree));
                bg_context.rotate(deg2rad(arc_cut_degree/2));
                bg_context.translate(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2);
    
                // outter line
                bg_context.beginPath();
                bg_context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_back_line_witdh/2, deg2rad(arc_cut_degree), deg2rad(360), false);
                bg_context.strokeStyle = 'rgba(153,204,255, 1.00)';
                if(alc_flag) bg_context.strokeStyle = 'rgba(173,255,183, 1.00)';
                bg_context.lineWidth = meter_back_line_witdh;
                bg_context.stroke();
    
                // splitter(start/end)
                bg_context.lineWidth = meter_line_width*1.2;
                bg_context.strokeStyle = 'rgba(255,255,255, 1.00)';
                bg_context.beginPath();
                bg_context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_line_width/2, deg2rad(arc_cut_degree), deg2rad(arc_cut_degree+1), false);
                bg_context.stroke();
                bg_context.beginPath();
                bg_context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_line_width/2, deg2rad(360-1), deg2rad(360), false);
                bg_context.stroke();
    
                // splitter(the others)
                bg_context.strokeStyle = 'rgba(255,255,255, 1.00)';
                bg_context.lineWidth = meter_line_width*0.8;
                for (let num = 1; num < split_num; ++num) {
                    let _deg = arc_cut_degree + (360-arc_cut_degree)/split_num * num
                    bg_context.beginPath();
                    bg_context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-bg_context.lineWidth/2, deg2rad(_deg-0.5), deg2rad(_deg+0.5), false);
                    bg_context.stroke();
                }
            }
            bg_context.restore()
        }
        bg_context.restore()

        bg_context.save()
        {// splitter(caption)
            let font_size_scale = 0.040
            let _radius = CANVAS_HEIGHT*0.39
            //for (let num = 1; num < split_num; ++num) { // Hide start and end splitter caption
            for (let num = 0; num <= split_num; ++num) { // Show start and end splitter caption
                let _deg = (360-arc_cut_degree)/split_num * num + arc_cut_degree/2 + 90;
                let _text = max_val/split_num * num
                if (split_val_flag) _text = num;
                bg_context.fillStyle = "#ccc"
                bg_context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
                bg_context.textBaseline = "middle"
                bg_context.textAlign = "center"
                bg_context.fillText(_text, CANVAS_WIDTH/2+_radius*Math.cos(deg2rad(_deg)), CANVAS_HEIGHT/2+_radius*Math.sin(deg2rad(_deg)));
            }
        }
        bg_context.restore()
    }

    const drawGaugeAnime = () => {
        const startTime = performance.now(); // start時間
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

        // canvas
        context.fillStyle = 'rgba(255,255,255,0)'; 
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()
        { 
            context.save()
            { // Inner Meter
                context.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                context.rotate(deg2rad(90-arc_cut_degree));
                context.rotate(deg2rad(arc_cut_degree/2));
                context.translate(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2);

                // meter
                let meter_val = deg2rad(arc_cut_degree + (360-arc_cut_degree)*gauge_val / max_val);
                context.beginPath();
                // arc(x, y, radius, startAngle, endAngle, counterclockwise)
                context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_line_width/2, deg2rad(arc_cut_degree), meter_val, false);
                context.strokeStyle = 'rgba(0,102,255, 0.50)';
                if(alc_flag) context.strokeStyle = 'rgba(0,255,102, 0.50)';
                context.lineWidth = meter_line_width;
                context.stroke();
            }
            context.restore()
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

    const drawMeterText = () => {
        // canvas
        text_context.fillStyle = 'rgba(255,255,255,0)'; 
        text_context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        text_context.save()
        { // inner text
            //fillText(text, x, y, maxWidth)
            let font_size_scale = 0.08
            text_context.fillStyle = "#ccc"
            text_context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
            text_context.textBaseline = "center"
            text_context.textAlign = "center"
            // value
            text_context.fillText(Math.round(target_val), CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
            // unit
            text_context.fillText(captionSubText, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + CANVAS_WIDTH*font_size_scale);
        }
        text_context.restore()
    }
    useEffect(()=>{ // update value
        setTargetValue(props.val);
        if("text" in props) setCaptionText(props.text);
        if("sub_text" in props) setCaptionSubText(props.sub_text);
        if("mirror" in props) setMirrorFlag(1);
        if("max_val" in props) setMaxValue(props.max_val);
        if("split_num" in props) setSplitNum(props.split_num);
        if("split_val" in props) {
            setSplitNum(props.max_val/props.split_val);
            setSplitValFlag(1);
        }
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
        const text_canvas = document.getElementById("text"+props.id)
        const text_canvasContext = text_canvas.getContext("2d")
        setTextContext(text_canvasContext)
    },[]) // executed at once

    useEffect(()=>{
        if(context!==null) {
            if(animationRef.current == null) {
                drawGaugeAnime();
                return () => {
                    cancelAnimationFrame(animationRef.current);
                    animationRef.current = null;
                }
            }
        }
    },[context, target_val, alc_flag])

    useEffect(()=>{
        if(bg_context!==null) {
            drawBackground();
        }
    },[bg_context, props.size, alc_flag])

    useEffect(()=>{
        if(text_context!==null) {
            drawMeterText();
        }
    },[text_context, target_val])

    return(
        <div style={wrapper_styles}>
            <canvas width={props.size} height={props.size} id={props.id} style={styles}></canvas>
            <canvas width={props.size} height={props.size} id={"text"+props.id} style={styles}></canvas>
            <canvas width={props.size} height={props.size} id={"bg"+props.id} style={bg_styles}></canvas>
        </div>
    )
}
