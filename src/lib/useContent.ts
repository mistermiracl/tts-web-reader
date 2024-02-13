import { useEffect, useState } from 'react';
import { fetchContent, parseContentIntoSentences } from './content';

export function useContent(): [string[] | undefined, boolean, () => void] {
  const [content, setContent] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  const refresh = () => {
    setFlag(!flag);
  }

  useEffect(() => {
    const abortCtrl = new AbortController();
    const getContent = async () => {
      setLoading(true);
      const content = await fetchContent(abortCtrl.signal);
      const sentences = parseContentIntoSentences(content);
      setContent(sentences);
      setLoading(false);
    }
    getContent();
    return () => abortCtrl.abort();
  }, [flag]);

  return [content, loading, refresh];
}