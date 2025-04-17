import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/(member)/api/auth/[...nextauth]/route';

export const getSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};
