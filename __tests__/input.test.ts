import { createInputProcessorFromIO } from "../lib/input";
import { createInputFromString, createOutputCapture } from "./test_utilities";

test("custom prompt works", () => {
  const input = createInputFromString("does not matter");
  const output = createOutputCapture();
  const prompt = "What's up?";
  const underTest = createInputProcessorFromIO({
    input,
    output,
    prompt,
  });

  underTest.readCommandLine();
  expect(output.readOutput().slice(0, prompt.length)).toBe(prompt);
});
