import { Applied } from './Apply';

export type Result = Applied & {
	started?: Date;
	finished?: Date;
	totalTime?: number;
	position: number;
};

export type ResultRace = {
	raceId: string;
	race: string;
	disciplineId: string;
	discipline: string;
	dateTime: Date;
	applied: number;
	position: number;
};
