import { NoDeps } from "../command_processor";

export const Result = {
  continue(output?: string): Result {
    return {
      shouldExit: false,
      output: output || "",
    };
  },
  exit(output?: string): Result {
    return {
      shouldExit: true,
      output: output || "Exiting.",
    };
  },
};

export interface Result {
  output: string;
  shouldExit: boolean;
}

export interface SingleCommandProcessor<Dependencies extends NoDeps = NoDeps> {
  command: string;
  process(args: string[], dependencies: Dependencies): Result | Promise<Result>;
}
