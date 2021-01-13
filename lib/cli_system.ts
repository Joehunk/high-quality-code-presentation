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
      // Let's try our own prompt.
      // Odd note: when I first tried this it did not print the new prompt. This was due to a stranmge
      // behavior of the TS compiler that started putting my files in a different directory when I added
      // tests, so it was running the old compiled code. I cleared out the "dist" directory and found
      // the issue.
      prompt: ">>",
    }),
    commandProcessor: createCommandProcessor({
      output: process.stdout,
    }),
  };
}
