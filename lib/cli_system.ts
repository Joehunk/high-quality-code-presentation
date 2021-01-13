import { CommandProcessor, createCommandProcessor } from "./command_processor";
import { createInputProcessorFromIO, InputProcessor } from "./input";

export interface CliSystem {
  input: InputProcessor;
  commandProcessor: CommandProcessor;
}

export function createDefaultCliSystem(): CliSystem {
  return {
    input: createInputProcessorFromIO({
      input: process.stdin,
      output: process.stdout,
    }),
    commandProcessor: createCommandProcessor({
      output: process.stdout,
    }),
  };
}
