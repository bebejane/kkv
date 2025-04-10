import { Menu } from '@/lib/menu';
import s from './Footer.module.scss';
import Link from 'next/link';
import { SupportDocument, AllSoundsDocument } from '../../graphql';
import { apiQuery } from 'next-dato-utils/api';

export default async function Footer({ menu }: { menu: Menu }) {
	//const { support } = await apiQuery<SupportQuery, SupportQueryVariables>(SupportDocument);
	//const { allSounds } = await apiQuery<AllSoundsQuery, AllSoundsQueryVariables>(AllSoundsDocument);

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
					<span className={s.text}>Copyright Point of You {new Date().getFullYear()}.</span>
					<span className={s.about}>
						Ett kurser av&nbsp;{' '}
						<a href='https://www.iffs.se/' target='new'>
							Institutet för Framtidsstudier
						</a>
						. &nbsp; &nbsp;
						<figure>
							<img src='/images/framtidsstudier.svg' alt='framtidsstudier' />
						</figure>
					</span>
				</div>
				{/* <Bubbles sounds={allSounds} /> */}
			</footer>
		</>
	);
}
