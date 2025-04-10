'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import s from './Bubbles.module.scss';
import cn from 'classnames';
import { usePathname } from 'next/navigation';
import { useInViewRef } from 'rooks';

export type BubblesProps = {
	sounds: AllSoundsQuery['allSounds'];
};

const bubbleSize = 36;
const bubbleScale = 2;
const bubbleSizeScaled = bubbleSize * bubbleScale;

export default function Bubbles({ sounds }: BubblesProps) {
	const pathname = usePathname();
	const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
	const [bubbles, setBubbles] = useState(
		sounds.map((sound, i) => ({
			id: `audio-bubble-${i}`,
			file: sound.file,
			text: sound.text,
			position: {
				left: 0,
				top: 0,
			},
			index: i,
		}))
	);
	const [ref, inView] = useInViewRef();

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!dimensions || !inView) return;

		const { items } = generatePositions(1000, dimensions, bubbleSize * bubbleScale);

		setBubbles(
			bubbles.map((b, i) => ({
				...b,
				position: {
					left: items.find(({ id }) => id === b.id).left,
					top: items.find(({ id }) => id === b.id).top,
				},
			}))
		);
	}, [inView, dimensions, pathname]);

	return (
		<div className={s.bubbles} ref={ref}>
			{bubbles.map(({ id, file, text, position, index }, i) => (
				<Bubble
					key={`${id}-${inView}`}
					id={id}
					index={index}
					file={file as FileField}
					text={text}
					position={position}
				/>
			))}
		</div>
	);
}

function Bubble({
	id,
	file,
	text,
	position,
	index,
}: {
	id: string;
	file: FileField;
	text: string;
	position: { left: number; top: number };
	index: number;
}) {
	const audio = useRef<HTMLAudioElement>(null);
	const [hover, setHover] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [bubbleStyle, setBubbleStyle] = useState<any | null>(null);

	function handleClick() {
		if (!audio.current) return;
		const allSounds = document.querySelectorAll<HTMLDivElement>(
			`[id^='audio-bubble-']:not([id='${id}'])`
		);
		allSounds.forEach((el) => {
			const a = el.querySelector<HTMLAudioElement>('audio');
			a.pause();
		});

		audio.current.paused ? audio.current.play() : audio.current.pause();
	}

	useEffect(() => {
		if (!audio.current) return;
		const a = audio.current;
		const handlePlaying = () => setPlaying(true);
		const handleEnded = () => {
			setPlaying(false);
			setHover(false);
		};
		const handlePause = () => {
			setPlaying(false);
			setHover(false);
		};

		a.addEventListener('ended', handleEnded);
		a.addEventListener('playing', handlePlaying);
		a.addEventListener('pause', handlePause);
		return () => {
			a.removeEventListener('ended', handleEnded);
			a.removeEventListener('playing', handlePlaying);
			a.removeEventListener('pause', handlePause);
		};
	}, [hover]);

	useEffect(() => {
		setBubbleStyle({
			'--size': bubbleSizeScaled,
			'--scale': bubbleScale,
			width: bubbleSizeScaled,
			height: bubbleSizeScaled,
			left: position.left,
			top: position.top,
			animationDelay: `${Math.random() * 1}s`,
		});
	}, [position]);

	return (
		<div
			id={id}
			className={cn(s.bubble, hover && s.hover)}
			onClick={handleClick}
			style={bubbleStyle}
		>
			<svg
				className={s.image}
				width={bubbleSizeScaled}
				height={bubbleSizeScaled}
				fill='none'
				transform={index % 2 === 0 ? `rotate(90)` : undefined}
				xmlns='http://www.w3.org/2000/svg'
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => !playing && setHover(false)}
			>
				<path
					d='M25.8056 33.1282L25.518 33.035L25.2461 33.1673C22.9833 34.2691 20.4579 34.9021 17.7668 34.9021C8.32833 34.9021 0.75 27.3021 0.75 17.8261C0.75 8.35002 8.32833 0.75 17.7668 0.75C27.2052 0.75 34.7835 8.35002 34.7835 17.8261C34.7835 22.5833 32.8883 26.8502 29.7986 29.9336L29.5271 30.2046L29.5879 30.5833L30.2264 34.5608L25.8056 33.1282Z'
					stroke='#FFFCE4'
					strokeWidth='1.5'
					//@ts-ignore
					transformOrigin='center'
					vectorEffect='non-scaling-stroke'
					transform={
						hover
							? `scale(${bubbleScale}) translate(${bubbleSize / 2} ${bubbleSize / 2})`
							: `scale(1) translate(${bubbleSize / 2} ${bubbleSize / 2})`
					}
				/>
			</svg>

			<div className={cn(s.icon, hover && s.show)}>
				<img src={!playing ? '/images/play.svg' : '/images/pause.svg'} alt='' />
			</div>
			<div className={s.text}>{text}</div>
			<audio ref={audio} src={file.url} controls={false} autoPlay={false} />
		</div>
	);
}

const generatePositions = (
	totalRetries = 0,
	dimensions: { width: number; height: number } = { width: 0, height: 0 },
	size = bubbleSize
) => {
	const elements = Array.prototype.slice.call(
		document.querySelectorAll<HTMLDivElement>(`[id^='audio-bubble-']`),
		0
	);
	const maxRetries = 10000;
	const symbolsPerPage = Math.floor(
		(Math.floor(dimensions.height / size) * Math.floor(dimensions.width / size)) / 2
	);
	const positions = { dimensions, items: [], totalHeight: 0 };
	const padding = 100;
	const minX = 0;
	const maxX = dimensions.width - bubbleSizeScaled - padding;
	const minY = 0;
	const maxY = dimensions.height - bubbleSizeScaled - padding;

	const isOverlapping = (area: { top: number; left: number; width: number; height: number }) => {
		for (let i = 0; i < positions.items.length; i++) {
			const checkArea = positions.items[i];
			const rect1VerticalReach = area.top + area.height;
			const rect1HorizontalReach = area.left + area.width;
			const rect2VerticalReach = checkArea.top + checkArea.height;
			const rect2HorizontalReach = checkArea.left + checkArea.width;

			if (
				checkArea.top < rect1VerticalReach &&
				area.top < rect2VerticalReach &&
				checkArea.left < rect1HorizontalReach &&
				area.left < rect2HorizontalReach
			)
				return true;
			else continue;
		}
		return false;
	};

	for (let i = 0, page = 0; i < elements.length; i++) {
		const el = elements[i];

		let randX = 0;
		let randY = 0;
		let retries = 0;
		let pageMargin = page * dimensions.height;

		let area: { id: string; left: number; top: number; width: number; height: number };

		do {
			randX = Math.round(minX + (maxX - minX) * (Math.random() % 1));
			randY = Math.round(
				minY + pageMargin + (maxY + pageMargin - (minY + pageMargin)) * Math.random()
			);
			area = {
				id: el.id,
				left: randX,
				top: randY,
				width: bubbleSizeScaled,
				height: bubbleSizeScaled,
			};
		} while (isOverlapping(area) && ++retries < maxRetries);

		if (retries >= maxRetries && totalRetries < 10000)
			return generatePositions(++totalRetries, dimensions, size);

		page = Math.floor((i + 1) / symbolsPerPage);

		positions.items.push(area);
		positions.totalHeight =
			positions.totalHeight < area.top + size ? area.top + size : positions.totalHeight;
	}
	if (totalRetries >= 10000) console.log('failed to randomly position');
	return positions;
};
