'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconMessageCircle2 } from '@tabler/icons-react';

export function DiscussionBoard({ meetings }) {
  const router = useRouter();
  const [meetingItems, setMeetingItems] = useState(meetings);
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? null);
  const [isPosting, setIsPosting] = useState(false);
  const selectedMeeting = meetingItems.find((meeting) => meeting.id === selectedMeetingId) ?? null;

  useEffect(() => {
    setMeetingItems(meetings);
    setSelectedMeetingId((currentId) => {
      if (currentId && meetings.some((meeting) => meeting.id === currentId)) {
        return currentId;
      }

      return meetings[0]?.id ?? null;
    });
  }, [meetings]);

  const form = useForm({
    initialValues: {
      author: '',
      message: '',
      sentiment: 'idea',
    },
    validate: {
      author: (value) => (value.trim().length < 2 ? 'Add your name.' : null),
      message: (value) =>
        value.trim().length < 6 ? 'Add a little more context to the comment.' : null,
    },
  });

  const totalComments = useMemo(
    () => meetingItems.reduce((count, meeting) => count + meeting.comments.length, 0),
    [meetingItems]
  );

  const submitComment = async (values) => {
    if (!selectedMeeting) {
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch(`/api/meetings/${selectedMeeting.id}/comments`, {
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        notifications.show({
          color: 'red',
          message: data.error ?? 'Unable to post the comment.',
          title: 'Comment failed',
          withCloseButton: true,
        });
        return;
      }

      setMeetingItems((currentMeetings) =>
        currentMeetings.map((meeting) => (meeting.id === data.meeting.id ? data.meeting : meeting))
      );

      notifications.show({
        color: 'teal',
        message: 'Discussion update posted and saved to MongoDB.',
        title: 'Comment posted',
        withCloseButton: true,
      });

      form.reset();
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" wrap="wrap">
        <div>
          <Text className="eyebrow">Discuss</Text>
          <Title order={1}>Feedback, decisions, and meeting follow-through</Title>
          <Text c="dimmed" mt="sm" maw={760}>
            Keep reactions and team feedback attached to the right session so decisions stay visible
            and every meeting ends with documented momentum.
          </Text>
        </div>
        <Button
          component={Link}
          href="/"
          leftSection={<IconArrowLeft size={16} />}
          radius="xl"
          variant="default"
        >
          Back to overview
        </Button>
      </Group>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card className="surfaceCard" padding="xl" radius="xl">
            <Group justify="space-between" mb="md">
              <div>
                <Title order={3}>Threads</Title>
                <Text c="dimmed" size="sm">
                  {totalComments} total comments across {meetingItems.length} meetings
                </Text>
              </div>
              <Badge color="cyan" radius="xl" variant="light">
                Live-ish board
              </Badge>
            </Group>
            <Stack gap="sm">
              {meetingItems.map((meeting) => (
                <Paper
                  className={
                    meeting.id === selectedMeetingId ? 'meetingCard selected' : 'meetingCard'
                  }
                  key={meeting.id}
                  onClick={() => setSelectedMeetingId(meeting.id)}
                  p="md"
                  radius="xl"
                >
                  <Group justify="space-between" mb={6}>
                    <Text fw={700}>{meeting.title}</Text>
                    <Badge color="gray" radius="xl" variant="light">
                      {meeting.comments.length}
                    </Badge>
                  </Group>
                  <Text c="dimmed" lineClamp={2} size="sm">
                    {meeting.summary}
                  </Text>
                  <Text c="dimmed" mt={8} size="xs">
                    {dayjs(meeting.startTime).format('MMM D · h:mm A')}
                  </Text>
                </Paper>
              ))}
              {meetingItems.length === 0 ? (
                <Text c="dimmed" size="sm">
                  Create a meeting first, then your discussion threads will appear here.
                </Text>
              ) : null}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card className="surfaceCard" padding="xl" radius="xl">
              {selectedMeeting ? (
                <Stack gap="md">
                  <Group justify="space-between" wrap="wrap">
                    <div>
                      <Text className="eyebrow">Current thread</Text>
                      <Title order={2}>{selectedMeeting.title}</Title>
                    </div>
                    <Badge color="cyan" radius="xl" size="lg" variant="light">
                      {selectedMeeting.comments.length} comments
                    </Badge>
                  </Group>
                  <Text c="dimmed">{selectedMeeting.summary}</Text>
                  <Group gap="xs">
                    {selectedMeeting.tags.map((tag) => (
                      <Badge color="dark" key={tag} radius="xl" variant="light">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                  <Stack gap="sm">
                    {selectedMeeting.comments.length > 0 ? (
                      selectedMeeting.comments
                        .slice()
                        .reverse()
                        .map((comment) => (
                          <Paper className="commentCard" key={comment.id} p="md" radius="xl">
                            <Group justify="space-between" mb={6}>
                              <div>
                                <Text fw={700}>{comment.author}</Text>
                                <Text c="dimmed" size="xs">
                                  {dayjs(comment.createdAt).format('MMM D, h:mm A')}
                                </Text>
                              </div>
                              <Badge color="cyan" radius="xl" variant="light">
                                {comment.sentiment}
                              </Badge>
                            </Group>
                            <Text c="dimmed" size="sm">
                              {comment.message}
                            </Text>
                          </Paper>
                        ))
                    ) : (
                      <Paper className="emptyState" p="lg" radius="xl">
                        <Text fw={600}>No discussion yet</Text>
                        <Text c="dimmed" size="sm">
                          Start the thread with context, a decision prompt, or open feedback
                          question.
                        </Text>
                      </Paper>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Paper className="emptyState" p="lg" radius="xl">
                  <Text fw={600}>
                    {meetingItems.length === 0 ? 'No meetings yet' : 'Select a meeting'}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {meetingItems.length === 0
                      ? 'Create your first meeting on the overview page and it will appear here automatically.'
                      : 'Select a meeting to open its discussion thread.'}
                  </Text>
                </Paper>
              )}
            </Card>

            <Card className="surfaceCard" padding="xl" radius="xl">
              <Group gap="sm" mb="md">
                <IconMessageCircle2 size={20} />
                <Title order={3}>Add a discussion update</Title>
              </Group>
              <form onSubmit={form.onSubmit(submitComment)}>
                <Stack gap="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Author"
                        placeholder="Your name"
                        {...form.getInputProps('author')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <SegmentedControl
                        data={[
                          { label: 'Idea', value: 'idea' },
                          { label: 'Support', value: 'support' },
                          { label: 'Decision', value: 'decision' },
                          { label: 'Risk', value: 'risk' },
                        ]}
                        fullWidth
                        radius="xl"
                        {...form.getInputProps('sentiment')}
                      />
                    </Grid.Col>
                  </Grid>
                  <Textarea
                    autosize
                    label="Message"
                    minRows={4}
                    placeholder="Capture a decision, concern, blocker, or follow-up so the team can react in context."
                    {...form.getInputProps('message')}
                  />
                  <Group justify="space-between" wrap="wrap">
                    <Text c="dimmed" size="sm">
                      Comments are tied to the selected meeting and persist in MongoDB.
                    </Text>
                    <Button
                      loading={isPosting}
                      loaderProps={{ type: 'dots' }}
                      radius="xl"
                      type="submit"
                    >
                      Post update
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
