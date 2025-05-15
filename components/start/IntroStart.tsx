'use client';

import 'swiper/css';
import s from './IntroStart.module.scss';
import cn from 'classnames';
import React from 'react';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { useScrollInfo } from 'next-dato-utils/hooks';

export type GalleryProps = {
	images: FileField[];
};

export default function IntroStart({ images }: GalleryProps) {
	const swiperRef = useRef<SwiperType | undefined>();
	const [realIndex, setRealIndex] = useState(0);
	const [hideLogoText, setHideLogoText] = useState(false);
	const logoRef = useRef<HTMLImageElement>(null);
	const { scrolledPosition, viewportHeight } = useScrollInfo();

	useEffect(() => {
		if (!logoRef.current) return;
		const ratio = Math.max(0, Math.min(1, (scrolledPosition / viewportHeight) * 4));
		logoRef.current.style.clipPath = `inset(0 0 ${ratio * 100}% 0)`;
		setHideLogoText(scrolledPosition > 0);
	}, [scrolledPosition, viewportHeight]);

	return (
		<div className={s.intro}>
			<div className={s.images}>
				<Swiper
					id={`main-gallery`}
					loop={true}
					spaceBetween={0}
					slidesPerView={1}
					initialSlide={0}
					onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
					onClick={() => swiperRef.current?.slideNext()}
				>
					{images.map((image, idx) => (
						<SwiperSlide key={idx} className={cn(s.slide)}>
							<Image imgClassName={s.image} data={image.responsiveImage} usePlaceholder={false} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className={s.logo}>
				<img src='/images/logo.svg' alt='Logo' ref={logoRef} />
				<h2>
					{'Centrum för sveriges konstnärsverkstäder'.split('').map((c, i) => (
						<span
							key={i}
							className={cn(hideLogoText && s.hide)}
							style={{ transitionDelay: `${i * 10}ms` }}
						>
							{c}
						</span>
					))}
				</h2>
			</div>
		</div>
	);
}
