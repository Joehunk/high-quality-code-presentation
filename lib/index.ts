import { CliSystem, createCliSystem } from "./cli_system";
import { Result } from "./commands/command_model";

// By marshalling an exception from a command line function into a result, as opposed to
// catching and logging, this method remains non-side-effecting and therefore fully unit testable.
function logFailures(func: () => Promise<Result>): Promise<Result> {
  return func().catch((reason: any) => {
    return {
      shouldExit: false,
      output: `Command produced the following error:\n${reason}`,
    };
  });
}

export async function runCommandLineInterpreter(cliSystem: CliSystem): Promise<void> {
  let exit = false;

  while (!exit) {
    await cliSystem.environment.output.write(`${cliSystem.environment.prompt} `);

    const commandLine = await cliSystem.environment.input.readLine();
    const result = await logFailures(() =>
      cliSystem.commandProcessor.processCommand(commandLine, cliSystem.environment)
    );

    await cliSystem.environment.output.writeLine(result.output);
    exit = result.shouldExit;
  }
}

if (require.main === module) {
  // tslint:disable-next-line:no-floating-promises
  runCommandLineInterpreter(createCliSystem()).then(() => process.exit(0));
}
