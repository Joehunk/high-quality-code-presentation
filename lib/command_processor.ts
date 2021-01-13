export interface Result {
  output: string;
  shouldExit: boolean;
}

export interface CommandProcessor {
  processCommand(commandLine: string): Promise<Result>;
}

export function createCommandProcessor(): CommandProcessor {
  return {
    async processCommand(commandLine: string): Promise<Result> {
      return {
        output: `You typed: ${commandLine}\n`,
        shouldExit: true,
      };
    },
  };
}
