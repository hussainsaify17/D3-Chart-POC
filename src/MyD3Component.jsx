import React, { useState } from 'react';
import * as d3 from 'd3';

const margin = { top: 40, right: 80, bottom: 60, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom,
    color = "green";

const MyD3Component = (props) => {
    /* The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement) */
    const svgRef = React.createRef(null)
    const [activeIndex, setActiveIndex] = useState(null);
    const [data] = useState(props.data);
    const { currentRegion } = props;
    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
    const yMinValue = 0,
        yMaxValue = d3.max(data, (d) => {
            if (currentRegion === d.field[0]["#text"]) {
                let _fieldData = d.field[3]
                return Number(_fieldData["#text"])
            }
            return false;
        });

    const getX = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => {
            if (currentRegion === d.field[0]["#text"]) {
                let _fieldData = d.field[2]
                return Number(_fieldData["#text"])
            }
            return false;
        }))
        .range([0, width]);

    const getY = d3
        .scaleLinear()
        .domain([yMinValue - 1, yMaxValue + 2])
        .range([height, 0]);

    const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(getX)
            .tickFormat(d3.format("d"));
        d3.select(ref).call(xAxis);
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(getY)
            .tickFormat((dValue) => dValue / 1000);
        d3.select(ref).call(yAxis);
    };

    const linePath = d3
        .line()
        .x((d) => {
            if (d.field[2]['#text']) {
                return getX(d.field[2]['#text'])
            }
            return false;
        })
        .y((d) => {
            if (d.field[3]['#text']) {
                return getY(d.field[3]['#text'])
            }
            return false;
        })
        .curve(d3.curveBasis)(data);

    const areaPath = d3
        .area()
        .x((d) => {
            if (d.field[2]['#text']) {
                return getX(d.field[2]['#text'])
            }
            return false
        })
        .y0((d) => {
            if (d.field[3]['#text']) {
                return getY(d.field[3]['#text'])
            }
            return false
        })
        .y1(() => getY(yMinValue - 1))
        .curve(d3.curveBasis)(data);




    return (
        <div className="wrapper" key={currentRegion}>
            <svg
                ref={svgRef}
                viewBox={`-100 -50 1000 357`}>
                {/* // x- and y-axes */}
                <g className="axis" ref={getYAxis} />
                <g className="axis xAxis" ref={getXAxis} transform={`translate(0,${height})`}
                />
                {/* // area and line paths */}
                <path fill={color} d={areaPath} opacity={0.3} />
                <path strokeWidth={3} fill="none" stroke={color} d={linePath} />
                {/* // y-axis label */}
                <text
                    transform={"rotate(-90)"}
                    x={0 - height / 2} y={-10 - margin.left} dy="1em">
                    {"Thousand"}
                </text>
                {/* // chart title */}
                <text
                    x={width / 2} y={0 - margin.top / 2} textAnchor="middle" >
                    {"GNI per capita, Atlas method (current US$)"}
                </text>
                {/* // chart subtitle */}
                {data.map((item, index) => {
                    return (
                        <g key={index}>
                            {/* // hovering circle */}
                            <circle
                                onMouseEnter={(e) => { e.target.style.r = 6 }}
                                onMouseOut={(e) => { e.target.style.r = 4 }}
                                onClick={() => setActiveIndex(index)}
                                cx={item.field[2]['#text'] ? getX(item.field[2]['#text']) : 0}
                                cy={item.field[3]['#text'] ? getY(item.field[3]['#text']) : 0}
                                r={index === activeIndex ? 6 : 4}
                                fill={color}
                                strokeWidth={index === activeIndex ? 2 : 0}
                                stroke="#fff"
                                style={{ transition: "ease-out .1s" }}
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default MyD3Component