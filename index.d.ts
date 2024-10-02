export interface Message {
  role: string;
  content: string;
}

export interface Options {
  model: string;
  apiKey?: string;
  frequency_penalty?: number;
  max_tokens?: number;
}

export interface Response {
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    completion_tokens_details: {
      reasoning_tokens: number;
    };
  };
  system_fingerprint: string;
  message: Message;
}

type PromptFunction = (prompt: readonly string) => Promise<Response>;
type PromptLinkFunction = (prompt: readonly string) => LinkFunction;
type LinkFunction = (previousContext: Message) => Promise<Response>;

/**
 * A chain of prompt functions that are executed in sequence (pipe)
 * @param functions the prompt functions to chain
 */
export function chain(...functions: LinkFunction[]): Promise<Response>;

/**
 * Get a prompt function that uses the provided model.
 * @param promptOptions The options to use for the prompt.
 * @param thread The thread of messages to use as context.
 * @returns A prompt function that uses the provided model.
 */
export function getPrompt(
  promptOptions: readonly Options,
  thread?: Message[]
): PromptFunction;

/**
 * Get a chainable prompt function that uses the provided model and the previous context.
 * @param promptOptions The options to use for the prompt.
 * @param thread The thread of messages to use as context.
 * @returns A chainable prompt function that uses the provided model and the previous context.
 */
export function getPromptLink(
  promptOptions: readonly Options,
  thread?: Message[]
): PromptLinkFunction;

/**
 * Utility to transform a response into a message.
 * @param response  The response to transform.
 * @returns The message from the response.
 */
export function getMessage(response: readonly Response): Message;
