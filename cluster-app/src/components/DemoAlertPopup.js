import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

export const DemoAlertPopup = (props) => {
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
        top: props.height*0.77,
        left: "0%",
        fontSize: 7.0*props.scale+"em",
        opacity: 1.0,
        fontFamily: 'Dejavu Sans, Arial Black',
    }
    let _triangle_size = 270*props.scale*1.0;
    let _h_offset = -0.035
    let _top_offset = 0.55
    let _style_triangle_center = {
        // background: '#00cc00',
        position: "absolute",
        width: "1px",
        height: "1px",
        borderRight: 0.9*_triangle_size + "px solid transparent",
        borderBottom: 0.9*_triangle_size*Math.sqrt(3) + "px solid #ff0000",
        borderLeft: 0.9*_triangle_size + "px solid transparent",
        // borderBottomLeftRadius: "10%",
        top: props.height*(1.0-_top_offset) - 0.9*_triangle_size*Math.sqrt(3)/2,
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
    _triangle_size *= 1.03
    let _style_triangle_curve_outer_1 = { ..._style_triangle_curve_1,
         background: '#FFFFFF',
         width: 2.0*_triangle_size+"px",
         height: 0.2*_triangle_size+"px",
         top: props.height*_top_offset + _triangle_size*Math.sqrt(3)/4 +  _triangle_size*_h_offset,
         left: props.width/2 - _triangle_size
         //  left: props.width/2 - _triangle_size,
        //  top: props.height/2 + _triangle_size*Math.sqrt(3)/2 - _triangle_size*0.175,
      }
     let _style_triangle_curve_outer_2 = { ..._style_triangle_curve_2,
        background: '#FFFFFF',
        width: 2.0*_triangle_size+"px",
        height: 0.2*_triangle_size+"px",
        top: props.height*_top_offset  - _triangle_size*Math.sqrt(3)/4- _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size - _triangle_size/2 - _triangle_size*_h_offset,
        // left: props.width/2 - (_triangle_size*1.5 + _triangle_size*_h_offset),
        // top: props.height/2 - _triangle_size*0.1,
    }
    let _style_triangle_curve_outer_3 = { ..._style_triangle_curve_3,
        background: '#FFFFFF',
        width: 2.0*_triangle_size+"px",
        height: 0.2*_triangle_size+"px",
        top: props.height*_top_offset  - _triangle_size*Math.sqrt(3)/4- _triangle_size*_h_offset,
        left: props.width/2 - _triangle_size + _triangle_size/2 + _triangle_size*_h_offset,
        // left: props.width/2 - (_triangle_size*0.5 - _triangle_size*_h_offset),
        // top: props.height/2 - _triangle_size*0.1,
    }
    let _style_triangle_rect = {
        position: "absolute",
        padding: "0px",
        margin: "0px",
        background: '#FFFFFF',
        width: 0.9*_triangle_size+"px",
        height: 0.2*_triangle_size+"px",
        //borderRadius: 2*_triangle_size+"px",
        transform: "rotate(90deg)",
        top: props.height*(1.0-_top_offset-0.07),    
        left: props.width/2 - 0.9*_triangle_size/2,
    }
    let _style_triangle_circle = {
        position: "absolute",
        padding: "0px",
        margin: "0px",
        background: '#FFFFFF',
        width: 0.3*_triangle_size+"px",
        height: 0.3*_triangle_size+"px",
        borderRadius: 3*_triangle_size+"px",
        top: props.height*(1.0-_top_offset+0.18),
        left: props.width/2 - 0.3*_triangle_size/2,
    }

    if (val <= max_val) {
        _style_wrapper.display = "none"
    }

    return(
        <div width={props.width} height={props.height} style={_style_wrapper}>
            <span style={_style_alert}></span>
            <div className="zoom-in-out-box">
                <p style={_style_text}>&#x2620;ATTACK DETECTED&#x2620;</p>
                {/* &#x2620; = ☠*/}
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
    )
}
