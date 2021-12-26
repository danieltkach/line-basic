import {  useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const D3Line = ({ data }) => {
	const svgRef = useRef();

	useEffect(() => {
		const svg = d3.select(svgRef.current)
			.attr('width', 800)
			.attr('height', 300)
			.style('background', "#eee")

		const line1 = d3.line()
			.x((value, index) => index *30)
			.y(d => 295 - d)
			.curve(d3.curveCardinal);


			svg
			.selectAll('path')
			.data([data])
			.join('path')
			.attr('d', d=>line1(d))
			.attr('fill', 'none')
			.attr('stroke', 'orange')
			.attr('stroke-width', 3)
	}, [data]);

	return (
		<svg ref={svgRef}></svg>
	)
}