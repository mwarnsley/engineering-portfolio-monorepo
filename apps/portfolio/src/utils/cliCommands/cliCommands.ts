import { YEARS_OF_EXPERIENCE_LABEL } from '@/data';

export const CLI_WELCOME_MESSAGE = 'Marcus Warnsley · portfolio CLI\nType "help" to list commands.';

export interface CliCommandResult {
  /** Text to append to the session, or `null` when nothing should be printed. */
  output: string | null;
  /** Whether the session history should be cleared. */
  clearHistory: boolean;
}

const COMMAND_OUTPUT: Readonly<Record<string, string>> = {
  help: [
    'Available commands:',
    '  whoami    Professional summary',
    '  skills    Core stack by category',
    '  contact   Contact channels',
    '  clear     Clear the session',
  ].join('\n'),
  whoami: [
    'Marcus Warnsley: Senior Front-End Engineer.',
    `${YEARS_OF_EXPERIENCE_LABEL} building scalable React and TypeScript architectures.`,
    'Specializing in high-performance UI and distributed systems.',
  ].join('\n'),
  skills: [
    'Core stack:',
    '  Frontend   React, Next.js, Redux, Tailwind',
    '  Language   TypeScript, ES6+, Rust',
    '  Mobile     React Native (iOS / Android)',
    '  Data       GraphQL, REST, PostgreSQL',
  ].join('\n'),
  contact: [
    'Email      marcus.warnsley@gmail.com',
    'Phone      (317) 605-4309',
    'LinkedIn   linkedin.com/in/marcus-warnsley-a7b42574',
    'GitHub     github.com/mwarnsley',
  ].join('\n'),
};

export const CLI_COMMAND_NAMES = [...Object.keys(COMMAND_OUTPUT), 'clear'] as const;

/**
 * Resolves a CLI command to its output using an O(1) lookup table.
 * @param {string} rawInput - The raw text typed by the user.
 * @returns {CliCommandResult} The output to print and whether to clear history.
 * @example
 * runCliCommand('  HELP '); // returns { output: 'Available commands: ...', clearHistory: false }
 * runCliCommand('clear');   // returns { output: null, clearHistory: true }
 */
export const runCliCommand = (rawInput: string): CliCommandResult => {
  const command = rawInput.trim().toLowerCase();

  if (!command) return { output: null, clearHistory: false };
  if (command === 'clear') return { output: null, clearHistory: true };

  const output = Object.hasOwn(COMMAND_OUTPUT, command)
    ? COMMAND_OUTPUT[command]
    : `Command not found: ${command}. Type "help" for available commands.`;

  return { output, clearHistory: false };
};
