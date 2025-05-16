'use client';

import s from './LoginForm.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSignin = async (e) => {
		e.preventDefault();

		const url = new URLSearchParams(window.location.search).get('callbackUrl');
		const callbackUrl = url ?? '/medlem';
		const formData = new FormData(e.target);
		console.log(url);
		try {
			setError(null);
			setLoading(true);
			console.log(callbackUrl);

			const res = await signIn('credentials', {
				callbackUrl,
				username: formData.get('email'),
				password: formData.get('password'),
			});

			if (res?.error) setError('Felaktigt användarnamn eller lösenord');
		} catch (error) {
			setError(`Något gick fel, försök igen. ${error}`);
		} finally {
			setTimeout(() => setLoading(false), 1000);
		}
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
				<button type='submit' disabled={loading}>
					{loading ? 'Loggar in...' : 'Logga in'}
				</button>
			</form>
			{error && <p className={s.error}>{error}</p>}
		</div>
	);
}
