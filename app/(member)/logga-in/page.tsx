'use server';

import s from './page.module.scss';
import Article from '@/components/common/Article';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export default async function Login() {
	return (
		<Article>
			<h1>Logga in</h1>
			<p className="intro">Här kan du som medlemsverkstad logga in och administrera dina uppgifter och kurser.</p>
			<div className={s.form}>
				<LoginForm />
			</div>
		</Article>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Logga in',
	} as Metadata;
}
