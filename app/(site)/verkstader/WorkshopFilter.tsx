'use client';

import s from './WorkshopFilter.module.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IoListSharp } from 'react-icons/io5';
import { RiMapPin5Line } from 'react-icons/ri';

export default function WorkshopFilter() {
	const searchParams = useSearchParams();
	const filter = searchParams.get('filter') ?? 'map';

	return (
		<div className={s.filter}>
			<span>Visar som {filter === 'map' ? 'karta' : 'lista'}</span>
			<Link href='?filter=list' prefetch={true}>
				<button data-selected={filter === 'list'} data-type='icon'>
					<IoListSharp />
				</button>
			</Link>
			<Link href='?filter=map' prefetch={true}>
				<button data-selected={filter === 'map'} data-type='icon'>
					<RiMapPin5Line />
				</button>
			</Link>
		</div>
	);
}
