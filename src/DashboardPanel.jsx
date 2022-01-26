<<<<<<< HEAD
import { useState, useRef, React } from 'react';
=======
import { useEffect, useRef, useState } from 'react';
import { logError, resolveErrorMessage } from "../../helpers/utils";
import styled from 'styled-components';
>>>>>>> sdmc-1423
import { SwitchesPanel } from './SwitchesPanel';
import { switchStats } from "../../services/portalService";
import { TOPPanel } from "shared-lib/src/components/dashboard/TOPPanel";
import { SwitchGraph } from 'shared-lib/src/components/dashboard/SwitchGraph';
<<<<<<< HEAD
import { GRAPH_DATA } from 'shared-lib/src/components/dashboard/TOPPanel/graphData';
import { StatsLoader } from 'shared-lib/src/components/dashboard/StatsLoader';
=======
import { HistoryChart } from 'shared-lib/src/components/dashboard/HistoryChart';
import { BandwidthChart } from 'shared-lib/src/components/dashboard/BandwidthChart';
import { ChartModal } from 'shared-lib/src/components/dashboard/ChartModal';


function calculateRates(newData, prevData) {
	let switchStatsRates;
	let agentsRates = [];

	const getDelta = (newData, prevData) => {
		if (!newData || !prevData) return null;

		let newTimestamp = new Date(newData.timestamp);
		let prevTimestamp = new Date(prevData.timestamp);
		
		let deltaTime = (newTimestamp - prevTimestamp) / 1000; 
		let deltaStats = { timestamp: newTimestamp.toISOString() };

		deltaStats.bytesOut = 8 * ((newData.bytesOut - prevData.bytesOut) / deltaTime);
		deltaStats.bytesIn = 8 * ((newData.bytesIn - prevData.bytesIn) / deltaTime);
		deltaStats.packetsIn = ((newData.packetsIn - prevData.packetsIn) / deltaTime);
		deltaStats.packetsOut = ((newData.packetsOut - prevData.packetsOut) / deltaTime);
		deltaStats.packetsDropped = ((newData.packetsDropped - prevData.packetsDropped) / deltaTime);

		return deltaStats;
	}

	switchStatsRates = getDelta(newData?.switchStats, prevData?.switchStats);
	newData?.agents.forEach((agent, i) => {
		agentsRates.push({ agentName: agent.agentName, ...getDelta(agent, prevData?.agents[i]) });
	})

	return { switchStatsRates, agentsRates };
}

>>>>>>> sdmc-1423

export const DashboardPanel = () => {
	const INTERVAL = 5 * 1000;
	const [modalState, setModalState] = useState({open: false, content: null});
	const [selectedSwitch, setSelectedSwitch] = useState(null);
<<<<<<< HEAD
	const stickyRef = useRef();
	const [newStats, setNewStats] = useState(null);

	function onNewStats(data) {
		setNewStats(data)
	}
=======
	const [state, setState] = useState({
		prevInfo: null,
		prevData: null,
		rates: null,
		loading: false,
		error: null
	});
	const stateRef = useRef(state);
	const [tout,] = useState(null);
	const toutRef = useRef(tout);

	const scheduleRefresh = () => {
		if (toutRef.current) {
			clearTimeout(toutRef.current);
		}
		toutRef.current = setTimeout(() => {
			if (selectedSwitch) {
				loadStats();
			}
		}, INTERVAL);
	}

	async function loadStats() {
		const { prevInfo } = stateRef.current;
		const loading = !prevInfo || selectedSwitch.sdmcSwitch.id !== prevInfo.sdmcSwitch.id;
		setState({ ...stateRef.current, loading: loading, error: null });
		doLoadStats();
	}

	const doLoadStats = async () => {
		try {
			const response = await switchStats(selectedSwitch.sdmcSwitch.guid);
			const newData = response.data;
			const { prevData } = stateRef.current;
			const rates = calculateRates(newData, prevData);
			stateRef.current = { prevData: newData, rates: rates, error: null, loading: false, prevInfo: selectedSwitch }
			setState(stateRef.current);
		} catch (e) {
			logError(e);
			const errorMessage = resolveErrorMessage(e);
			setState(prev => ({ ...prev, error: errorMessage, loading: false }))
		} finally {
			scheduleRefresh();
		}
	}

	const stopSchedule = () => {
		if (toutRef.current) {
			clearTimeout(toutRef.current);
		}
	}

	useEffect(() => {
		if (toutRef.current) {
			clearTimeout(toutRef.current);
		}
		if (selectedSwitch) {
			stateRef.current = { prevData: null, rates: null, error: null, loading: false, prevInfo: null }
			loadStats();
		}
		return () => stopSchedule();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSwitch]);

>>>>>>> sdmc-1423

	function onSwitchSelected(switchInfo) {
		setSelectedSwitch(switchInfo);
	}

	const ChartPanel = ({ setModalState, children }) => {
		return (
			<ChartPanelContainer>
				<button onClick={() => setModalState({open: true, content: children})}>&#128470;</button>
				{children}
			</ChartPanelContainer>
		)
	}

	return (
<<<<<<< HEAD
		<Grid columns={2} stackable centered padded>
			<Grid.Row centered>
				<Grid.Column width={9}>
					<Ref innerRef={stickyRef}>
						<SwitchesPanel onSwitchSelected={onSwitchSelected} />
					</Ref>
				</Grid.Column>
				<Grid.Column width={7}>
					<Sticky context={stickyRef}>
						<StatsLoader switchStatsCallback={switchStats} switchInfo={selectedSwitch} onNewStats={onNewStats} />
						<TOPPanel newData={newStats} switchInfo={selectedSwitch} />
						<div className="ui">
							{GRAPH_DATA && <SwitchGraph data={GRAPH_DATA} />}
						</div>
					</Sticky>
				</Grid.Column>
			</Grid.Row>
		</Grid>
=======
		<Container>
			{modalState.open && <ChartModal setState={setModalState} content={modalState.content} />}

			<LeftPanel>
				<SwitchesContainer>
					<SwitchesPanel onSwitchSelected={onSwitchSelected} />
				</SwitchesContainer>
				<VisualizationsContainer>
					<ChartPanel setModalState={setModalState}><SwitchGraph state={state} /></ChartPanel>
					<ChartPanel setModalState={setModalState}><BandwidthChart state={state} /></ChartPanel>
					{/* <ChartPanel setModalState={setModalState}><HistoryChart state={state} /></ChartPanel> */}
				</VisualizationsContainer>
			</LeftPanel>

			<RightPanel>
				<DetailsContainer>
					<TOPPanel state={state} switchInfo={selectedSwitch} />
				</DetailsContainer>
			</RightPanel>
		</Container>
>>>>>>> sdmc-1423
	)
}

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	height: 100%;
	width: 100%;
`;

const SwitchesContainer = styled.div`
	display: flex;
	height: 70%;
	width: 100%;
	overflow-y: auto;
`;

const VisualizationsContainer = styled.div`
	display: flex;
	height: 30%;
	width: 100%;
	border-top: 3px solid #f1dcb7;
	border-radius: 5px;
	padding: 0.5em;
	justify-content: space-between;
	margin-top: 1em;
`;

const DetailsContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	overflow-y: auto;
`;

const LeftPanel = styled.div`
	width: 60%;
	height: 100%;
	padding: 1em;
`;

const RightPanel = styled.div`
	width: 40%;
	height: 100%;
	padding: 1em;
`;

const ChartPanelContainer = styled.div`
	border-right: 1px solid #f1dcb7;
	padding: 0.5em;
	display: flex;
	justify-content: flex-end;
	flex: 1;
	button{
		position: absolute;
		background: #f1dcb7;
		border: none;
		border-radius: 2px;
		padding: 0.25em;
		cursor: pointer;
		margin-top: -.7em;
		&:hover{
			background: #ffa400;
			color: black;
		}
	}
`;