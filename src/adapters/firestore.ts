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
import { Result, ResultRace } from '@datatypes/Result';
import { sortResults } from '@helpers/sort';

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

const useGetRace = (id?: string): { raceData?: DocumentData<RaceType>; error?: FirestoreError; isLoading: boolean } => {
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

const useGetRaceLive = (id?: string): { raceData?: DocumentData<RaceType>; error?: FirestoreError } => {
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

const useGetDisciplines = (id?: string): { disciplines?: Discipline[]; error?: FirestoreError } => {
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

const useGetRaces = (future: boolean = true): { races?: RaceType[]; error?: FirestoreError } => {
	const [timeoutError, setTimeoutError] = useState<FirestoreError | undefined>(undefined);

	const [date] = useState(new Date());
	const now = new Date();
	now.setHours(24, 0, 0, 0);
	const [today] = useState(now);

	const whereClause: [Paths<RaceType> | DocumentId, Parameters<typeof where>[1], ValueOf<RaceType> | unknown][] = future
		? [['dateTime', '>', date]]
		: [['dateTime', '<=', today]];
	const orderByOrientation: Parameters<typeof orderBy>[1] = future ? 'asc' : 'desc';

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
		const disciplineRef = doc(collection(raceRef, 'disciplines'), applyData.discipline);
		const applyRef = doc(collection(disciplineRef, 'applied'), userId);
		const data = {
			gender: user.data()?.gender,
			age: age,
			racer: user.data()?.fullName,
			club: applyData.club,
			shirtSize: applyData.shirtSize,
		};

		const race = await transaction.get(raceRef);
		const discipline = await transaction.get(disciplineRef);
		const raceApplied = (race.data()?.applied || 0) + 1;
		const disciplineApplied = (discipline.data()?.applied || 0) + 1;
		transaction.update(raceRef, {
			applied: raceApplied,
		});
		transaction.update(disciplineRef, {
			applied: disciplineApplied,
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
			const oldDisciplineRef = oldApply.ref.parent.parent!;
			const newDisciplineRef = doc(collection(firestore, oldApply.ref.parent.parent!.parent.path), applyData.discipline);
			const applyRef = doc(collection(newDisciplineRef, 'applied'), oldApply.id);
			const userRef = doc(firestore, 'users', oldApply.id);

			const oldDiscipline = await transaction.get(oldDisciplineRef);
			const newDiscipline = await transaction.get(newDisciplineRef);
			const user = await transaction.get(userRef);
			const age = calculateAge(user.data()?.birthDate);
			const data = {
				gender: user.data()?.gender,
				age: age,
				racer: user.data()?.fullName,
				club: applyData.club,
				shirtSize: applyData.shirtSize,
			};

			const oldApplied = oldDiscipline.data()?.applied || 1;
			transaction.update(oldDisciplineRef, {
				applied: oldApplied > 1 ? oldApplied - 1 : deleteField(),
			});
			const newApplied = (newDiscipline.data()?.applied || 0) + 1;
			transaction.update(newDisciplineRef, {
				applied: newApplied,
			});
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
		const disciplineRef = applyRef.parent.parent!;
		const raceRef = disciplineRef.parent.parent!;
		const race = await transaction.get(raceRef);
		const discipline = await transaction.get(disciplineRef);
		const applied = race.data()?.applied || 1;
		transaction.update(raceRef, {
			applied: applied > 1 ? applied - 1 : deleteField(),
		});
		const disciplineApplied = discipline.data()?.applied || 1;
		transaction.update(disciplineRef, {
			applied: disciplineApplied > 1 ? disciplineApplied - 1 : deleteField(),
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
				data.sort(sortResults).map((item, index) => ({
					...item,
					position:
						(gender && gender != 'both' ? item.genderPosition : item.position) || item.finished ? index + 1 : item.position,
				})),
			);
		}
	}, [data]);

	return { results, error };
};

const useGetMyRaces = (userId?: string): { results?: ResultRace[]; error?: FirestoreError } => {
	const [results, setResults] = useState<ResultRace[]>();
	const { data: races, error: racesError } = useCollection<RaceType>({
		path: 'races',
		parseDates: ['dateTime', 'applyUntil'],
	});
	const { data: resultsData, error } = useCollectionGroup<Result>({
		path: 'applied',
	});
	const { data: disciplines, error: disciplinesError } = useCollectionGroup<Discipline>({
		path: 'disciplines',
	});

	useEffect(() => {
		if (resultsData && races && disciplines) {
			setResults(
				resultsData
					.filter((x) => x.id === userId)
					.map((item) => {
						const race = races.find((race) => race.id === item.ref.parent.parent!.parent.parent!.id);
						const discipline = disciplines.find((discipline) => discipline.id === item.ref.parent.parent!.id);
						return {
							raceId: race?.id || '',
							dateTime: race?.dateTime || new Date(),
							race: race?.title || '',
							disciplineId: discipline?.id || '',
							discipline: discipline?.title || '',
							applied: discipline?.applied || 0,
							position: item.position,
							genderPosition: item.genderPosition,
							started: item.started,
						};
					}),
			);
		}
	}, [resultsData, races, disciplines]);

	return { results, error: error || racesError || disciplinesError };
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
	useGetMyRaces,
};
