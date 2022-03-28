import { echoProcessor } from "./echo_command";
import { exitProcessor } from "./exit_command";

export const DEFAULT_COMMANDS = [echoProcessor, exitProcessor] as const;
