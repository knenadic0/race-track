import { IRaceProp } from '../types/IRace';
import dateFormat from 'dateformat';

const Info = ({ raceData }: IRaceProp) => {
	if (!raceData) {
		return null;
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
				<div className="mb-4 md:mb-0">
					<p className="mb-1">
						<span className="font-bold">Starting date and time:</span>{' '}
						{dateFormat(raceData.dateTime.toDate(), 'dd.mm.yyyy. HH:MM (dddd)')}
					</p>
					<p>
						<span className="font-bold">Applies open until:</span>{' '}
						{dateFormat(raceData.applyUntil.toDate(), 'dd.mm.yyyy. HH:MM (dddd)')}
					</p>
				</div>
				<div>
					{raceData.disciplines && raceData.disciplines.length && (
						<>
							<p className="mb-1 font-bold">Disciplines:</p>
							<ul className="list-inside list-disc">
								{raceData.disciplines.map((discipline) => (
									<li className="list-item">
										{discipline.title} ({discipline.raceLength} km)
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
			<hr className="my-6" />
			<div>{raceData.description}</div>
		</>
	);
};

export default Info;
