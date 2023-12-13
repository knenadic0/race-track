import { Timestamp } from 'firebase/firestore';
import * as TYPES from '@table-library/react-table-library/types/table';
import { User } from './User';
import { Race } from './Race';

export type Result = {
	id: string;
	userId: string;
	user: User;
	raceId: string;
	race: Race;
	started: Timestamp;
	finished: Timestamp | null;
};

export type ResultNode = TYPES.TableNode & Result;
