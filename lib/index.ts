import { CliSystem, createDefaultCliSystem } from "./cli_system";

async function runCommandLineInterpreter(cliSystem: CliSystem): Promise<void> {
  let exit = false;

  while (!exit) {
    const commandLine = await cliSystem.input.readCommandLine();
    const result = await cliSystem.commandProcessor.processCommand(commandLine);

    exit = result.shouldExit;
  }

  console.log("Exiting.");
}

runCommandLineInterpreter(createDefaultCliSystem()).then(() => process.exit(0));
