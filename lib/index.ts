import * as readline from "readline";

async function runCommandLineInterpreter(): Promise<void> {
  let exit = false;

  while (!exit) {
    const commandLine = await readCommandLineFromInput();
    const result = processCommand(commandLine);

    exit = result.shouldExit;
  }

  console.log("Exiting.");
}

function readCommandLineFromInput(): Promise<string> {
  // The procedural approach is already starting to break down.
  // I don't want to create a reader every time. Also maybe I want
  // something different than process.stdin/stdout to supply input
  // and output.
  //
  // Also this code is really hard to test since it requires a console.
  //
  // Let's refactor before proceeding.
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve, reject) => {
    try {
      reader.question("> ", (answer) => resolve(answer));
    } catch (e) {
      reject(e);
    }
  });
}

interface Result {
  readonly shouldExit: boolean;
}

function processCommand(commandLine: string): Result {
  console.log(`You typed: ${commandLine}`);
  return { shouldExit: true };
}

runCommandLineInterpreter().then(() => process.exit(0));
