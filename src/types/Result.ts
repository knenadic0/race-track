import { User } from './User';
import { Race } from './Race';
import { TableNode } from '@table-library/react-table-library';

export type Result = {
	id: string;
	userId: string;
	user: User;
	raceId: string;
	race: Race;
	started: Date;
	finished?: Date;
};

export type ResultNode = TableNode & Result;
