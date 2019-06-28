import React from "react";
import * as d3 from "d3";

export default class Tooltip extends React.Component {
  render() {
    const { svgDimensions, scales, margins, data } = this.props;
    const { xScale, yScale } = scales;
    let bisectMouseValue = d3.bisector(d => d.category).left;
    let mouseValue, d0, d1, i, d;
    const translateX = xScale(data[1].category);
    const translateY = yScale(data[1].valPercentage);
    const xAxisMinVal = xScale.domain()[0];
    const toolTipBox = {
      outline: "2px solid"
    };

    const tooltipElm = (
      <g
        className="lineChartTooltip"
        transform={`translate(${translateX},${translateY})`}
      >
        <line
          className="tooltipHoverLineY"
          y1="-100"
          y2={svgDimensions.height - translateY - margins.bottom}
          stroke="#111111"
          strokeWidth="1px"
        />
        <line
          className="tooltipHoverLineX"
          x1="-100"
          x2={svgDimensions.width - translateX - margins.right}
          stroke="#111111"
          strokeWidth="1px"
        />
        <circle r="2px" stroke="#111111" strokeWidth="2px" fill="#333333" />

        <text x="20" y="-20" fontSize="12px" style={toolTipBox}>
          NAME: {data[1].user}
        </text>
      </g>
    );
    const overlay = (
      <rect
        transform={`translate(${margins.left},${margins.top})`}
        className="lineChartOverlay"
        width={svgDimensions.width - margins.left - margins.right}
        height={svgDimensions.height - margins.top - margins.bottom}
        opacity="0"
        onMouseMove={event => {
          mouseValue = xScale.invert(event.nativeEvent.offsetX);
          i = bisectMouseValue(data, mouseValue);
          d0 = i === xAxisMinVal ? data[i] : data[i - 1];
          d1 = data[i];
          d = mouseValue - d0.category < d1.category - mouseValue ? d0 : d1;
          d3.select(".lineChartTooltip")
            .attr(
              "transform",
              "translate(" +
                xScale(d.category) +
                "," +
                yScale(d.valPercentage) +
                ")"
            )
            .attr("opacity", 1);
          d3.select(".lineChartTooltip .tooltipHoverLineY").attr(
            "y2",
            svgDimensions.height - yScale(d.valPercentage) - margins.bottom
          );
          d3.select(".lineChartTooltip .tooltipHoverLineX").attr(
            "x2",
            svgDimensions.width -
              xScale(d.category) -
              margins.right -
              margins.left
          );
          d3.select(".lineChartTooltip text").text(`NAME: ${d.user}`);
        }}
        onMouseOut={() => {
          const toolTipClass = d3.select(".lineChartTooltip");
          toolTipClass.transition();
          toolTipClass
            .transition()
            .delay(1000)
            .attr("opacity", 0);
        }}
      />
    );
    return (
      <g>
        {overlay}
        {tooltipElm}
      </g>
    );
  }
}
