import { authoredStory } from './authoredStories.js';
import { backAuthored, storyScene, storyCallbacks } from './authoredJourney.js';
export function AuthoredJourneyContext({game,onChange}) {
 const story=authoredStory(game),scene=storyScene(game);
 return <section className="cambodia-journey-context" aria-label="Historical journey context"><p><strong>{story.notice}</strong></p><p>Illustrative fictional imagery · {scene.date}. {story.contentNote}</p>{game.saveWarning&&<p role="status">{game.saveWarning}</p>}<details><summary>Scene summary, planning model &amp; earlier choices</summary><p>{scene.summary}</p><p>{game.planning.limit}</p>{storyCallbacks(game).map((text,i)=><p key={i}>{text}</p>)}</details><button type="button" disabled={!game.storyState.history.length} onClick={()=>onChange(backAuthored)}>Back to the previous choice</button></section>;
}
