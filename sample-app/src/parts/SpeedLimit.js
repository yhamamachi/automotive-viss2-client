import React from "react";

const _width = 100; // px
const styles = {
  outer: {
    "display": "inline-block",
    "width": _width+"px",
    "height": _width+"px",
    "border-radius": "50%",
    "background-color": "red"
},
  inner:{
    "display": "inline-grid",
    "width": "80%",
    "height": "80%",
    "padding": "auto",
    "margin": "10%", // (100 - width)/2
    "border-radius": "50%",
    "background-color": "#FFF",
    "color": "#000",
    "text-align": "center",
    "align-content": "center",
    "font-size": _width/2+"px"
  }
};

export const SpeedLimitBase = (props) => {
  return (
    <div style={styles.outer}>
        <div style={styles.inner}>
            30
        </div>
    </div>
  );
};
