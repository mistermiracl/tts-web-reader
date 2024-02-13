/**
 * Implement the CurrentlyReading component here
 * This component should have the following,
 * - A container tag with text containing all sentences supplied
 * - A p tag containing the current sentence with testID "current-sentence"
 * - A span tag inside the p tag containing the current word with testID "current-word"
 *
 * See example.gif for an example of how the component should look like, feel free to style it however you want as long as the testID exists
 */
export const CurrentlyReading = ({
  currentWordRange,
  currentSentenceIdx,
  sentences,
}: {
  currentWordRange: [number, number];
  currentSentenceIdx: number;
  sentences?: string[];
}) => {
  if (!sentences) {
    return <div>No sentences loaded</div>
  }
  return (
    <div className="currently-reading" data-testid="currently-reading">
      <p className="currently-reading-text" data-testid="current-sentence">
        {!sentences[currentSentenceIdx] && <span className="finished-reading">Read all sentences</span>}
        {
          sentences[currentSentenceIdx] &&
          <>
            <span>{sentences[currentSentenceIdx].substring(0, currentWordRange[0])}</span>
            <span className="currentword" data-testid="current-word">{sentences[currentSentenceIdx].substring(currentWordRange[0], currentWordRange[1])}</span>
            <span>{sentences[currentSentenceIdx].substring(currentWordRange[1])}</span>
          </>
        }
      </p>
      <p>{sentences.join('\n')}</p>
    </div>
  );
};
