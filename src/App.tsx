import './App.css';

import { Controls } from './components/Controls';
import { CurrentlyReading } from './components/CurrentlyReading';
import { useSpeech } from './lib/useSpeech';
import { useContent } from './lib/useContent';

function App() {
  const [sentences, loading, refresh] = useContent();
  const { currentWordRange, currentSentenceIdx, play, pause, playbackState } = useSpeech(sentences);

  return (
    <div className="App">
      <h1>Text to speech</h1>
      <div>
        <CurrentlyReading sentences={sentences} currentSentenceIdx={currentSentenceIdx} currentWordRange={currentWordRange} />
      </div>
      <div>
        <Controls play={play} pause={pause} loadNewContent={refresh} state={playbackState} />
      </div>
    </div>
  );
}

export default App;
