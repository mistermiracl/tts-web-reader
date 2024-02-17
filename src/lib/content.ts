const API_URL = "http://localhost:5174/content";
const DEFAULT_SSML = "<speak><s>There was an error</s></speak>";

type Content = {
  content: string
};

/**
 * Fetch the content from the api
 * In case of an error, return content as "<speak><s>There was an error</s></speak>"
 */
const fetchContent = async (signal?: AbortSignal): Promise<string> => {
  try {
    const response = await fetch(API_URL, { signal });
    const responseBody = await response.json() as Content;
    return responseBody.content;
  } catch (err) {
    console.error(err);
    return DEFAULT_SSML;
  }
};

/**
 * Parse the content into sentences, and return an array of sentences. Look at the Readme for sample input and expected output.
 * Avoid using DOMParser for implementing this function.
 */
const parseContentIntoSentences = (content: string): string[] => {
  if (!content) throw new ReferenceError('content is empty');
  
  // check if <speak></speak> is the root element
  const speakRegex = /^<speak>.+<\/speak>$/;
  if (!speakRegex.test(content)) {
    throw new Error('Invalid SSML');
  }

  // check if there are any <s></s> tags either between <p></p> tags or alone, + sign ensures that the capture group exists
  const senRegex = /<p><s>([a-zA-Z0-9_\- .,!?"';]+)<\/s><\/p>|<s>([a-zA-Z0-9_\- .,!?"';]+)<\/s>/g;
  const senMatches = [...content.matchAll(senRegex)];
  if (!senMatches.length) {
    throw new Error('Invalid SSML');
  }
  // check if get either capture group exists
  const sentences = senMatches.map(match => match[1] || match[2]);

  return sentences;
};

export { fetchContent, parseContentIntoSentences };
