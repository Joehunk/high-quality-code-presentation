import * as readline from "readline";

export interface InputProcessor {
  readCommandLine(): Promise<string>;
}

export interface CreateInputProcessorFromIOOptions {
  input: NodeJS.ReadableStream;
  output: NodeJS.WritableStream;
  prompt?: string;
}

export function createInputProcessorFromIO(options: CreateInputProcessorFromIOOptions): InputProcessor {
  const reader = readline.createInterface(options);

  return {
    readCommandLine(): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        try {
          // Replace hard coded string!
          reader.question(`${options.prompt} ` || "> ", (answer) => resolve(answer));
        } catch (e) {
          reject(e);
        }
      });
    },
  };
}
