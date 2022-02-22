import matchall from "string.prototype.matchall";
import { isDefined } from "./util";
export interface TokenizedLine {
  lowerCaseCommand: string;
  args: string[];
}

export interface Tokenizer {
  tokenizeLine(line: string): TokenizedLine;
}

export function createTokenizer(): Tokenizer {
  return {
    tokenizeLine(line: string): TokenizedLine {
      const tokenRegex = /"(.*?)"|([^\s"]+)/g;
      const matches = [...matchall(line, tokenRegex)].map((match) => match[1] || match[2]);

      const [command, ...args] = matches;

      if (command) {
        return {
          lowerCaseCommand: command.toLowerCase(),
          args: args.filter(isDefined),
        };
      } else {
        return {
          lowerCaseCommand: line.toLowerCase(),
          args: [],
        };
      }
    },
  };
}
