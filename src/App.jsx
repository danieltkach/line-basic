import { useState, useEffect } from 'react';
import { HistoryChart } from './HistoryChart';

const appStyles = { height: '100vh' };

export const App = () => {
	const [data, setData] = useState(null);
	useEffect(() => {
		const timer1 = setInterval(() => {
			setData(Math.round(Math.random() * 10 + 65));
		}, 1000);

		return () => clearInterval(timer1);
	}, []);

	return (
		<div className="App" style={appStyles}>
			<HistoryChart data={data} />
		</div>
	)
}