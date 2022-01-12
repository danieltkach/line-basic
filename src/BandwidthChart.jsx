import { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';


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

export const BandwidthChart = ({ data }) => {
	const [historicData, setHistoricData] = useState([]);
	const [historySize, setHistorySize] = useState(10);
	const dimensions = useResizeObserver(containerRef);

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
				value: packetsOut.map((x, i) => ({ xValue: i, yValue: x }))
			},
			{
				key: 'Packets In',
				value: packetsIn.map((x, i) => ({ xValue: i, yValue: x }))
			},
		];

	}, [data]);

	var trace1 = {
		x: [1, 2, 3, 4],
		y: [10, 15, 13, 17],
		type: 'scatter'
	};

	var trace2 = {
		x: [1, 2, 3, 4],
		y: [16, 5, 11, 9],
		type: 'scatter'
	};


	return (
		<div ref={containerRef}>
			<Plot
				data={[trace1, trace2]}
				layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
			/>
		</div>
	)
}