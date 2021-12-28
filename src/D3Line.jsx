import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const useResizeObserver = (ref) => {
	const [dimensions, setDimensions] = useState(null);

	useEffect(() => {
		const resizeObserver = new ResizeObserver(entries => {
			const { width, height } = entries[0].contentRect;
			setDimensions({ width, height });
		});
		resizeObserver.observe(ref.current);

		return () => resizeObserver.unobserve(ref.current);
	}, [ref]);

	return dimensions;
}

export const D3Line = ({ data }) => {
	const containerRef = useRef();
	const dimensions = useResizeObserver(containerRef);
	const svgRef = useRef();

	useEffect(() => {
		if (!dimensions) return;

		const verticalMargin = 40;
		const horizontalMargin = 40;
		const svgWidth = dimensions.width - horizontalMargin;
		const svgHeight = dimensions.height - verticalMargin;

		const svg = d3.select(svgRef.current)
			.attr('width', svgWidth + horizontalMargin)
			.attr('height', svgHeight + verticalMargin)
			.style('background', "#eee");

		const xScale = d3.scaleLinear()
			.domain([data.length - 1, 0])
			.range([0, svgWidth - horizontalMargin]);

		const yScale = d3.scaleLinear()
			.domain([0, 100])
			.range([svgHeight - verticalMargin, 0]);

		const colorScale = d3.scaleLinear()
			.domain([50, 100])
			.range(['green', 'red']);

		const line1 = d3.line()
			.x((v, i) => xScale(i))
			.y(yScale)
			.curve(d3.curveNatural);

		const xAxis = d3.axisBottom(xScale).ticks(data.length);
		svg.select('.x-axis')
			.style('transform', `translate(${horizontalMargin}px, ${svgHeight + 5}px)`)
			.call(xAxis);

		const yAxis = d3.axisRight(yScale);
		svg.select('.y-axis')
			.style('transform', `translate(${svgWidth}px, ${verticalMargin}px)`)
			.call(yAxis);

		svg.selectAll('.domain').style('stroke', '#999');
		svg.selectAll('.tick line').style('stroke', '#999');
		svg.selectAll('.tick text').style('fill', '#999').style('stroke', 'none');

		svg
			.selectAll('.line')
			.data([data])
			.join('path')
			.attr('class', 'line')
			.attr('d', line1)
			.attr('stroke', d => '#00357a')
			// .attr('stroke', d => colorScale(d[0]))
			.attr('fill', 'none')
			.attr('stroke-width', 3)
			.style('transform', `translate(${horizontalMargin}px, ${verticalMargin}px)`)
	}, [data]);

	return (
		<div ref={containerRef} className="D3Line" style={{ display: 'flex', alignItems: 'stretch', height: '100%'}}>
			<svg ref={svgRef} style={{ display: 'block', width: '100%' }}>
				<g className="x-axis" />
				<g className="y-axis" />
			</svg>
		</div>
	)
}