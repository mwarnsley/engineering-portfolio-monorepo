import dayjs from 'dayjs';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconMessages } from '@tabler/icons-react';
import { getMeetingById } from '../../../lib/meetings';

export const dynamic = 'force-dynamic';

export default async function MeetingDetailPage({ params }) {
  const { id } = await params;
  const meeting = await getMeetingById(id);

  if (!meeting) {
    return (
      <Paper className="surfaceCard" p="xl" radius="xl">
        <Stack gap="sm">
          <Title order={2}>Meeting not found</Title>
          <Text c="dimmed">This meeting may have been deleted or the link is no longer valid.</Text>
          <Button component={Link} href="/" radius="xl" variant="default">
            Return to overview
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      <Group justify="space-between" wrap="wrap">
        <div>
          <Text className="eyebrow">Meeting detail</Text>
          <Title order={1}>{meeting.title}</Title>
          <Text c="dimmed" maw={720} mt="sm">
            {meeting.summary}
          </Text>
        </div>
        <Group>
          <Button
            component={Link}
            href="/"
            leftSection={<IconArrowLeft size={16} />}
            radius="xl"
            variant="default"
          >
            Overview
          </Button>
          <Button
            component={Link}
            href="/discuss"
            leftSection={<IconMessages size={16} />}
            radius="xl"
          >
            Open discuss board
          </Button>
        </Group>
      </Group>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card className="surfaceCard" padding="xl" radius="xl">
            <Stack gap="md">
              <Group gap="xs">
                <Badge color="cyan" radius="xl" variant="light">
                  {meeting.status}
                </Badge>
                <Badge color="dark" radius="xl" variant="light">
                  {meeting.mode}
                </Badge>
              </Group>
              <Text>{meeting.agenda || 'No agenda has been added yet.'}</Text>
              <Divider />
              <div>
                <Text className="metaLabel">Action items</Text>
                <Stack gap="sm" mt="sm">
                  {meeting.actionItems.length > 0 ? (
                    meeting.actionItems.map((item) => (
                      <Paper className="listItem" key={item} p="sm" radius="lg">
                        <Text size="sm">{item}</Text>
                      </Paper>
                    ))
                  ) : (
                    <Text c="dimmed" size="sm">
                      No action items recorded yet.
                    </Text>
                  )}
                </Stack>
              </div>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card className="surfaceCard" padding="xl" radius="xl">
            <Stack gap="md">
              <Title order={3}>Meeting snapshot</Title>
              <div>
                <Text className="metaLabel">Owner</Text>
                <Text fw={700}>{meeting.ownerName}</Text>
              </div>
              <div>
                <Text className="metaLabel">When</Text>
                <Text fw={700}>
                  {dayjs(meeting.startTime).format('MMM D, YYYY h:mm A')} to{' '}
                  {dayjs(meeting.endTime).format('h:mm A')}
                </Text>
              </div>
              <div>
                <Text className="metaLabel">Location</Text>
                <Text fw={700}>{meeting.location}</Text>
              </div>
              <div>
                <Text className="metaLabel">Attendees</Text>
                <Text fw={700}>{meeting.attendees.join(', ') || 'None added yet'}</Text>
              </div>
              <div>
                <Text className="metaLabel">Discussion volume</Text>
                <Text fw={700}>{meeting.comments.length} comments logged</Text>
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
