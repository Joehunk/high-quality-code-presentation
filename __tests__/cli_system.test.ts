import { runCommandLineInterpreter } from "../lib";
import { createCliSystem } from "../lib/cli_system";
import { createInputFromString, createOutputCapture } from "./test_utilities";

// This is sort of a "snapshot test" in that it's likely to break any time we change
// something substantive, but that's okay. Our code is still being exercised against a
// known good state. Snapshot tests is chiefly how CDK code is tested by the way.
test("end to end", async () => {
  const reader = createInputFromString("Stuff");
  const writer = createOutputCapture();
  const underTest = createCliSystem({
    input: reader,
    output: writer,
    prompt: ">",
  });

  await runCommandLineInterpreter(underTest);
  expect(writer.readOutput()).toBe("> You typed: Stuff\n\nExiting.\n");
});
