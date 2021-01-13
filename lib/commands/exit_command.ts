import { Result, SingleCommandProcessor } from "./command_model";

export const exitProcessor: SingleCommandProcessor = {
  command: "exit",
  process(_args: string[]): Result {
    return {
      output: "Exiting.",
      shouldExit: true,
    };
  },
};
