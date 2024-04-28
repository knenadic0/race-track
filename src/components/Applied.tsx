import Loader, { LoaderType } from './Loader';
import { RaceProp } from './Info';
import DataTable from './DataTable';
import { useState } from 'react';
import { useGetApplied } from '@adapters/firestore';
import { TableNode } from '@table-library/react-table-library';
import classNames from 'classnames';
import { Column } from '@table-library/react-table-library/types/compact';
import { Applied as AppliedType } from '@datatypes/Apply';
import Pill from './Pill';

const Applied = ({ raceData, disciplines }: RaceProp) => {
	const [discipline, setDiscipline] = useState<string>();
	const { applied, error } = useGetApplied(raceData?.id, discipline);

	const columns: Column<AppliedType>[] = [
		{
			label: 'Racer',
			renderCell: (item: AppliedType) => item.racer,
			sort: { sortKey: 'racer' },
		},
		{
			label: 'Club',
			renderCell: (item: AppliedType) => item.club,
			sort: { sortKey: 'club' },
		},
		{
			label: 'Gender',
			renderCell: (item: AppliedType) =>
				item.gender === 'male' ? <Pill color="teal" text="Male" /> : <Pill color="red" text="Female" />,
			sort: { sortKey: 'gender' },
		},
		{
			label: 'Age',
			renderCell: (item: AppliedType) => item.age,
			sort: { sortKey: 'age' },
		},
	];

	const sortFns = {
		racer: (array: TableNode[]) => array.sort((a, b) => a.racer.localeCompare(b.racer)),
		club: (array: TableNode[]) => array.sort((a, b) => (a.club || '').localeCompare(b.club || '')),
		gender: (array: TableNode[]) => array.sort((a, b) => a.gender.localeCompare(b.gender)),
		age: (array: TableNode[]) => array.sort((a, b) => a.age - b.age),
	};

	return (raceData && !raceData.applied) || error ? (
		<div className="my-5">No applies yet.</div>
	) : !disciplines ? (
		<Loader type={LoaderType.Skeleton} count={5} height={48} />
	) : (
		<>
			<div className="my-3 w-full sm:w-96">
				<select
					className="rt-input"
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
			</div>
			<div className={classNames('flex-col', { '-mt-12': applied && applied.length })}>
				{applied && applied.length ? (
					<DataTable<AppliedType>
						columns={columns}
						data={applied}
						pageSize={10}
						sortFns={sortFns}
						searchableFields={['racer', 'club', 'gender', 'age']}
						defaultSortKey="racer"
						templateColumns="minmax(200px, 3fr) minmax(200px, 2fr) repeat(2, minmax(120px, 1fr))"
						fixedHeader
						searchPhrase="Search racers..."
					/>
				) : discipline ? (
					<div className="mt-12 mb-5">No applies yet.</div>
				) : null}
			</div>
		</>
	);
};

export default Applied;
