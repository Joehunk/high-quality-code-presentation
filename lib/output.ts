import { CommandEffect } from "./effects";

interface Result {
  output: string;
}
export interface Output {
  write: CommandEffect<string, void>;
}

export interface CreateOutputOptions {
  readonly outputStream: NodeJS.WritableStream;
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
  };
}
