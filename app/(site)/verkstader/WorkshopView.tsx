'use client';

import s from './WorkshopView.module.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IoListSharp } from 'react-icons/io5';
import { RiMapPin5Line } from 'react-icons/ri';

export default function WorkshopView() {
	const searchParams = useSearchParams();
	const view = searchParams.get('view') ?? 'map';

	return (
		<div className={s.view}>
			<span className='small'>Visar som {view === 'map' ? 'karta' : 'lista'}</span>
			<Link href='?view=list' prefetch={true}>
				<button data-selected={view === 'list'} data-type='icon'>
					<IoListSharp />
				</button>
			</Link>
			<Link href='?view=map' prefetch={true}>
				<button data-selected={view === 'map'} data-type='icon'>
					<RiMapPin5Line />
				</button>
			</Link>
		</div>
	);
}
