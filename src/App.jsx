import { useState, useEffect } from 'react';
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

	useEffect(() => {
		const timer1 = setInterval(() => {
			// setData(Math.round(Math.random() * 10 + 65
			let random1 = Math.round(Math.random() * 10 + 65);
			let random2 = Math.round(Math.random() * 10 + 65);
			setData({name: 'dt-swXtch', packetsOut: random1, packetsIn: random2, bytesOut: 0, bytesIn: 0})
		}, 1000);

		return () => clearInterval(timer1);
	}, []);

	return (
		<div className="App" style={appStyles}>
			<MultipleHistoryChart data={data} />
		</div>
	)
}