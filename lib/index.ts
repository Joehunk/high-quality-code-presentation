import { CliSystem, createDefaultCliSystem } from "./cli_system";

async function runCommandLineInterpreter(cliSystem: CliSystem): Promise<void> {
  let exit = false;

  while (!exit) {
    // This looks a little wrong. We have mixed abstractions here.
    // This line below is "lower level" code than the rest of the code in this
    // method. This is such a common problem in code that we almost stop noticing it,
    // but fixing it makles the code better.
    cliSystem.output.writeOutput(`${cliSystem.prompt || ">"} `);
    const commandLine = await cliSystem.input.readCommandLine();
    const result = await cliSystem.commandProcessor.processCommand(commandLine);

    // Same here, seems a little less abstract.
    cliSystem.output.writeOutput(result.output + "\n");
    exit = result.shouldExit;
  }

  console.log("Exiting.");
}

runCommandLineInterpreter(createDefaultCliSystem()).then(() => process.exit(0));
