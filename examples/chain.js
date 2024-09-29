import { getPromptLink, getMessage, chain } from '@makinteract/openai-chains';

const promptlink = getPromptLink({
  model: 'gpt-4o',
});

await chain(
  promptlink('My name is Alice'),
  promptlink('Make all uppercase of my name'),
  promptlink('Remove any other information except my name')
)
  .then(getMessage)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

// Checking history
const res = await chain(promptlink('What is my name?'));
console.log(res);
