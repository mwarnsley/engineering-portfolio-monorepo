'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconCalendarPlus,
  IconClockHour4,
  IconDeviceDesktopAnalytics,
  IconEdit,
  IconMessageCircle,
  IconPlus,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('./meeting-calendar').then((mod) => mod.MeetingCalendar), {
  ssr: false,
});

const createDefaultValues = () => {
  const startTime = dayjs().minute(0).second(0).millisecond(0).add(1, 'hour');

  return {
    actionItems: [],
    agenda: '',
    attendees: [],
    endTime: startTime.add(1, 'hour').toDate(),
    location: 'Zoom Room',
    mode: 'remote',
    ownerName: '',
    startTime: startTime.toDate(),
    status: 'scheduled',
    summary: '',
    tags: [],
    title: '',
    virtualLink: '',
  };
};

const emptyValues = {
  actionItems: [],
  agenda: '',
  attendees: [],
  endTime: null,
  location: 'Zoom Room',
  mode: 'remote',
  ownerName: '',
  startTime: null,
  status: 'scheduled',
  summary: '',
  tags: [],
  title: '',
  virtualLink: '',
};

const statusColor = {
  cancelled: 'red',
  completed: 'teal',
  'in-progress': 'grape',
  scheduled: 'cyan',
};

export function MeetingDashboard({ error, meetings, metrics }) {
  const router = useRouter();
  const [meetingItems, setMeetingItems] = useState(meetings);
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? null);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [mode, setMode] = useState('form');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
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

  useEffect(() => {
    if (!editingMeetingId) {
      form.setValues(createDefaultValues());
    }
  }, [editingMeetingId]);

  const form = useForm({
    initialValues: emptyValues,
    validate: {
      endTime: (value, values) =>
        !value
          ? 'Choose an end time.'
          : dayjs(value).isBefore(values.startTime)
            ? 'End time must be after the start time.'
            : null,
      ownerName: (value) => (value.trim().length < 2 ? 'Add a host or owner name.' : null),
      startTime: (value) => (!value ? 'Choose a start time.' : null),
      summary: (value) =>
        value.trim().length < 12 ? 'Write a short summary of the meeting purpose.' : null,
      title: (value) =>
        value.trim().length < 4 ? 'Give the meeting a more descriptive title.' : null,
    },
  });

  const stats = useMemo(
    () => [
      {
        icon: IconCalendarPlus,
        label: 'Total meetings',
        value: metrics.totalMeetings,
      },
      {
        icon: IconClockHour4,
        label: 'Upcoming',
        value: metrics.upcomingCount,
      },
      {
        icon: IconUsers,
        label: 'This week',
        value: metrics.thisWeekCount,
      },
      {
        icon: IconDeviceDesktopAnalytics,
        label: 'Active threads',
        value: metrics.activeDiscussions,
      },
    ],
    [metrics]
  );

  const resetComposer = () => {
    setEditingMeetingId(null);
    form.setValues(createDefaultValues());
  };

  const loadMeetingIntoForm = (meetingId) => {
    const meeting = meetingItems.find((item) => item.id === meetingId);

    if (!meeting) {
      return;
    }

    setEditingMeetingId(meeting.id);
    setSelectedMeetingId(meeting.id);
    setMode('form');
    form.setValues({
      actionItems: meeting.actionItems,
      agenda: meeting.agenda,
      attendees: meeting.attendees,
      endTime: new Date(meeting.endTime),
      location: meeting.location,
      mode: meeting.mode,
      ownerName: meeting.ownerName,
      startTime: new Date(meeting.startTime),
      status: meeting.status,
      summary: meeting.summary,
      tags: meeting.tags,
      title: meeting.title,
      virtualLink: meeting.virtualLink,
    });
  };

  const submitMeeting = async (values) => {
    setIsSaving(true);

    try {
      const payload = {
        ...values,
        endTime: values.endTime.toISOString(),
        startTime: values.startTime.toISOString(),
      };

      const response = await fetch(
        editingMeetingId ? `/api/meetings/${editingMeetingId}` : '/api/meetings',
        {
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
          method: editingMeetingId ? 'PUT' : 'POST',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to save the meeting.');
      }

      const savedMeeting = data.meeting;

      setMeetingItems((currentMeetings) => {
        if (editingMeetingId) {
          return currentMeetings.map((meeting) =>
            meeting.id === savedMeeting.id ? savedMeeting : meeting
          );
        }

        return [...currentMeetings, savedMeeting].sort(
          (left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime()
        );
      });

      setSelectedMeetingId(savedMeeting.id);

      notifications.show({
        color: 'teal',
        message: editingMeetingId
          ? 'Meeting updated and synced to MongoDB.'
          : 'Meeting created and added to the shared schedule.',
        title: editingMeetingId ? 'Meeting updated' : 'Meeting created',
        withCloseButton: true,
      });

      resetComposer();
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      notifications.show({
        color: 'red',
        message: error.message ?? 'Unable to save the meeting.',
        title: 'Save failed',
        withCloseButton: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMeeting = async (meetingId) => {
    setIsDeletingId(meetingId);

    const response = await fetch(`/api/meetings/${meetingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      notifications.show({
        color: 'red',
        message: data.error ?? 'Unable to delete the meeting.',
        title: 'Delete failed',
        withCloseButton: true,
      });
      setIsDeletingId(null);
      return;
    }

    const remainingMeetings = meetingItems.filter((meeting) => meeting.id !== meetingId);
    setMeetingItems(remainingMeetings);

    notifications.show({
      color: 'teal',
      message: 'The meeting and its discussion thread were removed.',
      title: 'Meeting deleted',
      withCloseButton: true,
    });

    if (selectedMeetingId === meetingId) {
      setSelectedMeetingId(remainingMeetings[0]?.id ?? null);
    }

    if (editingMeetingId === meetingId) {
      resetComposer();
    }

    setIsDeletingId(null);

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Stack gap="xl">
      <Paper className="heroPanel" p="xl" radius="xl">
        <Grid align="end" gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Text className="eyebrow">Centralized Meeting Management</Text>
            <Title order={1} size="3.5rem">
              Plan the room, capture the signal, keep the team aligned.
            </Title>
            <Text c="dimmed" maw={720} mt="md" size="lg">
              Build a reliable meeting rhythm with one place for scheduling, discussion, decisions,
              action items, and feedback across every session.
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <SimpleGrid cols={{ base: 2, sm: 4, md: 2 }}>
              {stats.map((stat) => (
                <Card className="statCard" key={stat.label} padding="lg" radius="xl">
                  <ThemeIcon color="cyan" radius="xl" size={44} variant="light">
                    <stat.icon size={22} />
                  </ThemeIcon>
                  <Text className="statValue">{stat.value}</Text>
                  <Text c="dimmed" size="sm">
                    {stat.label}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Paper>

      {error ? (
        <Alert
          color="red"
          icon={<IconAlertCircle size={18} />}
          radius="xl"
          title="MongoDB connection issue"
          variant="light"
        >
          {error}
        </Alert>
      ) : null}

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Stack gap="lg">
            <Group justify="space-between" wrap="wrap">
              <div>
                <Title order={2}>Plan a meeting</Title>
                <Text c="dimmed" mt={4}>
                  Toggle between a flexible form builder and a calendar-first planner.
                </Text>
              </div>
              <SegmentedControl
                data={[
                  { label: 'Form composer', value: 'form' },
                  { label: 'Calendar planner', value: 'calendar' },
                ]}
                onChange={setMode}
                radius="xl"
                value={mode}
              />
            </Group>

            {mode === 'form' ? (
              <Card className="surfaceCard" padding="xl" radius="xl">
                <form onSubmit={form.onSubmit(submitMeeting)}>
                  <Stack gap="md">
                    <Group justify="space-between">
                      <div>
                        <Title order={3}>
                          {editingMeetingId ? 'Edit meeting' : 'Create meeting'}
                        </Title>
                        <Text c="dimmed" size="sm">
                          Keep the team focused with a crisp brief, timing, and clear next steps.
                        </Text>
                      </div>
                      <Group gap="xs">
                        {editingMeetingId ? (
                          <Button onClick={resetComposer} radius="xl" variant="default">
                            Reset
                          </Button>
                        ) : null}
                        <Button
                          leftSection={<IconPlus size={16} />}
                          loading={isSaving}
                          loaderProps={{ type: 'dots' }}
                          radius="xl"
                          type="submit"
                        >
                          {editingMeetingId ? 'Save changes' : 'Create meeting'}
                        </Button>
                      </Group>
                    </Group>
                    <TextInput
                      label="Meeting title"
                      placeholder="Quarterly roadmap alignment"
                      {...form.getInputProps('title')}
                    />
                    <Textarea
                      autosize
                      label="Summary"
                      minRows={3}
                      placeholder="What should everyone understand or decide by the end of this session?"
                      {...form.getInputProps('summary')}
                    />
                    <Textarea
                      autosize
                      label="Agenda"
                      minRows={3}
                      placeholder="1. Wins and blockers&#10;2. Decision review&#10;3. Next milestones"
                      {...form.getInputProps('agenda')}
                    />
                    <Grid>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Meeting owner"
                          placeholder="Marcus"
                          {...form.getInputProps('ownerName')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Select
                          data={[
                            { label: 'Scheduled', value: 'scheduled' },
                            { label: 'In progress', value: 'in-progress' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Cancelled', value: 'cancelled' },
                          ]}
                          label="Status"
                          {...form.getInputProps('status')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <DateTimePicker
                          label="Start time"
                          valueFormat="MMM D, YYYY h:mm A"
                          {...form.getInputProps('startTime')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <DateTimePicker
                          label="End time"
                          valueFormat="MMM D, YYYY h:mm A"
                          {...form.getInputProps('endTime')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Select
                          data={[
                            { label: 'Remote', value: 'remote' },
                            { label: 'Hybrid', value: 'hybrid' },
                            { label: 'In person', value: 'in-person' },
                          ]}
                          label="Mode"
                          {...form.getInputProps('mode')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Location"
                          placeholder="Studio A or Zoom"
                          {...form.getInputProps('location')}
                        />
                      </Grid.Col>
                    </Grid>
                    <TextInput
                      label="Virtual link"
                      placeholder="https://meet.google.com/..."
                      {...form.getInputProps('virtualLink')}
                    />
                    <TagsInput
                      label="Attendees"
                      placeholder="Add people and press Enter"
                      {...form.getInputProps('attendees')}
                    />
                    <TagsInput
                      label="Tags"
                      placeholder="Ops, roadmap, retrospective"
                      {...form.getInputProps('tags')}
                    />
                    <TagsInput
                      label="Action items"
                      placeholder="Document decisions, share recap, confirm owners"
                      {...form.getInputProps('actionItems')}
                    />
                  </Stack>
                </form>
              </Card>
            ) : (
              <Card className="surfaceCard" padding="lg" radius="xl">
                <Group justify="space-between" mb="md" wrap="wrap">
                  <div>
                    <Title order={3}>Calendar planner</Title>
                    <Text c="dimmed" size="sm">
                      Click a meeting to edit it, or drag across a time range to prefill the form.
                    </Text>
                  </div>
                  <Button onClick={() => setMode('form')} radius="xl" variant="default">
                    Back to form
                  </Button>
                </Group>
                <Calendar
                  meetings={meetingItems}
                  onSelectMeeting={loadMeetingIntoForm}
                  onSelectTimeRange={(selection) => {
                    form.setFieldValue('startTime', new Date(selection.start));
                    form.setFieldValue('endTime', new Date(selection.end));
                    setMode('form');
                    notifications.show({
                      color: 'cyan',
                      message: 'Time block captured. Finish the rest in the form composer.',
                      title: 'Calendar slot selected',
                    });
                  }}
                />
              </Card>
            )}
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack gap="lg">
            <Card className="surfaceCard" padding="xl" radius="xl">
              <Group justify="space-between" mb="md">
                <div>
                  <Title order={3}>Meeting pipeline</Title>
                  <Text c="dimmed" size="sm">
                    Review upcoming work, decisions, and discussion activity.
                  </Text>
                </div>
                <Badge color="cyan" radius="xl" size="lg" variant="light">
                  {meetingItems.length} scheduled
                </Badge>
              </Group>
              <Stack gap="sm">
                {meetingItems.length === 0 ? (
                  <Paper className="emptyState" p="lg" radius="xl">
                    <Text fw={600}>No meetings yet</Text>
                    <Text c="dimmed" size="sm">
                      Create your first meeting to start building a searchable schedule and
                      discussion record.
                    </Text>
                  </Paper>
                ) : (
                  meetingItems.map((meeting) => (
                    <Card
                      className={
                        meeting.id === selectedMeetingId ? 'meetingCard selected' : 'meetingCard'
                      }
                      key={meeting.id}
                      onClick={() => setSelectedMeetingId(meeting.id)}
                      padding="md"
                      radius="xl"
                      withBorder
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <div>
                          <Group gap="xs" mb={6}>
                            <Badge color={statusColor[meeting.status]} radius="xl" variant="light">
                              {meeting.status}
                            </Badge>
                            <Badge color="dark" radius="xl" variant="dot">
                              {meeting.mode}
                            </Badge>
                          </Group>
                          <Text fw={700}>{meeting.title}</Text>
                          <Text c="dimmed" lineClamp={2} size="sm">
                            {meeting.summary}
                          </Text>
                          <Text c="dimmed" mt={8} size="xs">
                            {dayjs(meeting.startTime).format('ddd, MMM D · h:mm A')} to{' '}
                            {dayjs(meeting.endTime).format('h:mm A')}
                          </Text>
                        </div>
                        <Group gap={6}>
                          <ActionIcon
                            aria-label={`Edit ${meeting.title}`}
                            color="cyan"
                            onClick={(event) => {
                              event.stopPropagation();
                              loadMeetingIntoForm(meeting.id);
                            }}
                            radius="xl"
                            variant="light"
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                          <ActionIcon
                            aria-label={`Delete ${meeting.title}`}
                            color="red"
                            loading={isDeletingId === meeting.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteMeeting(meeting.id);
                            }}
                            radius="xl"
                            variant="light"
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Card>
                  ))
                )}
              </Stack>
            </Card>

            <Card className="surfaceCard" padding="xl" radius="xl">
              {selectedMeeting ? (
                <Stack gap="md">
                  <Group justify="space-between" wrap="wrap">
                    <div>
                      <Text className="eyebrow">Selected meeting</Text>
                      <Title order={3}>{selectedMeeting.title}</Title>
                    </div>
                    <Button
                      component={Link}
                      href={`/meetings/${selectedMeeting.id}`}
                      radius="xl"
                      variant="light"
                    >
                      Open detail page
                    </Button>
                  </Group>
                  <Text c="dimmed">{selectedMeeting.summary}</Text>
                  <Divider />
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <div>
                      <Text className="metaLabel">Owner</Text>
                      <Text fw={600}>{selectedMeeting.ownerName}</Text>
                    </div>
                    <div>
                      <Text className="metaLabel">Location</Text>
                      <Text fw={600}>{selectedMeeting.location}</Text>
                    </div>
                    <div>
                      <Text className="metaLabel">Start</Text>
                      <Text fw={600}>
                        {dayjs(selectedMeeting.startTime).format('MMM D, h:mm A')}
                      </Text>
                    </div>
                    <div>
                      <Text className="metaLabel">Attendees</Text>
                      <Text fw={600}>{selectedMeeting.attendees.join(', ') || 'None yet'}</Text>
                    </div>
                  </SimpleGrid>
                  <div>
                    <Text className="metaLabel">Action items</Text>
                    <Stack gap={8} mt="xs">
                      {selectedMeeting.actionItems.length > 0 ? (
                        selectedMeeting.actionItems.map((item) => (
                          <Paper className="listItem" key={item} p="sm" radius="lg">
                            <Text size="sm">{item}</Text>
                          </Paper>
                        ))
                      ) : (
                        <Text c="dimmed" size="sm">
                          No action items attached yet.
                        </Text>
                      )}
                    </Stack>
                  </div>
                  <div>
                    <Group justify="space-between">
                      <Text className="metaLabel">Discussion preview</Text>
                      <Button
                        component={Link}
                        href="/discuss"
                        leftSection={<IconMessageCircle size={16} />}
                        radius="xl"
                        variant="subtle"
                      >
                        Open discuss board
                      </Button>
                    </Group>
                    <Stack gap="sm" mt="xs">
                      {selectedMeeting.comments.slice(-3).map((comment) => (
                        <Paper className="commentCard" key={comment.id} p="sm" radius="lg">
                          <Group justify="space-between" mb={4}>
                            <Text fw={700} size="sm">
                              {comment.author}
                            </Text>
                            <Badge color="gray" radius="xl" variant="light">
                              {comment.sentiment}
                            </Badge>
                          </Group>
                          <Text c="dimmed" size="sm">
                            {comment.message}
                          </Text>
                        </Paper>
                      ))}
                      {selectedMeeting.comments.length === 0 ? (
                        <Text c="dimmed" size="sm">
                          No comments yet. Use the discuss board to capture reactions and decisions.
                        </Text>
                      ) : null}
                    </Stack>
                  </div>
                </Stack>
              ) : (
                <Stack gap="sm">
                  <Title order={3}>Meeting detail</Title>
                  <Text c="dimmed" size="sm">
                    Pick a meeting from the list to review logistics, action items, and the current
                    discussion.
                  </Text>
                </Stack>
              )}
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
