'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export default function RootTemplate({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session;
}) {
	//const session = await getServerSession(authOptions);

	return <SessionProvider session={session}>{children}</SessionProvider>;
}
