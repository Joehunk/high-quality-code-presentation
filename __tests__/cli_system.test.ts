import escapeStringRegexp from "escape-string-regexp";
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

const regexForRandomFileInProjectRoot = new RegExp(escapeStringRegexp("package.json"));

test("directory listing", async () => {
  const reader = createInputFromLines("ls .", "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
  });

  await runCommandLineInterpreter(underTest);

  expect(writer.readOutput()).toMatch(regexForRandomFileInProjectRoot);
});

test("directory listing with bad directory", async () => {
  const reader = createInputFromLines("ls this_does_not_exist", "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
  });

  await runCommandLineInterpreter(underTest);

  expect(writer.readOutput()).toMatch(/error/i);
});

test("directory listing multiple", async () => {
  const reader = createInputFromLines("ls . __tests__", "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
  });

  await runCommandLineInterpreter(underTest);

  const regexForFileInTestsDirectory = new RegExp(escapeStringRegexp("cli_system.test.ts"));

  expect(writer.readOutput()).toMatch(regexForRandomFileInProjectRoot);
  expect(writer.readOutput()).toMatch(regexForFileInTestsDirectory);
});

test("directory listing multiple with error", async () => {
  const reader = createInputFromLines("ls . does_not_exist", "exit");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
  });

  await runCommandLineInterpreter(underTest);

  const regexForFileInTestsDirectory = new RegExp(escapeStringRegexp("cli_system.test.ts"));

  expect(writer.readOutput()).toMatch(regexForRandomFileInProjectRoot);
  expect(writer.readOutput()).not.toMatch(regexForFileInTestsDirectory);
  expect(writer.readOutput()).toMatch(/error/i);
});
