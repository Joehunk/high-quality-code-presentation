export interface Result {
  output: string;
  shouldExit: boolean;
}

export interface CommandProcessor {
  processCommand(commandLine: string): Promise<Result>;
}

function separateFirstWordFromLine(line: string): [string, string] {
  const splitRegex = /(.+?)\s+(.*)/;
  const result = splitRegex.exec(line);

  if (result) {
    return [result[1], result[2]];
  }

  return [line.trimEnd(), ""];
}

export function createCommandProcessor(): CommandProcessor {
  return {
    async processCommand(commandLine: string): Promise<Result> {
      const [firstWordOfLine, restOfLine] = separateFirstWordFromLine(commandLine);
      const command = firstWordOfLine.toLowerCase();

      // Alright this is starting to look like a bad design but let's go for it for now
      // then refactor. As you are practicing, I recommend write the code the easy way first
      // then refactor. As you get more experienced, you may be able to do it all at once.
      // But don't rush.
      if (command === "echo") {
        return {
          output: restOfLine,
          shouldExit: false,
        };
      } else if (command === "exit") {
        return {
          output: "Exiting.",
          shouldExit: true,
        };
      } else {
        return {
          output: `Unrecognized command: '${command}'`,
          shouldExit: false,
        };
      }
    },
  };
}
