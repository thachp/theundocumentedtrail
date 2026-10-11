import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  BatteryMedium,
  BookOpenText,
  Briefcase,
  Clock,
  Compass,
  Crosshair,
  Drop,
  Eye,
  FirstAidKit,
  ForkKnife,
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
  Wallet,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  GAME_SAVE_KEY,
  FAMILY_PRESETS,
  ROUTES,
  chooseOption,
  continueJourney,
  createInitialGame,
  getChoiceBonuses,
  getCondition,
  getEvent,
  getFamilyPreset,
  getJourneyScore,
  getPeople,
  getPortraitImage,
  getPortraitMood,
  getRequirementFailure,
  getRoadsideOpportunity,
  getTravelPlanOptions,
  hasCompletedRoadsideWork,
  isSavedGameValid,
  planTravelLeg,
  requiresTravelPlan,
  takeRoadsideJob,
  useMedicine,
} from "./game.js";
import { createInteractionSounds } from "./soundEffects.js";
import { createJourneySoundtrack, selectSoundtrackTheme } from "./soundtrack.js";
import "./beginner.css";

const CONTENT_MODE_KEY = "the-long-road-content-mode-v1";
const TUTORIAL_COMPLETE_KEY = "the-undocumented-trail-tutorial-v2";
const FAMILY_SELECTION_KEY = "the-undocumented-trail-family-v1";

const TUTORIAL_STEPS = [
  {
    icon: Compass,
    eyebrow: "Welcome to the journey",
    title: "Guide a family, not a game piece",
    copy: "Every decision balances safety, time, money, dignity, and incomplete information. Reaching a destination does not guarantee legal status or erase what happened on the road.",
    lessons: ["There is rarely one perfect answer", "The family can stop or choose a different destination", "Sensitive events remain non-graphic"],
  },
  {
    icon: Crosshair,
    eyebrow: "How decisions work",
    title: "Read the route before you choose",
    copy: "Each decision is marked as trusted, uncertain, or high risk. Read what is known, notice what is only assumed, and check the immediate cost before committing.",
    lessons: ["Trusted does not mean guaranteed", "High-risk routes may be faster", "Research links explain the real-world basis"],
  },
  {
    icon: FirstAidKit,
    eyebrow: "Keep the family moving",
    title: "Resources affect real people",
    copy: "Food, water, medicine, stress, and exposure shape the journey. Select any portrait to review health, hear their latest reaction, or use medicine. A traveler whose health reaches zero dies and is remembered.",
    lessons: ["Low food and water damage health", "Stress changes expressions and family cohesion", "Short-term work can rebuild supplies"],
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
};

const reducedDescriptions = {
  blueDoorShelter: "The shelter is caring for a survivor of violence. Details are not shown. The family decides how long to stay and how to help.",
  riverCrossing: "The boat is visibly unsafe, and the crossing carries a risk of death. Further details are shortened.",
  memorial: "The family is grieving Daniela's death. The memorial remains part of the story without detailed description.",
  haddadAegean: "The family must decide whether to attempt a dangerous sea crossing. The risks are stated without graphic detail.",
  haddadMemorial: "The family is grieving Mariam's death. The memorial remains part of the story without detailed description.",
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
  haddadBalkans: "The route closes while people are already on it.",
  haddadEuropeNews: "A border speech fills every phone.",
  haddadGermany: "Arrival begins another kind of waiting.",
};

const toneLabels = {
  trusted: "Trusted route",
  uncertain: "Uncertain route",
  danger: "High risk",
};

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAME_SAVE_KEY));
    if (isSavedGameValid(saved)) return saved;
  } catch {
    // A damaged save should never prevent a new guided journey.
  }
  return createInitialGame();
}

function loadContentMode() {
  return localStorage.getItem(CONTENT_MODE_KEY) ?? "standard";
}

function hasCompletedTutorial() {
  return localStorage.getItem(TUTORIAL_COMPLETE_KEY) === "complete";
}

function hasChosenFamily() {
  return Boolean(FAMILY_PRESETS[localStorage.getItem(FAMILY_SELECTION_KEY)]);
}

function StatusItem({ icon: Icon, label, value, tone = "" }) {
  return (
    <div className={`cinematic-status-item ${tone}`}>
      <Icon weight="duotone" aria-hidden="true" />
      <span><small>{label}</small><strong>{value}</strong></span>
    </div>
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
              <button key={choice.id} className={choice.tone} onClick={() => onChoose(choice.id)} data-sound={choice.tone === "danger" ? "warning" : "choice"}>
                <small>{choice.tone === "danger" ? "Unverified offer" : "One-day shift"}</small>
                <strong>{choice.title}</strong>
                <span>{choice.hint}</span>
                <em><Clock weight="bold" />{choice.consequence}</em>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TravelPlanner({ game, onChoose }) {
  return (
    <div className="cinematic-travel-planner" aria-label="Plan this travel leg">
      <header>
        <Clock weight="duotone" />
        <span><small>The next leg lasts {game.currentOutcome.days} days</small><strong>How will the family manage the time?</strong></span>
      </header>
      <div>
        {getTravelPlanOptions(game).map((strategy) => (
          <button
            key={strategy.id}
            className={strategy.tone}
            onClick={() => onChoose(strategy.id)}
            disabled={Boolean(strategy.unavailable)}
            data-sound={strategy.tone === "danger" ? "warning" : "choice"}
          >
            <small>{strategy.unavailable ?? strategy.hint}</small>
            <strong>{strategy.title}</strong>
            <span>{strategy.consequence}</span>
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
          <img src={getPortraitImage(person, state, game.resources.stress, game)} alt="" style={{ objectPosition: person.focus }} />
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

function FamilySelection({ currentFamilyId, required, onSelect, onClose }) {
  return (
    <div className="cinematic-family-backdrop">
      <section className="cinematic-family-dialog" role="dialog" aria-modal="true" aria-labelledby="family-selection-title">
        {!required && <button className="cinematic-work-close" onClick={onClose} aria-label="Close family selection" data-sound="dismiss"><X weight="bold" /></button>}
        <span className="cinematic-family-symbol"><UsersThree weight="duotone" /></span>
        <small>Choose a journey</small>
        <h2 id="family-selection-title">Whose road will you follow?</h2>
        <p>Each family is a fictional composite grounded in documented experiences. Their people, starting resources, route, risks, and possible endings are different.</p>
        <div className="cinematic-family-options">
          {Object.values(FAMILY_PRESETS).map((family) => (
            <button
              className={currentFamilyId === family.id ? "selected" : ""}
              key={family.id}
              onClick={() => onSelect(family.id)}
              data-sound="confirm"
            >
              <img src={family.portraitStrips.healthy} alt={`Portraits of ${family.name}`} />
              <span>
                <small>{family.origin}</small>
                <strong>{family.name}</strong>
                <p>{family.context}</p>
                <em><MapPin weight="fill" />{family.journey}</em>
              </span>
              <ArrowRight weight="bold" />
            </button>
          ))}
        </div>
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

function Ending({ game, onRestart }) {
  const won = game.status === "won";
  const score = getJourneyScore(game);
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

        {won && (
          <div className="cinematic-arrival-route" aria-label={`${game.progress}% of the planned route completed`}>
            <div><span>Home</span><strong>{reachedDestination ? "Destination" : "New beginning"}</strong></div>
            <span className="cinematic-arrival-track"><i style={{ width: `${game.progress}%` }} /><HouseLine weight="fill" /></span>
            <small>{game.progress}% of the planned route completed</small>
          </div>
        )}

        <div className="cinematic-ending-stats" aria-label="Journey results">
          <div><strong>{score}</strong><span>Journey score</span></div>
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
                <img src={getPortraitImage(person, state, game.resources.stress, game)} alt="" style={{ objectPosition: person.focus }} />
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

        <button onClick={onRestart} data-sound="confirm"><ArrowCounterClockwise weight="bold" />Begin a new journey</button>
      </section>
    </div>
  );
}

export function BeginnerApp() {
  const [game, setGame] = useState(loadGame);
  const [familySelectionRequired, setFamilySelectionRequired] = useState(() => !hasChosenFamily());
  const [showFamilySelection, setShowFamilySelection] = useState(() => !hasChosenFamily());
  const [soundtrackOn, setSoundtrackOn] = useState(false);
  const [showRoadsideWork, setShowRoadsideWork] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [showJourneyLog, setShowJourneyLog] = useState(false);
  const [contentMode, setContentMode] = useState(loadContentMode);
  const [showContentSettings, setShowContentSettings] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(() => !hasCompletedTutorial());
  const soundtrackRef = useRef(null);
  const interactionSoundsRef = useRef(null);
  const family = getFamilyPreset(game);
  const people = getPeople(game);
  const event = getEvent(game);
  const route = ROUTES[game.route];
  const roadsideOpportunity = getRoadsideOpportunity(game);
  const roadsideWorkCompleted = hasCompletedRoadsideWork(game);
  const roadsideOutcome = roadsideWorkCompleted && game.lastRoadsideOutcome?.eventId === game.eventId
    ? game.lastRoadsideOutcome
    : null;
  const selectedPerson = people.find((person) => person.id === selectedPersonId) ?? null;
  const travelPlanRequired = requiresTravelPlan(game);
  const storyCopy = game.phase === "decision"
    ? (contentMode === "reduced" && reducedDescriptions[event.id]
      ? reducedDescriptions[event.id]
      : event.messages.map((message) => message.body).join(" "))
    : (contentMode === "reduced" && ["boardOverloaded", "haddadOverloadedBoat"].includes(game.currentOutcome?.id)
      ? `The crossing ends with ${game.familyId === "haddad" ? "Mariam" : "Daniela"}'s death. The event is not described in detail.`
      : game.currentOutcome.copy);

  useEffect(() => {
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(game));
  }, [game]);

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

  const selectFamily = (familyId) => {
    const fresh = createInitialGame(familyId);
    localStorage.setItem(FAMILY_SELECTION_KEY, familyId);
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(fresh));
    setGame(fresh);
    setFamilySelectionRequired(false);
    setShowFamilySelection(false);
    setShowRoadsideWork(false);
    setSelectedPersonId(null);
    setShowJourneyLog(false);
  };

  const restart = () => setShowFamilySelection(true);

  const choose = (choice) => setGame((current) => chooseOption(current, choice.id));
  const takeWork = (choiceId) => setGame((current) => takeRoadsideJob(current, choiceId));
  const selectContentMode = (mode) => {
    localStorage.setItem(CONTENT_MODE_KEY, mode);
    setContentMode(mode);
    setShowContentSettings(false);
  };

  const finishTutorial = () => {
    localStorage.setItem(TUTORIAL_COMPLETE_KEY, "complete");
    setShowTutorial(false);
  };

  const replayTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
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
        <div className="cinematic-header-actions">
          <button className="cinematic-music" onClick={() => setShowFamilySelection(true)} aria-label="Choose family journey" title={`Playing ${family.name}`} data-sound="tap"><UsersThree weight="duotone" /></button>
          <button className="cinematic-music" onClick={replayTutorial} aria-label="Open tutorial" title="How to play" data-sound="tap"><Question weight="duotone" /></button>
          <button className="cinematic-music" onClick={() => setShowContentSettings(true)} aria-label="Open content settings" data-sound="tap"><WarningCircle weight="duotone" /></button>
          <button className="cinematic-music" onClick={() => setShowJourneyLog(true)} aria-label="Open journey log" data-sound="tap"><BookOpenText weight="duotone" /></button>
          <button
            className={`cinematic-music ${soundtrackOn ? `playing ${soundtrackTheme.id}` : ""}`}
            onClick={toggleSoundtrack}
            aria-pressed={soundtrackOn}
            aria-label={soundtrackOn ? `Pause music — ${soundtrackTheme.label}` : "Play soundtrack"}
            data-sound="tap"
          >
            {soundtrackOn ? <SpeakerHigh weight="fill" /> : <MusicNotes weight="duotone" />}
          </button>
          <a href="/?mode=full" className="cinematic-full-link">Planning view</a>
        </div>
      </header>

      <section className="cinematic-stage">
        <div className="cinematic-scene" style={{ backgroundImage: `url("${sceneByEvent[event.id] ?? family.heroImage}")` }} aria-hidden="true" />

        <aside className="cinematic-map" aria-label={`Journey map, ${game.progress}% complete`}>
          <img src={family.mapImage} alt={family.mapAlt} />
          <div className="cinematic-map-destination">
            <HouseLine weight="fill" />
            <span><strong>{family.destination}</strong><small>{100 - game.progress}% remains</small></span>
          </div>
          <div className="cinematic-map-location" style={{ bottom: `${8 + (game.progress * 0.68)}%` }}>
            <Crosshair weight="fill" />
            <span><strong>You are here</strong><small>{event.location}</small></span>
          </div>
          <div className="cinematic-map-route">
            <Compass weight="duotone" />
            <span><strong>{route.title}</strong><small>{route.kicker}</small></span>
          </div>
        </aside>

        <section className="cinematic-story" aria-label="Current story and decision">
          <div className="cinematic-copy">
            <span>{event.location} · Day {game.day}</span>
            <h1>{game.phase === "decision" ? (storyTitles[event.id] ?? event.location) : game.currentOutcome.title}</h1>
            <p>{storyCopy}</p>
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
            {game.phase === "decision" && roadsideOpportunity && (
              <button className={`cinematic-work-trigger ${roadsideWorkCompleted ? "completed" : ""}`} onClick={() => setShowRoadsideWork(true)} data-sound="tap">
                <Briefcase weight="duotone" />
                <span>
                  <small>{roadsideWorkCompleted ? "Work completed here" : roadsideOpportunity.eyebrow}</small>
                  <strong>{roadsideWorkCompleted ? roadsideOutcome?.title : "Find short-term work"}</strong>
                </span>
                <ArrowRight weight="bold" />
              </button>
            )}
          </div>

          {game.phase === "decision" ? (
            <div className="cinematic-choices" aria-label="Decision options">
              {event.choices.map((choice) => {
                const unavailable = getRequirementFailure(game, choice);
                const bonus = getChoiceBonuses(game, choice)[0];
                return (
                  <button
                    key={choice.id}
                    className={`cinematic-choice ${choice.tone}`}
                    onClick={() => choose(choice)}
                    disabled={Boolean(unavailable)}
                    data-sound={choice.tone === "danger" ? "warning" : "choice"}
                  >
                    <small>{toneLabels[choice.tone]}</small>
                    <strong>{choice.title}</strong>
                    <span>{unavailable ?? choice.hint}</span>
                    {bonus && <em><Sparkle weight="fill" />{bonus.label}</em>}
                    <ArrowRight weight="bold" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div className={`cinematic-outcome ${game.currentOutcome.tone}`}>
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
                {!travelPlanRequired && <button onClick={() => setGame((current) => continueJourney(current))} data-sound="confirm">
                  {game.pendingEnding ? "See journey result" : "Continue the journey"}<ArrowRight weight="bold" />
                </button>}
              </div>
              {travelPlanRequired && <TravelPlanner game={game} onChoose={(strategyId) => setGame((current) => planTravelLeg(current, strategyId))} />}
            </>
          )}
        </section>
      </section>

      <footer className="cinematic-footer">
        <section className="cinematic-resources" aria-label="Group resources">
          <StatusItem icon={Drop} label="Water" value={`${game.resources.water} L`} tone={game.resources.water <= 3 ? "danger" : ""} />
          <StatusItem icon={ForkKnife} label="Food" value={`${game.resources.supplies} ${game.resources.supplies === 1 ? "day" : "days"}`} tone={game.resources.supplies <= 1 ? "danger" : ""} />
          <StatusItem icon={Wallet} label="Cash" value={`$${game.resources.cash}`} />
          <StatusItem icon={Pill} label="Medicine" value={`${game.resources.medicine} ${game.resources.medicine === 1 ? "dose" : "doses"}`} tone={game.resources.medicine === 0 ? "danger" : ""} />
          <StatusItem icon={BatteryMedium} label="Phone" value={`${game.resources.battery}%`} tone={game.resources.battery <= 15 ? "danger" : ""} />
          <StatusItem icon={FirstAidKit} label="Health" value={getCondition(groupHealth).label} tone={groupHealth < 55 ? "danger" : ""} />
          <StatusItem icon={Handshake} label="Cohesion" value={averageTrust >= 4 ? "Strong" : averageTrust >= 3 ? "Steady" : "Fragile"} />
          <StatusItem icon={Eye} label="Risk" value={`${game.resources.exposure}%`} tone={game.resources.exposure >= 75 ? "danger" : ""} />
        </section>

        <section className="cinematic-people" aria-label="People traveling together">
          {people.map((person) => (
            <button className={`cinematic-person mood-${getPortraitMood(game.people[person.id], game.resources.stress)} ${game.people[person.id].alive === false ? "lost" : ""}`} key={person.id} onClick={() => setSelectedPersonId(person.id)} data-sound="tap">
              <img src={getPortraitImage(person, game.people[person.id], game.resources.stress, game)} alt="" style={{ objectPosition: person.focus }} />
              <span><strong>{person.name}</strong><small>{game.people[person.id].alive === false ? "Remembered" : `${person.age} · ${person.skills[0]}`}</small></span>
            </button>
          ))}
          <button className="cinematic-restart" onClick={restart} aria-label="Start over" data-sound="warning"><ArrowCounterClockwise weight="bold" /></button>
        </section>
      </footer>

      {game.phase === "ended" && <Ending game={game} onRestart={restart} />}
      {showRoadsideWork && roadsideOpportunity && (
        <RoadsideWork
          opportunity={roadsideOpportunity}
          outcome={roadsideOutcome}
          completed={roadsideWorkCompleted}
          onChoose={takeWork}
          onClose={() => setShowRoadsideWork(false)}
        />
      )}
      {selectedPerson && <CareDialog game={game} person={selectedPerson} onUseMedicine={(personId) => setGame((current) => useMedicine(current, personId))} onClose={() => setSelectedPersonId(null)} />}
      {showJourneyLog && <JourneyLog game={game} onClose={() => setShowJourneyLog(false)} />}
      {showContentSettings && <ContentSettings currentMode={contentMode} onSelect={selectContentMode} onClose={() => setShowContentSettings(false)} />}
      {showFamilySelection && (
        <FamilySelection
          currentFamilyId={game.familyId}
          required={familySelectionRequired}
          onSelect={selectFamily}
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
