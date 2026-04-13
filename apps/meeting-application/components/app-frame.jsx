'use client';

import { AppShell, Burger, Button, Group, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendarEvent, IconMessages } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Overview', icon: IconCalendarEvent },
  { href: '/discuss', label: 'Discuss', icon: IconMessages },
];

export function AppFrame({ children }) {
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 84 }}
      navbar={{
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
        width: 280,
      }}
      padding="md"
    >
      <AppShell.Header className="shellHeader">
        <Group h="100%" justify="space-between" px="lg">
          <Group gap="md">
            <Burger
              aria-label="Open navigation"
              hiddenFrom="sm"
              onClick={toggle}
              opened={opened}
              size="sm"
            />
            <div>
              <Text className="brandMark">Meeting Hub</Text>
            </div>
          </Group>
          <Group gap="xs" visibleFrom="sm">
            {links.map(({ href, label }) => (
              <Button
                className="navButton"
                component={Link}
                href={href}
                key={href}
                size="md"
                variant={pathname === href ? 'filled' : 'subtle'}
              >
                {label}
              </Button>
            ))}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className="shellNavbar" p="md">
        <Group align="stretch" gap="sm" style={{ flexDirection: 'column' }}>
          {links.map(({ href, icon: Icon, label }) => (
            <Button
              className="navButton"
              component={Link}
              href={href}
              justify="flex-start"
              key={href}
              leftSection={<Icon style={{ width: rem(18), height: rem(18) }} />}
              onClick={close}
              radius="xl"
              size="md"
              variant={pathname === href ? 'filled' : 'light'}
            >
              {label}
            </Button>
          ))}
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
