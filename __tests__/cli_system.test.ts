import { runCommandLineInterpreter } from "../lib";
import { createCliSystem } from "../lib/cli_system";
import { createInputFromLines, createOutputCapture } from "./test_utilities";

test("end to end", async () => {
  const reader = createInputFromLines("echo hello", "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
    prompt: ">",
  });

  await runCommandLineInterpreter(underTest);
  expect(writer.readOutput()).toBe("> hello\n> Exiting.\n");
});

test("end to end 2", async () => {
  const reader = createInputFromLines('echo "hello    world"', "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
    prompt: "?",
  });

  await runCommandLineInterpreter(underTest);
  expect(writer.readOutput()).toBe("? hello    world\n? Exiting.\n");
});
