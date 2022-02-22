import { pipe } from "fp-ts/function";
import { HasFileSystem, HasOutput } from "../cli_system";
import { Result, SingleCommandProcessor } from "./command_model";
import { Adapt, run, Stage } from "./pipeline";

export const directoryProcessor: SingleCommandProcessor<HasOutput & HasFileSystem> = {
  command: "ls",
  async process([directoryName]: [string], dependencies: HasOutput & HasFileSystem): Promise<Result> {
    return run(
      pipe(
        Stage.of(directoryName),
        Stage.validateNonEmptyString(Result.continue("Must supply one argument (directory to list)")),
        Stage.map(dependencies.fileSystem.listFilesInDirectory),
        Stage.chain(Adapt.asyncForEach(Adapt.fromPromise(dependencies.output.writeLine))),
        Stage.success()
      )
    );
  },
};

/*
NOTES:

Doing the same no-mock unit testing here as I was trying out in file_system.ts.

My mental model is, there are 3 kinds of units in a program, and you should try to never write
a unit that is more than one of these 3:
1. Functional units. Pure functions with no side effects. Any dependencies are expressed in their
   signatures. As such, they are easily testable as units by calling them and verifying outputs.
   They are also stateless, memoizable, cacheable, etc.
2. Effectful units (possibly "IO units?"). Units whose only purpose is to have a single side effect. 
   A gateway from your program to the outside world. These units should contain no logic (branch 
   complexity 1 always) and should use some sort of dual like an Either, Promise, Future, etc to 
   represent the possibility of async completion as well as the possibility of unpredictable
   error conditions. Effectful units are tested only as part of integration and system tests,
   either with simulated effects or the real deal.
3. Compositional units. Units that declaratively express composition of effectful and/or
   functional units. Like effectful units, they should have no branching and resemble a
   configuration file more than a piece of code. They express structure only, not behavior.
   These units are also only tested at the integration and system level.

Note that there is a such thing as a unit that is functional (category 1), but
serves purely as a compositional tool. An example would be CommandProcessor, which acts
as a Composite of SingleCommandProcessors. As you can see CommandProcessor is unit tested
as it is a category 1 (functional) unit, but category 3 units that use it to compose things,
such as cli_system, are only tested at the integration level.

The page I linked that talks about no-mock unit testing:
https://medium.com/javascript-scene/mocking-is-a-code-smell-944a70c90a6a

...mentions that mocking is okay in integration tests. However as an alternative to
code-level mocking (i.e. constructing fake versions of things either manually or
using a framework), I prefer "sandboxing", where you use scoped-down work-alikes
for dependencies. For example at KUKA we did our integration testing with real
mini-Kafka and Cassandra nodes via Docker as opposed to mocking shims to them.
Even some cloud services like DynamoDB have local versions you can use for
sandbox testing.

So far, this project is only unit tested and sandbox tested, and uses no
mocking. We use special implementations of the low level Node IO streams
to control IO to the CLI system, and we use the real file system to test
things like the ls command.
*/
