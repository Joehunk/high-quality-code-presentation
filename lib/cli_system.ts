import { CommandProcessor, createCommandProcessor } from "./command_processor";
import { createInputProcessor, InputProcessor } from "./input";
import { createOutput, Output } from "./output";

export interface CliSystem {
  input: InputProcessor;
  commandProcessor: CommandProcessor;
  prompt?: string;
  output: Output;
}

export function createDefaultCliSystem(prompt?: string): CliSystem {
  return {
    input: createInputProcessor(process.stdin),
    commandProcessor: createCommandProcessor(),
    output: createOutput(process.stdout),
    prompt,
  };
}
