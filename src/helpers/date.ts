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

export const formatMilisecondsToTime = (milliseconds?: number): string => {
	// Handle potential negative or zero milliseconds
	if (!milliseconds || milliseconds <= 0) {
		return '00:00:00.00';
	}

	// Calculate hours, minutes, seconds, and milliseconds
	const hours = Math.floor(milliseconds / (1000 * 60 * 60));
	const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
	const remainingMilliseconds = (milliseconds % 1000) / 10;

	// Format the output with leading zeros
	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');
	const formattedSeconds = seconds.toString().padStart(2, '0');
	const formattedMilliseconds = remainingMilliseconds.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
};
