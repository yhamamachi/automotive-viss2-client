import React from "react";
import { Chart } from "react-google-charts";

const styles = {
  dial: {
    width: `auto`,
    height: `auto`,
    color: "#000",
    border: "0.5px solid #fff",
    padding: "2px"
  },
  title: {
    fontSize: "1em",
    color: "#000"
  }
};

export const SpeedMeterBase = (props) => {
  return (
    <div style={styles.dial}>
      <Chart
        height={300}
        width={300}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          [props.title, Number(props.val)]
        ]}
        options={{
          redFrom: props.max*0.85,
          redTo: props.max,
          yellowFrom: props.max*0.70,
          yellowTo: props.max*0.85,
          minorTicks: 5,
          min: props.min,
          max: props.max
        }}
      />
    </div>
  );
};
