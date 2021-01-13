import { createInputProcessorFromIO } from "../lib/input";
import { createInputFromString, createOutputCapture } from "./test_utilities";

// Obviously we would write more tests than this, but this is a good example of a well-written test
// that was coded top-down.
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
