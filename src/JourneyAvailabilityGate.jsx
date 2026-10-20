import { isJourneyHidden } from './journeyAvailability.js';

// Gate before mounting gameplay: old links must never load, migrate or write saves.
export function JourneyAvailabilityGate({ search, children }) {
  const params = new URLSearchParams(search);
  if (!isJourneyHidden(params.get('story'))) return children;
  return <main style={{maxWidth:'42rem',margin:'4rem auto',padding:'1.5rem'}}>
    <h1>This journey is temporarily unavailable</h1>
    <p>The Cuban and Vietnamese boat journeys are being reworked. Your saved progress is preserved for their return.</p>
    <a href={params.get('mode') === 'full' ? '/?mode=full' : '/'}>Choose another journey</a>
  </main>;
}
