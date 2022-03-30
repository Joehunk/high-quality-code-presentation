import * as F from "fp-ts/function";
import { addNewline, CommandEffect, pipeErrorToEffect, pipeStreamToSink, StreamingCommandEffect } from "../effects";
import { Result } from "./types";
import { EffectfulCommand } from "./types";

export interface LsEffects {
  readonly io: {
    readonly output: CommandEffect<string, void>;
    readonly errorOutput: CommandEffect<string, void>;
  };
  readonly fileSystem: {
    readonly listDirectory: StreamingCommandEffect<string, string>;
  };
}

export const lsCommand: EffectfulCommand<LsEffects> = (effects) => async (args) => {
  const listDirectoryToOutput = F.pipe(
    pipeStreamToSink(effects.fileSystem.listDirectory, addNewline(effects.io.output)),
    pipeErrorToEffect(addNewline(effects.io.errorOutput))
  );

  if (args.length < 1) {
    await listDirectoryToOutput(".");
    return Result.continue();
  }

  for (const directory of args) {
    await effects.io.output(`${directory}:\n`);
    await listDirectoryToOutput(directory);
    await effects.io.output("\n");
  }

  return Result.continue();
};
