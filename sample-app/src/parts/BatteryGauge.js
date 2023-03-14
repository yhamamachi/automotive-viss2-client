import BatteryGauge from 'react-battery-gauge'

const _customization = {
    "batteryMeter": {
      "noOfCells": 10
    }
  }

const styles = {
    center : {
      "textAlign": "center",
      "fontSize": "1.5em",
      "padding": "0px",
      "margin": "0px",
      "color": "#ccc",
    }
}
  
  
export const BatteryGaugeBase = (props) => {
    return (
      <>
        <BatteryGauge 
          value={props.val}
          size="300"
          // customization={_customization}
          padding={10}
          />
        <div style={styles.center}>Battery</div>
      </>
    );
  };
  
