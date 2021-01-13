function runCommandLineInterpreter(): void {
  let exit = false;

  while (!exit) {
    const commandLine = readCommandLineFromInput();
    const result = processCommand(commandLine);

    exit = result.shouldExit;
  }

  console.log("Exiting.");
}

function readCommandLineFromInput(): string {
  return "";
}

interface Result {
  readonly shouldExit: boolean;
}

function processCommand(commandLine: string): Result {
  return { shouldExit: true };
}

runCommandLineInterpreter();
