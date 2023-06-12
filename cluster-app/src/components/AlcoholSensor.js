import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

export const AlcoholSensor = (props) => {
    const [val, setValue] = React.useState(0)
    const [max_val, setMaxValue] = React.useState(0)

    useEffect(()=>{ // update value
        setValue(props.val.toFixed(4));
        setMaxValue(props.max_val);
    },[props])

    let _style_common = {
        border: "solid 3px",
        borderRadius: "10px",
        margin: "2px",
        left: "50%",
        letterSpacing: "2px",
        position: "absolute",
    }
    let _style_alert = {
        ..._style_common,
        padding: "30px",
        color: "#000000",
        background: "#cc0000",
        borderColor: "#ff0000",
        animation: "flash 0.4s linear infinite",

        color: "#cfe4f9",
        fontSize: 3.0*props.scale+"em",
        fontWeight: "900",
        top: "50%",
        transform: "translate(-50%, -50%)",
    }
    let _style = {
        ..._style_common,
        transform: "translate(-50%, 0%)",
        bottom: "10px",
        color: "#cfe4f9",
        borderColor: "#6091d3",
        fontSize: 2.2*props.scale+"em",
    }

    if (val < 0.1500) {
        _style_alert.display = "none"
    }
    if (val < 0) {
        _style.display = "none"
    }
    return (
        <div>
            <style>
                {`@keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }`}
            </style>
            <div style={_style_alert}>
                Alcohol Detected !!
            </div>
            <div style={_style}>
                BrAC {`${val} mg/L`}
            </div>
        </div>
    )
}

