import { Timestamp } from 'firebase/firestore';
import * as TYPES from '@table-library/react-table-library/types/table';
import IUser from './IUser';
import IRace from './IRace';

export default interface IResult {
	id: string;
	userId: string;
	user: IUser;
	raceId: string;
	race: IRace;
	started: Timestamp;
	finished: Timestamp | null;
}

export type ResultNode = TYPES.TableNode & IResult;
