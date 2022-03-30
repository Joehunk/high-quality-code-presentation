import { CliSystem, createCliSystem } from "./cli_system";
import { executeCommand } from "./command-executor";
import { Result } from "./commands/types";

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
    await cliSystem.environment.io.output(`${cliSystem.configuration.prompt} `);

    const tokenizedLine = await cliSystem.environment.io.input().then(cliSystem.configuration.tokenizer.tokenizeLine);
    const result = await logFailures(() =>
      executeCommand(
        cliSystem.commandRegistry,
        cliSystem.environment,
        tokenizedLine.lowerCaseCommand,
        tokenizedLine.args
      )
    );

    await cliSystem.environment.io.output(result.output + "\n");
    exit = result.shouldExit;
  }
}

if (require.main === module) {
  // tslint:disable-next-line:no-floating-promises
  runCommandLineInterpreter(createCliSystem()).then(() => process.exit(0));
}
