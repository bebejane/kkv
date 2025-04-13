import { Menu } from '@/lib/menu';
import s from './Footer.module.scss';
import Link from 'next/link';

export default async function Footer({ menu }: { menu: Menu }) {
	return (
		<>
			<footer className={s.footer}>
				<nav>
					<ul>
						{menu.map(({ id, title, sub }) => (
							<li key={id}>
								<div>{title}</div>
								{sub && (
									<ul>
										{sub.map(({ id, title, slug, href }) => (
											<li key={id}>
												<Link href={slug ?? href}>{title}</Link>
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</nav>

				<div className={s.copyright}>
					<span className={s.text}>Copyright KKV {new Date().getFullYear()}.</span>
					<span className={s.about}>
						Ett kurser av&nbsp;{' '}
						<a href='https://www.iffs.se/' target='new'>
							blah blah
						</a>
						. &nbsp; &nbsp;
						<figure>{/* <img src='/images/logo.svg' alt='Logo' /> */}</figure>
					</span>
				</div>
				{/* <Bubbles sounds={allSounds} /> */}
			</footer>
		</>
	);
}
