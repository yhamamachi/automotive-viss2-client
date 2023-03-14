import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"

const styles = {
    // "backgroundColor": "red",
}

export const HTMLViewer = (props) => {
    return(
        <div style={{width: props.width, height: props.height, border: "solid"}}>
            <object type="text/html" data={props.url} width={props.width} height={props.height}>
                <p>Note: It seems that your browser doesn't support Object tag.</p>
            </object>
        </div>
    );
};
