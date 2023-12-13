import { rtBlue } from '@constants/tailwind';
import { StyleProp } from '@datatypes/StyleProps';
import classNames from 'classnames';
import { Puff } from 'react-loader-spinner';

const Loader = ({ className = '' }: StyleProp) => {
	return (
		<div className={classNames(className, 'absolute top-1/3')}>
			<Puff height="60" width="60" radius={1} color={rtBlue} ariaLabel="puff-loading" visible={true} />
		</div>
	);
};

export default Loader;
