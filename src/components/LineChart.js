import React from "react";
import * as d3 from "d3";

import "./LineChart.css";

import data from "../data/category-value";
import XYAxisLineChart from './XYAxisLineChart';
import SummeryLine from './SummeryLine';
import Tooltip from './Tooltip';
import Line from './Line';

const LineChartComponent = ({
  data,
  svgDimensions,
  margins,
  miniMargins,
  categoryDict
}) => {
  let xAxisCategoryMinVal = Math.min(...data.map(d => d.category));
  let xAxisCategoryMaxVal = Math.max(...data.map(d => d.category));

  let xScale = d3
    .scaleLinear()
    .domain([xAxisCategoryMinVal, xAxisCategoryMaxVal])
    .range([margins.left, svgDimensions.width - margins.right])
    .clamp(true);
  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([svgDimensions.height - margins.bottom, margins.top])
    .clamp(true);

  const xScaleMini = d3
    .scaleLinear()
    .domain([xAxisCategoryMinVal, xAxisCategoryMaxVal])
    .range([margins.left, svgDimensions.width - margins.right])
    .clamp(true);
  const yScaleMini = d3
    .scaleLinear()
    .domain([0, 100])
    .range([svgDimensions.minHeight - margins.bottom, margins.top])
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
        categoryDict={categoryDict}
      />

      <SummeryLine
        scales={{ xScale, yScale, xScaleMini, yScaleMini }}
        data={data}
        margins={margins}
        miniMargins={miniMargins}
        svgDimensions={svgDimensions}
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
    let categoryDict = {};

    data.forEach(d => {
      d.valPercentage = Math.round((d.value / sum) * 100);
    });

    data.sort((a, b) => d3.ascending(a.category, b.category));

    data.forEach(item => {
      categoryDict[item.category]
        ? categoryDict[item.category].push(item)
        : (categoryDict[item.category] = [item]);
    });
    this.setState({
      lineChartData: data,
      categoryDict: categoryDict
    });
  }

  render() {
    const margins = { top: 50, right: 100, bottom: 100, left: 100 },
      miniMargins = { top: 330, right: 100, bottom: 20, left: 0 },
      svgDimensions = {
        height: window.screen.height / 2,
        width: window.screen.width / 2,
        minHeight: 200,
        minWidth: window.screen.width / 2
      };
    return (
      <div className="chart">
        <div className="lineChart">
          <LineChartComponent
            margins={margins}
            miniMargins={miniMargins}
            svgDimensions={svgDimensions}
            data={this.state.lineChartData}
            categoryDict={this.state.categoryDict}
          />
        </div>
      </div>
    );
  }
}
