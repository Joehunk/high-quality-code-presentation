import { Result, SingleCommandProcessor } from "./command_model";

export const echoProcessor: SingleCommandProcessor = {
  command: "echo",
  process(args: string[]): Result {
    return {
      output: args.join(" "),
      shouldExit: false,
    };
  },
};
