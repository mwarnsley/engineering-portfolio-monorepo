import { MeetingDashboard } from '../components/meeting-dashboard';
import { getDashboardData } from '../lib/meetings';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getDashboardData();

  return <MeetingDashboard {...data} />;
}
