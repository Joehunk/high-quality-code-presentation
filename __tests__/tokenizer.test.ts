import { createTokenizer } from "../lib/tokenizer";

test("quoted tokenization", () => {
  const underTest = createTokenizer();
  const { args } = underTest.tokenizeLine('echo "this   is a    test"');

  expect(args).toEqual(["this   is a    test"]);
});

test("unquoted tokenization", () => {
  const underTest = createTokenizer();
  const { args } = underTest.tokenizeLine("echo this   is a    test");

  expect(args).toEqual(["this", "is", "a", "test"]);
});
