import { createTokenizer } from "../lib/tokenizer";

test("quoted tokenization", () => {
  const underTest = createTokenizer();
  // Notice we don't care about lowerCaseCommand for this test so we just don't destructure it.
  const { args } = underTest.tokenizeLine('echo "this   is a    test"');

  expect(args).toEqual(["this   is a    test"]);
});

test("unquoted tokenization", () => {
  const underTest = createTokenizer();
  // Notice we don't care about lowerCaseCommand for this test so we just don't destructure it.
  const { args } = underTest.tokenizeLine("echo this   is a    test");

  expect(args).toEqual(["this", "is", "a", "test"]);
});
