import { commandRegistry } from "./commands/command-registry";
import { RegistryWithEffects } from "./commands/types";
import { CommandEffect } from "./effects";
import { createFileSystem, FileSystem } from "./file_system";
import { createInputProcessor } from "./input";
import { createOutput } from "./output";
import { createTokenizer, Tokenizer } from "./tokenizer";

interface IO {
  readonly input: CommandEffect<void, string>;
  readonly output: CommandEffect<string, void>;
  readonly errorOutput: CommandEffect<string, void>;
}
interface Environment {
  readonly io: IO;
  readonly fileSystem: FileSystem;
}

export interface CliSystemDependencies {
  readonly io: IO;
}

export interface CliSystem {
  readonly configuration: {
    readonly prompt: string;
    readonly tokenizer: Tokenizer;
  };
  readonly environment: Environment;
  readonly commandRegistry: RegistryWithEffects<Environment>;
}
export interface CreateCliSystemOptions {
  readonly prompt?: string;
  readonly input?: NodeJS.ReadableStream;
  readonly output?: NodeJS.WritableStream;
  readonly fileSystem?: FileSystem;
}

export type DefaultEffects = Environment;

export function createCliSystemWithRegistry<E>(
  registry: RegistryWithEffects<Environment>,
  options?: CreateCliSystemOptions
): CliSystem {
  const customOutput = options?.output && createOutput({ outputStream: options?.output }).write;
  return {
    environment: {
      io: {
        input: createInputProcessor(options?.input || process.stdin).readLine,
        output: customOutput || createOutput({ outputStream: process.stdout }).write,
        errorOutput: customOutput || createOutput({ outputStream: process.stderr }).write,
      },
      fileSystem: options?.fileSystem || createFileSystem(),
    },
    configuration: {
      prompt: options?.prompt || ">",
      tokenizer: createTokenizer(),
    },
    commandRegistry: registry,
  };
}

export function createCliSystem(options?: CreateCliSystemOptions): CliSystem {
  return createCliSystemWithRegistry(commandRegistry, options);
}
