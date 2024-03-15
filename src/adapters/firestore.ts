import { useState, useEffect } from 'react';
import { RaceForm, Race as RaceType } from '@datatypes/Race';
import { useCollection, DocumentData as SwrDocumentData, useGetDoc, useGetDocs } from '@tatsuokaniwa/swr-firestore';
import { Discipline } from '@datatypes/Discipline';
import {
	DocumentData,
	DocumentReference,
	FirestoreError,
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getCountFromServer,
	setDoc,
} from 'firebase/firestore';
import { User } from '@datatypes/User';
import { firestore } from './firebase';

const useGetUser = (id?: string): { userInfo?: User; error?: FirestoreError; isLoading: boolean } => {
	const [userInfo, setInfo] = useState<User | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<FirestoreError | undefined>(undefined);

	const response = useGetDoc<User>({
		path: `users/${id}`,
	});

	useEffect(() => {
		setInfo(response.data);
		if (id && !response.data && !error) {
			const err: FirestoreError = {
				code: 'not-found',
				message: 'Not found',
				name: 'Not found',
			};
			setError(err);
		}
		setIsLoading(response.isLoading);
	}, [response]);

	return { userInfo, error, isLoading };
};

const useSetUser = (uid: string, userData: User): Promise<void> => {
	const userDocRef = doc(firestore, 'users', uid);
	return setDoc(userDocRef, userData, { merge: true });
};

const useGetRace = (id?: string | string[]): { raceData?: RaceType; error?: FirestoreError; isLoading: boolean } => {
	const [raceData, setData] = useState<RaceType | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<FirestoreError | undefined>(undefined);
	const response = useGetDoc<RaceType>({
		path: `races/${id}`,
		parseDates: ['dateTime', 'applyUntil'],
	});
	const disciplines = useGetDocs<Discipline>({
		path: `races/${id}/disciplines`,
		orderBy: [['length', 'asc']],
	});

	useEffect(() => {
		if (response.error) {
			setError(response.error);
		}
		if (response.data && disciplines) {
			response.data.disciplines = disciplines.data;
		}
		if (!response.isLoading && !response.data && !response.error && !error) {
			const err: FirestoreError = {
				code: 'not-found',
				message: 'Not found',
				name: 'Not found',
			};
			setError(err);
		}
		setData(response.data);
		setIsLoading(response.isLoading);
	}, [response, disciplines]);

	return { raceData, error, isLoading };
};

const useGetDisciplines = (id?: string | string[]): { disciplines?: Discipline[]; error?: FirestoreError } => {
	const [disciplines, setDisciplines] = useState<Discipline[] | undefined>(undefined);
	const [error, setError] = useState<FirestoreError | undefined>(undefined);
	const response = useCollection<Discipline>({
		path: `races/${id}/disciplines`,
		orderBy: [['length', 'asc']],
	});

	useEffect(() => {
		setDisciplines(response.data);
		setError(response.error);
	}, [response]);

	return { disciplines, error };
};

const useGetRaces = (): { races?: RaceType[]; error?: FirestoreError } => {
	const [races, setRaces] = useState<RaceType[] | undefined>(undefined);
	const [error, setError] = useState<FirestoreError | undefined>(undefined);
	const [date] = useState(new Date());
	const response = useCollection<RaceType>({
		path: 'races',
		where: [['dateTime', '>', date]],
		orderBy: [['dateTime', 'asc']],
		parseDates: ['dateTime', 'applyUntil'],
	});

	const fetchAppliedCount = async (raceRef: DocumentReference<DocumentData>) => {
		const snapshot = await getCountFromServer(collection(raceRef, 'applied'));
		return snapshot.data().count;
	};

	const fetchDisciplines = async (raceRef: DocumentReference<DocumentData>) => {
		const snapshot = await getCountFromServer(collection(raceRef, 'disciplines'));
		const count = snapshot.data().count;
		return new Array(count);
	};

	const mapRaces = async (data: SwrDocumentData<RaceType>[]) => {
		setRaces(
			await Promise.all(
				data.map(async (race) => ({
					...race,
					applied: await fetchAppliedCount(race.ref),
					disciplines: await fetchDisciplines(race.ref),
				})),
			),
		);
	};

	useEffect(() => {
		if (!races && response.data) {
			mapRaces(response.data);
		}
		setError(response.error);
	}, [response]);

	return { races, error };
};

const useUpdateRace = (uid: string, raceData: RaceForm): Promise<void> => {
	const raceDocRef = doc(firestore, 'races', uid);
	const data = {
		...raceData,
		dateTime: Timestamp.fromDate(new Date(raceData.dateTime)),
		applyUntil: Timestamp.fromDate(new Date(raceData.applyUntil)),
	};
	return setDoc(raceDocRef, data, { merge: true });
};

const useAddRace = (raceData: RaceForm, userId: string): Promise<DocumentReference<DocumentData>> => {
	const racesRef = collection(firestore, 'races');
	const data = {
		...raceData,
		dateTime: Timestamp.fromDate(new Date(raceData.dateTime)),
		applyUntil: Timestamp.fromDate(new Date(raceData.applyUntil)),
		createdBy: doc(firestore, 'users', userId),
	};
	return addDoc(racesRef, data);
};

const useRemoveRace = (uid: string): Promise<void> => {
	const raceDocRef = doc(firestore, 'races', uid);
	return deleteDoc(raceDocRef);
};

export { useGetRace, useSetUser, useGetDisciplines, useGetRaces, useGetUser, useUpdateRace, useAddRace, useRemoveRace };
