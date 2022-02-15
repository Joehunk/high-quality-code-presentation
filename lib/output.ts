interface Result {
  output: string;
}

export interface CommandOutput {
  prompt(): Promise<void>;
  printResult(result: Result): Promise<void>;
}

export interface Output {
  write(value: string): Promise<void>;
  writeLine(value: string): Promise<void>;
}

export interface CreateOutputOptions {
  readonly outputStream: NodeJS.WritableStream;
}

export interface CreateCommandOutputOptions {
  readonly prompt?: string;
  readonly output: Output;
}

export function createOutput(options: CreateOutputOptions): Output {
  const output = options.outputStream;

  function writeAsync(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const shouldResolveSync = output.write(value, (result) => {
        if (result) {
          reject(result);
        } else {
          resolve();
        }
      });

      if (shouldResolveSync) {
        resolve();
      }
    });
  }

  return {
    async write(value: string): Promise<void> {
      await writeAsync(value);
    },
    async writeLine(value: string): Promise<void> {
      await writeAsync(`${value}\n`);
    },
  };
}

export function createCommandOutput(options: CreateCommandOutputOptions): CommandOutput {
  const output = options.output;

  return {
    async prompt(): Promise<void> {
      await output.write(`${options.prompt || ">"} `);
    },
    async printResult(result: Result): Promise<void> {
      await output.writeLine(result.output);
    },
  };
}
