import { echoCommand } from "./echo-command";
import { exitCommand } from "./exit-command";
import { lsCommand } from "./ls-command";
import { Command } from "./types";

export const commandRegistry = {
  ls: Command.effectful(lsCommand),
  exit: Command.pure(exitCommand),
  echo: Command.pure(echoCommand),
};
