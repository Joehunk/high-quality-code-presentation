import { CommandProcessor, createCommandProcessor } from "./command_processor";
import { createInputProcessor, InputProcessor } from "./input";
import { CommandOutput, createCommandOutput, createOutput, Output } from "./output";

export interface CliSystem {
  input: InputProcessor;
  commandProcessor: CommandProcessor;
  prompt?: string;
  output: CommandOutput;
}

export interface CreateCliSystemOptions {
  prompt?: string;
  input?: NodeJS.ReadableStream;
  output?: Output;
}

export function createCliSystem(options?: CreateCliSystemOptions): CliSystem {
  return {
    input: createInputProcessor(options?.input || process.stdin),
    commandProcessor: createCommandProcessor(),
    output: createCommandOutput({
      output: options?.output || createOutput({ outputStream: process.stdout }),
      prompt: options?.prompt,
    }),
  };
}
