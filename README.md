# OpenAI in Chains

A simple library to create OpenAI API calls for both single prompts and chains. The user can generate a prompt that keeps track of the previous invocation (e.g., history or _threads_). The library uses a functional programming style.

## Single Prompts

Create a prompt by passing a model. Other options such as _temperature_ or _frequency_penalty_ can be found [here](https://platform.openai.com/docs/api-reference/chat/create).

```js
import { getPrompt, getMessage } from '@makinteract/openai-chains';

const prompt = getPrompt({
  model: 'gpt-4o-mini',
});
```

Using the prompt, invoke the LLM this way:

```js
prompt('Tell me a joke')
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

Or alternatively using `async/await` this way:

```js
try {
  const result = await prompt('Tell me a joke');
  console.log(result);
} catch (err) {
  console.log(err);
}
```

The result is an object with the following structure, resembling OpenAI's standard [response](https://platform.openai.com/docs/api-reference/chat/create).

```json
{
  "object": "chat.completion",
  "created": 1727650823,
  "model": "gpt-4o-2024-05-13",
  "usage": {
    "prompt_tokens": 87,
    "completion_tokens": 5,
    "total_tokens": 92,
    "completion_tokens_details": { "reasoning_tokens": 0 }
  },
  "system_fingerprint": "fp_5796ac6771",
  "message": {
    "role": "assistant",
    "content": "Hello, how can I help you?"
  }
}
```

> Tip: To simplify the extraction of a message, you can use the `getMessage` function in this way.

```js
prompt('Tell me a joke')
  .then(getMessage) // extract the message
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

## Prompt Chains

You can create a chain that passes the result of the previous prompt to the next one. For that, you need to create a sequence of prompt links and pipe them in a chain. Like for a single prompt, a prompt link also contains the thread of all the previous invocations to the LLM and can be customized by passing options.

```js
const promptlink = getPromptLink({
  model: 'gpt-4o',
});

chain(
  promptlink('My name is Alice'),
  promptlink('Make all uppercase of my name'),
  promptlink('Remove any other information except my name')
)
  .then(getMessage)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

## Issues

For any problem or question with this library, please raise an issue on the [Issue page](https://github.com/makinteract/openai-chains/issues).

## License

ISC
