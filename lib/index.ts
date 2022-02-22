import { CliSystem, createCliSystem } from "./cli_system";
import { Result } from "./commands/command_model";
import { Output } from "./output";

function logFailures(func: () => Promise<Result>): Promise<Result> {
  return func().catch((reason: any) => {
    return {
      shouldExit: false,
      output: `Error: ${reason}`,
    };
  });
}

export async function runCommandLineInterpreter(cliSystem: CliSystem): Promise<void> {
  let exit = false;

  while (!exit) {
    await cliSystem.output.write(`${cliSystem.prompt} `);

    const commandLine = await cliSystem.input.readLine();
    const result = await logFailures(() => cliSystem.commandProcessor.processCommand(commandLine));

    await cliSystem.output.writeLine(result.output);
    exit = result.shouldExit;
  }
}

if (require.main === module) {
  // tslint:disable-next-line:no-floating-promises
  runCommandLineInterpreter(createCliSystem()).then(() => process.exit(0));
}
