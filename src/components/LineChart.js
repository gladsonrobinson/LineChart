import React from "react";
import * as d3 from "d3";
import "./LineChart.css";
import data from "../data/category-value";

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

class Tooltip extends React.Component {
  render() {
    const { svgDimensions, scales, margins, data } = this.props;
    const { xScale, yScale } = scales;
    let bisectMouseValue = d3.bisector(d => d.category).left;
    let mouseValue, d0, d1, i, d;
    const translateX = xScale(data[1].category);
    const translateY = yScale(data[1].valPercentage);
    const xAxisMinVal = xScale.domain()[0];
    const xAxisMaxVal = xScale.domain()[1];
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
        <circle r="3px" stroke="#111111" strokeWidth="3px" fill="#333333" />
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
          i = bisectMouseValue(data, mouseValue, xAxisMinVal, xAxisMaxVal);
          d0 = i === xAxisMinVal ? data[i] : data[i - 1];
          d1 = data[i];
          d = mouseValue - d0.category < d1.category - mouseValue ? d0 : d1;
          d3.select(".lineChartTooltip").attr(
            "transform",
            "translate(" +
              xScale(d.category) +
              "," +
              yScale(d.valPercentage) +
              ")"
          );
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
          //ToDO
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

const Line = ({ scales, data }) => {
  const { xScale, yScale } = scales;
  const line = d3
    .line()
    .x(d => xScale(d.category))
    .y(d => yScale(d.valPercentage));

  const path = (
    <path d={line(data)} stroke="steelblue" strokeWidth="2px" fill="none" />
  );
  return <g>{path}</g>;
};

const LineChartComponent = ({ data, svgDimensions, margins }) => {
  const xAxisCategoryMinVal = Math.min(...data.map(d => d.category));
  const xAxisCategoryMaxVal = Math.max(...data.map(d => d.category));

  const xScale = d3
    .scaleLinear()
    .domain([0, xAxisCategoryMaxVal])
    .range([margins.left, svgDimensions.width - margins.right])
    .clamp(true);
  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([svgDimensions.height - margins.bottom, margins.top])
    .clamp(true);

  const Tittle = (
    <text
      transform={`translate(${svgDimensions.width / 2 -
        margins.left},${margins.top - 15})`}
    >
      Percent Value Vs Category
    </text>
  );

  return (
    <svg
      className="lineChartSvg"
      width={svgDimensions.width}
      height={svgDimensions.height}
    >
      {Tittle}
      <XYAxisLineChart
        scales={{ xScale, yScale }}
        margins={margins}
        svgDimensions={svgDimensions}
      />
      <Line scales={{ xScale, yScale }} data={data} />
      <Tooltip
        svgDimensions={svgDimensions}
        margins={margins}
        scales={{ xScale, yScale }}
        data={data}
      />
    </svg>
  );
};

export default class Charts extends React.Component {
  constructor() {
    super();
    this.state = {
      lineChartData: []
    };
  }
  componentWillMount() {
    const sum = d3.sum(data, d => d.value);

    data.forEach(d => {
      d.valPercentage = Math.round((d.value / sum) * 100);
    });

    data.sort((a, b) => d3.ascending(a.category, b.category));
    console.log(data);
    this.setState({
      lineChartData: data
    });
  }

  render() {
    const margins = { top: 50, right: 100, bottom: 50, left: 100 },
      svgDimensions = { height: 500, width: 900 };
    return (
      <div className="chart">
        <div className="lineChart">
          <LineChartComponent
            margins={margins}
            svgDimensions={svgDimensions}
            data={this.state.lineChartData}
          />
        </div>
      </div>
    );
  }
}
