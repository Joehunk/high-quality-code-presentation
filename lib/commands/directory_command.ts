import { HasFileSystem, HasOutput } from "../cli_system";
import { Result, SingleCommandProcessor } from "./command_model";

/*
After banging my head on how to get this to work in fp-ts, as they did not have good primitives for sequences
the way I wanted to use them, I went back to a language native style.

This gets us back to where the entire class is not really unit-testable without mocking, which would add
only minimal extra value on top of the system-level test we already have.

I find what I really want is something like Akka not necessarily something like fp-ts. Akka is much more
natural for running things in parallel than a Monad stack where you might have a list being transiently
part of the stack and have to account for that.
*/

async function ensureDirectoryExists(directory: string, { fileSystem }: HasFileSystem): Promise<void> {
  for await (const file of fileSystem.listFilesInDirectory(directory)) {
    break;
  }
}

function concatErrors(results: PromiseSettledResult<unknown>[]): string | null {
  let errors = "";

  for (const result of results) {
    if (result.status === "rejected") {
      errors = `${errors}\n\n${result.reason}`;
    }
  }

  return errors || null;
}

async function ensureAllDirectoriesExist(directories: string[], dependencies: HasFileSystem): Promise<void> {
  const results = await Promise.allSettled(directories.map((d) => ensureDirectoryExists(d, dependencies)));
  const errors = concatErrors(results);

  if (errors) {
    throw Error(errors);
  }
}

export const directoryProcessor: SingleCommandProcessor<HasOutput & HasFileSystem> = {
  command: "ls",
  async process(args: string[], dependencies: HasOutput & HasFileSystem): Promise<Result> {
    if (args.length < 1) {
      return Result.continue("Must supply at least one directory.");
    }

    await ensureAllDirectoriesExist(args, dependencies);

    for (const directory of args) {
      for await (const file of dependencies.fileSystem.listFilesInDirectory(directory)) {
        await dependencies.output.writeLine(file);
      }
    }
    return Result.continue();
  },
};
