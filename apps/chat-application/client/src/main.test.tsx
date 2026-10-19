import { act, screen } from '@testing-library/react';
import ReactDOM from 'react-dom/client';

vi.mock('./services/socket', () => ({
  createChatSocket: () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    emitMessage: vi.fn(),
    emitTyping: vi.fn(),
    emitReset: vi.fn(),
    onConnect: () => vi.fn(),
    onDisconnect: () => vi.fn(),
    onMessage: () => vi.fn(),
    onTyping: () => vi.fn(),
    onReset: () => vi.fn(),
  }),
}));

it('mounts the application with both participant panels into the document root', async () => {
  const container = document.createElement('div');
  container.id = 'root';
  document.body.append(container);
  const createRoot = vi.spyOn(ReactDOM, 'createRoot');
  try {
    await act(async () => {
      await import('./main');
    });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Real-time chat');
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  } finally {
    act(() => createRoot.mock.results[0]?.value.unmount());
    createRoot.mockRestore();
    container.remove();
  }
});
