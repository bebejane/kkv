'use client';

import s from './LogoutForm.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { signIn, signOut } from 'next-auth/react';

export default function LogoutForm() {
	useEffect(() => {
		signOut({ callbackUrl: '/' });
	}, []);

	return (
		<div className={cn('structured', 'grid')}>
			<div>Loggar ut...</div>
		</div>
	);
}
