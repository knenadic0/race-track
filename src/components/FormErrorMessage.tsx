import { PropsWithStyle } from '@datatypes/StyleProps';
import classNames from 'classnames';

export type FormErrorMessageProps = {
	message: string;
};

const FormErrorMessage = ({ className, message }: PropsWithStyle<FormErrorMessageProps>) => (
	<p className={classNames('text-rt-dark-red', className)}>{message}</p>
);

export default FormErrorMessage;
