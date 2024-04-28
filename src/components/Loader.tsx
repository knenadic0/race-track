import { rtBlue, rtLightGray } from '@constants/tailwind';
import { PropsWithStyle } from '@datatypes/StyleProps';
import classNames from 'classnames';
import { Puff } from 'react-loader-spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export enum LoaderType {
	Skeleton,
	Circle,
}

export type LoaderProps = {
	type: LoaderType;
	count?: number;
	height?: number;
};

const Loader = ({ type, count, height, className = '' }: PropsWithStyle<LoaderProps>) => {
	const containerClass = classNames(
		className,
		{ 'absolute top-1/3': type == LoaderType.Circle },
		{ relative: type == LoaderType.Skeleton },
	);

	return (
		<div className={containerClass}>
			{type == LoaderType.Skeleton ? (
				<Skeleton count={count} highlightColor={rtLightGray} height={height} containerClassName="w-full" />
			) : (
				<Puff
					height="60"
					width="60"
					radius={1}
					color={rtBlue}
					ariaLabel="puff-loading"
					visible={true}
					wrapperClass="mx-auto w-min"
				/>
			)}
		</div>
	);
};

export default Loader;
