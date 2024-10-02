import {
  getPrompt,
  getPromptLink,
  getMessage,
  chain,
} from '@makinteract/openai-chains';

// Adding context
const context = [{ role: 'system', content: 'Be very succinct' }];

// Single prompt
const prompt = getPrompt(
  {
    model: 'gpt-4o-mini',
  },
  context
);

// Saying the name here
await prompt('My name is Jon Snow');
await prompt('I love dragons');
await prompt('I am a Stark');
// Asking for my name - it remembers it!
await prompt('What is my name?').then(getMessage).then(console.log);
// Response: { role: 'assistant', content: 'Your name is Jon Snow!', refusal: null }

// With chains
const promptlink = getPromptLink({ model: 'gpt-4o' }, context);

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
