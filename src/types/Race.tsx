import { DocumentReference, Timestamp } from 'firebase/firestore';
import * as TYPES from '@table-library/react-table-library/types/table';
import { Discipline } from './Discipline';

export type Race = {
	id: string;
	title: string;
	dateTime: Timestamp;
	applyUntil: Timestamp;
	disciplines: Discipline[];
	description: string;
	applied: number;
	createdBy: DocumentReference;
}

export type RaceNode = TYPES.TableNode & Race;
