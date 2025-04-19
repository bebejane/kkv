'use client';

import { useState, useEffect, use } from 'react';

export type DotLoaderProps = {
	children?: string;
};

export default function DotLoader({ children }: DotLoaderProps) {
	const [dots, setDots] = useState<string>('.');

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((dots) => (dots.length > 4 ? '' : `${dots + 1}`));
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{children}
			{dots}
		</>
	);
}
