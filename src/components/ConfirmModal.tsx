import Button, { ButtonColor } from './Button';
import { Modal } from 'flowbite-react';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';

export type ConfirmModalProps = {
	text: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	type: 'warning' | 'info';
};

const ConfirmModal = ({ text, isOpen, onClose, onConfirm, type }: ConfirmModalProps) => {
	const yesButtonColor = type === 'info' ? ButtonColor.Blue : ButtonColor.Red;
	const icon =
		type === 'info' ? (
			<FiInfo className="mx-auto mb-4 h-14 w-14 text-rt-black" />
		) : (
			<FiAlertCircle className="mx-auto mb-4 h-14 w-14 text-rt-black" />
		);
	return (
		<Modal show={isOpen} size="md" onClose={onClose} popup dismissible>
			<Modal.Header />
			<Modal.Body>
				<div className="text-center">
					{icon}
					<h3 className="mb-5 text-lg font-normal text-rt-black">{text}</h3>
					<div className="flex justify-center gap-4">
						<Button color={yesButtonColor} onClick={onConfirm} text="Yes" />
						<Button color={ButtonColor.Neutral} onClick={onClose} text="No" />
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default ConfirmModal;
