import matchall from "string.prototype.matchall";

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

      if (matches && matches.length >= 2) {
        return {
          lowerCaseCommand: matches[0].toLowerCase(),
          args: matches.slice(1),
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
