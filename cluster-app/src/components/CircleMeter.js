import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

var moveValue = 4;
const fillColor = "#38c"

const styles = { /** For debug */
    //"backgroundColor": "red",
}

function deg2rad(deg){
    let ret = deg * Math.PI/180.0;
    if (ret > 2*Math.PI) ret %= 2*Math.PI;
    return ret;
}

export const CircleMeter = (props) => {
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
        let blur_line_width = 15// > outer_line_witdh
        let inner_radius_scale = 0.40

        // canvas
        context.fillStyle = 'rgba(255,255,255,0)'; 
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save()
        { // Outer/inner Circle
            [base_radius, base_radius*inner_radius_scale].forEach(function (radius) {
                // arc(x, y, radius, startAngle, endAngle, counterclockwise)
                context.beginPath();
                context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, radius - outer_line_width - blur_line_width/2, 0, Math.PI * 2, true);
                context.strokeStyle = 'rgba(179,214,255, 0.20)';
                context.lineWidth = blur_line_width;
                context.stroke();

                context.beginPath();
                context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, radius - outer_line_width - blur_line_width/2, 0, Math.PI * 2, true);
                context.strokeStyle = 'rgba(179,214,255, 1.00)';
                context.lineWidth = outer_line_width;
                context.stroke();
            });
        }
        { // inner text
            //fillText(text, x, y, maxWidth)
            let font_size_scale = 0.08
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
            context.textBaseline = "center"
            context.textAlign = "center"
            // value
            context.fillText(Math.round(target_val), CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
            // unit
            context.fillText(captionSubText, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + CANVAS_WIDTH*font_size_scale);
        }
        { // Caption Text
            let font_size_scale = 0.08
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
            context.textBaseline = "center"
            context.textAlign = "center"
            context.fillText(captionText, CANVAS_WIDTH/2, CANVAS_HEIGHT*0.85);
        }
        { // Inner Meter
            // Inner Meter
            // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            let arc_cut_degree = 100
            let meter_radius_scale = 0.70
            let meter_line_width = base_radius*(meter_radius_scale - inner_radius_scale)
            let meter_back_line_witdh = base_radius*(meter_radius_scale - inner_radius_scale) * 0.3

            context.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
            context.rotate(deg2rad(90-arc_cut_degree));
            context.rotate(deg2rad(arc_cut_degree/2));
            context.translate(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2);

            // outter line
            context.beginPath();
            context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_back_line_witdh/2, deg2rad(arc_cut_degree), deg2rad(360), false);
            context.strokeStyle = 'rgba(153,204,255, 1.00)';
            context.lineWidth = meter_back_line_witdh;
            context.stroke();

            // meter
            let meter_val = deg2rad(arc_cut_degree + (360-arc_cut_degree)*gauge_val / max_val);
            context.beginPath();
            context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_line_width/2, deg2rad(arc_cut_degree), meter_val, false);
            context.strokeStyle = 'rgba(0,102,255, 0.50)';
            context.lineWidth = meter_line_width;
            context.stroke();

            // splitter(start/end)
            context.lineWidth = meter_line_width*1.2;
            context.strokeStyle = 'rgba(255,255,255, 1.00)';
            context.beginPath();
            context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_line_width/2, deg2rad(arc_cut_degree), deg2rad(arc_cut_degree+1), false);
            context.stroke();
            context.beginPath();
            context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-meter_line_width/2, deg2rad(360-1), deg2rad(360), false);
            context.stroke();

            // splitter(the others)
            context.strokeStyle = 'rgba(255,255,255, 1.00)';
            context.lineWidth = meter_line_width*0.8;
            for (let num = 1; num < split_num; ++num) {
                let _deg = arc_cut_degree + (360-arc_cut_degree)/split_num * num
                context.beginPath();
                context.arc( CANVAS_WIDTH/2, CANVAS_HEIGHT/2, base_radius*meter_radius_scale-context.lineWidth/2, deg2rad(_deg-0.5), deg2rad(_deg+0.5), false);
                context.stroke();
            }
            context.restore()
            context.save()

            // splitter(caption)
            let font_size_scale = 0.040
            let _radius = CANVAS_HEIGHT*0.39
            //for (let num = 1; num < split_num; ++num) { // Hide start and end splitter caption
            for (let num = 0; num <= split_num; ++num) { // Show start and end splitter caption
                let _deg = (360-arc_cut_degree)/split_num * num + arc_cut_degree/2 + 90;
                let _text = max_val/split_num * num
                if (split_val_flag) _text = num;
                context.fillStyle = "#ccc"
                context.font = "bold " + CANVAS_WIDTH*font_size_scale + "px serif"
                context.textBaseline = "middle"
                context.textAlign = "center"
                context.fillText(_text, CANVAS_WIDTH/2+_radius*Math.cos(deg2rad(_deg)), CANVAS_HEIGHT/2+_radius*Math.sin(deg2rad(_deg)));
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
        if("text" in props) setCaptionText(props.text);
        if("sub_text" in props) setCaptionSubText(props.sub_text);
        if("mirror" in props) setMirrorFlag(1);
        if("max_val" in props) setMaxValue(props.max_val);
        if("split_num" in props) setSplitNum(props.split_num);
        if("split_val" in props) {
            setSplitNum(props.max_val/props.split_val);
            setSplitValFlag(1);
        }
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
