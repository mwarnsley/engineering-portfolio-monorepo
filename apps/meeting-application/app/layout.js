import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { AppProviders } from '../components/providers';
import { AppFrame } from '../components/app-frame';

export const metadata = {
  title: 'Meeting Hub',
  description:
    'A centralized meeting management platform for planning sessions, tracking discussion, and keeping teams aligned.',
};

export default function RootLayout({ children }) {
  return (
    <html data-mantine-color-scheme="light" lang="en">
      <body>
        <AppProviders>
          <AppFrame>{children}</AppFrame>
        </AppProviders>
      </body>
    </html>
  );
}
