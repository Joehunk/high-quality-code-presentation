import * as command_model from "./commands/command_model";
import { DEFAULT_COMMANDS } from "./commands/command_registry";
import { createTokenizer, Tokenizer } from "./tokenizer";

type Result = command_model.Result;

export interface CommandProcessor {
  processCommand(commandLine: string): Promise<Result>;
}

export interface CreateCommandProcessorOptions {
  tokenizer?: Tokenizer;
  commands?: command_model.SingleCommandProcessor[];
}

// The "| undefined" is a nice hint to TypeScript that you expect it to be possible for you to
// look for an entry that is not there.
type StringToProcessorMap = Record<string, command_model.SingleCommandProcessor | undefined>;

// Notice how careful naming of functions and variables reminds us where we need to convert to lower case
// and where we already have.
function buildLowerCaseCommandToProcessorMap(commands: command_model.SingleCommandProcessor[]): StringToProcessorMap {
  const map: StringToProcessorMap = {};

  commands.forEach((command) => {
    const lowerCaseCommand = command.command.toLowerCase();
    if (map[lowerCaseCommand]) {
      throw new Error("Duplicate command in registry: " + lowerCaseCommand);
    }

    map[lowerCaseCommand] = command;
  });

  return map;
}

// This is nice. You can add options to a function that used to have no options,
// and use defaults so you do not break existing callers.
export function createCommandProcessor(options?: CreateCommandProcessorOptions): CommandProcessor {
  const tokenizer = options?.tokenizer || createTokenizer();
  const lowerCaseCommandToProcessor: StringToProcessorMap = buildLowerCaseCommandToProcessorMap(
    options?.commands || DEFAULT_COMMANDS
  );
  return {
    async processCommand(commandLine: string): Promise<Result> {
      const { args, lowerCaseCommand } = tokenizer.tokenizeLine(commandLine);
      const processor = lowerCaseCommandToProcessor[lowerCaseCommand];

      if (!processor) {
        return {
          output: `Unrecognized command: '${lowerCaseCommand}'`,
          shouldExit: false,
        };
      }

      // Now the typescript compiler is smart enough to "narrow" the type by
      // removing the "| undefined" part since we have checked it above.
      // if we comment out the check above, this line will fail to compile.
      return processor.process(args);
    },
  };
}
