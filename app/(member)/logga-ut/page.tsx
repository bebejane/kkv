import s from './page.module.scss';
import Article from '@/components/common/Article';
import LogoutForm from './LogoutForm';
import { Metadata } from 'next';

export default async function Login() {
	return (
		<Article>
			<div className={s.form}>
				<LogoutForm />
			</div>
		</Article>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Logga in',
	} as Metadata;
}
