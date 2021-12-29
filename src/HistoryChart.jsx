import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
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

export const HistoryChart = ({ data }) => {
	const [historicData, setHistoricData] = useState([]);
	const [scaleMinDelta, setScaleMinDelta] = useState(-5);
	const [scaleMaxDelta, setScaleMaxDelta] = useState(5);
	const [historySize, setHistorySize] = useState(10);
	const containerRef = useRef();
	const dimensions = useResizeObserver(containerRef);
	const svgRef = useRef();

	useEffect(() => {
		if (!dimensions || !historicData) return;

		let newData = [...historicData];
		if (newData.length > historySize) newData.pop();
		newData.unshift(data);
		setHistoricData(newData);

		const verticalMargin = 40;
		const horizontalMargin = 40;
		const svgWidth = dimensions.width - horizontalMargin;
		const svgHeight = dimensions.height - verticalMargin;

		const svg = d3.select(svgRef.current)
			.attr('width', svgWidth + horizontalMargin)
			.attr('height', svgHeight + verticalMargin)
			.style('background', "#eee");

		const xScale = d3.scaleLinear()
			.domain([historySize, 0])
			.range([0, svgWidth - horizontalMargin]);

		const yDomain = [d3.min(historicData) + scaleMinDelta, d3.max(historicData) + scaleMaxDelta];
		const yScale = d3.scaleLinear()
			.domain(yDomain)
			.range([svgHeight - verticalMargin, 0]);

		const colorScale = d3.scaleLinear()
			.domain(yDomain)
			.range(['orange', 'green']);

		const line1 = d3.line()
			.x((v, i) => xScale(i))
			.y(yScale)
			.curve(d3.curveNatural);

		const xAxis = d3.axisBottom(xScale).ticks(historicData.length);
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
			.data([historicData])
			.join('path')
			.attr('class', 'line')
			.attr('d', line1)
			// .attr('stroke', d => '#00357a')
			.attr('stroke', d => colorScale(d[0]))
			.attr('fill', 'none')
			.attr('stroke-width', 3)
			.style('transform', `translate(${horizontalMargin}px, ${verticalMargin}px)`)
	}, [data]);

	return (
		<Container>
			<Toolbar>
				<div>
					<label>
						<span>history size:</span>
						<input type="number" step={1} min={2} max={999} value={historySize} onChange={(e) => setHistorySize(+e.target.value)} />
					</label>
				</div>
				<div>
					<label>
						<span>min offset:</span>
						<input type="number" step={1} max={0} value={scaleMinDelta} onChange={(e) => setScaleMinDelta(+e.target.value)} />
					</label>
					<label>
						<span>max offset:</span>
						<input type="number" step={1} min={0} value={scaleMaxDelta} onChange={(e) => setScaleMaxDelta(+e.target.value)} />
					</label>
				</div>
			</Toolbar>

			<div ref={containerRef} style={{ display: 'flex', alignItems: 'stretch', height: '90%' }}>
				<svg ref={svgRef} style={{ display: 'block', width: '100%' }}>
					<g className="x-axis" />
					<g className="y-axis" />
				</svg>
			</div>

		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0.5em;
	height: 100%;
  box-sizing: border-box;
	font-family: system-ui;
`;

const Toolbar = styled.div`
	height: 5%;
	padding: 0.5em;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border: 1px solid #ddd;
	border-radius: 3px;	
	margin-bottom: 0.5em;
	span {
		margin-right: 0.4em;
	}

	input {
		border-radius: 3px;
		outline: none;
		border: 1px solid #ddd;
		width: 2.5em;
		margin-right: 1em;
		padding: 0.5em;
	}
`;