export type SpeechEngineOptions = {
  onBoundary: (e: SpeechSynthesisEvent) => void;
  onEnd: (e: SpeechSynthesisEvent) => void;
  onStateUpdate: (state: PlaybackState) => void;
};

export enum PlaybackState {
  Initialized = "initialized",
  Playing = "playing",
  Paused = "paused",
  Ended = "ended"
}

export type SpeechEngineState = {
  utterance: SpeechSynthesisUtterance | null;
  playbackState: PlaybackState;
  config: {
    rate: number;
    volume: number;
    voice?: SpeechSynthesisVoice;
  };
};

export type SpeechEngine = ReturnType<typeof createSpeechEngine>;

/**
 * This speech engine is meant to be a simple adapter for using speech synthesis api.
 * This should generally be left for the candidate to use as the speech synthesis apis have a few nuances
 * that the candidate might not be familiar with.
 */
const createSpeechEngine = (options: SpeechEngineOptions) => {
  const state: SpeechEngineState = {
    utterance: null,
    playbackState: PlaybackState.Paused,
    config: {
      rate: 1,
      volume: 1
    },
  };

  const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise(solve => {
      const voices = speechSynthesis.getVoices();
      if (voices) {
        solve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          solve(speechSynthesis.getVoices());
          window.speechSynthesis.onvoiceschanged = null;
        };
      }
    });
  };

  const loadVoice = async (): Promise<void> => {
    const voices = await getVoices();
    state.config.voice = voices[0];
  };

  const updatePlaybackState = (playbackState: PlaybackState) => {
    state.playbackState = playbackState;
    options.onStateUpdate(playbackState);
  }

  const load = async (text: string): Promise<void> => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.config.rate;
    utterance.volume = state.config.volume;
    // voice needs to be explicitely set, otherwise onboundary won't fire
    if (!state.config.voice) {
      await loadVoice();
    }
    utterance.voice = state.config.voice!;
    // set up listeners
    utterance.onboundary = (e) => options.onBoundary(e);
    utterance.onend = (e) => {
      console.log('ended');
      updatePlaybackState(PlaybackState.Ended);
      options.onEnd(e);
    };

    // set it up as active utterance
    state.utterance = utterance;
  };

  const play = () => {
    if (!state.utterance) throw new Error("No active utterance found to play");

    if (state.playbackState === PlaybackState.Paused) {
      window.speechSynthesis.resume();
      updatePlaybackState(PlaybackState.Playing);
    } else {
      state.utterance.onstart = () => {
        console.log('started')
        updatePlaybackState(PlaybackState.Playing);
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(state.utterance);
    }
  };

  const pause = () => {
    window.speechSynthesis.pause();
    updatePlaybackState(PlaybackState.Paused);
  };
  const cancel = () => {
    window.speechSynthesis.cancel();
    updatePlaybackState(PlaybackState.Initialized);
  };

  return {
    state,
    play,
    pause,
    cancel,
    load,
  };
};

export { createSpeechEngine };
