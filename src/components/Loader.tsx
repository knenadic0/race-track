import { rtBlue } from '@constants/tailwind';
import { PropsWithStyle } from '@datatypes/StyleProps';
import classNames from 'classnames';
import { Puff } from 'react-loader-spinner';

export enum LoaderContainer {
	Component,
	Page,
}

export type LoaderProps = {
	container: LoaderContainer;
};

const Loader = ({ container, className = '' }: PropsWithStyle<LoaderProps>) => {
	const containerClass = classNames(
		className,
		container == LoaderContainer.Page ? 'absolute top-1/3' : '',
		container == LoaderContainer.Page ? 'relative mx-auto' : '',
	);

	return (
		<div className={containerClass}>
			<Puff height="60" width="60" radius={1} color={rtBlue} ariaLabel="puff-loading" visible={true} wrapperClass="mx-auto w-min" />
		</div>
	);
};

export default Loader;
