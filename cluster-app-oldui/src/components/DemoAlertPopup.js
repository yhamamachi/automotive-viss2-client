import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const styles = {
    // "backgroundColor": "red",
}

export const DemoAlertPopup = (props) => {
    const [context,setContext] = useState(null)
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
        animation: "flash 0.4s linear infinite"
    }
    if (val < max_val) {
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
                <div style={_style_alert}>
                    Attack Detected !!
                </div>
            </div>
    )
}
