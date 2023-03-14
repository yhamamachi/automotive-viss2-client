import React from 'react'
import GaugeChart from 'react-gauge-chart'

const styles = {
  center : {
    "textAlign": "center",
    "fontSize": "1.5em",
    "padding": "0px",
    "margin": "0px",
    "color": "#ccc",
  }
}

export const FuelMeter = (props) => {
    let text_color = "#cccccc"
    if (props.val < 0.2) {
        text_color = "#cc3333"
    }
    return (
      <div>
        <GaugeChart
          percent={props.val}
          animate={false}
          animDelay={0}
          animateDuration={0}
          arcsLength={[0.2, 0.8]}
          colors={['#EA4228', "#3c3"]}
          nrOfLevels={1} 
          needleColor={"#cc3"}
          textColor={text_color}
          formatTextValue={value => value+'%'}
        />
        <div style={styles.center}>FUEL</div>
      </div>
    );
  };
  