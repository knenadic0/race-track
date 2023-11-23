import { Timestamp } from 'firebase/firestore';
import * as TYPES from '@table-library/react-table-library/types/table';

export default interface IRace {
	id: string;
	title: string;
	dateTime: Timestamp;
}

export type RaceNode = TYPES.TableNode & IRace;
