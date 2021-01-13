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
  // Notice how I just passed in options because the shape of my options interface matches theirs.
  // Typescript is "structurally typed". Types with compatible shapes are considered equivalent.
  const reader = readline.createInterface(options);

  return {
    readCommandLine(): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        try {
          reader.question("> ", (answer) => resolve(answer));
        } catch (e) {
          reject(e);
        }
      });
    },
  };
}
