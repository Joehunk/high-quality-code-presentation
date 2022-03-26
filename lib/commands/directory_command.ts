import * as F from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
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

// Normally we would write a unit test for this too.
export async function pipeGeneratorToSink<T>(
  gen: AsyncGenerator<T, unknown, unknown>,
  func: (arg: T) => Promise<unknown>
): Promise<void> {
  for await (const value of gen) {
    await func(value);
  }
}

export const directoryProcessor: SingleCommandProcessor<HasOutput & HasFileSystem> = {
  command: "ls",
  async process(args: string[], dependencies: HasOutput & HasFileSystem): Promise<Result> {
    const task = F.pipe(
      TE.of(args),
      TE.filterOrElse(
        // Notably I got this wrong initially (was "> 1"). This demonstrates that even for
        // a function with branch complexity 1, "correct on sight" is not really achievable.
        // Therefore you must simulate effects in an integration test here. So this approach
        // appears to add extra complexity for not much extra value over the language
        // native approach.
        //
        // Another possible lesson learned here is that a helper like "argsNotEmpty" might
        // have made this code more readable.
        (args) => args.length >= 1,
        () => Result.continue("Must supply at least one directory.")
      ),
      TE.chainFirst((args) => TE.fromTask(() => ensureAllDirectoriesExist(args, dependencies))),
      TE.chain((args) =>
        F.pipe(
          args,
          TE.traverseSeqArray((arg) =>
            TE.fromTask(() =>
              pipeGeneratorToSink(dependencies.fileSystem.listFilesInDirectory(arg), dependencies.output.writeLine)
            )
          )
        )
      ),
      TE.map(F.constant(Result.continue())),
      TE.getOrElse(T.of)
    );

    return await task();
  },
};
