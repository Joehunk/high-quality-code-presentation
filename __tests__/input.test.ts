import { createInputProcessor } from "../lib/input";
import { createInputFromString } from "./test_utilities";

test("custom prompt works", async () => {
  const underTest = createInputProcessor(createInputFromString("foo"));

  // Now this test is purely functional and not testing a bunch of coupled-together
  // functionality (Single Responsibility Principle). There is no way I could forget
  // the await now because I am testing the result, not a side-effect.
  const result = await underTest.readCommandLine();
  expect(result).toBe("foo");
});
