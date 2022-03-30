import { PureCommand } from "./types";

export const exitCommand: PureCommand = () => {
  return {
    shouldExit: true,
    output: "Exiting.",
  };
};
