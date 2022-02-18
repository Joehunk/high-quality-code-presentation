import { CliSystem, createCliSystem } from "./cli_system";

export async function runCommandLineInterpreter(cliSystem: CliSystem): Promise<void> {
  let exit = false;

  while (!exit) {
    await cliSystem.output.write(`${cliSystem.prompt} `);

    const commandLine = await cliSystem.input.readLine();
    const result = await cliSystem.commandProcessor.processCommand(commandLine);

    await cliSystem.output.writeLine(result.output);
    exit = result.shouldExit;
  }
}

if (require.main === module) {
  // tslint:disable-next-line:no-floating-promises
  runCommandLineInterpreter(createCliSystem()).then(() => process.exit(0));
}
