import { useState, useEffect } from 'react';
import { RaceForm, Race as RaceType } from '@datatypes/Race';
import { useCollection, DocumentData as SwrDocumentData, useGetDoc } from '@tatsuokaniwa/swr-firestore';
import { Discipline } from '@datatypes/Discipline';
import {
	DocumentData,
	DocumentReference,
	FirestoreError,
	Timestamp,
	collection,
	doc,
	getCountFromServer,
	getDocs,
	runTransaction,
	setDoc,
	writeBatch,
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
	const data = {
		fullName: userData.fullName,
		birthDate: userData.birthDate,
		gender: userData.gender,
	};
	return setDoc(userDocRef, data, { merge: true });
};

const useGetRace = (id?: string | string[]): { raceData?: RaceType; error?: FirestoreError; isLoading: boolean } => {
	const [raceData, setData] = useState<RaceType | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<FirestoreError | undefined>(undefined);
	const response = useGetDoc<RaceType>({
		path: `races/${id}`,
		parseDates: ['dateTime', 'applyUntil'],
	});

	useEffect(() => {
		if (response.error) {
			setError(response.error);
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
	}, [response]);

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

const useUpdateRace = async (uid: string, raceData: RaceForm): Promise<void> => {
	const batch = writeBatch(firestore);
	const raceDocRef = doc(firestore, 'races', uid);
	const data = {
		title: raceData.title,
		description: raceData.description,
		dateTime: Timestamp.fromDate(new Date(raceData.dateTime)),
		applyUntil: Timestamp.fromDate(new Date(raceData.applyUntil)),
	};
	batch.set(raceDocRef, data, { merge: true });

	raceData.disciplines.forEach((discipline) => {
		const disciplinesRef = discipline.id
			? doc(collection(raceDocRef, 'disciplines'), discipline.id)
			: doc(collection(raceDocRef, 'disciplines'));
		const disciplineData = {
			title: discipline.title,
			length: discipline.length,
		};
		batch.set(disciplinesRef, disciplineData);
	});

	const firestoreDisciplines = (await getDocs(collection(raceDocRef, 'disciplines'))).docs;
	firestoreDisciplines.forEach((firestoreDiscipline) => {
		if (!raceData.disciplines.some((x) => x.id === firestoreDiscipline.id)) {
			batch.delete(firestoreDiscipline.ref);
		}
	});

	return batch.commit();
};

const useAddRace = (raceData: RaceForm, userId: string): Promise<void> => {
	const batch = writeBatch(firestore);
	const racesRef = doc(collection(firestore, 'races'));
	const data = {
		title: raceData.title,
		description: raceData.description,
		dateTime: Timestamp.fromDate(new Date(raceData.dateTime)),
		applyUntil: Timestamp.fromDate(new Date(raceData.applyUntil)),
		createdBy: doc(firestore, 'users', userId),
	};
	batch.set(racesRef, data);

	raceData.disciplines.forEach((discipline) => {
		const disciplinesRef = doc(collection(racesRef, 'disciplines'));
		batch.set(disciplinesRef, discipline);
	});

	return batch.commit();
};

const useRemoveRace = (uid: string): Promise<void> => {
	const promise = runTransaction(firestore, async (transaction) => {
		const raceDocRef = doc(firestore, 'races', uid);
		const disciplines = await getDocs(collection(raceDocRef, 'disciplines'));
		disciplines.forEach((discipline) => {
			transaction.delete(discipline.ref);
		});
		transaction.delete(raceDocRef);
	});
	return promise;
};

export { useGetRace, useSetUser, useGetDisciplines, useGetRaces, useGetUser, useUpdateRace, useAddRace, useRemoveRace };
