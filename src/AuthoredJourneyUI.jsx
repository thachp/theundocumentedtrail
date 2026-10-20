import { HouseholdEditionNotice } from './HouseholdEditionNotice.jsx';
import { authoredStory } from './authoredStories.js';
import { storyScene, storyCallbacks } from './authoredJourney.js';
export function AuthoredJourneyContext({game,onChange}) {
 const story=authoredStory(game),scene=storyScene(game);
 return <section className="cambodia-journey-context" aria-label="Historical journey context"><HouseholdEditionNotice game={game} onChange={onChange} /><p><strong>{story.notice}</strong></p><p>Illustrative fictional imagery · {scene.date}. {story.contentNote}</p>{game.saveWarning&&<p role="status">{game.saveWarning}</p>}<details><summary>Scene summary, planning model &amp; earlier choices</summary><p>{scene.summary}</p><p>{game.planning.limit}</p>{storyCallbacks(game).map((text,i)=><p key={i}>{text}</p>)}</details></section>;
}
