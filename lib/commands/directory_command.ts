import * as F from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import { HasFileSystem, HasOutput } from "../cli_system";
import { Result, SingleCommandProcessor } from "./command_model";

async function ensureDirectoryExists(directory: string, { fileSystem }: HasFileSystem): Promise<void> {
  for await (const file of fileSystem.listFilesInDirectory(directory)) {
    break;
  }
}

function concatErrors(results: PromiseSettledResult<unknown>[]): string {
  return F.pipe(
    results,
    RA.chain((result) => (result.status === "rejected" ? [result] : [])),
    RA.reduce("", (errorOutput, result) => `${errorOutput}\n\n${result.reason}`)
  );
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
