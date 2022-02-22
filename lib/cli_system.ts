import { CommandProcessor, createCommandProcessor } from "./command_processor";
import { createFileSystem, FileSystem } from "./file_system";
import { createInputProcessor, Input } from "./input";
import { createOutput, Output } from "./output";

/*

I fixed a lot of issues I had observed in previous revs.

1. What is the CliSystem and what is an Environment? When I refactored the dependency system in command_processor,
   this became obvious. The environment is the intersection type of all dependencies needed by the command processors.
   This allowed me to hold out stuff I never wanted to pass to the handlers, such as the command processor itself.

2. Input and output are now symmetrical. I suspect at some point I will write a helper that takes Input and Output
   and prompts a user for input. My next command to write is something that prompts a user for input like sudo maybe
   (a fake sudo of course -- a pseudo sudo if you will).

3. CliSystemOptions still has a lot in common with CliSystem itself. For now I am not considering this a big problem.
   It's a purpose build interface that provides options to 1 method, so the only reason for change is that method's
   requirements changing. createCliSystem() is not intended to be flexible (like let you create systems with custom
   handlers and crap. It is meant to create the real deal. It's a factory class. It's only configurable to allow
   the full system to be integration tested. I might consider taking out the fileSystem as an option and assume
   that it will always work with a real file system in this mode, whether integration testing or running.

*/

export interface HasInput {
  readonly input: Input;
}

export interface HasOutput {
  readonly output: Output;
}

export interface HasFileSystem {
  readonly fileSystem: FileSystem;
}

export interface HasPrompt {
  readonly prompt: string;
}

type Environment = HasFileSystem & HasInput & HasOutput & HasPrompt;

export interface CliSystem {
  readonly commandProcessor: CommandProcessor<Environment>;
  readonly environment: Environment;
}

export interface CreateCliSystemOptions {
  readonly prompt?: string;
  readonly input?: NodeJS.ReadableStream;
  readonly output?: NodeJS.WritableStream;
  readonly fileSystem?: FileSystem;
}

export function createCliSystem(options?: CreateCliSystemOptions): CliSystem {
  return {
    environment: {
      input: createInputProcessor(options?.input || process.stdin),
      output: createOutput({ outputStream: options?.output || process.stdout }),
      prompt: options?.prompt || ">",
      fileSystem: options?.fileSystem || createFileSystem(),
    },
    commandProcessor: createCommandProcessor(),
  };
}
