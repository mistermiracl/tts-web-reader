import { useEffect, useRef, useState } from 'react';

import { PlayingState, SpeechEngine, createSpeechEngine } from './speech';

/*
  @description
  Implement a custom useSpeech hook that uses a speech engine defined in 'speech.ts'
  to play the sentences that have been fetched and parsed previously.
  
  This hook should return react friendly controls for playing, and pausing audio as well as provide information about
  the currently read word and sentence
*/
const useSpeech = (sentences?: Array<string>) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState<[number, number]>([0, 0]);

  const [playbackState, setPlaybackState] = useState<PlayingState>("paused");

  const engine = useRef<SpeechEngine>();

  const play = () => {
    engine.current?.play();
  };
  const pause = () => {
    engine.current?.pause()
  };

  useEffect(() => {
    if (sentences) {
      engine.current = createSpeechEngine({
        onStateUpdate: (state) => setPlaybackState(state),
        onBoundary: (e) => {
          const endWordIndex = e.utterance.text.indexOf(" ", e.charIndex);
          setCurrentWordRange([e.charIndex, endWordIndex > -1 ? endWordIndex : e.utterance.text.length])
        },
        onEnd: () => {
          setCurrentSentenceIdx(prevIdx => prevIdx + 1);
          setCurrentWordRange([0, 0]);
        }
      });
      setCurrentSentenceIdx(0);
      setCurrentWordRange([0, 0]);
    }
  }, [sentences]);

  useEffect(() => {
    if (sentences) {
      engine.current?.load(sentences[currentSentenceIdx]);
    }
  }, [sentences, currentSentenceIdx])

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
  };
};

export { useSpeech };
