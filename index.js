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
      });
  };
}

export function getMessage(response) {
  return response.message;
}

function _formatResponse(result) {
  const { error, object, created, model, usage, system_fingerprint } = result;
  if (error) {
    throw error.message;
  }

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
  let { apiKey, ...otherOptions } = options;

  try {
    apiKey ||= process.env.OPENAI_API_KEY; // last resort for apiKey
  } catch (e) {
    // console.error('Error: ', e);
  }

  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      ...otherOptions,
      messages,
    }),
  }).then((response) => response.json());
}
