import s from './layout.module.scss';

export type LayoutProps = {
	children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
	return <article className={s.memberLayout}>{children}</article>;
}
