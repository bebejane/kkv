'use client';

import s from './LoginForm.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
	const [error, setError] = useState<string | null>(null);

	const handleSignin = async (e) => {
		e.preventDefault();

		setError(null);

		const url = new URLSearchParams(window.location.search).get('callbackUrl');
		const callbackUrl = url?.endsWith('/medlem') ? undefined : url ?? '/medlem';
		const formData = new FormData(e.target);

		signIn('credentials', {
			callbackUrl,
			username: formData.get('email'),
			password: formData.get('password'),
		})
			.then((response) => {
				if (response?.error) setError('Felaktigt användarnamn eller lösenord');
			})
			.catch((error) => {
				setError(`Något gick fel, försök igen. ${error}`);
			});
	};

	useEffect(() => {
		const error = new URLSearchParams(window.location.search).get('error');
		if (error === 'CredentialsSignin') setError('Felaktigt användarnamn eller lösenord');
	}, []);

	return (
		<div className={cn('structured', 'grid')}>
			<form className={s.form} method='POST' onSubmit={handleSignin}>
				<input id='email' name='email' type='email' placeholder='E-post' autoComplete='username' />
				<input
					name='password'
					type='password'
					placeholder='Lösenord'
					autoComplete='current-password'
				/>
				<button type='submit'>Logga in</button>
			</form>
			{error && <p className={s.error}>{error}</p>}
		</div>
	);
}
