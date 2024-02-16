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

  const engine = useRef<SpeechEngine>(createSpeechEngine({
    onStateUpdate: (state) => {
      if (state === 'ended') {
        setPlaybackState('paused');
      } else {
        setPlaybackState(state);
      }
    },
    onBoundary: (e) => {
      const nextSpaceIndex = e.utterance.text.indexOf(" ", e.charIndex);
      const endWordIndex = nextSpaceIndex > -1 ? nextSpaceIndex : e.utterance.text.length;
      setCurrentWordRange([e.charIndex, endWordIndex]);
    },
    onEnd: () => {
      setCurrentSentenceIdx(prevIdx => prevIdx + 1);
      setCurrentWordRange([0, 0]);
    }
  }));

  const play = () => {
    engine.current.play();
  };
  const pause = () => {
    engine.current.pause()
  };

  const reset = () => {
    setCurrentSentenceIdx(0);
    setCurrentWordRange([0, 0]);
    engine.current.cancel();
  };

  useEffect(() => {
    reset();
  }, [sentences]);

  useEffect(() => {
    // set state to ended when all sentences have been spoken
    if (currentSentenceIdx === sentences?.length) {
      setPlaybackState('ended');
    }
  }, [currentSentenceIdx]);

  useEffect(() => {
    if (sentences && sentences[currentSentenceIdx]) {
      engine.current.load(sentences[currentSentenceIdx]);
    }
  }, [sentences, currentSentenceIdx]);

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
  };
};

export { useSpeech };
