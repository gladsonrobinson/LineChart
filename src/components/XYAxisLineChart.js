import React from "react";
import * as d3 from "d3";

class Axis extends React.Component {
  componentDidMount() {
    this.renderAxis();
  }
  componentDidUpdate() {
    this.renderAxis();
  }
  renderAxis() {
    let axisType = `axis${this.props.orient}`;
    const axis = d3[axisType]()
      .scale(this.props.scale)
      .tickSize(-this.props.tickSize)
      .tickPadding(this.props.padding)
      .tickFormat(this.props.format);

    d3.select(this.axisElement).call(axis);
  }
  render() {
    return (
      <g
        className={this.props.className}
        ref={el => (this.axisElement = el)}
        transform={this.props.translate}
      />
    );
  }
}

const XYAxisLineChart = ({ scales, margins, svgDimensions }) => {
  const xAxisProps = {
    orient: "Bottom",
    translate: `translate(0,${svgDimensions.height - margins.bottom})`,
    scale: scales.xScale,
    tickSize: svgDimensions.height - margins.top - margins.bottom,
    className: "axisBottom",
    padding: 10,
    format: d3.format("")
  };
  const yAxisProps = {
    orient: "Left",
    translate: `translate(${margins.left},0)`,
    scale: scales.yScale,
    tickSize: svgDimensions.width - margins.left - margins.right,
    ticks: 10,
    className: "axisLeft",
    padding: 15,
    format: d => d + "%"
  };

  return (
    <g>
      <Axis {...xAxisProps} />
      <Axis {...yAxisProps} />
    </g>
  );
};

export default XYAxisLineChart;
