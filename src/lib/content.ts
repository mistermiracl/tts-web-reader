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
  // TODO: refactor this after testing
  // TODO: replace dom parser with regex
  const parser = new DOMParser().parseFromString(content, 'text/xml');
  const sentences = Array.from(parser.querySelector('speak')!.querySelectorAll('s')).map(sEl => sEl.textContent!);
  return sentences;
};

export { fetchContent, parseContentIntoSentences };
