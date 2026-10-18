import { cambodiaStoryEnabled } from "./cambodiaState.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  BatteryMedium,
  BookOpenText,
  Briefcase,
  ChatCircleDots,
  Clock,
  Compass,
  Crosshair,
  Drop,
  Eye,
  FirstAidKit,
  ForkKnife,
  GithubLogo,
  Handshake,
  Heartbeat,
  HouseLine,
  MapPin,
  MusicNotes,
  Pill,
  Question,
  SpeakerHigh,
  Sparkle,
  UsersThree,
  UserCircle,
  Wallet,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  FAMILY_PRESETS,
  JOURNEY_STAGES,
  ROUTES,
  buySupply,
  chooseOption,
  continueJourney,
  getCondition,
  getEvent,
  getFamilyPreset,
  getJourneyStage,
  getPeople,
  getPortraitMood,
  getRequirementFailure,
  getRoadsideOpportunity,
  getSocialFeed,
  getSocialResponseOptions,
  getSupplyStop,
  getTravelLeadOptions,
  getTravelPlanOptions,
  hasCompletedRoadsideWork,
  hasRespondedToSocialFeed,
  planTravelLeg,
  requiresTravelPlan,
  respondToSocialFeed,
  resolveTravelIncident,
  takeRoadsideJob,
  useMedicine,
} from "./game.js";
import {
  hasSelectedFamily,
  loadCurrentGame,
  loadFamilySaves,
  loadJourneyArchive,
  saveFamilyGame,
  selectFamilyGame,
} from "./saveStore.js";
import {
  completeTutorialOverlayState,
  createInitialOnboardingState,
} from "./onboarding.js";
import { SocialFeedModal, SocialFeedTrigger } from "./SocialFeed.jsx";
import { Portrait } from "./Portrait.jsx";
import { JourneyMap } from "./JourneyMap.jsx";
import { JourneyHistoryDialog, SceneHistory } from "./JourneyHistory.jsx";
import { getJourneyDate, getJourneyHistory, shouldShowJourneyIntro, rememberJourneyIntro } from "./journeyHistory.js";
import { SupplyShop, SupplyStopTrigger } from "./SupplyShop.jsx";
import { TravelIncident } from "./TravelIncident.jsx";
import { createInteractionSounds } from "./soundEffects.js";
import { createJourneySoundtrack, selectSoundtrackTheme } from "./soundtrack.js";
import "./beginner.css";

const CONTENT_MODE_KEY = "the-long-road-content-mode-v1";
const TUTORIAL_COMPLETE_KEY = "the-undocumented-trail-tutorial-v2";

const TUTORIAL_STEPS = [
  {
    icon: Compass,
    eyebrow: "Welcome to the journey",
    title: "Guide people, not game pieces",
    copy: "Every decision balances safety, time, money, dignity, and incomplete information. Reaching a destination does not guarantee legal status or erase what happened on the road.",
    lessons: ["There is rarely one perfect answer", "The family can stop or choose a different destination", "Sensitive events remain non-graphic"],
  },
  {
    icon: Crosshair,
    eyebrow: "How decisions work",
    title: "Read the route before you choose",
    copy: "Read what the family knows and notice what is only a promise. Choose a path to discover its actual consequences; they appear after you commit.",
    lessons: ["Trusted does not mean guaranteed", "High-risk routes may be faster", "Research links explain the real-world basis"],
  },
  {
    icon: FirstAidKit,
    eyebrow: "Keep the family moving",
    title: "Resources affect real people",
    copy: "Food, water, medicine, stress, and exposure shape the journey. At marked resupply stops, spend cash on essentials before choosing the next path. Select any portrait to review health, hear their latest reaction, or use medicine.",
    lessons: ["Low food and water damage health", "Resupply stops sell medicine and essentials", "Short-term work can rebuild cash and supplies"],
  },
  {
    icon: ChatCircleDots,
    eyebrow: "Read the information environment",
    title: "A viral post is not the whole story",
    copy: "The Current carries reporting, rumors, political messaging, and community support. Verify claims, protect locations, and decide whether public visibility is worth the risk.",
    lessons: ["Posts can mix real events with collective blame", "Verification costs time and phone battery", "Public replies can help and increase exposure"],
  },
  {
    icon: BookOpenText,
    eyebrow: "Choices have a memory",
    title: "Earlier decisions return later",
    copy: "Documents, favors, debts, broken promises, and family trust persist across chapters. Open the journey log at any time to see active story threads and the choices that created them.",
    lessons: ["Family voices reveal changing trust", "Story threads can become payoffs or setbacks", "Your progress saves automatically"],
  },
];

const sceneByEvent = {
  home: "/assets/long-road-theft-night.webp",
  guideOffer: "/assets/long-road-theft-night.webp",
  roadRobbery: "/assets/long-road-theft-night.webp",
  guideAbandon: "/assets/long-road-theft-night.webp",
  blueDoorShelter: "/assets/dawn-horizon.webp",
  waitingTown: "/assets/dawn-horizon.webp",
  clinicQueue: "/assets/dawn-horizon.webp",
  transport: "/assets/dawn-horizon.webp",
  checkpointDelay: "/assets/dawn-horizon.webp",
  policyNews: "/assets/guided-night-camp.webp",
  northernWait: "/assets/guided-night-camp.webp",
  borderCity: "/assets/guided-night-camp.webp",
  riverCrossing: "/assets/guided-night-camp.webp",
  memorial: "/assets/guided-night-camp.webp",
  detention: "/assets/guided-night-camp.webp",
  rohingyaSea: "/assets/rohingya-sea-scene.webp",
  rohingyaWeather: "/assets/rohingya-sea-scene.webp",
  rohingyaSignal: "/assets/rohingya-sea-scene.webp",
};

const reducedDescriptions = {
  blueDoorShelter: "The shelter is caring for a survivor of violence. Details are not shown. The family decides how long to stay and how to help.",
  riverCrossing: "The boat is visibly unsafe, and the crossing carries a risk of death. Further details are shortened.",
  memorial: "The family is grieving Daniela's death. The memorial remains part of the story without detailed description.",
  haddadAegean: "The family must decide whether to attempt a dangerous sea crossing. The risks are stated without graphic detail.",
  haddadMemorial: "The family is grieving Mariam's death. The memorial remains part of the story without detailed description.",
  diopAtlantic: "The four relatives must decide whether to turn back or attempt a dangerous Atlantic crossing. The risks are stated without graphic detail.",
  diopMemorial: "The three survivors are grieving Lamine's death. The memorial remains part of the story without detailed description.",
  nguyenSafeHouse: "The family faces forced labor and threats of sexual violence. The abuse is not described in detail, and Mai chooses what information to record.",
  nguyenChannel: "The family must decide whether to stop in France or attempt a dangerous Channel crossing. The risks are stated without graphic detail.",
  rohingyaCoast: "The family must decide whether to return to the camp or accept an unsafe, unverified sea route. The risks are stated without graphic detail.",
  rohingyaSea: "The crossing is taking longer than promised, and the family must ration limited water. Further details are shortened.",
  rohingyaWeather: "Changing weather makes the current route unsafe. The family chooses how to reduce the immediate risk.",
  rohingyaSignal: "The boat is disabled at sea. The family can seek rescue without knowing where landing will be permitted.",
};

const storyTitles = {
  home: "The family home is sold. The threat remains.",
  guideOffer: "A stranger promises the whole road north.",
  roadRobbery: "Everything in the pockets.",
  guideAbandon: "The coyote is gone with the deposit.",
  blueDoorShelter: "For three nights, the door has a lock.",
  waitingTown: "The road becomes a room paid by the week.",
  clinicQueue: "Four inhaler doses remain.",
  transport: "Every way north has a price.",
  checkpointDelay: "The bus stops. Nobody names an hour.",
  policyNews: "The rules change while the family waits.",
  northernWait: "Weeks pass with their shoes beside the bed.",
  borderCity: "The border offers no safe certainty.",
  riverCrossing: "The boat is smaller than promised.",
  memorial: "There is an empty place in the circle.",
  detention: "The lights never turn off.",
  haddadHome: "The workshop is gone. The apartment key remains.",
  haddadBorder: "A border crossed is not a place secured.",
  haddadTurkey: "Work buys time, but not certainty.",
  haddadAegean: "The sea is shorter than the list of risks.",
  haddadMemorial: "The key belongs to an empty hand.",
  haddadGreece: "Every name enters another system.",
  haddadBalkans: "A delayed connection leaves everyone waiting.",
  haddadEuropeNews: "A photograph becomes an argument about everyone.",
  haddadGermany: "Arrival begins another kind of waiting.",
  diopHome: "Four bags wait beside an empty repair stall.",
  diopDakar: "A posted wage is smaller than a recruiter's promise.",
  diopSaintLouis: "Every road north asks who keeps the documents.",
  diopNouakchott: "The boat is delayed. The deposit is not returned.",
  diopAtlantic: "Paid places expire. The ocean does not care.",
  diopMemorial: "The blue notebook has no hand to hold it.",
  diopCanaryLanding: "Three survivors arrive with four names.",
  diopIslandWait: "A deportation video fills every phone.",
  diopFinal: "Arrival begins three separate legal questions.",
  nguyenHome: "The family home secures a promise without a contract.",
  nguyenRecruiter: "The employer disappears when the number is checked.",
  nguyenTransit: "The driver asks for every passport.",
  nguyenSafeHouse: "The debt grows behind a locked warehouse door.",
  nguyenFrance: "The Channel is close. Safety is not.",
  nguyenChannel: "Every crossing is sold as the last one.",
  nguyenUKArrival: "Arrival begins with questions, not permission.",
  nguyenPolicy: "A deportation video fills every phone.",
  nguyenFinal: "Four names enter separate, uncertain decisions.",
  punjabHome: "Four permits appear beside one changing price.",
  punjabDelhi: "A pending application is sold as a guarantee.",
  punjabAirport: "The agent's story does not match the documents.",
  punjabDublin: "Arrival requires more than an employer's address.",
  punjabWorksite: "Every payslip subtracts another promise.",
  punjabInspection: "The plant closes. The permits do not move with it.",
  punjabPolicy: "A deportation flight becomes someone else's celebration.",
  punjabFinal: "Four workers ask to re-enter the system.",
  rohingyaCamp: "A closed classroom and an unverified boat.",
  rohingyaPapers: "Papers do not create citizenship. Losing them still matters.",
  rohingyaCoast: "The broker calls changing weather a deadline.",
  rohingyaSea: "Every cup of water becomes a family decision.",
  rohingyaWeather: "The forecast changes faster than the promise.",
  rohingyaSignal: "Rescue offers no choice of shore.",
  rohingyaLanding: "Land is reached. Permission is not.",
  rohingyaAceh: "Survival is not the same as belonging.",
};

const reducedFatalityNames = {
  boardOverloaded: "Daniela",
  haddadOverloadedBoat: "Mariam",
  diopSmallerPirogue: "Lamine",
  diopNightPirogue: "Lamine",
};

function StoryVoice({ message, game, people }) {
  const speaker = people.find((person) => person.name.toLocaleLowerCase() === message.sender.toLocaleLowerCase());
  const voiceTone = message.trusted === true ? "trusted" : message.trusted === false ? "unverified" : "context";
  const sourceLabel = message.trusted === true
    ? "Known voice"
    : message.trusted === false
      ? "Identity unverified"
      : "Story context";

  return (
    <article className={`cinematic-voice ${voiceTone}`}>
      <div className={`cinematic-speaker-avatar ${speaker ? "traveler" : "source"}`}>
        {speaker ? (
          <Portrait
            person={speaker}
            state={game.people[speaker.id]}
            stress={game.resources.stress}
            family={game}
            alt={`${speaker.name} speaking`}
          />
        ) : (
          <UserCircle weight="duotone" aria-hidden="true" />
        )}
      </div>
      <div className="cinematic-voice-copy">
        <header>
          <span><strong>{message.sender}</strong><small>{message.role}</small></span>
          <em>{sourceLabel}</em>
        </header>
        <blockquote>“{message.body}”</blockquote>
      </div>
    </article>
  );
}

function loadContentMode() {
  return localStorage.getItem(CONTENT_MODE_KEY) ?? "standard";
}

function hasCompletedTutorial() {
  return localStorage.getItem(TUTORIAL_COMPLETE_KEY) === "complete";
}

function StatusItem({ icon: Icon, label, value, tone = "", tooltip }) {
  return (
    <div
      className={`cinematic-status-item ${tone}`}
      tabIndex="0"
      data-tooltip={tooltip}
      data-tooltip-position="top"
      aria-label={`${label}: ${value}. ${tooltip}`}
    >
      <Icon weight="duotone" aria-hidden="true" />
      <span><small>{label}</small><strong>{value}</strong></span>
    </div>
  );
}

const journeyStageIcons = {
  home: HouseLine,
  transit: Compass,
  arrival: MapPin,
  review: BookOpenText,
};

function JourneyGauge({ game, event }) {
  const currentStage = getJourneyStage(game);
  const currentIndex = JOURNEY_STAGES.findIndex((stage) => stage.id === currentStage.id);
  const stageProgress = (currentIndex / (JOURNEY_STAGES.length - 1)) * 100;

  return (
    <section
      className="cinematic-journey-status"
      style={{ "--stage-fill": `${stageProgress * 0.75}%` }}
      aria-label={`Current chapter: ${event.location}. ${currentStage.label} stage. ${game.progress}% of the story complete.`}
    >
      <header className="cinematic-current-chapter">
        <MapPin weight="fill" aria-hidden="true" />
        <span><small>Current chapter</small><strong>{event.location}</strong></span>
        <em>{game.progress}%</em>
      </header>
      <div className="cinematic-stage-gauge" aria-hidden="true">
        {JOURNEY_STAGES.map((stage, index) => {
          const Icon = journeyStageIcons[stage.id];
          const state = index < currentIndex ? "complete" : index === currentIndex ? "active" : "upcoming";
          return (
            <span className={state} key={stage.id}>
              <i><Icon weight={state === "active" ? "fill" : "duotone"} /></i>
              <small>{stage.label}</small>
            </span>
          );
        })}
      </div>
    </section>
  );
}

function RoadsideWork({ opportunity, outcome, completed, onChoose, onClose }) {
  return (
    <div className="cinematic-work-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="cinematic-work-dialog" role="dialog" aria-modal="true" aria-labelledby="work-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="cinematic-work-close" onClick={onClose} aria-label="Close work opportunity" data-sound="dismiss"><X weight="bold" /></button>
        <Briefcase weight="duotone" aria-hidden="true" />
        <small>{completed ? "Shift completed" : opportunity.eyebrow}</small>
        <h2 id="work-dialog-title">{completed ? outcome.title : opportunity.title}</h2>
        <p>{completed ? outcome.copy : opportunity.copy}</p>
        {completed ? (
          <div className={`cinematic-work-result ${outcome.tone}`}>
            <strong>What changed</strong>
            <span>{outcome.consequence}</span>
            {outcome.appliedBonuses?.map((bonus) => <em key={bonus}><Sparkle weight="fill" />{bonus}</em>)}
            {outcome.reactions?.map((reaction) => (
              <blockquote key={`${reaction.personId}-${reaction.text}`}><strong>{reaction.personName}</strong> “{reaction.text}”</blockquote>
            ))}
            {outcome.threadUpdates?.map((thread) => <em key={thread.id}><BookOpenText weight="fill" />Story thread: {thread.title}</em>)}
            <button onClick={onClose} data-sound="confirm">Return to the journey<ArrowRight weight="bold" /></button>
          </div>
        ) : (
          <div className="cinematic-work-choices" aria-label="Short-term work options">
            {opportunity.choices.map((choice) => (
              <button key={choice.id} className="" onClick={() => onChoose(choice.id)} data-sound="choice">
                <small>{choice.tone === "danger" ? "Unverified offer" : "One-day shift"}</small>
                <strong>{choice.title}</strong>
                <span>{choice.hint}</span>

              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TravelPlanner({ game, onChoose }) {
  const [leadPersonId, setLeadPersonId] = useState(null);
  const leadOptions = getTravelLeadOptions(game);
  const selectedLead = leadOptions.find((option) => option.personId === leadPersonId) ?? null;
  const strategies = getTravelPlanOptions(game, leadPersonId);

  return (
    <div className="cinematic-travel-planner" aria-label="Plan this travel leg">
      <header>
        <Clock weight="duotone" />
        <span><small>The next leg lasts {game.currentOutcome.days} days</small><strong>Assign a travel role, then choose the pace</strong></span>
      </header>
      <section className="cinematic-travel-leadership" aria-labelledby="travel-leadership-title">
        <div className="cinematic-travel-step">
          <small>Step 1 · Family role</small>
          <strong id="travel-leadership-title">Who should coordinate this leg?</strong>
          <span>Trust changes how strongly each skill helps.</span>
        </div>
        <div className="cinematic-travel-leads" role="group" aria-label="Choose a traveler to coordinate the leg">
          {leadOptions.map((option) => (
            <button
              type="button"
              className={leadPersonId === option.personId ? "selected" : ""}
              key={option.personId}
              onClick={() => setLeadPersonId(option.personId)}
              disabled={Boolean(option.unavailable)}
              aria-pressed={leadPersonId === option.personId}
              title={option.unavailable ?? option.roleTitle}
              data-sound="tap"
            >
              <Portrait
                person={option.person}
                state={game.people[option.personId]}
                stress={game.resources.stress}
                family={game}
                alt=""
              />
              <span>
                <strong>{option.person.name}</strong>
                <small>{option.skill} · Trust {option.trust}/5</small>
                <em>{option.unavailable ?? option.roleTitle}</em>
              </span>
            </button>
          ))}
        </div>
      </section>
      <div className="cinematic-travel-step cinematic-travel-pace-heading">
        <small>Step 2 · Travel pace</small>
        <strong>{selectedLead ? `${selectedLead.person.name} will coordinate. How should the group travel?` : "Choose a family role to unlock the travel plans"}</strong>
      </div>
      <div className="cinematic-travel-strategies">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}

            onClick={() => onChoose(strategy.id, leadPersonId)}
            disabled={!selectedLead || Boolean(strategy.unavailable)}
            data-sound="choice"
          >
            <small>{!selectedLead ? "Assign a travel role first" : strategy.unavailable ?? strategy.hint}</small>
            <strong>{strategy.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function CareDialog({ game, person, onUseMedicine, onClose }) {
  const state = game.people[person.id];
  const relationshipNote = game.relationshipNotes?.[person.id];
  const condition = getCondition(state.health, state.alive !== false);
  const unavailable = state.alive === false
    ? "This person is remembered"
    : state.health >= 100
      ? "Health is already full"
      : game.resources.medicine < 1
        ? "No medicine remains"
        : null;
  return (
    <div className="cinematic-work-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="cinematic-care-dialog" role="dialog" aria-modal="true" aria-labelledby="care-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="cinematic-work-close" onClick={onClose} aria-label="Close traveler details" data-sound="dismiss"><X weight="bold" /></button>
        <div className="cinematic-care-heading">
          <Portrait person={person} state={state} stress={game.resources.stress} family={game} />
          <span><small>Traveling together</small><h2 id="care-dialog-title">{person.name}</h2><strong className={condition.tone}>{condition.label} · {state.health}% health</strong></span>
        </div>
        <p>{person.story}</p>
        <div className="cinematic-care-skills">
          {person.skills.map((skill) => <span key={skill}><Sparkle weight="fill" />{skill}</span>)}
        </div>
        {relationshipNote && (
          <blockquote className="cinematic-care-voice">
            <small>Latest family voice · Day {relationshipNote.day}</small>
            <p>“{relationshipNote.text}”</p>
          </blockquote>
        )}
        <div className="cinematic-care-action">
          <Pill weight="duotone" />
          <span><strong>{game.resources.medicine} {game.resources.medicine === 1 ? "dose" : "doses"} available</strong><small>Medicine restores 15 health and lowers group stress.</small></span>
          <button onClick={() => onUseMedicine(person.id)} disabled={Boolean(unavailable)} data-sound="confirm">{unavailable ?? "Use one dose"}</button>
        </div>
      </section>
    </div>
  );
}

function JourneyLog({ game, onClose }) {
  const storyThreads = Object.values(game.storyThreads ?? {}).sort((a, b) => b.updatedDay - a.updatedDay);
  const entries = [
    ...game.history.map((entry) => ({ day: entry.day, kind: "Decision", title: entry.choiceTitle, detail: `${entry.location} · ${entry.outcomeTitle}`, tone: entry.tone })),
    ...(game.activityLog ?? []).map((entry) => ({
      ...entry,
      kind: entry.kind === "work"
        ? "Work"
        : entry.kind === "social"
          ? "The Current"
        : entry.kind === "care"
          ? "Care"
          : entry.kind === "remembrance"
            ? "Remembrance"
            : "Travel plan",
    })),
  ].sort((a, b) => b.day - a.day);
  return (
    <div className="cinematic-work-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="cinematic-log-dialog" role="dialog" aria-modal="true" aria-labelledby="cinematic-log-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="cinematic-work-close" onClick={onClose} aria-label="Close journey log" data-sound="dismiss"><X weight="bold" /></button>
        <BookOpenText weight="duotone" />
        <small>Saved automatically</small>
        <h2 id="cinematic-log-title">Journey log</h2>
        {storyThreads.length > 0 && (
          <div className="cinematic-log-threads">
            <h3>Choices still traveling with the family</h3>
            {storyThreads.map((thread) => (
              <article className={thread.status} key={thread.id}>
                <span>{thread.status === "resolved" ? "Resolved" : thread.status === "setback" ? "Setback" : "Active"}</span>
                <strong>{thread.title}</strong>
                <small>{thread.summary}</small>
              </article>
            ))}
          </div>
        )}
        {entries.length ? <ol>{entries.map((entry, index) => (
          <li key={`${entry.day}-${entry.title}-${index}`}>
            <span>Day {entry.day}<small>{entry.kind}</small></span>
            <div><strong>{entry.title}</strong><small>{entry.detail}</small></div>
          </li>
        ))}</ol> : <p>The first decision begins at the family home.</p>}
      </section>
    </div>
  );
}

function FamilySelection({ currentFamilyId, required, saves, archive, onSelect, onRestart, onClose }) {
  const families = Object.values(FAMILY_PRESETS);
  const initialIndex = Math.max(0, families.findIndex((family) => family.id === currentFamilyId));
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(initialIndex);
  const recentJourneys = archive.slice(0, 6);

  const scrollToFamily = (index, behavior = "smooth") => {
    const rail = carouselRef.current;
    const nextIndex = Math.min(families.length - 1, Math.max(0, index));
    const card = rail?.children[nextIndex];
    if (!rail || !card) return;
    const left = card.offsetLeft - ((rail.clientWidth - card.clientWidth) / 2);
    rail.scrollTo({ left: Math.max(0, left), behavior });
    setCarouselIndex(nextIndex);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToFamily(initialIndex, "auto"));
    return () => cancelAnimationFrame(frame);
  }, [currentFamilyId]);

  const updateCarouselIndex = () => {
    const rail = carouselRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + (rail.clientWidth / 2);
    const nextIndex = [...rail.children].reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + (card.clientWidth / 2);
      return Math.abs(cardCenter - center) < closest.distance
        ? { index, distance: Math.abs(cardCenter - center) }
        : closest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
    setCarouselIndex(nextIndex);
  };

  const handleCarouselKeys = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollToFamily(carouselIndex + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <div className="cinematic-family-backdrop">
      <section className="cinematic-family-dialog" role="dialog" aria-modal="true" aria-labelledby="family-selection-title">
        {!required && <button className="cinematic-work-close" onClick={onClose} aria-label="Close family selection" data-sound="dismiss"><X weight="bold" /></button>}
        <span className="cinematic-family-symbol"><UsersThree weight="duotone" /></span>
        <small>Choose a journey</small>
        <h2 id="family-selection-title">Whose road will you follow?</h2>
        <p>Each traveling group is a fictional composite grounded in documented experiences. Every family now keeps its own progress, so you can leave one road and safely return later.</p>
        <div className="cinematic-family-carousel">
          <div className="cinematic-family-carousel-controls">
            <span aria-live="polite"><strong>{carouselIndex + 1} of {families.length}</strong><small>Drag, swipe, or use the arrows</small></span>
            <div>
              <button onClick={() => scrollToFamily(carouselIndex - 1)} disabled={carouselIndex === 0} aria-label="Previous journey" data-sound="tap"><ArrowLeft weight="bold" /></button>
              <button onClick={() => scrollToFamily(carouselIndex + 1)} disabled={carouselIndex === families.length - 1} aria-label="Next journey" data-sound="tap"><ArrowRight weight="bold" /></button>
            </div>
          </div>
          <div
            className="cinematic-family-options"
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Journey choices"
            tabIndex="0"
            onScroll={updateCarouselIndex}
            onKeyDown={handleCarouselKeys}
          >
          {families.map((family, index) => {
            const saved = saves[family.id];
            const savedStatus = saved?.phase === "ended"
              ? `${saved.status === "won" ? "Completed" : "Journey stopped"}`
              : saved
                ? `In progress · Day ${saved.day} · ${saved.progress}%`
                : "Not started";
            return (
              <article
                className={`cinematic-family-card ${currentFamilyId === family.id ? "selected" : ""}`}
                key={family.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${families.length}: ${family.name}`}
              >
                <div className="cinematic-family-portrait">
                  <img src={family.portraitStrips.healthy} alt={`Portraits of ${family.name}`} />
                  <span className={saved?.phase === "ended" ? saved.status : saved ? "playing" : "new"}>{savedStatus}</span>
                </div>
                <div className="cinematic-family-copy">
                  <small>{family.origin}</small>
                  <span className="history-chooser-setting">{getJourneyHistory(family.id).place} · {getJourneyHistory(family.id).era}</span>
                  <strong>{family.name}</strong>
                  <p>{family.context}</p>
                  <em><MapPin weight="fill" />{family.journey}</em>
                </div>
                <div className="cinematic-family-actions">
                  <button className="continue" onClick={() => onSelect(family.id)} data-sound="confirm">
                    {saved ? (saved.phase === "ended" ? "View result" : "Continue") : "Start journey"}<ArrowRight weight="bold" />
                  </button>
                  {saved && (
                    <button className="restart" onClick={() => onRestart(family.id)} data-sound="warning">
                      <ArrowCounterClockwise weight="bold" />Start again
                    </button>
                  )}
                </div>
              </article>
            );
          })}
          </div>
        </div>
        {cambodiaStoryEnabled(import.meta.env) && <section className="cinematic-journey-archive"><h3>Historical stories</h3><p>An unscored fictional composite about migration, refuge and rebuilding.</p><a href="/?story=cambodia-1979">A Place for Tomorrow · Khmer Cambodian household, 1979–1982 →</a></section>}
        {recentJourneys.length > 0 && (
          <section className="cinematic-journey-archive" aria-label="Completed journey archive">
            <header><BookOpenText weight="duotone" /><span><small>Journey archive</small><strong>Roads already traveled</strong></span></header>
            <div>
              {recentJourneys.map((entry) => {
                const family = FAMILY_PRESETS[entry.familyId];
                return (
                  <article key={entry.runId}>
                    <span><strong>{family.shortName}</strong><small>{entry.endingTitle}</small></span>
                    <em>{entry.status === "won" ? "Completed" : "Stopped"}</em>
                    <span><strong>{entry.survivors}/{entry.travelers}</strong><small>Survived</small></span>
                    <span><strong>Day {entry.day}</strong><small>{entry.decisions} decisions</small></span>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        <footer>Stories include displacement, exploitation, detention, family loss, and uncertain legal outcomes. Difficult events remain non-graphic.</footer>
      </section>
    </div>
  );
}

function ContentSettings({ currentMode, onSelect, onClose }) {
  return (
    <div className="cinematic-work-backdrop cinematic-content-backdrop">
      <section className="cinematic-content-dialog" role="dialog" aria-modal="true" aria-labelledby="content-settings-title">
        <button className="cinematic-work-close" onClick={onClose} aria-label="Close content settings" data-sound="dismiss"><X weight="bold" /></button>
        <WarningCircle weight="duotone" />
        <small>Content settings</small>
        <h2 id="content-settings-title">Choose how difficult events are described</h2>
        <p>This fictional composite includes threats, sexual violence, child death, detention, and deportation. Harm is never shown graphically, and links identify the research behind the story.</p>
        <div className="cinematic-content-options">
          <button className={currentMode === "standard" ? "selected" : ""} onClick={() => onSelect("standard")} data-sound="confirm">
            <strong>Non-graphic detail</strong><span>Keep the full written context without graphic imagery.</span>
          </button>
          <button className={currentMode === "reduced" ? "selected" : ""} onClick={() => onSelect("reduced")} data-sound="confirm">
            <strong>Shorter descriptions</strong><span>Shorten the most sensitive passages while preserving consequences.</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function Tutorial({ step, onBack, onNext, onFinish }) {
  const item = TUTORIAL_STEPS[step];
  const Icon = item.icon;
  const isLastStep = step === TUTORIAL_STEPS.length - 1;
  return (
    <div className="cinematic-tutorial-backdrop" onKeyDown={(event) => event.key === "Escape" && onFinish()}>
      <section className="cinematic-tutorial" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <header>
          <span className="cinematic-tutorial-icon"><Icon weight="duotone" /></span>
          <button onClick={onFinish} data-sound="dismiss">Skip tutorial</button>
        </header>
        <small>{item.eyebrow}</small>
        <h2 id="tutorial-title">{item.title}</h2>
        <p>{item.copy}</p>
        <div className="cinematic-tutorial-lessons">
          {item.lessons.map((lesson, index) => <span key={lesson}><i>{index + 1}</i>{lesson}</span>)}
        </div>
        <footer>
          <div className="cinematic-tutorial-progress" aria-label={`Tutorial step ${step + 1} of ${TUTORIAL_STEPS.length}`}>
            {TUTORIAL_STEPS.map((tutorialStep, index) => <i className={index === step ? "active" : index < step ? "complete" : ""} key={tutorialStep.title} />)}
            <small>{step + 1} / {TUTORIAL_STEPS.length}</small>
          </div>
          <div>
            {step > 0 && <button className="tutorial-back" onClick={onBack} data-sound="dismiss">Back</button>}
            <button className="tutorial-next" autoFocus onClick={isLastStep ? onFinish : onNext} data-sound="confirm">
              {isLastStep ? "Begin the journey" : "Next"}<ArrowRight weight="bold" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function Ending({ game, onTryAgain, onChooseFamily, onExploreHistory }) {
  const won = game.status === "won";
  const people = getPeople(game);
  const survivors = people.filter((person) => game.people[person.id].alive !== false);
  const losses = people.filter((person) => game.people[person.id].alive === false);
  const reachedDestination = won && game.progress >= 100;
  return (
    <div className={`cinematic-ending-backdrop ${won ? "arrival" : "journey-stopped"}`}>
      <section className={`cinematic-ending ${game.status}`} role="dialog" aria-modal="true" aria-labelledby="cinematic-ending-title">
        <span className="cinematic-ending-symbol">
          {won ? <HouseLine weight="fill" /> : <Heartbeat weight="duotone" />}
        </span>
        <small>{reachedDestination ? "Destination reached · Route complete" : won ? "A new destination · Journey complete" : "The journey ends here"}</small>
        <h2 id="cinematic-ending-title">{game.ending.title}</h2>
        <p>{game.ending.copy}</p>
        <p className="history-ending-period">{getJourneyDate(game)}</p>
        <button className="history-ending-button" onClick={onExploreHistory}>Explore the history</button>
        <JourneyMap game={game} compact />

        {won && (
          <div className="cinematic-arrival-route" aria-label={`${game.progress}% of the planned route completed`}>
            <div><span>Home</span><strong>{reachedDestination ? "Destination" : "New beginning"}</strong></div>
            <span className="cinematic-arrival-track"><i style={{ width: `${game.progress}%` }} /><HouseLine weight="fill" /></span>
            <small>{game.progress}% of the planned route completed</small>
          </div>
        )}

        <div className="cinematic-ending-stats" aria-label="Journey results">
          <div><strong>{Math.max(1, game.day - 1)}</strong><span>Days traveled</span></div>
          <div><strong>{survivors.length}/{people.length}</strong><span>Survived</span></div>
          <div><strong>{game.history.length}</strong><span>Decisions</span></div>
        </div>

        <div className="cinematic-ending-people" aria-label="Family at the end of the journey">
          {people.map((person) => {
            const state = game.people[person.id];
            const alive = state.alive !== false;
            return (
              <div className={alive ? "survived" : "remembered"} key={person.id}>
                <Portrait person={person} state={state} stress={game.resources.stress} family={game} />
                <span><strong>{person.name}</strong><small>{alive ? `${state.health}% health` : "Remembered"}</small></span>
              </div>
            );
          })}
        </div>

        {losses.length > 0 && (
          <div className="cinematic-remembrance">
            <Heartbeat weight="duotone" />
            <span><strong>Remembered on the road</strong><small>{losses.map((person) => person.name).join(", ")}</small></span>
          </div>
        )}

        <div className="cinematic-ending-actions">
          <button className="try-again" onClick={onTryAgain} data-sound="confirm"><ArrowCounterClockwise weight="bold" />Try again</button>
          <button className="choose-family" onClick={onChooseFamily} data-sound="tap"><UsersThree weight="duotone" />Choose another family</button>
        </div>
      </section>
    </div>
  );
}

function RestartConfirmation({ familyName, day, decisions, onCancel, onConfirm }) {
  return (
    <div className="cinematic-work-backdrop cinematic-reset-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="cinematic-reset-dialog" role="dialog" aria-modal="true" aria-labelledby="cinematic-reset-title" onMouseDown={(event) => event.stopPropagation()}>
        <WarningCircle weight="duotone" aria-hidden="true" />
        <small>Reset journey</small>
        <h2 id="cinematic-reset-title">Start the {familyName} journey again?</h2>
        <p>Day {day} and {decisions} recorded {decisions === 1 ? "decision" : "decisions"} for this family will be replaced. Other family saves and completed journey records will remain safe.</p>
        <div className="cinematic-reset-actions">
          <button className="cinematic-reset-cancel" onClick={onCancel} data-sound="dismiss" autoFocus>Keep this journey</button>
          <button className="cinematic-reset-confirm" onClick={onConfirm} data-sound="warning">Start again<ArrowCounterClockwise weight="bold" /></button>
        </div>
      </section>
    </div>
  );
}

export function BeginnerApp() {
  const [initialOnboardingState] = useState(() => createInitialOnboardingState({
    tutorialComplete: hasCompletedTutorial(),
    familySelected: hasSelectedFamily(),
  }));
  const [game, setGame] = useState(loadCurrentGame);
  const [familySelectionRequired, setFamilySelectionRequired] = useState(initialOnboardingState.familySelectionRequired);
  const [showFamilySelection, setShowFamilySelection] = useState(initialOnboardingState.showFamilySelection);
  const [familySaves, setFamilySaves] = useState(loadFamilySaves);
  const [journeyArchive, setJourneyArchive] = useState(loadJourneyArchive);
  const [soundtrackOn, setSoundtrackOn] = useState(false);
  const [showRoadsideWork, setShowRoadsideWork] = useState(false);
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [showSupplyShop, setShowSupplyShop] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [showJourneyLog, setShowJourneyLog] = useState(false);
  const [contentMode, setContentMode] = useState(loadContentMode);
  const [showContentSettings, setShowContentSettings] = useState(false);
  const [restartFamilyId, setRestartFamilyId] = useState(null);
  const [restartReturnsToSelection, setRestartReturnsToSelection] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(initialOnboardingState.showTutorial);
  const [tutorialIsOnboarding, setTutorialIsOnboarding] = useState(initialOnboardingState.tutorialIsOnboarding);
  const [historyMode, setHistoryMode] = useState(null);
  const [showJourneyTools, setShowJourneyTools] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const soundtrackRef = useRef(null);
  const interactionSoundsRef = useRef(null);
  const journeyToolsRef = useRef(null);
  const choicesRef = useRef(null);
  const family = getFamilyPreset(game);
  const people = getPeople(game);
  const event = getEvent(game);
  const route = ROUTES[game.route];
  const roadsideOpportunity = getRoadsideOpportunity(game);
  const roadsideWorkCompleted = hasCompletedRoadsideWork(game);
  const roadsideOutcome = roadsideWorkCompleted && game.lastRoadsideOutcome?.eventId === game.eventId
    ? game.lastRoadsideOutcome
    : null;
  const socialFeed = getSocialFeed(game);
  const socialFeedResolved = hasRespondedToSocialFeed(game);
  const socialOutcome = socialFeedResolved && game.lastSocialOutcome?.eventId === game.eventId
    ? game.lastSocialOutcome
    : null;
  const socialOptions = getSocialResponseOptions(game);
  const supplyStop = getSupplyStop(game);
  const selectedPerson = people.find((person) => person.id === selectedPersonId) ?? null;
  const travelPlanRequired = requiresTravelPlan(game);
  const reducedFatalityName = reducedFatalityNames[game.currentOutcome?.id];
  const reducedDecisionCopy = contentMode === "reduced" ? reducedDescriptions[event.id] : null;
  const storyCopy = game.phase === "decision"
    ? (reducedDecisionCopy
      ? reducedDecisionCopy
      : event.messages.map((message) => message.body).join(" "))
    : (contentMode === "reduced" && reducedFatalityName
      ? `The crossing ends with ${reducedFatalityName}'s death. The event is not described in detail.`
      : game.currentOutcome.copy);
  const decisionMessages = reducedDecisionCopy
    ? [{ sender: "Story context", role: "Non-graphic summary", body: reducedDecisionCopy }]
    : event.messages;
  const restartGame = restartFamilyId ? (familySaves[restartFamilyId] ?? game) : null;
  const restartFamily = restartFamilyId ? getFamilyPreset(restartFamilyId) : null;
  const optionalActionLabels = [
    roadsideOpportunity ? "Work" : null,
    supplyStop ? "Resupply" : null,
    socialFeed ? "The Current" : null,
  ].filter(Boolean);

  useEffect(() => {
    if (familySelectionRequired) return;
    setFamilySaves(saveFamilyGame(game));
    setJourneyArchive(loadJourneyArchive());
  }, [familySelectionRequired, game]);

  useEffect(() => {
    setShowSocialFeed(false);
    setShowSupplyShop(false);
    setShowJourneyTools(false);
  }, [game.eventId]);

  useEffect(() => {
    if (!showJourneyTools) return undefined;

    const dismissMenu = (pointerEvent) => {
      if (!journeyToolsRef.current?.contains(pointerEvent.target)) setShowJourneyTools(false);
    };
    const dismissOnEscape = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") setShowJourneyTools(false);
    };

    document.addEventListener("pointerdown", dismissMenu);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissMenu);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [showJourneyTools]);

  useEffect(() => {
    if (game.phase !== "decision") {
      setChoicesVisible(false);
      return undefined;
    }

    setChoicesVisible(false);
    const choices = choicesRef.current;
    if (!choices || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setChoicesVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(choices);
    return () => observer.disconnect();
  }, [game.eventId, game.phase]);

  useEffect(() => () => soundtrackRef.current?.dispose(), []);
  useEffect(() => () => interactionSoundsRef.current?.dispose(), []);

  const groupHealth = useMemo(() => {
    const people = Object.values(game.people).filter((person) => person.alive !== false);
    return people.length ? Math.round(people.reduce((total, person) => total + person.health, 0) / people.length) : 0;
  }, [game.people]);

  const averageTrust = useMemo(() => {
    const people = Object.values(game.people).filter((person) => person.alive !== false);
    return people.length ? people.reduce((total, person) => total + person.trust, 0) / people.length : 0;
  }, [game.people]);

  const soundtrackMood = useMemo(() => ({
    stress: game.resources.stress,
    exposure: game.resources.exposure,
    progress: game.progress,
    averageHealth: groupHealth,
    outcomeTone: game.currentOutcome?.tone ?? game.history[game.history.length - 1]?.tone ?? null,
    status: game.status,
  }), [game.currentOutcome, game.history, game.progress, game.resources.exposure, game.resources.stress, game.status, groupHealth]);

  const soundtrackTheme = useMemo(() => selectSoundtrackTheme(soundtrackMood), [soundtrackMood]);

  useEffect(() => {
    soundtrackRef.current?.setMood(soundtrackMood);
  }, [soundtrackMood]);

  const playInteractionSound = (clickEvent) => {
    const button = clickEvent.target.closest("button");
    if (!button || button.disabled) return;
    const sounds = interactionSoundsRef.current ?? createInteractionSounds();
    interactionSoundsRef.current = sounds;
    sounds.play(button.dataset.sound ?? "tap");
  };

  const toggleSoundtrack = async () => {
    const soundtrack = soundtrackRef.current ?? createJourneySoundtrack();
    soundtrackRef.current = soundtrack;
    if (soundtrackOn) {
      soundtrack.pause();
      setSoundtrackOn(false);
      return;
    }
    soundtrack.setMood(soundtrackMood);
    await soundtrack.play();
    setSoundtrackOn(true);
  };

  const selectFamily = (familyId, options = {}) => {
    const selectedGame = selectFamilyGame(familyId, options);
    setGame(selectedGame);
    setFamilySaves(loadFamilySaves());
    setJourneyArchive(loadJourneyArchive());
    setFamilySelectionRequired(false);
    setShowFamilySelection(false);
    setHistoryMode(shouldShowJourneyIntro(selectedGame, window.localStorage) ? "intro" : null);
    setShowRoadsideWork(false);
    setShowSocialFeed(false);
    setShowSupplyShop(false);
    setRestartFamilyId(null);
    setRestartReturnsToSelection(false);
    setSelectedPersonId(null);
    setShowJourneyLog(false);
  };

  const closeHistory = () => {
    if (historyMode === "intro") rememberJourneyIntro(game, window.localStorage);
    setHistoryMode(null);
  };

  const requestRestart = () => {
    setRestartReturnsToSelection(false);
    setRestartFamilyId(game.familyId);
  };
  const requestFamilyRestart = (familyId) => {
    setRestartReturnsToSelection(true);
    setShowFamilySelection(false);
    setRestartFamilyId(familyId);
  };
  const cancelRestart = () => {
    setRestartFamilyId(null);
    if (restartReturnsToSelection) setShowFamilySelection(true);
    setRestartReturnsToSelection(false);
  };
  const confirmRestart = () => {
    if (restartFamilyId) selectFamily(restartFamilyId, { restart: true });
  };

  const choose = (choice) => setGame((current) => chooseOption(current, choice.id));
  const takeWork = (choiceId) => setGame((current) => takeRoadsideJob(current, choiceId));
  const respondToPost = (responseId) => setGame((current) => respondToSocialFeed(current, responseId));
  const continueWithIncidents = () => {
    const incidentRolls = [Math.random(), Math.random(), Math.random()];
    setGame((current) => continueJourney(current, { incidents: true, incidentRolls }));
  };
  const selectContentMode = (mode) => {
    localStorage.setItem(CONTENT_MODE_KEY, mode);
    setContentMode(mode);
    setShowContentSettings(false);
  };

  const finishTutorial = () => {
    localStorage.setItem(TUTORIAL_COMPLETE_KEY, "complete");
    const nextOverlayState = completeTutorialOverlayState({ tutorialIsOnboarding });
    setShowTutorial(nextOverlayState.showTutorial);
    setShowFamilySelection(nextOverlayState.showFamilySelection);
    setTutorialIsOnboarding(nextOverlayState.tutorialIsOnboarding);
  };

  const replayTutorial = () => {
    setShowJourneyTools(false);
    setTutorialStep(0);
    setTutorialIsOnboarding(false);
    setShowTutorial(true);
  };

  const scrollToChoices = () => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    choicesRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    choicesRef.current?.focus({ preventScroll: true });
  };

  return (
    <main className="cinematic-shell" onClickCapture={playInteractionSound}>
      <header className="cinematic-header">
        <a className="cinematic-brand" href="/" aria-label="The Undocumented Trail journey">
          <strong>The Undocumented Trail</strong>
          <span>Everything they carry</span>
        </a>
        <div className="cinematic-header-note">
          <span>Every choice costs.<br />Dignity comes first.</span>
          <i />
          <small>Family<br />Safety<br />Tomorrow</small>
        </div>
        <div className="cinematic-tools" ref={journeyToolsRef}>
          <button
            className="cinematic-tools-trigger"
            onClick={() => setShowJourneyTools((current) => !current)}
            aria-expanded={showJourneyTools}
            aria-controls="cinematic-journey-tools"
            data-sound="tap"
          >
            <Compass weight="duotone" aria-hidden="true" />
            <span>Journey tools</span>
            <ArrowRight weight="bold" aria-hidden="true" />
          </button>
          <div id="cinematic-journey-tools" className={`cinematic-header-actions ${showJourneyTools ? "open" : ""}`} role="group" aria-label="Journey tools">
            <button className="cinematic-music" onClick={() => { setShowJourneyTools(false); setShowFamilySelection(true); }} aria-label="Choose family journey" data-tooltip={`Playing ${family.name} · choose another family`} data-sound="tap"><UsersThree weight="duotone" /><span className="cinematic-tool-label">Choose family</span></button>
            <button className="cinematic-music" onClick={() => { setShowJourneyTools(false); setHistoryMode("explore"); }} aria-label="Explore the history" data-tooltip="Place, period, timeline and sources" data-sound="tap"><BookOpenText weight="duotone" /><span className="cinematic-tool-label">Explore the history</span></button>
            <button className="cinematic-music" onClick={replayTutorial} aria-label="Open tutorial" data-tooltip="How to play" data-sound="tap"><Question weight="duotone" /><span className="cinematic-tool-label">How to play</span></button>
            <button className="cinematic-music" onClick={() => { setShowJourneyTools(false); setShowContentSettings(true); }} aria-label="Open content settings" data-tooltip="Sensitive-content settings" data-sound="tap"><WarningCircle weight="duotone" /><span className="cinematic-tool-label">Content settings</span></button>
            <button className="cinematic-music" onClick={() => { setShowJourneyTools(false); setShowJourneyLog(true); }} aria-label="Open journey log" data-tooltip="Journey log" data-sound="tap"><BookOpenText weight="duotone" /><span className="cinematic-tool-label">Journey log</span></button>
            <a
              className="cinematic-source-link"
              href="https://github.com/thachp/theundocumentedtrail"
              target="_blank"
              rel="noreferrer"
              aria-label="View the open-source project on GitHub"
              data-tooltip="Open source on GitHub · MIT license"
              onClick={() => setShowJourneyTools(false)}
            >
              <GithubLogo weight="fill" aria-hidden="true" />
              <span className="cinematic-tool-label">Open-source project</span>
            </a>
            <button
              className={`cinematic-music ${soundtrackOn ? `playing ${soundtrackTheme.id}` : ""}`}
              onClick={() => { setShowJourneyTools(false); toggleSoundtrack(); }}
              aria-pressed={soundtrackOn}
              aria-label={soundtrackOn ? `Pause music — ${soundtrackTheme.label}` : "Play soundtrack"}
              data-tooltip={soundtrackOn ? `${soundtrackTheme.label} playing · pause music` : "Play the journey soundtrack"}
              data-sound="tap"
            >
              {soundtrackOn ? <SpeakerHigh weight="fill" /> : <MusicNotes weight="duotone" />}
              <span className="cinematic-tool-label">{soundtrackOn ? "Pause soundtrack" : "Play soundtrack"}</span>
            </button>
            <a href="/?mode=full" className="cinematic-full-link" data-tooltip="Open the detailed planning view" data-tooltip-align="right">Planning view</a>
          </div>
        </div>
      </header>

      <section className="cinematic-stage">
        <div key={`${game.familyId}-${event.id}`} className="cinematic-scene" style={{ backgroundImage: `url("${sceneByEvent[event.id] ?? family.heroImage}")` }} aria-hidden="true" />

        <aside className="cinematic-map" aria-label="Journey geography">
          <JourneyMap game={game} />
          <JourneyGauge game={game} event={event} />
        </aside>

        <section className="cinematic-story" aria-label="Current story and decision">
          <div className="cinematic-copy" key={`${event.id}-${game.phase}-${game.currentOutcome?.id ?? "decision"}`}>
            <span>{event.location} · {getJourneyDate(game)}</span>
            <h1 tabIndex="-1" data-history-return>{game.phase === "decision" ? (storyTitles[event.id] ?? event.location) : game.currentOutcome.title}</h1>
            {game.phase === "decision" ? (
              <div className={`cinematic-voices ${decisionMessages.length > 1 ? "multiple" : ""}`}>
                {decisionMessages.map((message, index) => (
                  <StoryVoice key={`${message.sender}-${message.time ?? index}`} message={message} game={game} people={people} />
                ))}
              </div>
            ) : (
              <p>{storyCopy}</p>
            )}
            <SceneHistory game={game} onExplore={() => setHistoryMode("explore")} />
            <div className="cinematic-context">
              <MapPin weight="fill" />
              <small>{event.weather} · {event.time} · {event.region}</small>
            </div>
            {(event.contentNote || event.source) && (
              <div className="cinematic-evidence">
                {event.contentNote && <span>Content note: {event.contentNote}</span>}
                {event.source && <a href={event.source.url} target="_blank" rel="noreferrer">Research basis: {event.source.label}</a>}
              </div>
            )}
            {game.phase === "decision" && optionalActionLabels.length > 0 && (
              <details className="cinematic-optional-actions" key={`optional-${event.id}`}>
                <summary>
                  <span><small>Optional before choosing</small><strong>{optionalActionLabels.join(" · ")}</strong></span>
                  <ArrowRight weight="bold" aria-hidden="true" />
                </summary>
                <div className="cinematic-optional-list">
                  {roadsideOpportunity && (
                    <button className={`cinematic-work-trigger ${roadsideWorkCompleted ? "completed" : ""}`} onClick={() => setShowRoadsideWork(true)} data-sound="tap">
                      <Briefcase weight="duotone" />
                      <span>
                        <small>{roadsideWorkCompleted ? "Work completed here" : roadsideOpportunity.eyebrow}</small>
                        <strong>{roadsideWorkCompleted ? roadsideOutcome?.title : "Find short-term work"}</strong>
                      </span>
                      <ArrowRight weight="bold" />
                    </button>
                  )}
                  {supplyStop && <SupplyStopTrigger stop={supplyStop} onOpen={() => setShowSupplyShop(true)} />}
                  {socialFeed && (
                    <SocialFeedTrigger
                      feed={socialFeed}
                      climate={game.socialClimate}
                      resolved={socialFeedResolved}
                      onOpen={() => setShowSocialFeed(true)}
                    />
                  )}
                </div>
              </details>
            )}
          </div>

          {game.phase === "decision" && !choicesVisible && (
            <button className="cinematic-choice-jump" onClick={scrollToChoices} aria-controls="guided-choice-options" data-sound="tap">
              <Crosshair weight="duotone" aria-hidden="true" />
              <span>View {event.choices.length} choices</span>
              <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          )}

          {game.phase === "decision" ? (
            <div className="cinematic-decision" id="guided-choice-options" ref={choicesRef} tabIndex="-1" key={`choices-${event.id}`}>
              <div className="cinematic-choice-prompt" role="note">
                <Crosshair weight="duotone" aria-hidden="true" />
                <span>
                  <small>Your decision</small>
                  <strong id="guided-decision-prompt">Choose what the family does next</strong>
                </span>
                <em>{game.history.length === 0 ? "Read what is known, then choose. Consequences appear afterward. Progress saves automatically; How to play is always in Journey tools." : "Select one option below to continue"}</em>
              </div>
              <div className="cinematic-choices" aria-labelledby="guided-decision-prompt">
                {event.choices.map((choice) => {
                  const unavailable = getRequirementFailure(game, choice);
                  return (
                    <button
                      key={choice.id}
                      className="cinematic-choice"
                      onClick={() => choose(choice)}
                      disabled={Boolean(unavailable)}
                      data-sound="choice"
                    >
                      <strong>{choice.title}</strong>
                      <span>{unavailable ?? choice.hint}</span>
                      <span className="cinematic-choice-action">
                        {unavailable ? "Unavailable" : "Select this path"}
                        <ArrowRight weight="bold" aria-hidden="true" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className={`cinematic-outcome ${game.currentOutcome.tone}`} key={`outcome-${game.currentOutcome.id}`}>
                <div>
                  <strong>Decision recorded</strong>
                  <span>{game.currentOutcome.consequence}</span>
                  {game.currentOutcome.appliedBonuses?.map((bonus) => <em key={bonus}><Sparkle weight="fill" />{bonus}</em>)}
                  {game.currentOutcome.travelPlan && <em><Clock weight="fill" />{game.currentOutcome.travelPlan.title}: {game.currentOutcome.travelPlan.consequence}</em>}
                  {game.currentOutcome.returningConsequences?.length > 0 && (
                    <section className="cinematic-returning-consequences">
                      <small>Earlier choices return</small>
                      {game.currentOutcome.returningConsequences.map((item) => (
                        <span className={item.kind} key={item.label}><Clock weight="fill" />{item.label}</span>
                      ))}
                    </section>
                  )}
                  {game.currentOutcome.reactions?.length > 0 && (
                    <section className="cinematic-family-reactions">
                      <small>Family voices</small>
                      {game.currentOutcome.reactions.map((reaction) => (
                        <blockquote key={`${reaction.personId}-${reaction.text}`}>
                          <strong>{reaction.personName}</strong>
                          <span>“{reaction.text}”</span>
                          <em>{reaction.trustDelta > 0 ? `Trust +${reaction.trustDelta}` : reaction.trustDelta < 0 ? `Trust ${reaction.trustDelta}` : "Trust holds"}</em>
                        </blockquote>
                      ))}
                    </section>
                  )}
                  {game.currentOutcome.threadUpdates?.length > 0 && (
                    <section className="cinematic-thread-updates">
                      {game.currentOutcome.threadUpdates.map((thread) => (
                        <span className={thread.status} key={thread.id}><BookOpenText weight="fill" /><small>Story thread</small>{thread.title}</span>
                      ))}
                    </section>
                  )}
                </div>
                {!travelPlanRequired && <button onClick={continueWithIncidents} data-sound="confirm">
                  {game.pendingEnding ? "See journey result" : "Continue the journey"}<ArrowRight weight="bold" />
                </button>}
              </div>
              {travelPlanRequired && <TravelPlanner game={game} onChoose={(strategyId, leadPersonId) => setGame((current) => planTravelLeg(current, strategyId, leadPersonId))} />}
            </>
          )}
        </section>
      </section>

      <footer className="cinematic-footer">
        <section className="cinematic-resources" aria-label="Group resources">
          <StatusItem key={`water-${game.resources.water}`} icon={Drop} label="Water" value={`${game.resources.water} L`} tone={game.resources.water <= 3 ? "danger" : ""} tooltip="Drinking water carried by the group. Reaching zero causes dehydration." />
          <StatusItem key={`food-${game.resources.supplies}`} icon={ForkKnife} label="Food" value={`${game.resources.supplies} ${game.resources.supplies === 1 ? "day" : "days"}`} tone={game.resources.supplies <= 1 ? "danger" : ""} tooltip="Food for the group. Reaching zero harms health and raises stress." />
          <StatusItem key={`cash-${game.resources.cash}`} icon={Wallet} label="Cash" value={`$${game.resources.cash}`} tooltip="Money available for transport, shelter, food, and official fees." />
          <StatusItem key={`medicine-${game.resources.medicine}`} icon={Pill} label="Medicine" value={`${game.resources.medicine} ${game.resources.medicine === 1 ? "dose" : "doses"}`} tone={game.resources.medicine === 0 ? "danger" : ""} tooltip="Doses that can restore an injured or exhausted traveler’s health." />
          <StatusItem key={`battery-${game.resources.battery}`} icon={BatteryMedium} label="Phone" value={`${game.resources.battery}%`} tone={game.resources.battery <= 15 ? "danger" : ""} tooltip="Phone charge used for verification, calls, maps, and support." />
          <StatusItem key={`health-${groupHealth}`} icon={FirstAidKit} label="Health" value={getCondition(groupHealth).label} tone={groupHealth < 55 ? "danger" : ""} tooltip="Average health of the travelers who are still alive." />
          <StatusItem key={`cohesion-${averageTrust}`} icon={Handshake} label="Cohesion" value={averageTrust >= 4 ? "Strong" : averageTrust >= 3 ? "Steady" : "Fragile"} tooltip="How strongly the group trusts the decisions being made." />
          <StatusItem key={`risk-${game.resources.exposure}`} icon={Eye} label="Risk" value={`${game.resources.exposure}%`} tone={game.resources.exposure >= 75 ? "danger" : ""} tooltip="Visibility to danger or enforcement. At 100%, the journey stops." />
        </section>

        <section className="cinematic-people" aria-label="People traveling together">
          {people.map((person) => (
            <button className={`cinematic-person mood-${getPortraitMood(game.people[person.id], game.resources.stress)} ${game.people[person.id].alive === false ? "lost" : ""}`} key={person.id} onClick={() => setSelectedPersonId(person.id)} data-sound="tap">
              <Portrait person={person} state={game.people[person.id]} stress={game.resources.stress} family={game} />
              <span><strong>{person.name}</strong><small>{game.people[person.id].alive === false ? "Remembered" : `${person.age} · ${person.skills[0]}`}</small></span>
            </button>
          ))}
          <button className="cinematic-restart" onClick={requestRestart} aria-label="Reset journey" data-tooltip="Reset journey · confirmation required" data-tooltip-position="top" data-tooltip-align="right" data-sound="warning"><ArrowCounterClockwise weight="bold" /></button>
        </section>
      </footer>

      {historyMode && !showFamilySelection && <JourneyHistoryDialog game={game} introduction={historyMode === "intro"} onClose={closeHistory} />}
      {game.phase === "ended" && (
        <Ending
          game={game}
          onExploreHistory={() => setHistoryMode("explore")}
          onTryAgain={requestRestart}
          onChooseFamily={() => setShowFamilySelection(true)}
        />
      )}
      {showRoadsideWork && roadsideOpportunity && (
        <RoadsideWork
          opportunity={roadsideOpportunity}
          outcome={roadsideOutcome}
          completed={roadsideWorkCompleted}
          onChoose={takeWork}
          onClose={() => setShowRoadsideWork(false)}
        />
      )}
      {showSocialFeed && socialFeed && (
        <SocialFeedModal
          feed={socialFeed}
          climate={game.socialClimate}
          options={socialOptions}
          outcome={socialOutcome}
          resolved={socialFeedResolved}
          onRespond={respondToPost}
          onClose={() => setShowSocialFeed(false)}
        />
      )}
      {showSupplyShop && supplyStop && (
        <SupplyShop
          game={game}
          onBuy={(itemId) => setGame((current) => buySupply(current, itemId))}
          onClose={() => setShowSupplyShop(false)}
        />
      )}
      {selectedPerson && <CareDialog game={game} person={selectedPerson} onUseMedicine={(personId) => setGame((current) => useMedicine(current, personId))} onClose={() => setSelectedPersonId(null)} />}
      {showJourneyLog && <JourneyLog game={game} onClose={() => setShowJourneyLog(false)} />}
      {showContentSettings && <ContentSettings currentMode={contentMode} onSelect={selectContentMode} onClose={() => setShowContentSettings(false)} />}
      {game.pendingIncident && <TravelIncident game={game} onResolve={(responseId) => setGame((current) => resolveTravelIncident(current, responseId))} />}
      {restartFamily && restartGame && (
        <RestartConfirmation
          familyName={restartFamily.shortName}
          day={restartGame.day}
          decisions={restartGame.history.length}
          onCancel={cancelRestart}
          onConfirm={confirmRestart}
        />
      )}
      {showFamilySelection && (
        <FamilySelection
          currentFamilyId={game.familyId}
          required={familySelectionRequired}
          saves={familySaves}
          archive={journeyArchive}
          onSelect={selectFamily}
          onRestart={requestFamilyRestart}
          onClose={() => setShowFamilySelection(false)}
        />
      )}
      {showTutorial && !showContentSettings && !showFamilySelection && (
        <Tutorial
          step={tutorialStep}
          onBack={() => setTutorialStep((current) => Math.max(0, current - 1))}
          onNext={() => setTutorialStep((current) => Math.min(TUTORIAL_STEPS.length - 1, current + 1))}
          onFinish={finishTutorial}
        />
      )}
    </main>
  );
}
