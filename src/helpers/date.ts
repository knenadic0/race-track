export const calculateAge = (dateOfBirth: string): number => {
	const [yearString, monthString, dayString] = dateOfBirth.split('-');
	const year = parseInt(yearString, 10);
	const month = parseInt(monthString, 10);
	const day = parseInt(dayString, 10);

	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth() + 1;
	const currentDay = today.getDate();

	let age = currentYear - year;
	if (currentMonth < month || (currentMonth === month && currentDay < day)) {
		age--;
	}

	return age;
};
