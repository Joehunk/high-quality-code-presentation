interface Result {
  output: string;
}

export interface Output {
  prompt(): void;
  printResult(result: Result): void;
}

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
