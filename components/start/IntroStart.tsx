'use client';

import 'swiper/css';
import s from './IntroStart.module.scss';
import cn from 'classnames';
import React from 'react';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperCore } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { useInterval } from 'react-use';

SwiperCore.use([Autoplay]);

export type GalleryProps = {
	images: FileField[];
};

const headline = 'Centrum för sveriges konstnärsverkstäder';

export default function IntroStart({ images }: GalleryProps) {
	const [hideLogoText, setHideLogoText] = useState(false);
	const [index, setIndex] = useState(-1);
	const logoRef = useRef<HTMLImageElement>(null);
	const { scrolledPosition, viewportHeight } = useScrollInfo();

	useEffect(() => {
		if (!logoRef.current) return;
		const ratio = Math.max(0, Math.min(1, (scrolledPosition / viewportHeight) * 4));
		logoRef.current.style.clipPath = `inset(0 0 ${ratio * 100}% 0)`;
		setHideLogoText(scrolledPosition > 0);
	}, [scrolledPosition, viewportHeight]);

	useInterval(() => {
		setIndex((index) => (index === images.length - 1 ? -1 : index + 1));
	}, 4000);

	return (
		<div className={s.intro}>
			<div className={s.images}>
				{images.concat(images[0]).map((image, idx) => (
					<Image
						key={idx}
						data={image.responsiveImage}
						className={cn(s.imageWrap, index >= idx && s.hide)}
						imgClassName={s.image}
						style={{ zIndex: images.length + 1 - idx }}
					/>
				))}
			</div>
			<div className={s.logo}>
				<img src='/images/logo.svg' alt='Logo' ref={logoRef} />
				<h2>
					{headline.split('').map((c, i) => (
						<span
							key={i}
							className={cn(hideLogoText && s.hide)}
							style={{
								transitionDelay: !hideLogoText ? `${i * 10}ms` : `${(headline.length - i) * 10}ms`,
							}}
						>
							{c}
						</span>
					))}
				</h2>
			</div>
		</div>
	);
}
