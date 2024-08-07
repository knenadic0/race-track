import { DocumentReference } from 'firebase/firestore';
import { Discipline } from './Discipline';

export type Race = {
	id: string;
	title: string;
	dateTime: Date;
	applyUntil: Date;
	disciplines?: Discipline[];
	description: string;
	applied: number;
	finished?: number;
	disciplinesCount: number;
	createdBy: DocumentReference;
};

export type RaceForm = {
	title: string;
	dateTime: string;
	applyUntil: string;
	description: string;
	disciplines: {
		title: string;
		length?: number;
		id?: string;
	}[];
};

const raceForm: RaceForm = {
	title: '',
	dateTime: '',
	applyUntil: '',
	description: '',
	disciplines: [{ title: '', length: undefined, id: undefined }],
};
export const raceFormFields = Object.keys(raceForm)
	.concat(['disciplines.root'])
	.concat(
		Array.from({ length: 5 })
			.map((_, i) => [`disciplines.${i}.title`, `disciplines.${i}.length`])
			.flat(),
	);
