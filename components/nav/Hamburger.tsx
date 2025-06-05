'use client';

import s from './Hamburger.module.scss';
import cn from 'classnames';
import React, { useState, useEffect, useRef } from 'react';

export type HamburgerProps = {
	toggled: boolean;
	color: string;
	size: number;
	onToggle: (state: boolean) => void;
};
export default function Hamburger({ toggled, onToggle, size }: HamburgerProps) {
	const [key, setKey] = useState(Math.random());
	const [init, setInit] = useState(false);
	const handleClick = (e) => {
		setInit(true);
		onToggle(!toggled);
		setKey(Math.random());
		e.stopPropagation();
	};

	return (
		<div className={cn(s.hamburger, toggled && s.open)} onClick={handleClick}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	);
}
