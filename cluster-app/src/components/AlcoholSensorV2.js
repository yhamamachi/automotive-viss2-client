import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

export const AlcoholSensorV2 = (props) => {
    const [val, setValue] = React.useState(0)
    const [max_val, setMaxValue] = React.useState(0)
    
    useEffect(()=>{ // update value
        setValue(props.val);
        setMaxValue(props.max_val);
    },[props])

    let _style_alert = {
        padding: "0px",
        margin: "0px",
        color: "#000000",
        background: 'radial-gradient(rgb(150, 33, 11), rgb(0, 0, 0) 90%)',
        position: "absolute",
        top: "-1%",
        left: "0%",
        width: props.width,
        height: props.height,
        opacity: 0.65,
        fontSize: 4.0*props.scale+"em",
    }
    let _style_text = {
        textAlign: "center",
        position: "absolute",
        padding: "0px",
        margin: "0px",
        color: "white",
        fontWeight: "700", // 400=normal, 700=bold, 1000=max
        textStroke: "50px red",
        width: props.width,
        // height: props.height,
        top: props.height*0.65,
        left: "0%",
        fontSize: 7.0*props.scale+"em",
        opacity: 1.0,
        fontFamily: 'Dejavu Sans, Arial Black',
        textShadow: "0 0 20px rgba(200,200,50,1.0)",
    }
    let _triangle_size = 270*props.scale*0.90;
    let _h_offset = -0.035
    let _top_offset = 0.45
    let _style_triangle_center = {
        // background: '#00cc00',
        position: "absolute",
        width: "1px",
        height: "1px",
        borderRight: 0.9*_triangle_size + "px solid transparent",
        borderBottom: 0.9*_triangle_size*Math.sqrt(3) + "px solid #ff0000",
        borderLeft: 0.9*_triangle_size + "px solid transparent",
        // borderBottomLeftRadius: "10%",
        top: props.height*(_top_offset) - 1.15*_triangle_size*Math.sqrt(3)/2,
        left: "50%", 
        transform: "translate(-50%, 0%)",
    }
    let _style_wrapper = {position: "relative",}
    let _style_triangle_curve = {
        position: "absolute",
        padding: "0px",
        margin: "0px",
        background: '#ff0000',
        width: 2.0*_triangle_size+"px",
        height: 0.2*_triangle_size+"px",
        borderRadius: 5*_triangle_size+"px",
        // transform: "translate(-50%, -50%)",
    }
    let _style_triangle_curve_1 = {
        ..._style_triangle_curve,
        transform: "rotate(0deg)",
        // left: props.width/2 - _triangle_size,
        // top: props.height/2 + _triangle_size*Math.sqrt(3)/2 - _triangle_size*0.175,
        top: props.height*_top_offset + _triangle_size*Math.sqrt(3)/4 +  _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size
    };
    let _style_triangle_curve_2 = {
        ..._style_triangle_curve,
        transform: "rotate(120deg)",
        // left: props.width/2 - (_triangle_size*1.5 + _triangle_size*_h_offset),
        // top: props.height/2 - _triangle_size*0.1,
        top: props.height*_top_offset  - _triangle_size*Math.sqrt(3)/4- _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size - _triangle_size/2 - _triangle_size*_h_offset,
    };
    let _style_triangle_curve_3 = {
        ..._style_triangle_curve,
        transform: "rotate(240deg)",
        left: _triangle_size/4,
        // left: props.width/2 - (_triangle_size*0.5 - _triangle_size*_h_offset),
        // top: props.height/2 - _triangle_size*0.1,
        top: props.height*_top_offset  - _triangle_size*Math.sqrt(3)/4- _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size + _triangle_size/2 + _triangle_size*_h_offset,
    };

    // outer 
    _triangle_size *= 1.03;
    //let _boxshadow = "1px 1px 6px 2px #cc3";
    let _boxshadow = "1px 1px 6px 2px rgba(200,200,50, 0.5)";
    let _style_triangle_curve_outer_1 = { ..._style_triangle_curve_1,
         background: '#FFFFFF',
         width: 2.0*_triangle_size+"px",
         height: 0.2*_triangle_size+"px",
         top: props.height*_top_offset + _triangle_size*Math.sqrt(3)/4 +  _triangle_size*_h_offset,
         left: props.width/2 - _triangle_size,
         //  left: props.width/2 - _triangle_size,
        //  top: props.height/2 + _triangle_size*Math.sqrt(3)/2 - _triangle_size*0.175,
        boxShadow: _boxshadow,
      }
     let _style_triangle_curve_outer_2 = { ..._style_triangle_curve_2,
        background: '#FFFFFF',
        width: 2.0*_triangle_size+"px",
        height: 0.2*_triangle_size+"px",
        top: props.height*_top_offset  - _triangle_size*Math.sqrt(3)/4- _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size - _triangle_size/2 - _triangle_size*_h_offset,
        // left: props.width/2 - (_triangle_size*1.5 + _triangle_size*_h_offset),
        // top: props.height/2 - _triangle_size*0.1,
        boxShadow: _boxshadow,
    }
    let _style_triangle_curve_outer_3 = { ..._style_triangle_curve_3,
        background: '#FFFFFF',
        width: 2.0*_triangle_size+"px",
        height: 0.2*_triangle_size+"px",
        top: props.height*_top_offset  - _triangle_size*Math.sqrt(3)/4- _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size + _triangle_size/2 + _triangle_size*_h_offset,
        // left: props.width/2 - (_triangle_size*0.5 - _triangle_size*_h_offset),
        // top: props.height/2 - _triangle_size*0.1,
        boxShadow: _boxshadow,
    }
    let _rect_config = {
        width: 0.15,
        height: 0.9,
        border_scale: 0.20,
    }
    let _style_triangle_rect = {
        position: "absolute",
        padding: "0px",
        margin: "0px",
        background: '#CCCCCC',
        width: _rect_config.width*_triangle_size+"px",
        height: _rect_config.height*_triangle_size+"px",
        //borderRadius: 2*_triangle_size+"px",
        //transform: "rotate(180deg)",
        top: props.height*(_top_offset)*1.10 - 1.15*_triangle_size*_rect_config.height - Number(_rect_config.border_scale*_rect_config.width*_triangle_size),    
        left: props.width/2 - _rect_config.width*_triangle_size/2 - Number(_rect_config.border_scale*_rect_config.width*_triangle_size),
        border: Number(_rect_config.border_scale*_rect_config.width*_triangle_size) + "px solid #FFFFFF",
    }
    let _circle_config = {
        size: 0.25,
        border_scale: 0.10,
    }
    let _style_triangle_circle = {
        position: "absolute",
        padding: "0px",
        margin: "0px",
        background: '#cccccc',
        width: _circle_config.size*_triangle_size+"px",
        height: _circle_config.size*_triangle_size+"px",
        borderRadius: _triangle_size+"px",
        top: props.height*(_top_offset)*1.10,
        left: props.width/2 - _circle_config.size*_triangle_size/2 - Number(_circle_config.border_scale*_circle_config.size*_triangle_size),
        border: Number(_circle_config.border_scale*_circle_config.size*_triangle_size) + "px solid #FFFFFF",
    }

    let _alc_text_style = {
        border: "solid 3px",
        borderRadius: "10px",
        margin: "2px",
        left: "50%",
        letterSpacing: "2px",
        position: "absolute",
        transform: "translate(-50%, 0%)",
        bottom: "10px",
        color: "#FFFF00",
        borderColor: "#FFFF00",
        fontSize: 2.4*props.scale+"em",
        fontWeight: "900",
        textAlign: "center",
        fontFamily: 'Dejavu Sans, Arial Black',
    }

    let _style_zoom_in_zoom_out = {
        margin: "0px",
        padding: "0px",
        width: "100%",
        height: "100%",
        background: "rgba(255,255,255,0)",
        position: "relative",
        left: "0px",
        top: "0px",
        /* background: radial-gradient(rgb(150, 33, 11), rgb(0, 0, 0) 90%); */
        animation: "zoom-in-zoom-out 1.0s linear infinite",
        /* opacity: 0.5; */
    }

    if (val.toFixed(2) < max_val.toFixed(2)) {
        _style_wrapper.display = "none"
    }

    if (val.toFixed(2) < 0 ) {
        _alc_text_style.display = "none"
    }

    return(
        <>
            {/* Text */}
            <div style={_alc_text_style}>
                &#x1F37A;BrAC <br />
                {`${val.toFixed(2)} mg/L`} {/* X.XX */}
            </div>
            {/* Alert */}
            <div width={props.width} height={props.height} style={_style_wrapper}>
                <style>
                    {`@keyframes zoom-in-zoom-out {
                        0%, 100% {
                            transform: scale(0.94, 0.94);
                            opacity: 0.8;
                        }

                        15%, 85% {
                            transform: scale(0.95, 0.95);
                            opacity: 0.4;
                        }

                        50% {
                            transform: scale(0.98, 0.98);
                            opacity: 0.3;
                        }
                    }`}
                </style>
                <span style={_style_alert}></span>
                <div style={_style_zoom_in_zoom_out}>
                    <p style={_style_text}>&#x1F37A;ALCOHOL DETECTED&#x1F37A;</p>
                    {/* &#x1F37A; = 🍺*/}
                    <span style={_style_triangle_curve_outer_1}></span>
                    <span style={_style_triangle_curve_outer_2}></span>
                    <span style={_style_triangle_curve_outer_3}></span>
                    <span style={_style_triangle_curve_1}></span>
                    <span style={_style_triangle_curve_2}></span>
                    <span style={_style_triangle_curve_3}></span>
                    <span style={_style_triangle_center}></span>
                    <span style={_style_triangle_rect}></span>
                    <span style={_style_triangle_circle}></span>
                </div> 
            </div>
        </>
    )
}
