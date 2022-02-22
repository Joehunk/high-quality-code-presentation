import { Result } from "../lib/commands/command_model";
import { createCommandProcessor } from "../lib/command_processor";

interface FooDependency {
  fooDependency: string;
}

interface BarDependency {
  barDependency: string;
}

const testCommands = [
  {
    command: "foo",
    process(noArgs: [], { fooDependency }: FooDependency): Result {
      return Result.continue(`foo: ${fooDependency}`);
    },
  },
  {
    command: "bar",
    process(noArgs: [], { barDependency }: BarDependency): Result {
      return Result.exit(`bar: ${barDependency}`);
    },
  },
] as const;

const underTest = createCommandProcessor({
  commands: testCommands,
});

const dependencies = {
  fooDependency: "hello foo",
  barDependency: "hello bar",
};

test("foo command", async () => {
  const result = await underTest.processCommand("foo", dependencies);
  expect(result).toMatchObject({
    output: "foo: hello foo",
    shouldExit: false,
  });
});

test("bar command", async () => {
  const result = await underTest.processCommand("bar", dependencies);
  expect(result).toMatchObject({
    output: "bar: hello bar",
    shouldExit: true,
  });
});
