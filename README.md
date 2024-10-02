# OpenAI Chains

A simple library to create OpenAI API calls for both single prompts and chains. The user can generate a prompt that keeps track of the previous invocation (e.g., [history](#history) or _threads_). The library uses a functional programming style.

## Usage

Ensure you have a valid OpenAI API key. Store it in a `.env` file in the root folder of your project. The `.env` file should look like something like this:

```
OPENAI_API_KEY=sk-proj-nKrwmdu5fSZm....
```

### Single Prompts

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

#### Examples

If you want to pass an initial context, you can simply pass it when you create the prompt.

```js
const context = [{ role: 'system', content: 'You are a funny guy' }];

const prompt = getPrompt({ model: 'gpt-4o-mini' }, context);

await prompt('Tell me a joke'); // ....
```

Another common usage is using [few shot prompts](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-examples) using examples.

```js
const examples = [
  {
    role: 'system',
    content: 'Answer in a consistent style with the examples.',
  },
  { role: 'user', content: 'What is happyness?' },
  { role: 'assistant', content: "Aren't you happy?" },
  { role: 'user', content: 'What is ambition?' },
  { role: 'assistant', content: "Aren't you ambitious?" },
];

const prompt = getPrompt({ model: 'gpt-4o-mini' }, examples);

prompt('What is love?') //
  .then(getMessage)
  .then(console.log);
// Response: { role: 'assistant', content: "Aren't you in love?", refusal: null }
```

### Prompt Chains

You can create a chain that passes the result of the previous prompt to the next one. For that, you need to create a sequence of prompt links and pipe them in a chain. Like for a single prompt, a prompt link also contains the thread of all the previous invocations to the LLM and can be customized by passing options.

```js
import { getPromptLink, getMessage, chain } from '@makinteract/openai-chains';

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

As for the single prompt example, you can pass a context when you create the prompt:

```js
const promptlink = getPromptLink(
  {
    model: 'gpt-4o',
  },
  context
);
```

### History

Both prompts keep track of the past prompt invocations and results—something similar to the concept of [threads](https://platform.openai.com/docs/assistants/deep-dive/managing-threads-and-messages).

This means that you do not need to manually keep track of your prompts or their responses. Here is an example.

```js
const prompt = getPrompt(
  {
    model: 'gpt-4o-mini',
  }[{ role: 'user', content: 'Be very succinct' }]
);

// Saying the name here
await prompt('My name is Jon Snow');
await prompt('I love dragons');
await prompt('I am a Stark');
// Asking for my name - it remembers it!
await prompt('What is my name?').then(getMessage).then(console.log);
// Response: { role: 'assistant', content: 'Your name is Jon Snow!', refusal: null }
```

This also works using chains:

```js
const promptlink = getPromptLink({ model: 'gpt-4o' }, [
  { role: 'system', content: 'Answer in a sentence.' },
]);

await chain(
  promptlink('My name is Jon Snow'),
  promptlink('I love dragons'),
  promptlink('I am a Stark'),
  promptlink('Who am I?')
)
  .then(getMessage)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

// Reponse { role: 'assistant', content: 'You are Jon Snow, a member of House Stark.', refusal: null }
```

## Issues

For any problem or question with this library, please raise an issue on the [Issue page](https://github.com/makinteract/openai-chains/issues).

## License

ISC
