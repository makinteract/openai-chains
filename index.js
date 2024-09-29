import 'dotenv/config';

export function chain(...fns) {
  function pipe(...fns) {
    return (x) => fns.reduce((p, f) => p.then(f), Promise.resolve(x));
  }

  // Provide default value to start
  return pipe(...fns)({
    message: {
      role: 'system',
      content: 'You are a helpful assistant',
    },
  });
}

export function getPrompt(
  promptOptions = {
    model: 'gpt-4o-mini',
    temperature: 0,
  },
  thread = []
) {
  return (userPrompt) => {
    const userMessage = {
      role: 'user',
      content: userPrompt,
    };
    const messages = [...thread, userMessage];

    return _httpRequest(messages, promptOptions) //
      .then((data) => {
        const response = _formatResponse(data);
        thread.push(userMessage);
        thread.push(response.message);
        return response;
      });
  };
}

export function getPromptLink(
  promptOptions = {
    model: 'gpt-4o-mini',
    temperature: 0,
  },
  thread = []
) {
  return (userPrompt) => (previousContext) => {
    const userMessage = {
      role: 'user',
      content: userPrompt,
    };

    const messages = [previousContext.message, ...thread, userMessage];

    return _httpRequest(messages, promptOptions) //
      .then((data) => {
        const response = _formatResponse(data);
        thread.push(userMessage);
        thread.push(response.message);
        return response;
      })
      .catch(() => {});
  };
}

export function getMessage(response) {
  return response.message;
}

function _formatResponse(result) {
  const { object, created, model, usage, system_fingerprint } = result;
  const choice = result.choices[0];
  if (choice.finish_reason === 'stop') {
    return {
      object,
      created,
      model,
      usage,
      system_fingerprint,
      message: choice.message,
    };
  }
  throw new Error('No response from AI');
}

function _httpRequest(messages, options) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      ...options,
      messages,
    }),
  }).then((response) => response.json());
}

// Usage
// 1. Example with single prompt

// const prompt = getPrompt({
//   model: 'gpt-4o-mini',
// });

// prompt('Tell me a joke')
//   .then(getMessage)
//   .then((res) => console.log(res))
//   .catch((err) => console.error(err));

// // 2. Example with multiple prompts
// const promptlink = getPromptLink({
//   model: 'gpt-4o',
// });

// await chain(
//   promptlink('My name is Alice'),
//   promptlink('Make all uppercase of my name'),
//   promptlink('Remove any other information except my name')
// )
//   .then(getMessage)
//   .then((res) => console.log(res))
//   .catch((err) => console.error(err));
