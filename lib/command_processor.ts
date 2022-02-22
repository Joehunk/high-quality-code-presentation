import { Result, SingleCommandProcessor } from "./commands/command_model";
import { DEFAULT_COMMANDS } from "./commands/command_registry";
import { createTokenizer, Tokenizer } from "./tokenizer";

export interface CommandProcessor<Deps = undefined> {
  processCommand(commandLine: string, cliSystem: Deps): Promise<Result>;
}

type CombineDependencyTypes<T1, T2> = [T1] extends [undefined] ? T2 : [T2] extends [undefined] ? T1 : T2 & T1;

type Dependencies<T> = T extends []
  ? undefined
  : T extends SingleCommandProcessor<infer SingleDep>
  ? SingleDep
  : T extends SingleCommandProcessor<infer ArrayDep>[]
  ? ArrayDep
  : T extends readonly [SingleCommandProcessor<infer FirstDep>, ...infer RestOfProcessors]
  ? CombineDependencyTypes<FirstDep, Dependencies<RestOfProcessors>>
  : undefined;

type UnknownCommands = readonly SingleCommandProcessor<unknown>[];

interface HasTokenizer {
  readonly tokenizer: Tokenizer;
}

interface HasCommands<T extends UnknownCommands> {
  readonly commands: T;
}

type CreateCommandProcessorOptions<T extends UnknownCommands> = Partial<HasCommands<T>> & Partial<HasTokenizer>;

type StringToProcessorMap<Deps> = Record<string, SingleCommandProcessor<Deps>>;

// Notice how careful naming of functions and variables reminds us where we need to convert to lower case
// and where we already have.
function buildLowerCaseCommandToProcessorMap<T extends UnknownCommands>(
  commands: T
): StringToProcessorMap<Dependencies<T>> {
  const map: StringToProcessorMap<Dependencies<T>> = {};

  commands.forEach((command) => {
    const lowerCaseCommand = command.command.toLowerCase();
    if (map[lowerCaseCommand]) {
      throw new Error("Duplicate command in registry: " + lowerCaseCommand);
    }

    map[lowerCaseCommand] = command;
  });

  return map;
}

export function createCommandProcessor<T extends UnknownCommands>(
  options: HasCommands<T> | (HasCommands<T> & HasTokenizer)
): CommandProcessor<Dependencies<T>>;

export function createCommandProcessor(options?: HasTokenizer): CommandProcessor<Dependencies<typeof DEFAULT_COMMANDS>>;

export function createCommandProcessor<T extends UnknownCommands>(
  options?: CreateCommandProcessorOptions<T>
): CommandProcessor<unknown> {
  const tokenizer = options?.tokenizer || createTokenizer();
  const lowerCaseCommandToProcessor: StringToProcessorMap<unknown> = buildLowerCaseCommandToProcessorMap(
    options?.commands || DEFAULT_COMMANDS
  );
  return {
    async processCommand(commandLine: string, dependencies: Dependencies<T>): Promise<Result> {
      const { args, lowerCaseCommand } = tokenizer.tokenizeLine(commandLine);
      const processor = lowerCaseCommandToProcessor[lowerCaseCommand];

      if (!processor) {
        return {
          output: `Unrecognized command: '${lowerCaseCommand}'`,
          shouldExit: false,
        };
      }

      return processor.process(args, dependencies);
    },
  };
}
