export interface Result {
  output: string;
  shouldExit: boolean;
}

export interface CommandProcessor {
  processCommand(commandLine: string): Promise<Result>;
}

// Deleted the options. We might need options later, but don't try to predict requirements
// or write code for requirements you are not considering yet. Remember "exercise the code"
// is a tenet of simple design. If you are not exercising the code it is almost surely
// not the right code.

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
