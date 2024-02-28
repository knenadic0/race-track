import { DocumentReference } from 'firebase/firestore';
import * as TYPES from '@table-library/react-table-library/types/table';
import { Discipline } from './Discipline';

export type Race = {
	id: string;
	title: string;
	dateTime: Date;
	applyUntil: Date;
	disciplines?: Discipline[];
	description: string;
	applied: number;
	createdBy: DocumentReference;
};

export type RaceForm = {
	title: string;
	dateTime: string;
	applyUntil: string;
	description: string;
};
const raceForm: RaceForm = {
	title: '',
	dateTime: '',
	applyUntil: '',
	description: '',
};
export const raceFormFields = Object.keys(raceForm);

export type RaceNode = TYPES.TableNode & Race;
