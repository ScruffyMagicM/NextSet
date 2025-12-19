import getFestival from '@/supabase/actions/server/festival/getFestival';
import FestivalWrapper from './festivalwrapper';

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ festivalId: string }> }) {
  const festival = await getFestival(parseInt((await params).festivalId));

  return <FestivalWrapper festival={festival}>{children}</FestivalWrapper>;
}