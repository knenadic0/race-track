import Loader, { LoaderContainer } from './Loader';
import { RaceProp } from './Info';
import { useForm } from 'react-hook-form';
import Button, { ButtonColor } from './Button';
import { FiCheckSquare, FiXCircle } from 'react-icons/fi';
import { toastPromise } from '@helpers/toast';
import { useApplyForRace, useCancelApply, useGetApply, useGetUser, useUpdateApply } from '@adapters/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@adapters/firebase';
import { useEffect, useState } from 'react';
import { User } from '@datatypes/User';
import { Tooltip } from 'flowbite-react';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from './FormErrorMessage';
import { DocumentData } from '@tatsuokaniwa/swr-firestore';
import ConfirmModal from './ConfirmModal';
import { ApplyData, ApplyForm, ShirtSize } from '@datatypes/Apply';

const defaultApplyForm: ApplyForm = {
	discipline: '',
	shirtSize: 0,
	club: '',
};

const Apply = ({ raceData, disciplines }: RaceProp) => {
	const auth = getAuth(app);
	const [applyButtonColor, setApplyButtonColor] = useState<ButtonColor>(ButtonColor.Disabled);
	const [userData, setUserData] = useState<User>();
	const [applyData, setApplyData] = useState<DocumentData<ApplyData>>();
	const { userInfo } = useGetUser(auth.currentUser?.uid);
	const { applyData: applyInfo } = useGetApply(disciplines || [], auth.currentUser?.uid);
	const {
		register,
		handleSubmit,
		setValue,
		trigger,
		reset,
		formState: { errors },
	} = useForm<ApplyForm>({ defaultValues: defaultApplyForm });

	useEffect(() => {
		if (!userData && userInfo) {
			setUserData(userInfo);
			setApplyButtonColor(ButtonColor.Blue);
		}
	}, [userInfo]);

	useEffect(() => {
		if (!applyData && applyInfo) {
			setApplyData(applyInfo);
			setValue('discipline', applyInfo.ref.parent.parent?.id || '');
			setValue('club', applyInfo.club);
			setValue('shirtSize', applyInfo.shirtSize);
			trigger();
		}
	}, [applyInfo]);

	const onFormSubmit = async (formData: ApplyForm) => {
		setApplyButtonColor(ButtonColor.Disabled);
		if (raceData && auth.currentUser) {
			if (applyData) {
				await toastPromise(useUpdateApply(applyData, formData), {
					loading: 'Updating...',
					success: 'Apply updated.',
					error: 'An error occurred.',
				});
				setApplyButtonColor(ButtonColor.Blue);
				setApplyData((prevState) =>
					Object.assign({}, prevState, {
						discipline: formData.discipline,
						club: formData.club,
						shirtSize: formData.shirtSize,
					}),
				);
			} else {
				await toastPromise(useApplyForRace(raceData.ref, formData, auth.currentUser.uid), {
					loading: 'Applying...',
					success: 'Applied for the race.',
					error: 'An error occurred.',
				});
			}
		}
	};

	const cancelApply = async () => {
		if (applyData) {
			await toastPromise(useCancelApply(applyData.ref), {
				loading: 'Canceling apply...',
				success: 'Apply cancelled.',
				error: 'An error occurred.',
			});
			setApplyData(undefined);
			reset();
		}
	};

	const ApplyButton = () => (
		<Button onClick={handleSubmit(onFormSubmit)} text={applyData ? 'Update' : 'Apply'} color={applyButtonColor}>
			<FiCheckSquare />
		</Button>
	);

	return !raceData || !disciplines ? (
		<Loader container={LoaderContainer.Component} />
	) : (
		<div className="grid grid-cols-1 gap-x-4">
			<form className="w-full">
				<div className="input-container mb-8">
					<div className="label-container">
						<label htmlFor="discipline">Discipline:</label>
					</div>
					<select
						id="discipline"
						className="rt-input md:w-96"
						{...register('discipline', {
							required: 'Discipline is required.',
						})}
					>
						{disciplines.map((discipline) => (
							<option value={discipline.id} key={discipline.id}>
								{discipline.title} ({discipline.length} km)
							</option>
						))}
					</select>
				</div>
				<div className="input-container mb-8">
					<div className="label-container">
						<label htmlFor="club">Racing club:</label>
					</div>
					<input
						type="text"
						id="club"
						{...register('club', {
							maxLength: { value: 100, message: 'Maximum racing club length is 100.' },
						})}
						className="rt-input md:w-96"
					/>
				</div>
				<div className="input-container mb-8">
					<div className="label-container">
						<label htmlFor="shirtSize">Shirt size:</label>
					</div>
					<select
						id="shirtSize"
						className="rt-input md:w-96"
						{...register('shirtSize', {
							required: 'Shirt size is required.',
						})}
					>
						{Object.keys(ShirtSize)
							.filter((x) => isNaN(parseInt(x)))
							.map((sizeKey) => (
								<option value={sizeKey} key={sizeKey}>
									{sizeKey}
								</option>
							))}
					</select>
				</div>
				<div className="input-container">
					{Object.keys(defaultApplyForm).map((field) => (
						<ErrorMessage
							errors={errors}
							name={field as keyof ApplyForm}
							key={field}
							render={({ message }) => <FormErrorMessage message={message} className="sm:col-span-2 sm:col-start-2" />}
						/>
					))}
				</div>
				<div className="mt-8 flex justify-center gap-x-2 sm:gap-x-5">
					{userData && <ApplyButton />}
					{!userData && (
						<Tooltip content="Update profile in order to apply.">
							<ApplyButton />
						</Tooltip>
					)}
					{applyData && (
						<ConfirmModal
							onConfirm={cancelApply}
							text="Are you sure you want to cancel apply for this race?"
							type="warning"
							buttonComponentProps={{ text: 'Cancel apply', color: ButtonColor.Red, children: <FiXCircle /> }}
						/>
					)}
				</div>
			</form>
		</div>
	);
};

export default Apply;
