import Loader, { LoaderType } from './Loader';
import { RaceProp } from './Info';
import DataTable from './DataTable';
import { useEffect, useState } from 'react';
import { TableNode } from '@table-library/react-table-library';
import classNames from 'classnames';
import { Column } from '@table-library/react-table-library/types/compact';
import { useGetResults } from '@adapters/firestore';
import dateFormat from 'dateformat';
import { Result as ResultType } from '@datatypes/Result';
import { formatMilisecondsToTime } from '@helpers/date';
import Pill, { DNFPill, DNSPill } from './Pill';
import { useAuth } from '@contexts/auth';

export type ResultProp = RaceProp & {
	selectedDiscipline?: string;
};

const Results = ({ raceData, disciplines, selectedDiscipline }: ResultProp) => {
	const { user } = useAuth();
	const [discipline, setDiscipline] = useState<string | undefined>(selectedDiscipline);
	const [gender, setGender] = useState<string | undefined>(selectedDiscipline ? 'both' : undefined);
	const { results, error } = useGetResults(raceData?.id, discipline, gender);

	useEffect(() => {
		if (selectedDiscipline && !discipline) {
			setDiscipline(selectedDiscipline);
			setGender('both');
		}
	}, [selectedDiscipline]);

	const columns: Column<ResultType>[] = [
		{
			label: '#',
			renderCell: (item: ResultType) => item.position,
			sort: { sortKey: 'position' },
		},
		{
			label: 'Racer',
			renderCell: (item: ResultType) => item.racer,
			sort: { sortKey: 'racer' },
			cellProps: {
				'data-row-selected': (item: ResultType) => item.id === user?.uid,
			},
		},
		{
			label: 'Time',
			renderCell: (item: ResultType) =>
				item.totalTime && item.totalTime > 0 ? formatMilisecondsToTime(item.totalTime) : <DNFPill />,
		},
		{
			label: 'Club',
			renderCell: (item: ResultType) => item.club,
			sort: { sortKey: 'club' },
		},
		{
			label: 'Gender',
			renderCell: (item: ResultType) =>
				item.gender === 'male' ? <Pill color="teal" text="Male" /> : <Pill color="red" text="Female" />,
			sort: { sortKey: 'gender' },
		},
		{
			label: 'Age',
			renderCell: (item: ResultType) => item.age,
			sort: { sortKey: 'age' },
		},
		{
			label: 'Started',
			renderCell: (item: ResultType) => (item.started ? dateFormat(item.started, 'HH:MM:ss.L') : <DNSPill />),
			sort: { sortKey: 'started' },
		},
		{
			label: 'Finished',
			renderCell: (item: ResultType) => (item.finished ? dateFormat(item.finished, 'HH:MM:ss.L') : <DNFPill />),
			sort: { sortKey: 'finished' },
		},
	];

	const sortFns = {
		position: (array: TableNode[]) => array.sort((a, b) => a.position - b.position),
		racer: (array: TableNode[]) => array.sort((a, b) => a.racer.localeCompare(b.racer)),
		club: (array: TableNode[]) => array.sort((a, b) => (a.club || '').localeCompare(b.club || '')),
		gender: (array: TableNode[]) => array.sort((a, b) => a.gender.localeCompare(b.gender)),
		age: (array: TableNode[]) => array.sort((a, b) => a.age - b.age),
		started: (array: TableNode[]) => array.sort((a, b) => a.started.getTime() - b.started.getTime()),
		finished: (array: TableNode[]) => array.sort((a, b) => a.finished.getTime() - b.finished.getTime()),
	};

	return error ? (
		<div className="my-5">{error.message}</div>
	) : !disciplines ? (
		<Loader type={LoaderType.Skeleton} count={2} />
	) : (
		<>
			<div className="my-3 flex flex-col gap-y-3 gap-x-4 md:flex-row">
				<select
					className="rt-input w-full sm:w-80"
					onChange={(e) => setDiscipline(e.target.value)}
					placeholder="Select discipline"
					defaultValue={discipline || 0}
				>
					{disciplines
						.map((discipline) => (
							<option value={discipline.id} key={discipline.id}>
								{discipline.title} ({discipline.length} km)
							</option>
						))
						.concat(
							<option disabled value={0} hidden key={0}>
								Select discipline
							</option>,
						)}
				</select>
				{discipline && (
					<select
						className="rt-input w-full sm:w-72"
						onChange={(e) => setGender(e.target.value)}
						placeholder="Select gender"
						defaultValue={gender || 0}
					>
						<option disabled value={0} hidden>
							Select gender
						</option>
						<option value="both">Both</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				)}
			</div>
			<div className={classNames('flex-col ', { 'lg:-mt-12': gender && results && results.length })}>
				{gender && results && results.length > 0 && (
					<DataTable<ResultType>
						columns={columns}
						data={results}
						pageSize={10}
						sortFns={sortFns}
						searchableFields={['racer', 'club', 'gender', 'age']}
						defaultSortKey="position"
						templateColumns="50px minmax(200px, 4fr) repeat(2, minmax(120px, 2fr)) repeat(2, minmax(120px, 1fr)) repeat(2, minmax(120px, 2fr))"
						fixedHeader
						searchPhrase="Search racers..."
					/>
				)}
				{gender && (!results || !results.length) && <div className="mt-10 mb-5">No finishes yet.</div>}
			</div>
		</>
	);
};

export default Results;
