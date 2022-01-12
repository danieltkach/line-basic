import { useState, useEffect } from 'react';
import { BandwidthChart } from './BandwidthChart';
import { MultipleHistoryChart } from './MultipleHistoryChart';

const appStyles = { height: '100vh' };

export const App = () => {
	const [data, setData] = useState(null);

	const SWITCH_DATA = {
		"name": "10.2.35.6",
		"timestamp": "1970-01-01T00:00:00.000Z",
		"packetsOut": 100,
		"packetsIn": 100,
		"bytesOut": null,
		"bytesIn": null,
		"packetsDropped": null
	};

	function getRandom(min, max) {
		return Math.round(Math.random() * min + (max - min))
	}

	useEffect(() => {
		const timer1 = setInterval(() => {
			let random1 = getRandom(10, 55);
			let random2 = getRandom(10, 55);
			let random3 = getRandom(10, 55);
			let random4 = getRandom(10, 55);
			let random5 = getRandom(10, 55);
			setData({
				name: 'dt-swXtch',
				packetsOut: random1,
				packetsIn: random2,
				bytesOut: random3,
				bytesIn: random4,
				packetsDropped: random5
			})
		}, 1000);

		return () => clearInterval(timer1);
	}, []);

	return (
		<div className="App" style={appStyles}>
			{/* <MultipleHistoryChart data={data} /> */}
			<BandwidthChart data={data} />
		</div>
	)
}