import { useState, useEffect } from 'react';
import { D3Line } from "./D3Line"

const appStyles = { height: '100vh' };

export const App = () => {
	const [D3LineData, setD3LineData] = useState([20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20,	20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20]);

	useEffect(() => {
		const timer1 = setInterval(() => {
			let newData = [...D3LineData];
			if (newData.length > 50) newData.pop();
			newData.unshift(Math.round(Math.random() * 100));
			setD3LineData(newData);
		}, 250);

		return () => clearInterval(timer1);
	}, [D3LineData]);

	return (
		<div className="App" style={appStyles}>
			<D3Line data={D3LineData} />
		</div>
	)
}