// I am taking advantage of TS's structural typing here.
// Instead of importing Result from command_processor, I use my own
// type. This allows me to take in a Result from command processor because
// the shapes are compatible, but I don't require the caller to populate
// properties I do not need (like "shouldExit") and I do not couple this
// class to command_processor by depending on its types.
interface Result {
  output: string;
}

export interface Output {
  prompt(): void;
  printResult(result: Result): void;
}

// I like options classes because I find the named parameters more easy to read than
// "oh this is the 3rd parameter so it's the file name" or whatever. I consider 2
// parameters to be the max for any function. More than 2 and you need an options class.
// Sometimes I do options classes before I get to 2 if it "feels right".
export interface CreateOutputOptions {
  prompt?: string;
  output: NodeJS.WritableStream;
}

export function createOutput(options: CreateOutputOptions): Output {
  return {
    prompt(): void {
      options.output.write(`${options.prompt || ">"} `);
    },
    printResult(result: Result): void {
      options.output.write(`${result.output}\n`);
    },
  };
}
