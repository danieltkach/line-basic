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
	const containerRef = useRef();
	const dimensions = useResizeObserver(containerRef);
	const [chartData, setChartData] = useState()

	useEffect(() => {
		if (!dimensions || !historicData) return;

		let newData = [...historicData];
		if (newData.length > historySize) newData.pop();
		newData.unshift(data);
		setHistoricData(newData);

		let timestamps = newData?.map(x => x?.timestamp);
		let packetsOut = newData?.map(x => x?.packetsOut);
		let packetsIn = newData?.map(x => x?.packetsIn);
		let bytesOut = newData?.map(x => x?.bytesOut);
		let bytesIn = newData?.map(x => x?.bytesIn);
		let packetsDropped = newData?.map(x => x?.packetsDropped);



		let trace1 = {
			x: timestamps,
			y: packetsOut,
			type: 'scatter'
		};
		let trace2 = {
			x: timestamps,
			y: packetsIn,
			type: 'scatter'
		};
		let trace3 = {
			x: timestamps,
			y: bytesOut,
			type: 'scatter'
		};
		let trace4 = {
			x: timestamps,
			y: bytesIn,
			type: 'scatter'
		};
		let trace5 = {
			x: timestamps,
			y: packetsDropped,
			type: 'scatter'
		};

		setChartData([trace1, trace2, trace3, trace4, trace5])
	

	}, [data]);

	
	const {width, height} = dimensions || {};


	return (
		<div ref={containerRef} style={{height: '100vh', width: '100vw'}}>
			<Plot
				data={chartData}
				layout={{ width, height, title: 'Bandwidth Chart' }}
			/>
		</div>
	)
}