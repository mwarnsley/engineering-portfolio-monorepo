import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from '../../app/layout';

jest.mock('../../components/providers', () => ({
  AppProviders: ({ children }) => <div data-provider="app">{children}</div>,
}));
jest.mock('../../components/app-frame', () => ({
  AppFrame: ({ children }) => <main>{children}</main>,
}));

it('renders an English document with the light theme and nested application content', () => {
  const html = renderToStaticMarkup(
    <RootLayout>
      <h1>Meeting content</h1>
    </RootLayout>
  );
  expect(html).toContain('<html data-mantine-color-scheme="light" lang="en">');
  expect(html).toContain(
    '<body><div data-provider="app"><main><h1>Meeting content</h1></main></div></body>'
  );
  expect(metadata).toMatchObject({
    title: 'Meeting Hub',
    description: expect.stringContaining('meeting management'),
  });
});
