interface Result {
  output: string;
}

export interface Output {
  prompt(): Promise<void>;
  printResult(result: Result): Promise<void>;
}

export interface CreateOutputOptions {
  prompt?: string;
  output: NodeJS.WritableStream;
}

export function createOutput(options: CreateOutputOptions): Output {
  const output = options.output;

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
    async prompt(): Promise<void> {
      await writeAsync(`${options.prompt || ">"} `);
    },
    async printResult(result: Result): Promise<void> {
      await writeAsync(`${result.output}\n`);
    },
  };
}
