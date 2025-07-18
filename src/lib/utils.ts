import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const formattedDateTime = () => {
	function getPartOfDay(hour: number) {
		if (hour >= 5 && hour < 12) return 'Morning';
		else if (hour >= 12 && hour < 17) return 'Afternoon';
		else if (hour >= 17 && hour < 21) return 'Evening';
		else return 'Night';
	}

	const now = new Date();
	const dayOfWeek = new Intl.DateTimeFormat('en-US', {
		weekday: 'long'
	}).format(now);
	const date = new Intl.DateTimeFormat('en-US', {
		month: 'numeric',
		day: 'numeric'
	}).format(now);
	const partOfDay = getPartOfDay(now.getHours());

	return `${dayOfWeek} (${date}) ${partOfDay}`; // Example output: Sunday (4/19) Evening
};

export const formatDollar = (value: number) => {
	const dollarFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		trailingZeroDisplay: 'stripIfInteger'
	});

	return dollarFormatter.format(value);
};
