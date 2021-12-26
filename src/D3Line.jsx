import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const D3Line = ({ data }) => {
	const svgRef = useRef();
	const svgWidth = 800;
	const svgHeight = 300;
	const verticalMargin = 40;
	const horizontalMargin = 40;

	const svg = d3.select(svgRef.current)
		.attr('width', svgWidth + horizontalMargin)
		.attr('height', svgHeight + verticalMargin)
		.style('background', "#eee");

	const xScale = d3.scaleLinear()
		.domain([0, data.length - 1])
		.range([0, svgWidth-horizontalMargin]);

	const yScale = d3.scaleLinear()
		.domain([0, 100])
		.range([svgHeight-verticalMargin, 0]);

	const line1 = d3.line()
		.x((v, i) => xScale(i))
		.y(yScale)
		.curve(d3.curveCardinal);

	const xAxis = d3.axisBottom(xScale);
	svg.select('.x-axis')
		.style('transform', `translate(${horizontalMargin}px, ${svgHeight+10}px)`)
		.call(xAxis);

	const yAxis = d3.axisLeft(yScale);
	svg.select('.y-axis')
	.style('transform', `translate(${horizontalMargin}px, ${verticalMargin}px)`)
	.call(yAxis);

	useEffect(() => {
		svg
			.selectAll('.line')
			.data([data])
			.join('path')
			.attr('class', 'line')
			.attr('d', line1)
			.attr('fill', 'none')
			.attr('stroke', 'orange')
			.attr('stroke-width', 3)
			.style('transform', `translate(${horizontalMargin}px, ${verticalMargin}px)`)

	}, [data]);

	return (
		<svg ref={svgRef}>
			<g className="x-axis" />
			<g className="y-axis" />
		</svg>
	)
}