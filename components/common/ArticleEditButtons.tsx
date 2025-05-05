'use client';

import s from './ArticleEditButtons.module.scss';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { publishCourse } from '@/lib/actions';
import { startTransition, useState } from 'react';

export type ArticleEditButtonsProps = {
	id: string;
	workshopId: string;
	pathname: string;
	status: string;
};

export default function ArticleEditButtons({
	id,
	pathname,
	status,
	workshopId,
}: ArticleEditButtonsProps) {
	const { data: session } = useSession();
	const editable = id && session?.user?.id === workshopId && pathname;
	const publishable = editable && status === 'updated';
	const [publishing, setPublishing] = useState(false);
	const [publishingError, setPublishingError] = useState<string | null>(null);

	return (
		<div className={s.editButtons}>
			<Link href={pathname}>
				<button>Redigera</button>
			</Link>
			<button
				disabled={!publishable || publishing}
				onClick={() => {
					setPublishing(true);
					setPublishingError(null);
					startTransition(() => {
						publishCourse(id as string)
							.catch((e) => setPublishingError(e.message))
							.finally(() => setPublishing(false));
					});
				}}
			>
				{publishing ? 'Publicerar...' : 'Publicera'}
			</button>
			{publishingError && <p className={s.error}>{publishingError}</p>}
		</div>
	);
}
