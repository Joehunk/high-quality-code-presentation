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
          reader.question("", (answer) => resolve(answer));
        } catch (e) {
          reject(e);
        }
      });
    },
  };
}
