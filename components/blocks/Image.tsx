'use client';
import s from './Image.module.scss';
import React from 'react';
import { Image as DatoImage } from 'react-datocms';

export type ImageProps = {
	id: string;
	data: ImageRecord;
	onClick: Function;
	editable?: any;
};

export default function Image({ id, data: { image } }: ImageProps) {
	return (
		<figure className={s.image}>
			<DatoImage data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' />
			{image.title && <figcaption>{image.title}</figcaption>}
		</figure>
	);
}
