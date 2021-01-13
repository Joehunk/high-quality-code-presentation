import { CommandProcessor, createCommandProcessor } from "./command_processor";
import { createInputProcessor, InputProcessor } from "./input";
import { createOutput, Output } from "./output";

export interface CliSystem {
  input: InputProcessor;
  commandProcessor: CommandProcessor;
  prompt?: string;
  output: Output;
}

export interface CreateCliSystemOptions {
  prompt?: string;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
}

export function createCliSystem(options?: CreateCliSystemOptions): CliSystem {
  // Notice how you can use the "?." operator (sometimes called the "Elvis operator")
  // in combination with "||" to allow defaults for options.
  return {
    input: createInputProcessor(options?.input || process.stdin),
    commandProcessor: createCommandProcessor(),
    output: createOutput({
      output: options?.output || process.stdout,
      prompt: options?.prompt,
    }),
  };
}
