/**
 * Implement the CurrentlyReading component here
 * This component should have the following,
 * - A container tag with text containing all sentences supplied
 * - A p tag containing the current sentence with testID "current-sentence"
 * - A span tag inside the p tag containing the current word with testID "current-word"
 *
 * See example.gif for an example of how the component should look like, feel free to style it however you want as long as the testID exists
 */

import { Fragment } from 'react';
import { PlaybackState } from '../lib/speech';

type CurrentSentenceProps = {
  sentence?: string;
  wordRange: [number, number];
  playbackState: PlaybackState;
}

const CurrentSentence = ({ sentence, wordRange, playbackState }: CurrentSentenceProps) => {
  if (playbackState === PlaybackState.Ended || !sentence) {
    return <span className="read">Read all sentences</span>;
  }

  const sentenceFirstHalf = sentence.substring(0, wordRange[0]);
  const sentenceCurrentWord = sentence.substring(wordRange[0], wordRange[1]);
  const sentenceSecondHalf = sentence.substring(wordRange[1]);
  return (
    <>
      <span>{sentenceFirstHalf}</span>
      <span className="current-word" data-testid="current-word">{sentenceCurrentWord}</span>
      <span>{sentenceSecondHalf}</span>
    </>
  );
}

type CurrentlyReadingProps = {
  currentWordRange: [number, number];
  currentSentenceIdx: number;
  sentences?: string[];
  playbackState: PlaybackState;
};

export const CurrentlyReading = ({ currentWordRange, currentSentenceIdx, sentences, playbackState }: CurrentlyReadingProps) => {
  if (!sentences) {
    return <div>No sentences loaded</div>
  }
  return (
    <div className="currently-reading" data-testid="currently-reading">
      <p className="currently-reading-text" data-testid="current-sentence">
        <CurrentSentence sentence={sentences[currentSentenceIdx]} wordRange={currentWordRange} playbackState={playbackState} />
      </p>
      <p>
        {sentences.map(sen => (
          <Fragment key={sen}>
            {sen}
            <br />
          </Fragment>
        ))}
      </p>
    </div>
  );
};
