import { CommandProcessor, createCommandProcessor } from "./command_processor";
import { createInputProcessor, Input } from "./input";
import { createOutput, Output } from "./output";

/*

Hm, I think I want CliSystem to extend Environment rather than having one. Because it's
close to this now, i.e. has an input and output parameter which is 2/3 of what an Environment is now,
here are the thoughts I am having:

1. input and output are mismatched. CommandOutput is a higher level Facade on Output. What I really want
is the Output here to match Input. 

2. CommandOutput (ever since I factored the functionality of Output out of it) is really
not something that needs to be in an interface. It could be effectively extension methods on Output,
although since TS is not awesome enough to have those it could simply be a series of functions
that take an Output as an arg. There is perhaps a principle to be extracted here: when do you wrap
a thing and provide methods that use that thing, vs. provide free standing functions that use
that thing as inputs? Are these in fact materially different? Is the only trade off the need
to create a wrapper object (which has overhead but might provide a cleaner abstraction absent
language support for extension functions)?

3. It may be that Environment and CliSystem are in fact the exact same thing and I don't need 2 classes.

4. If CliSystem gets big, I might want to make it hierarchical, like put things like "prompt" in a
"configuration" sub object. Of course this breaks compatibility, but then again maybe breaking compatibility
when things are small is exactly what you want to do.

5. Do we need a function for createCliSystem? Really all it does is call a bunch of sub-factory-methods
that we could just call ourselves, and CreateCliSystemOptions is just a union of all the arguments for
all those sub-factory-methods.

*/

export interface CliSystem {
  readonly input: Input;
  readonly output: Output;
  readonly commandProcessor: CommandProcessor;
  readonly prompt: string;
}

export interface CreateCliSystemOptions {
  prompt?: string;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
}

export function createCliSystem(options?: CreateCliSystemOptions): CliSystem {
  return {
    input: createInputProcessor(options?.input || process.stdin),
    output: createOutput({ outputStream: options?.output || process.stdout }),
    commandProcessor: createCommandProcessor(),
    prompt: options?.prompt || ">",
  };
}
