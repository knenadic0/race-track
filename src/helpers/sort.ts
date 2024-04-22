import { Result } from '@datatypes/Result';

export const sortResults = (a: Result, b: Result) => {
	if (a.totalTime! < 0 && b.totalTime! >= 0) {
		return 1;
	} else if (a.totalTime! >= 0 && b.totalTime! < 0) {
		return -1;
	} else if (a.totalTime! < 0 && b.totalTime! < 0) {
		if (a.started && b.started) {
			return 0;
		} else {
			return a.started ? -1 : 1;
		}
	}

	return a.totalTime! - b.totalTime!;
};
