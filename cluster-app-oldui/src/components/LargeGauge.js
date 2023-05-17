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
    const [captionText, setCaptionText] = React.useState("")
    const [captionSubText, setCaptionSubText] = React.useState("")
    const [max_val, setMaxValue] = React.useState(180)
    const [split_num, setSplitNum] = React.useState(20)
    const [scale_num, setScaleNum] = React.useState(1)
    
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
        if (gauge_val > max_val) {
            cancelAnimationFrame(animationRef.current);
            return
        }
        setValue(gauge_val)

        let gaugeWidth = 0.20
        let upper_cross_point_x = 0.8 // -1/4x + ((1.0-gWidth)-0.2*-1/4) = -4x => 15/4x = ((1.0-gWidth)-0.05) => x= 1-4*(1.0-gWidth-0.05)/15
        let upper_cross_point_y = 0.2; // y= -1/4x
        let bottom_cross_point_x = 4.0*(1.0-gaugeWidth)/5 ; // -1/4x + (1.0-gWidth) = -4x - (1.0-gWidth) =>  15/4x = -2(1.0-gWidth) => x= 1- 8(1.0-gWidth)/15 
        let bottom_cross_point_y = 1/4.0*bottom_cross_point_x + gaugeWidth; // y=-1/4x -0.2
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

            let upper_start_x  = (1.0 - (gauge_val)/50 * (1.0-upper_cross_point_x)) *CANVAS_WIDTH
            let upper_start_y  = (1.0 - (gauge_val)/50 * (1.0-upper_cross_point_y)) *CANVAS_HEIGHT
            let bottom_start_x = ((1.0-gaugeWidth)- (gauge_val)/50 * ((1.0-gaugeWidth)-bottom_cross_point_x)) *CANVAS_WIDTH
            let bottom_start_y = (1.0 - (gauge_val)/50 * (1.0-bottom_cross_point_y)) *CANVAS_HEIGHT
            if (gauge_val > 50) {
                upper_start_x = (100-gauge_val)/50 * upper_cross_point_x * CANVAS_WIDTH;
                upper_start_y = (100-gauge_val)/50 * upper_cross_point_y * CANVAS_HEIGHT;
                bottom_start_x = (100-gauge_val)/50 * (bottom_cross_point_x) * CANVAS_WIDTH;
                bottom_start_y = (gaugeWidth + (100-gauge_val)/50 * (bottom_cross_point_y-gaugeWidth)) * CANVAS_HEIGHT;
            }
        
            context.moveTo(upper_start_x, upper_start_y)
            if (gauge_val > 50) context.lineTo( CANVAS_WIDTH*upper_cross_point_x, CANVAS_HEIGHT*upper_cross_point_y );
            context.lineTo( CANVAS_WIDTH*1.0, CANVAS_HEIGHT*1.0 );
            context.lineTo( CANVAS_WIDTH*(1.0-gaugeWidth), CANVAS_HEIGHT*1.0 );
            if (gauge_val > 50) context.lineTo( CANVAS_WIDTH* bottom_cross_point_x , CANVAS_HEIGHT*bottom_cross_point_y);
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
        if(0){ // cross point show
            context.fillStyle = "red"
            context.fillRect(upper_cross_point_x * CANVAS_WIDTH, upper_cross_point_y * CANVAS_HEIGHT
            , 10, 10);//塗りつぶされた四角形              
            context.fillStyle = "green"
            context.fillRect(bottom_cross_point_x * CANVAS_WIDTH, bottom_cross_point_y * CANVAS_HEIGHT
            , 10, 10);//塗りつぶされた四角形            
        }
        {
            // Text
            let font_size = 0.035
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_WIDTH*font_size + "px serif"
            context.textBaseline = "bottom"
            if(mirrorFlag) {
                context.textAlign = "left"
                context.fillText(captionText, CANVAS_WIDTH*(gaugeWidth+font_size*3), CANVAS_HEIGHT*(1-font_size*2), CANVAS_WIDTH);
                context.fillText(captionSubText, CANVAS_WIDTH*(gaugeWidth+font_size*3), CANVAS_HEIGHT, CANVAS_WIDTH);
            } else {
                context.textAlign = "right"
                context.fillText(captionText, CANVAS_WIDTH*(1.0-gaugeWidth-font_size*3), CANVAS_HEIGHT*(1-font_size*2), CANVAS_WIDTH);
                context.fillText(captionSubText, CANVAS_WIDTH*(1.0-gaugeWidth-font_size*3), CANVAS_HEIGHT, CANVAS_WIDTH);
            }
        }
        {
            // Splitter
            let font_size = 0.05
            context.fillStyle = "#ccc"
            context.font = "bold " + CANVAS_WIDTH*font_size + "px serif"
            context.textAlign = "left"
            context.textBaseline = "bottom"
            if(split_num > 0){
                for( var num=0; num<max_val; num+=split_num){
                    let _val_par = parseInt(100.0*num/max_val)
                    let _val = num * scale_num
                    let bottom_start_x = ((1.0-gaugeWidth)- (_val_par)/50 * ((1.0-gaugeWidth)-bottom_cross_point_x)) *CANVAS_WIDTH
                    let bottom_start_y = (1.0 - (_val_par)/50 * (1.0-bottom_cross_point_y)) *CANVAS_HEIGHT
                    if (_val_par >= 50) {
                        bottom_start_x = (100-_val_par)/50 * (bottom_cross_point_x) * CANVAS_WIDTH;
                        bottom_start_y = (gaugeWidth + (100-_val_par)/50 * (bottom_cross_point_y-gaugeWidth)) * CANVAS_HEIGHT;
                        context.textAlign = "center"
                        context.textBaseline = "top"
                        if(mirrorFlag) context.fillText(_val, (CANVAS_WIDTH-bottom_start_x)*(1+font_size), bottom_start_y*(1+font_size), CANVAS_WIDTH);
                        else           context.fillText(_val, bottom_start_x*(1-font_size), bottom_start_y*(1+font_size), CANVAS_WIDTH);
                    } else if(_val_par == 0) {
                        if(mirrorFlag) context.fillText(_val, (CANVAS_WIDTH-bottom_start_x)*(1+font_size*1.5), bottom_start_y*(1), CANVAS_WIDTH);
                        else           context.fillText(_val, bottom_start_x*(1-font_size*1.5), bottom_start_y*(1), CANVAS_WIDTH);
                    } else {
                        if(mirrorFlag) context.fillText(_val, (CANVAS_WIDTH-bottom_start_x)*(1+font_size*1.5), bottom_start_y*(1+font_size), CANVAS_WIDTH);
                        else           context.fillText(_val, (bottom_start_x)*(1-font_size*1.5), bottom_start_y*(1+font_size), CANVAS_WIDTH);
                    }
                }
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
        if("sub_text" in props) setCaptionSubText(props.sub_text);
        if("mirror" in props) setMirrorFlag(1);
        if("max_val" in props) setMaxValue(props.max_val);
        if("split_num" in props) setSplitNum(props.split_num);
        if("scale" in props) setScaleNum(props.scale);
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
