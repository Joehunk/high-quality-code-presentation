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

  cliSystem.output.printResult({ output: "Exiting." });
}

runCommandLineInterpreter(createCliSystem()).then(() => process.exit(0));
