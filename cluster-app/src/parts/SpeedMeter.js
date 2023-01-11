import React, { useEffect } from 'react'
import ReactSpeedometer from "react-d3-speedometer"

export const SpeedMeterBase = (props) => {
    const [value, setValue] = React.useState(0)
  
    return (
      <div>
          <ReactSpeedometer 
            value={props.val}
            maxValue={props.max}
            minValue={props.min}
            segments={props.max/20}
            startColor={"#333333"}
            endColor=  {"#ff0000"}
            needleTransitionDuration={500}
            ringWidth={130}
            currentValueText={props.val + " km/h"}
            />
      </div>
    )
}
