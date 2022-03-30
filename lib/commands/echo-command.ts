import { PureCommand, Result } from "./types";

export const echoCommand: PureCommand = (args) => {
  return Result.continue(args.join(" "));
};
