import { useState, useEffect } from 'react';
import { RaceForm, Race as RaceType } from '@datatypes/Race';
import { useCollection, DocumentData as SwrDocumentData, useGetDoc, useGetDocs, DocumentData } from '@tatsuokaniwa/swr-firestore';
import { Discipline } from '@datatypes/Discipline';
import {
	DocumentReference,
	FirestoreError,
	Timestamp,
	collection,
	deleteField,
	doc,
	getDocs,
	runTransaction,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { User } from '@datatypes/User';
import { firestore } from './firebase';
import { ApplyData, ApplyForm } from '@components/Apply';

const useGetUser = (id?: string): { userInfo?: User; error?: FirestoreError; isLoading: boolean } => {
	const [userInfo, setInfo] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<FirestoreError>();

	const response = useGetDoc<User>({
		path: `users/${id}`,
	});

	useEffect(() => {
		setInfo(response.data);
		if (id && !response.data && !response.isLoading && !error) {
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

const useGetRace = (id?: string | string[]): { raceData?: SwrDocumentData<RaceType>; error?: FirestoreError; isLoading: boolean } => {
	const [raceData, setData] = useState<SwrDocumentData<RaceType>>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<FirestoreError>();
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
	const [disciplines, setDisciplines] = useState<Discipline[]>();
	const [error, setError] = useState<FirestoreError>();
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
	const [races, setRaces] = useState<RaceType[]>();
	const [error, setError] = useState<FirestoreError>();
	const [date] = useState(new Date());
	const response = useCollection<RaceType>({
		path: 'races',
		where: [['dateTime', '>', date]],
		orderBy: [['dateTime', 'asc']],
		parseDates: ['dateTime', 'applyUntil'],
	});

	useEffect(() => {
		if (!races && response.data) {
			setRaces(response.data);
		}
		if (!error && response.error) {
			setError(response.error);
		}
	}, [response]);

	return { races, error };
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
		batch.set(disciplinesRef, {
			title: discipline.title,
			length: discipline.length,
		});
	});

	return batch.commit();
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

const useApplyForRace = (raceRef: DocumentReference, applyData: ApplyForm, userId: string): Promise<void> => {
	const promise = runTransaction(firestore, async (transaction) => {
		const applyRef = doc(collection(doc(collection(raceRef, 'disciplines'), applyData.discipline), 'applied'), userId);
		const data = {
			user: doc(firestore, 'users', userId),
			club: applyData.club,
			shirtSize: applyData.shirtSize,
		};

		const race = await transaction.get(raceRef);
		const applied = (race.data()?.applied || 0) + 1;
		transaction.update(raceRef, {
			applied: applied,
		});
		transaction.set(applyRef, data);
	});
	return promise;
};

const useUpdateApply = (oldApply: DocumentData<ApplyData>, applyData: ApplyForm): Promise<void> => {
	const promise = runTransaction(firestore, async (transaction) => {
		if (oldApply.ref.parent.parent?.id === applyData.discipline) {
			transaction.update(oldApply.ref, {
				club: applyData.club,
				shirtSize: applyData.shirtSize,
			});
		} else {
			const applyRef = doc(
				collection(doc(collection(firestore, oldApply.ref.parent.parent!.parent.path), applyData.discipline), 'applied'),
				oldApply.user.id,
			);
			const data = {
				user: oldApply.user,
				club: applyData.club,
				shirtSize: applyData.shirtSize,
			};
			transaction.delete(oldApply.ref);
			transaction.set(applyRef, data);
		}
	});
	return promise;
};

const useGetApply = (
	disciplines: Discipline[],
	userId?: string,
): { applyData?: SwrDocumentData<ApplyData>; error?: FirestoreError; isLoading: boolean } => {
	const [applyData, setApplyData] = useState<DocumentData<ApplyData>>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<FirestoreError>();

	const response = useGetDocs<ApplyData>({
		path: 'applied',
		isCollectionGroup: true,
	});

	useEffect(() => {
		if (!applyData && response.data && response.data.length && disciplines && disciplines.length && userId) {
			setApplyData(
				response.data.find((apply) =>
					disciplines.some((discipline) => discipline.id === apply.ref.parent.parent?.id && apply.user.id === userId),
				),
			);
		}
		setIsLoading(response.isLoading);
		setError(response.error);
	}, [response]);

	return { applyData, error, isLoading };
};

const useCancelApply = (applyRef: DocumentReference): Promise<void> => {
	const promise = runTransaction(firestore, async (transaction) => {
		const raceRef = applyRef.parent.parent!.parent.parent!;
		const race = await transaction.get(raceRef);
		const applied = race.data()?.applied || 1;
		transaction.update(raceRef, {
			applied: applied > 1 ? applied - 1 : deleteField(),
		});

		transaction.delete(applyRef);
	});
	return promise;
};

export {
	useGetUser,
	useSetUser,
	useGetRace,
	useGetDisciplines,
	useGetRaces,
	useAddRace,
	useUpdateRace,
	useRemoveRace,
	useApplyForRace,
	useUpdateApply,
	useGetApply,
	useCancelApply,
};
