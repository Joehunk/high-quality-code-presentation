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
      // Destructuring assignments are cool. Other languages like Kotlin
      // and Scala also have these.
      const [command, ...args] = line.split(/\s+/);

      return {
        lowerCaseCommand: command.toLowerCase(),
        args,
      };
    },
  };
}
