import { Result, SingleCommandProcessor } from "./commands/command_model";
import { DEFAULT_COMMANDS } from "./commands/command_registry";
import { createTokenizer, Tokenizer } from "./tokenizer";

export type NoDeps = {};

export interface CommandProcessor<Deps extends NoDeps = NoDeps> {
  processCommand(commandLine: string, cliSystem: Deps): Promise<Result>;
}

/*
Why are the T1, T2 etc in array brackets you ask? If the expression on the left hand side of an extends operator
in a conditional type is a naked type (not an array, object, other type function, etc) then the transpiler
treats it as a "distributive conditional type", which is a complicated concept but in brief it means that
if Foo<T> evaluates to Bar<T>, then Foo<T | U> will evaluate to Bar<T> | Bar<U> i.e. the type function is
distributed over unions. To turn this behavior off, enclose the type expressions in either array or
object notation.
*/
type CombineDependencyTypes<T1, T2> = T1 & T2;

/* 
This was a fancy type trick I am proud of. This type function determines the intersection type of all dependencies
of all commands, so it ensures that when processing a command, you are passing the command processor all dependencies
that could be needed by any command processor.

I went to all this trouble because otherwise this class was hard/impossible to unit test. It is a composer so it
should be unit tested, but it was taking in the world of dependencies even if it was composing all command handlers
that didn't need them. So I had to construct crap like IO and a file system that the unit test never used nor
should this unit depend on anyway.

So, command handlers now declare their dependency requirements in their types, SingleCommandHandler<Deps>.
And the intersection of all handlers' dependencies is that the top level composite expects.
*/
export type Dependencies<T> = T extends []
  ? {}
  : T extends SingleCommandProcessor<infer SingleDep>
  ? SingleDep
  : T extends readonly [SingleCommandProcessor<infer FirstDep>, ...infer RestOfProcessors]
  ? CombineDependencyTypes<Dependencies<RestOfProcessors>, FirstDep>
  : never;

export type UnknownCommands = readonly SingleCommandProcessor<NoDeps>[];
export type DefaultDependencies = Dependencies<typeof DEFAULT_COMMANDS>;

interface HasTokenizer {
  readonly tokenizer: Tokenizer;
}

interface HasCommands<T extends UnknownCommands> {
  readonly commands: T;
}

type CreateCommandProcessorOptions<T extends UnknownCommands> = Partial<HasCommands<T>> & Partial<HasTokenizer>;

type StringToProcessorMap<Deps extends NoDeps> = Record<string, SingleCommandProcessor<Deps>>;

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

export function createCommandProcessor<Commands extends UnknownCommands>(
  options: HasCommands<Commands> | (HasCommands<Commands> & HasTokenizer)
): CommandProcessor<Dependencies<Commands>>;

export function createCommandProcessor(options?: HasTokenizer): CommandProcessor<DefaultDependencies>;

export function createCommandProcessor<Commands extends UnknownCommands = typeof DEFAULT_COMMANDS>(
  options?: CreateCommandProcessorOptions<Commands>
): CommandProcessor<Dependencies<Commands>> {
  const tokenizer = options?.tokenizer || createTokenizer();
  const lowerCaseCommandToProcessor: StringToProcessorMap<NoDeps> = buildLowerCaseCommandToProcessorMap(
    options?.commands || DEFAULT_COMMANDS
  );
  return {
    async processCommand(commandLine: string, dependencies: Dependencies<Commands>): Promise<Result> {
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
