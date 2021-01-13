import { Result, SingleCommandProcessor } from "./command_model";

export const exitProcessor: SingleCommandProcessor = {
  command: "exit",
  // Some linters require you to prefix unused arguments with "_"
  process(_args: string[]): Result {
    return {
      output: "Exiting.",
      shouldExit: true,
    };
  },
};
