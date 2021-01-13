import { runCommandLineInterpreter } from "../lib";
import { createCliSystem } from "../lib/cli_system";
import { createInputFromLines, createOutputCapture } from "./test_utilities";

// Let's start with some TDD this time. Change the test to match expected behavior.
test("end to end", async () => {
  const reader = createInputFromLines("echo hello", "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
    prompt: ">",
  });

  await runCommandLineInterpreter(underTest);
  // Obviously this will fail now but this is the first step in TDD
  expect(writer.readOutput()).toBe("> hello\n> Exiting.\n");
});
