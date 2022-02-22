import { pipe } from "fp-ts/function";
import { HasFileSystem, HasOutput } from "../cli_system";
import { Result, SingleCommandProcessor } from "./command_model";
import { Adapt, run, Stage } from "./pipeline";

const validateNonEmptyString = (result: Result) =>
  Stage.chain((value: string) => {
    return (value && Stage.of(value)) || Stage.error(result);
  });

export const directoryProcessor: SingleCommandProcessor<HasOutput & HasFileSystem> = {
  command: "ls",
  async process([directoryName]: [string], dependencies: HasOutput & HasFileSystem): Promise<Result> {
    return run(
      pipe(
        Stage.of(directoryName),
        Stage.custom(validateNonEmptyString(Result.continue("Must supply one argument (directory to list)"))),
        Stage.map(dependencies.fileSystem.listFilesInDirectory),
        Stage.chain(Adapt.asyncForEach(Adapt.fromPromise(dependencies.output.writeLine))),
        Stage.success()
      )
    );
  },
};
