import { ExclusiveOr } from '@datatypes/ExclusiveOr';
import Button, { ButtonColor, ButtonProps } from './Button';
import { Modal } from 'flowbite-react';
import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent, PropsWithChildren, useState } from 'react';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';

export type ConfirmModalProps = {
	text: string;
	onConfirm: () => void;
	type: 'warning' | 'info';
} & ExclusiveOr<
	{
		buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
	},
	{
		buttonComponentProps?: PropsWithChildren<ButtonProps>;
	}
>;

const ConfirmModal = ({ text, onConfirm, type, buttonProps, buttonComponentProps }: ConfirmModalProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const yesButtonColor = type === 'info' ? ButtonColor.Blue : ButtonColor.Red;
	const icon =
		type === 'info' ? (
			<FiInfo className="mx-auto mb-4 h-14 w-14 text-rt-black" />
		) : (
			<FiAlertCircle className="mx-auto mb-4 h-14 w-14 text-rt-black" />
		);
	const onYesButtonClick = () => {
		setIsOpen(false);
		onConfirm();
	};

	const onButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
		setIsOpen(true);
		if (buttonProps?.onClick) {
			buttonProps.onClick(e);
		}
		if (buttonComponentProps?.onClick) {
			buttonComponentProps.onClick(e);
		}
	};

	return (
		<>
			{buttonProps && (
				<button onClick={onButtonClick} type="button" className={buttonProps.className}>
					{buttonProps.children}
				</button>
			)}
			{buttonComponentProps && (
				<Button {...buttonComponentProps} onClick={onButtonClick}>
					{buttonComponentProps.children}
				</Button>
			)}
			<Modal show={isOpen} size="md" onClose={() => setIsOpen(false)} popup dismissible>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						{icon}
						<h3 className="mb-5 text-lg font-normal text-rt-black">{text}</h3>
						<div className="flex justify-center gap-4">
							<Button color={yesButtonColor} onClick={() => onYesButtonClick()} text="Yes" />
							<Button color={ButtonColor.Neutral} onClick={() => setIsOpen(false)} text="No" />
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default ConfirmModal;
