import { HasOutput } from "../cli_system";
import { FileSystem } from "../file_system";
import { isDefined } from "../util";
import { Result, SingleCommandProcessor } from "./command_model";

/*
This is my attempt to define the dependency of the ls command as narrowly as possible, following
the least-powerful abstraction principle.

We don't currently have unit tests against the individual command handlers, and it's
debatable whether they would add additional value over the integration tests we currently
have. But if we did, it would be nice to only have to mock the bits of a file system
(or any dependency) needed by each handler, and for each handler to declare which bits
it needs precisely.
*/
type FileSystemDependency = { fileSystem: Pick<FileSystem, "isDirectory" | "listFilesInDirectory"> };

async function ensureAllDirectoriesExist(directories: string[], { fileSystem }: FileSystemDependency): Promise<void> {
  const errors = (
    await Promise.all(
      directories.map(async (d) => {
        if (await fileSystem.isDirectory(d)) {
          return undefined;
        }
        return `'${d}' does not exist or is not a directory.`;
      })
    )
  ).filter(isDefined);

  if (errors.length > 0) {
    throw Error(errors.reduce((prev, current) => (prev ? prev + "\n" + current : current), ""));
  }
}

export const directoryProcessor: SingleCommandProcessor<HasOutput & FileSystemDependency> = {
  command: "ls",
  async process(args: string[], dependencies: HasOutput & FileSystemDependency): Promise<Result> {
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
