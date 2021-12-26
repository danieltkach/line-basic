import { useState, useEffect } from 'react';
import { D3Line } from "./D3Line"
 

export const App =()=> {
	const [D3LineData, setD3LineData] = useState([20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20,
		20, 15, 50, 24, 32, 43, 0, 100, 23, 56, 20]);

	useEffect(()=>{
		const timer1 = setInterval(()=>{
			let newData = [...D3LineData];
			newData.shift();
			newData.push(Math.round(Math.random()*101+0));
			setD3LineData(newData);
		}, 500);

		return ()=>clearInterval(timer1);
	}, [D3LineData]);

	return (
		<D3Line data={D3LineData} />
	)
}