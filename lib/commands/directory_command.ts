import { HasFileSystem, HasOutput } from "../cli_system";
import { Result, SingleCommandProcessor } from "./command_model";

export const directoryProcessor: SingleCommandProcessor<HasOutput & HasFileSystem> = {
  command: "ls",
  async process([directoryName]: [string], dependencies: HasOutput & HasFileSystem): Promise<Result> {
    if (!directoryName) {
      return Result.continue("Must supply one argument (directory to list)");
    }

    for await (const file of dependencies.fileSystem.listFilesInDirectory(directoryName)) {
      await dependencies.output.writeLine(file);
    }

    return Result.continue();
  },
};
