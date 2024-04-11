import { Applied } from './Apply';

export type Result = Applied & {
	started?: Date;
	finished?: Date;
	totalTime?: number;
	position: number;
};
