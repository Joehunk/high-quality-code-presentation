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

// But wait! Our refactoring is not done!
// We still have some issues:
//
// By decoupling the code, we cannot test as much functionality in one test as before.
// We need more tests.
//
// If you look at test_utilities, you will see that there is a function we no longer
// use called createOutputCapture(). Should we delete it? Normally you should always
// delete dead code, but it seems like we want to leave it around. Why? I think because
// it should be used in the additional tests we write. This is a case where a vague
// sense of "hmm, I do not want to delete this" leads to an insight of "I should
// write more tests."
