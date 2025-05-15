import { Menu } from '@/lib/menu';
import s from './Footer.module.scss';
import Link from 'next/link';

export default async function Footer() {
	return (
		<>
			<footer className={s.footer}>Footer</footer>
		</>
	);
}
