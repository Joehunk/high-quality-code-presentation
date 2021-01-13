import * as readline from "readline";

export interface InputProcessor {
  readCommandLine(): Promise<string>;
}

export function createInputProcessor(input: NodeJS.ReadableStream): InputProcessor {
  const reader = readline.createInterface({ input });

  return {
    readCommandLine(): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        try {
          reader.on("line", (input) => resolve(input));
        } catch (e) {
          reject(e);
        }
      });
    },
  };
}
