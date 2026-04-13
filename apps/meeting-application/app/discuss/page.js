import { DiscussionBoard } from '../../components/discussion-board';
import { getDashboardData } from '../../lib/meetings';

export const dynamic = 'force-dynamic';

export default async function DiscussPage() {
  const data = await getDashboardData();

  return <DiscussionBoard meetings={data.meetings} />;
}
