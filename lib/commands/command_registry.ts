import { directoryProcessor } from "./directory_command";
import { echoProcessor } from "./echo_command";
import { exitProcessor } from "./exit_command";

export const DEFAULT_COMMANDS = [echoProcessor, exitProcessor, directoryProcessor] as const;
