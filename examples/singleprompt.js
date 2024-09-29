import { getPrompt, getMessage } from '@makinteract/openai-chains';

const prompt = getPrompt({
  model: 'gpt-4o-mini',
});

await prompt('Tell me a joke')
  .then(getMessage)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

// checking history
await prompt('What was the joke about')
  .then(getMessage)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
