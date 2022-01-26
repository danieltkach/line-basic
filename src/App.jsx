import { useState, useEffect, useRef } from 'react';
import { HistoryChart } from './HistoryChart';
import ecgWaveData from './ecgWave.json';

const appStyles = { height: '100vh' };

export const App = () => {
	const [data, setData] = useState(null);
	const indexRef = useRef(0);

	useEffect(() => {

		const timer1 = setInterval(() => {
			indexRef.current++;
			if (indexRef.current === 1000) indexRef.current = 0;
			setData([
				ecgWaveData["0"][indexRef.current],
				ecgWaveData["1"][indexRef.current],
				ecgWaveData["2"][indexRef.current],
				ecgWaveData["3"][indexRef.current],
				ecgWaveData["4"][indexRef.current],
				ecgWaveData["5"][indexRef.current],
			]);
			// setData(Math.round(Math.random() * 10 + 65));

		}, 30);

		return () => clearInterval(timer1);
	}, []);

	if (!data) return <></>

	return (
		<div className="App" style={appStyles}>
			<HistoryChart data={data["0"]} lineColor={'red'} />
			<HistoryChart data={data["1"]} lineColor={'blue'} />
			<HistoryChart data={data["2"]} lineColor={'green'} />
			<HistoryChart data={data["3"]} lineColor={'purple'} />
			<HistoryChart data={data["4"]} lineColor={'black'} />
			<HistoryChart data={data["5"]} lineColor={'brown'} />
		</div>
	)
}