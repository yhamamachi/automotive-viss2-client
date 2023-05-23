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
        border: "solid 3px",
        borderRadius: "10px",
        padding: "30px",
        margin: "2px",
        color: "#000000",
        background: "#cc0000",
        borderColor: "#ff0000",
        animation: "flash 0.4s linear infinite",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 4.0*props.scale+"em",
    }
    if (val <= max_val) {
        _style_alert.display = "none"
    }

    return(
            <div width={props.width} height={props.height}>
                <style>
                {`@keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }`}
                </style>
                <span  style={_style_alert}>Attack Detected !!</span>
            </div>
    )
}
