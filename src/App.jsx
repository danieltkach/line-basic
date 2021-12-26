import { useState, useEffect } from 'react';
import { D3Line } from "./D3Line"


export const App = () => {
	// const tempLine = [20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20,	20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20];
	// let lines = [tempLine, tempLine, tempLine, tempLine];
	// const [D3LineData, setD3LineData] = useState(lines);
	const [D3LineData, setD3LineData] = useState([20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20,	20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20]);

	useEffect(() => {
		const timer1 = setInterval(() => {
			let newData = [...D3LineData];
			newData.shift();
			newData.push(Math.round(Math.random() * 100));
			setD3LineData(newData);

			// for (let i = 0; i < 25; i++) {
			// 	for (let j = 0; j < 4; j++) {
			// 		lines[j].shift();
			// 		lines[j].push(Math.round(Math.random() * 100))
			// 	}
			// }
			// setD3LineData(lines);
		}, 1000);

		return () => clearInterval(timer1);
	}, [D3LineData]);

	return (
		<D3Line data={D3LineData} />
	)
}