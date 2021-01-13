export interface Result {
  shouldExit: boolean;
}

export interface CommandProcessor {
  // Let's go ahead and make this a promise now. TS makes this easier than some
  // languages because you can await anything and if it's not a Promise it is
  // a no-op. In some languages like C# you have to know ahead of time if you
  // need a Promise (C# calls it a Task) and it is expensive to change.
  processCommand(commandLine: string): Promise<Result>;
}

export interface CreateCommandProcessorOptions {
  output: NodeJS.WritableStream;
}

export function createCommandProcessor(options: CreateCommandProcessorOptions): CommandProcessor {
  return {
    async processCommand(commandLine: string): Promise<Result> {
      options.output.write(`You typed: ${commandLine}\n`);
      return { shouldExit: true };
    },
  };
}
