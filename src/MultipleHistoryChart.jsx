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

export const MultipleHistoryChart = ({ data }) => {
	const [historicData, setHistoricData] = useState([]);
	const [scaleMinDelta, setScaleMinDelta] = useState(-5);
	const [scaleMaxDelta, setScaleMaxDelta] = useState(5);
	const [historySize, setHistorySize] = useState(10);

	const containerRef = useRef();
	const dimensions = useResizeObserver(containerRef);
	const svgRef = useRef();

	const verticalMargin = 40;
	const horizontalMargin = 40;
	let svgWidth;
	let svgHeight;
	let svg;
	let svgGroup;

	if (dimensions) {
		svgWidth = dimensions.width - horizontalMargin;
		svgHeight = dimensions.height - verticalMargin;

		svg = d3.select(svgRef.current)
			.attr('width', svgWidth + horizontalMargin)
			.attr('height', svgHeight + verticalMargin)
			.style('background', "#eee");
		
		svgGroup = svg.append('g');
	}

	useEffect(() => {
		if (!dimensions || !historicData) return;

		let newData = [...historicData];
		if (newData.length > historySize) newData.pop();
		newData.unshift(data);
		setHistoricData(newData);

		let packetsOut = newData?.map(x => x?.packetsOut);
		let packetsIn = newData?.map(x => x?.packetsIn);
		let bytesOut = newData?.map(x => x?.bytesOut);
		let bytesIn = newData?.map(x => x?.bytesIn);
		let packetsDropped = newData?.map(x => x?.packetsDropped);

		const nestedData = [
			{
				key: 'Packets Out',
				value: packetsOut.map((x,i) => ({xValue: i, yValue: x}))
			},
			{
				key: 'Packets In',
				value: packetsIn.map((x,i) => ({xValue: i, yValue: x}))
			},
		]
		console.log(nestedData);

		const xScale = d3.scaleLinear()
			.domain([historySize, 0])
			.range([0, svgWidth - horizontalMargin]);

		const yDomain = [0 + scaleMinDelta, 100 + scaleMaxDelta];
		// const yDomain = [d3.min(historicData) + scaleMinDelta, d3.max(historicData.packetsOut) + scaleMaxDelta];
		const yScale = d3.scaleLinear()
			.domain(yDomain)
			.range([svgHeight - verticalMargin, 0]);

		const colorScale = d3.scaleLinear()
			.domain(yDomain)
			.range(['orange', 'green']);

		const linexy = d3.line()
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

		// Plotting the lines ---
		// svg
		// 	.selectAll('.packetsOut')
		// 	.data([packetsOut])
		// 	.join('path')
		// 	.attr('class', 'packetsOut')
		// 	.attr('d', linexy)
		// 	.attr('stroke', d => colorScale(d[0]))
		// 	.attr('fill', 'none')
		// 	.attr('stroke-width', 3)
		// 	.style('transform', `translate(${horizontalMargin}px, ${verticalMargin}px)`);

		svgGroup.selectAll('path')
			.data(nestedData)
			.join('path')
			.attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'orange')
			// .attr('d', linexy)
			.attr("d", d => {
				return d3.line()
					.x(d => xScale(+d.xValue))
					.y(d => yScale(+d.yValue))
			});

	}, [data]);

	return (
		<Container>
			<Toolbar>
				<div>
					<label>
						<span>history size:</span>
						<input type="number" step={1} min={2}
							max={999} value={historySize} onChange={(e) => setHistorySize(+e.target.value)} />
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