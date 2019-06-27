import React from "react";
import * as d3 from "d3";

const Line = ({ scales, data }) => {
  const { xScale, yScale } = scales;
  const line = d3
    .line()
    .x(d => xScale(d.category))
    .y(d => yScale(d.valPercentage));

  const path = (
    <path d={line(data)} stroke="steelblue" strokeWidth="2px" fill="none" />
  );
  return <g className="mainLine">{path}</g>;
};
export default Line;