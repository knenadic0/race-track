import Loader, { LoaderContainer } from './Loader';
import { RaceProp } from './Info';
import DataTable from './DataTable';
import { useState } from 'react';
import { TableNode } from '@table-library/react-table-library';
import classNames from 'classnames';
import { Column } from '@table-library/react-table-library/types/compact';
import { useGetResults } from '@adapters/firestore';
import dateFormat from 'dateformat';
import { Result as ResultType } from '@datatypes/Result';
import { formatMilisecondsToTime } from '@helpers/date';
import { getAuth } from 'firebase/auth';
import { app } from '@adapters/firebase';

const Results = ({ raceData, disciplines }: RaceProp) => {
	const auth = getAuth(app);
	const [discipline, setDiscipline] = useState<string>();
	const [gender, setGender] = useState<string>();
	const { results, error } = useGetResults(raceData?.id, discipline, gender);

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
				'data-row-selected': (item: ResultType) => item.id === auth.currentUser?.uid,
			},
		},
		{
			label: 'Time',
			renderCell: (item: ResultType) => formatMilisecondsToTime(item.totalTime || 0),
		},
		{
			label: 'Club',
			renderCell: (item: ResultType) => item.club,
			sort: { sortKey: 'club' },
		},
		{
			label: 'Gender',
			renderCell: (item: ResultType) => item.gender,
			sort: { sortKey: 'gender' },
		},
		{
			label: 'Age',
			renderCell: (item: ResultType) => item.age,
			sort: { sortKey: 'age' },
		},
		{
			label: 'Started',
			renderCell: (item: ResultType) => dateFormat(item.started, 'HH:MM:ss.L'),
			sort: { sortKey: 'started' },
		},
		{
			label: 'Finished',
			renderCell: (item: ResultType) => dateFormat(item.finished, 'HH:MM:ss.L'),
		},
	];

	const sortFns = {
		position: (array: TableNode[]) => array.sort((a, b) => a.position - b.position),
		racer: (array: TableNode[]) => array.sort((a, b) => a.racer.localeCompare(b.racer)),
		club: (array: TableNode[]) => array.sort((a, b) => (a.club || '').localeCompare(b.club || '')),
		gender: (array: TableNode[]) => array.sort((a, b) => a.gender.localeCompare(b.gender)),
		age: (array: TableNode[]) => array.sort((a, b) => a.age - b.age),
		started: (array: TableNode[]) => array.sort((a, b) => a.started.getTime() - b.started.getTime()),
	};

	return error ? (
		<div className="my-5">{error.message}</div>
	) : !disciplines ? (
		<Loader container={LoaderContainer.Component} />
	) : (
		<>
			<div className="my-3 flex flex-col gap-y-3 gap-x-4 md:flex-row">
				<select
					className="rt-input w-full sm:w-80"
					onChange={(e) => setDiscipline(e.target.value)}
					placeholder="Select discipline"
					defaultValue={0}
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
						defaultValue={0}
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
