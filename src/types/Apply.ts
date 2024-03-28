import { DocumentReference } from 'firebase/firestore';

export enum ShirtSize {
	XS,
	S,
	M,
	L,
	XL,
	XXL,
}

export type ApplyForm = {
	discipline: string;
	club?: string;
	shirtSize: ShirtSize;
};

export type ApplyData = ApplyForm & {
	user: DocumentReference;
};
