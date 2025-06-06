'use client';

import s from './VideoExternal.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'rooks';
import Youtube from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';

export type VideoExternalProps = {
	data: VideoExternalRecord;
	editable?: boolean;
};

export default function VideoExternal({ data }: VideoExternalProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [height, setHeight] = useState(360);
	const { innerWidth, innerHeight } = useWindowSize();

	useEffect(() => {
		setHeight((ref.current?.clientWidth / 16) * 9);
	}, [innerWidth, innerHeight, data, ref]);

	if (!data || !data.video) return null;

	const { provider, providerUid } = data.video;
	const style = { height: `${height}px`, width: '100%' };

	return (
		<section className={s.video} ref={ref}>
			{provider === 'youtube' ? (
				<Youtube
					opts={{
						playerVars: {
							autoplay: false,
							controls: 0,
							rel: 0,
						},
					}}
					videoId={providerUid}
					className={s.player}
					style={style}
				/>
			) : provider === 'vimeo' ? (
				<Vimeo video={providerUid} className={s.player} style={style} />
			) : null}
		</section>
	);
}
