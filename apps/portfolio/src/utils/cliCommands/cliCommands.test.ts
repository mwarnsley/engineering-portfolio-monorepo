import { describe, expect, it } from 'vitest';
import { CLI_COMMAND_NAMES, runCliCommand } from './cliCommands';

describe('runCliCommand', () => {
  it.each([
    ['help', 'Available commands:'],
    ['whoami', '10+ years'],
    ['skills', 'Core stack:'],
    ['contact', 'marcus.warnsley@gmail.com'],
  ])('should print output for "%s"', (command, expected) => {
    expect(runCliCommand(command).output).toContain(expected);
  });

  it.each(['  HELP ', 'Help', '\twhoami\n'])(
    'should normalize casing and whitespace for %j',
    (input) => {
      expect(runCliCommand(input).output).not.toContain('Command not found');
    }
  );

  it.each(['', '   '])('should return no output for blank input %j', (input) => {
    expect(runCliCommand(input)).toEqual({ output: null, clearHistory: false });
  });

  it('should request a history clear for "clear"', () => {
    expect(runCliCommand('clear')).toEqual({ output: null, clearHistory: true });
  });

  it.each(['matrix', 'toString', 'constructor', '__proto__'])(
    'should report unknown command %j without resolving prototype keys',
    (input) => {
      expect(runCliCommand(input).output).toBe(
        `Command not found: ${input.toLowerCase()}. Type "help" for available commands.`
      );
    }
  );

  it('should expose every supported command name', () => {
    expect([...CLI_COMMAND_NAMES].sort()).toEqual(['clear', 'contact', 'help', 'skills', 'whoami']);
  });
});
