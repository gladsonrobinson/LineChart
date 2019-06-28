import React from "react";
import * as d3 from "d3";

export default class SummeryLine extends React.Component {
  constructor(props) {
    super(props);
    this.brushed = this.brushed.bind(this);
  }

  componentDidMount() {
    const { minWidth } = this.props.svgDimensions;
    const { xScale, yScale } = this.props.scales;
    const { right } = this.props.margins;
    this.xAxis = d3.axisBottom(xScale);
    this.line = d3
      .line()
      .x(d => xScale(d.category))
      .y(d => yScale(d.valPercentage));

    const brush = d3
      .brushX()
      .extent([[100, 70], [minWidth - right, minWidth - right]])
      .on("brush", this.brushed);

    d3.select(".brush")
      .call(brush)
      .call(brush.move, xScale.range());
  }

  brushed() {
    const { xScale, xScaleMini } = this.props.scales;
    const s = d3.event.selection || xScaleMini.range();
    xScale.domain(s.map(xScaleMini.invert, xScaleMini));
    d3.select(".mainLine path").attr("d", this.line(this.props.data));
    d3.select(".axisBottom").call(this.xAxis);
  }
  render() {
    const { xScaleMini, yScaleMini } = this.props.scales;
    const { data, miniMargins, svgDimensions } = this.props;

    const miniLine = d3
      .line()
      .x(function(d) {
        return xScaleMini(d.category);
      })
      .y(function(d) {
        return yScaleMini(d.valPercentage);
      });

    const path = (
      <path
        d={miniLine(data)}
        stroke="steelblue"
        strokeWidth="2px"
        fill="none"
        className="tline"
      />
    );
    return (
      <g
        className="brush"
        width={svgDimensions.minWidth}
        height={svgDimensions.minHeight}
        transform={`translate(${miniMargins.left},${miniMargins.top})`}
      >
        {path}
      </g>
    );
  }
}
