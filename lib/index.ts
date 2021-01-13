import { CliSystem, createCliSystem } from "./cli_system";

export async function runCommandLineInterpreter(cliSystem: CliSystem): Promise<void> {
  let exit = false;

  while (!exit) {
    cliSystem.output.prompt();

    const commandLine = await cliSystem.input.readCommandLine();
    const result = await cliSystem.commandProcessor.processCommand(commandLine);

    cliSystem.output.printResult(result);
    exit = result.shouldExit;
  }

  // Guess what I was still incorrectly using console.log to print this and it failed the end to end test!
  cliSystem.output.printResult({ output: "Exiting." });
}

runCommandLineInterpreter(createCliSystem()).then(() => process.exit(0));
