export type User = {
	fullName: string;
	birthDate: string;
	gender: string;
};

const userForm: User = {
	fullName: '',
	birthDate: '',
	gender: '',
};

export const userFormFields = Object.keys(userForm);
