import { Timestamp } from 'firebase/firestore';
import * as TYPES from '@table-library/react-table-library/types/table';
import IDiscipline from './IDiscipline';

export default interface IRace {
	id: string;
	title: string;
	dateTime: Timestamp;
	applyUntil: Timestamp;
	disciplines: IDiscipline[];
	applied: number;
}

export type RaceNode = TYPES.TableNode & IRace;
