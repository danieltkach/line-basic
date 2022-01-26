import { useState, useEffect, useRef } from 'react';
import { HistoryChart } from './HistoryChart';

const appStyles = { height: '100vh' };

export const App = () => {
	const [data, setData] = useState(null);

	function getRandom(min, max) {
		return Math.round(Math.random() * min + (max - min))
	}

	const indexRef = useRef();
	useEffect(() => {
		indexRef.current = 0;
		const timer1 = setInterval(() => {
			let random1 = getRandom(10, 55);
			let random2 = getRandom(10, 55);
			let random3 = getRandom(10, 55);
			let random4 = getRandom(10, 55);
			let random5 = getRandom(10, 55);
			setData({
				name: 'line',
				timestamp: ['12:00 AM', '12:05 AM', '12:10 AM', '12:15 AM', '12:20 AM', '12:25 AM', '12:30 AM', '12:35 AM'],
				packetsOut: random1,
				packetsIn: random2,
				bytesOut: random3,
				bytesIn: random4,
				packetsDropped: random5
			});
		}, 1000);

		return () => clearInterval(timer1);
	}, []);

	return (
		<div className="App" style={appStyles}>
			{/* <MultipleHistoryChart data={data} /> */}
			{/* <BandwidthChart data={data} /> */}
			<HistoryChart />
		</div>
	)
}