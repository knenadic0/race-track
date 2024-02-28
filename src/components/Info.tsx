import { Race } from '@datatypes/Race';
import dateFormat from 'dateformat';
import Loader, { LoaderContainer } from './Loader';
import parse from 'html-react-parser';

export type RaceProp = {
	raceData?: Race;
};

const Info = ({ raceData }: RaceProp) => {
	return !raceData ? (
		<Loader container={LoaderContainer.Component} />
	) : (
		<>
			<div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
				<div className="mb-4 md:mb-0">
					<p className="mb-1">
						<span className="font-bold">Starting date & time:</span> {dateFormat(raceData.dateTime, 'dd.mm.yyyy. HH:MM (dddd)')}
					</p>
					<p>
						<span className="font-bold">Applies open until:</span> {dateFormat(raceData.applyUntil, 'dd.mm.yyyy. HH:MM (dddd)')}
					</p>
				</div>
				<div>
					{raceData.disciplines && raceData.disciplines.length && (
						<>
							<p className="mb-1 font-bold">Disciplines:</p>
							<ul className="list-inside list-disc">
								{raceData.disciplines.map((discipline, idx) => (
									<li className="list-item" key={idx}>
										{discipline.title} ({discipline.length} km)
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
			<hr className="my-6" />
			<div className="html-parsed">{parse(raceData.description)}</div>
		</>
	);
};

export default Info;
