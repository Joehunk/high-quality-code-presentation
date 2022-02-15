import { createInputProcessor } from "../lib/input";
import { createInputFromString } from "./test_utilities";

test("custom prompt works", async () => {
  const underTest = createInputProcessor(createInputFromString("foo"));

  const result = await underTest.readLine();
  expect(result).toBe("foo");
});
