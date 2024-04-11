import { useState, useEffect } from 'react';
import { RaceForm, Race as RaceType } from '@datatypes/Race';
import { useCollection, useGetDoc, DocumentData, useDoc, useCollectionGroup } from '@tatsuokaniwa/swr-firestore';
import { Discipline } from '@datatypes/Discipline';
import {
	DocumentReference,
	FirestoreError,
	Timestamp,
	collection,
	deleteField,
	doc,
	getDocs,
	orderBy,
	runTransaction,
	where,
	writeBatch,
} from 'firebase/firestore';
import { User } from '@datatypes/User';
import { firestore } from './firebase';
import { Applied, ApplyForm } from '@datatypes/Apply';
import { calculateAge } from '@helpers/date';
import { DocumentId, Paths, ValueOf } from '@tatsuokaniwa/swr-firestore/dist/util/type';
import { Result } from '@datatypes/Result';

const useGetUser = (id?: string): { userInfo?: DocumentData<User>; error?: FirestoreError } => {
	const [userInfo, setInfo] = useState<DocumentData<User>>();
	const [error, setError] = useState<FirestoreError>();

	const response = useDoc<User>({
		path: `users/${id}`,
	});

	useEffect(() => {
		setInfo(response.data);
		setError(response.error);
	}, [response]);

	return { userInfo, error };
};

const useSetUser = (uid: string, userData: User): Promise<void> => {
	const promise = runTransaction(firestore, async (transaction) => {
		const userDocRef = doc(firestore, 'users', uid);
		const data = {
			fullName: userData.fullName,
			birthDate: userData.birthDate,
			gender: userData.gender,
		};
		transaction.set(userDocRef, data, { merge: true });
	});
	return promise;
};

const useGetRace = (id?: string | string[]): { raceData?: DocumentData<RaceType>; error?: FirestoreError; isLoading: boolean } => {
	const [raceData, setData] = useState<DocumentData<RaceType>>();
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

const useGetRaceLive = (id?: string | string[]): { raceData?: DocumentData<RaceType>; error?: FirestoreError } => {
	const [timeoutError, setTimeoutError] = useState<FirestoreError | undefined>(undefined);
	const { data: raceData, error } = useDoc<RaceType>({
		path: `races/${id}`,
		parseDates: ['dateTime', 'applyUntil'],
	});

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!raceData && !error) {
				setTimeoutError({
					code: 'not-found',
					message: 'Not found',
					name: 'Not found',
				});
			}
		}, 3000);

		return () => clearTimeout(timeoutId);
	}, [raceData, error]);

	return { raceData, error: error || timeoutError };
};

const useGetDisciplines = (id?: string | string[]): { disciplines?: Discipline[]; error?: FirestoreError } => {
	const [timeoutError, setTimeoutError] = useState<FirestoreError | undefined>(undefined);

	const { data: disciplines, error } = useCollection<Discipline>({
		path: `races/${id}/disciplines`,
		orderBy: [['length', 'asc']],
	});

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!disciplines && !error) {
				setTimeoutError({
					code: 'not-found',
					message: 'Not found',
					name: 'Not found',
				});
			}
		}, 3000);

		return () => clearTimeout(timeoutId);
	}, [disciplines, error]);

	return { disciplines, error: error || timeoutError };
};

const useGetRaces = (past: boolean = true): { races?: RaceType[]; error?: FirestoreError } => {
	const [timeoutError, setTimeoutError] = useState<FirestoreError | undefined>(undefined);

	const [date] = useState(new Date());
	const now = new Date();
	now.setHours(24, 0, 0, 0);
	const [today] = useState(now);

	const whereClause: [Paths<RaceType> | DocumentId, Parameters<typeof where>[1], ValueOf<RaceType> | unknown][] = past
		? [['dateTime', '>', date]]
		: [['dateTime', '<=', today]];
	const orderByOrientation: Parameters<typeof orderBy>[1] = past ? 'asc' : 'desc';

	const { data: races, error } = useCollection<RaceType>({
		path: 'races',
		where: whereClause,
		orderBy: [['dateTime', orderByOrientation]],
		parseDates: ['dateTime', 'applyUntil'],
	});

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!races && !error) {
				setTimeoutError({
					code: 'not-found',
					message: 'Not found',
					name: 'Not found',
				});
			}
		}, 3000);

		return () => clearTimeout(timeoutId);
	}, [races, error]);

	return { races, error: error || timeoutError };
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
		disciplinesCount: raceData.disciplines.length,
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
		disciplinesCount: raceData.disciplines.length,
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
		const userRef = doc(firestore, 'users', userId);
		const user = await transaction.get(userRef);
		const age = calculateAge(user.data()?.birthDate);
		const applyRef = doc(collection(doc(collection(raceRef, 'disciplines'), applyData.discipline), 'applied'), userId);
		const data = {
			gender: user.data()?.gender,
			age: age,
			racer: user.data()?.fullName,
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

const useUpdateApply = (oldApply: DocumentData<ApplyForm>, applyData: ApplyForm): Promise<void> => {
	const promise = runTransaction(firestore, async (transaction) => {
		if (oldApply.ref.parent.parent?.id === applyData.discipline) {
			transaction.update(oldApply.ref, {
				club: applyData.club,
				shirtSize: applyData.shirtSize,
			});
		} else {
			const applyRef = doc(
				collection(doc(collection(firestore, oldApply.ref.parent.parent!.parent.path), applyData.discipline), 'applied'),
				oldApply.id,
			);
			const userRef = doc(firestore, 'users', oldApply.id);
			const user = await transaction.get(userRef);
			const age = calculateAge(user.data()?.birthDate);
			const data = {
				gender: user.data()?.gender,
				age: age,
				racer: user.data()?.fullName,
				club: applyData.club,
				shirtSize: applyData.shirtSize,
			};
			transaction.delete(oldApply.ref);
			transaction.set(applyRef, data);
		}
	});
	return promise;
};

const useGetApply = (disciplines: Discipline[], userId?: string): { applyData?: DocumentData<ApplyForm>; error?: FirestoreError } => {
	const [applyData, setApplyData] = useState<DocumentData<ApplyForm>>();
	const [error, setError] = useState<FirestoreError>();

	const response = useCollectionGroup<ApplyForm>({
		path: 'applied',
	});

	useEffect(() => {
		if (response.data && response.data.length && disciplines && disciplines.length && userId) {
			setApplyData(
				response.data.find((apply) =>
					disciplines.some((discipline) => discipline.id === apply.ref.parent.parent?.id && apply.id === userId),
				),
			);
		}
		setError(response.error);
	}, [response]);

	return { applyData, error };
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

const useGetApplied = (raceId?: string, disciplineId?: string): { applied?: Applied[]; error?: FirestoreError } => {
	const [timeoutError, setTimeoutError] = useState<FirestoreError>();

	const { data: applied, error } = useCollection<Applied>({
		path: `races/${raceId}/disciplines/${disciplineId}/applied`,
		orderBy: [['racer', 'asc']],
	});

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!applied && !error) {
				setTimeoutError({
					code: 'not-found',
					message: 'Not found',
					name: 'Not found',
				});
			}
		}, 3000);

		return () => clearTimeout(timeoutId);
	}, [applied, error]);

	return { applied, error: error || timeoutError };
};

const useGetResults = (raceId?: string, disciplineId?: string, gender?: string): { results?: Result[]; error?: FirestoreError } => {
	const [results, setResults] = useState<Result[]>();
	const whereClause: [Paths<Result> | DocumentId, Parameters<typeof where>[1], ValueOf<Result> | unknown][] | undefined =
		gender && gender !== 'both' ? [['gender', '==', gender]] : undefined;

	const { data, error } = useCollection<Result>({
		path: `races/${raceId}/disciplines/${disciplineId}/applied`,
		where: whereClause,
		orderBy: [['totalTime', 'asc']],
		parseDates: ['started', 'finished'],
	});

	useEffect(() => {
		if (data) {
			setResults(
				data.map((item, index) => ({
					...item,
					position: index + 1,
				})),
			);
		}
	}, [data]);

	return { results, error };
};

export {
	useGetUser,
	useSetUser,
	useGetRace,
	useGetRaceLive,
	useGetDisciplines,
	useGetRaces,
	useAddRace,
	useUpdateRace,
	useRemoveRace,
	useApplyForRace,
	useUpdateApply,
	useGetApply,
	useCancelApply,
	useGetApplied,
	useGetResults,
};
