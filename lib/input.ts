import * as readline from "readline";

export interface InputProcessor {
  readCommandLine(): Promise<string>;
}

export function createInputProcessor(input: NodeJS.ReadableStream): InputProcessor {
  const reader = readline.createInterface({ input });
  const queuedLines: string[] = [];
  const waitingCallbacks: ((arg: string) => void)[] = [];

  async function waitForNextLine(): Promise<string> {
    return new Promise((resolve) => {
      waitingCallbacks.push(resolve);
    });
  }

  reader.on("line", (value) => {
    const waitingCallback = waitingCallbacks.shift();

    if (waitingCallback) {
      waitingCallback(value);
    } else {
      queuedLines.push(value);
    }
  });

  return {
    async readCommandLine(): Promise<string> {
      const line = queuedLines.shift();

      if (line) {
        return line;
      } else {
        return waitForNextLine();
      }
    },
  };
}
