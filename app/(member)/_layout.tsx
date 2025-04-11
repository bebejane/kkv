'use server';

import { default as RootLayout, LayoutProps, generateMetadata as gMetaData } from '../root-layout';

export default async function Layout({ children }: LayoutProps) {
	return <RootLayout>{children}</RootLayout>;
}

export async function generateMetadata() {
	return gMetaData();
}
