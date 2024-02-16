import { useEffect, useState } from 'react';
import { fetchContent, parseContentIntoSentences } from './content';

export function useContent(): [string[] | undefined, boolean, () => void] {
  const [content, setContent] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refresh = () => {
    setRefreshFlag(!refreshFlag);
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
  }, [refreshFlag]);

  return [content, loading, refresh];
}