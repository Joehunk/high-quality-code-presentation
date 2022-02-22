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

type StringToProcessorMap = Record<string, command_model.SingleCommandProcessor>;

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

      return processor.process(args);
    },
  };
}
