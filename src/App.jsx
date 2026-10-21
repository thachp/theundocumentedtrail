import { PlanningHeaderActions } from "./PlanningHeaderActions.jsx";
import { DetailDrawer } from "./DetailDrawer.jsx";
import { StatusMetric } from "./StatusMetric.jsx";
import { IllustratedJourneyMap } from "./IllustratedJourneyMap.jsx";
import {CambodiaTravelPlanner,CambodiaResupply} from './CambodiaTravelControls.jsx';
import {resupplyCambodia} from './cambodiaExpanded/journey.js';
import { commitJourneyChoice } from "./journeyChoiceActions.js";
import { isSharedHouseholdJourney as isCambodiaJourney } from "./sharedHouseholdJourney.js";
import { CambodiaResources, CambodiaJourneyContext, CambodiaPersonDialog, CambodiaEndingReflection } from "./CambodiaJourneyUI.jsx";
import { selectJourneyGame as selectFamilyGame } from "./selectJourney.js";
import { EndingDialog } from "./EndingDialog.jsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useJourneyGame } from "./useJourneyGame.js";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  BatteryMedium,
  BookOpenText,
  Briefcase,
  CarProfile,
  ChatCircleDots,
  Check,
  ClockCountdown,
  CloudRain,
  Compass,
  Crosshair,
  Drop,
  Eye,
  FirstAidKit,
  ForkKnife,
  Gavel,
  GithubLogo,
  Handshake,
  Heartbeat,
  HouseLine,
  Info,
  MapPin,
  Mountains,
  MusicNotes,
  NavigationArrow,
  Path,
  Pause,
  PersonSimpleWalk,
  Phone,
  Pill,
  ShieldWarning,
  SpeakerHigh,
  Sparkle,
  Toolbox,
  UsersThree,
  Wallet,
  Warning,
  X,
} from "@phosphor-icons/react";
import {
  EVENTS,
  ROUTES,
  buySupply,
  continueJourney,
  getCondition,
  getEvent,
  getFamilyPreset,
  getPeople,
  getPortraitMood,
  getRequirementFailure,
  getResourceTone,
  getSocialFeed,
  getSocialResponseOptions,
  getSupplyStop,
  getTravelPlanOptions,
  hasRespondedToSocialFeed,
  planTravelLeg,
  requiresTravelPlan,
  respondToSocialFeed,
  resolveTravelIncident,
  useMedicine,
} from "./game.js";
import { hasSelectedFamily, loadFamilySaves, loadJourneyArchive } from "./saveStore.js";
import { FamilySelection } from "./JourneySelection.jsx";
import { SocialFeedModal, SocialFeedTrigger } from "./SocialFeed.jsx";
import { Portrait } from "./Portrait.jsx";
import { JourneyMap } from "./JourneyMap.jsx";
import { JourneyHistoryDialog, SceneHistory } from "./JourneyHistory.jsx";
import { getJourneyDate } from "./journeyHistory.js";
import { SupplyShop, SupplyStopTrigger } from "./SupplyShop.jsx";
import { TravelIncident } from "./TravelIncident.jsx";
import { createJourneySoundtrack, selectSoundtrackTheme } from "./soundtrack.js";
import { createInteractionSounds } from "./soundEffects.js";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/rajdhani/latin-500.css";
import "@fontsource/rajdhani/latin-600.css";

const choiceIcons = {
  navigate: NavigationArrow,
  car: CarProfile,
  wait: ClockCountdown,
  aid: FirstAidKit,
  walk: PersonSimpleWalk,
  phone: Phone,
  legal: Gavel,
  work: Briefcase,
  tools: Toolbox,
  mountain: Mountains,
  talk: ChatCircleDots,
  rest: Pause,
};

const IconText = ({ icon: Icon, children }) => (
  <span className="icon-text">
    <Icon weight="duotone" aria-hidden="true" />
    {children}
  </span>
);


function CharacterCard({ person, state, stress, family, active, onClick }) {
  const condition = getCondition(state.health, state.alive !== false);
  const portraitMood = getPortraitMood(state, stress);
  return (
    <button
      className={`character-card mood-${portraitMood} ${active ? "active" : ""} ${state.alive === false ? "lost" : ""}`}
      onClick={() => onClick(person)}
      aria-pressed={active}
      data-sound="tap"
    >
      <Portrait person={person} state={state} stress={stress} family={family} />
      <span className="character-copy">
        <span className="character-heading">
          <strong>{person.name}</strong>
          <small>{person.pronouns} · {person.age}</small>
        </span>
        <span className="skill-list">
          <span><Sparkle weight="duotone" aria-hidden="true" />{person.skills[0]}</span>
          <span><Handshake weight="duotone" aria-hidden="true" />{person.skills[1]}</span>
        </span>
        {(!isCambodiaJourney(family) || family.householdEdition === 3) && <><span className={`condition ${condition.tone}`}>
          <i />{state.alive === false ? condition.label : `${condition.label} · ${state.health}%`}
        </span>
        <span className="trust-row">
          <small>Trust</small>
          <span className="trust-meter" aria-label={`${state.trust} of 5 trust`}>
            {[1, 2, 3, 4, 5].map((level) => (
              <i key={level} className={level <= state.trust ? "filled" : ""} />
            ))}
          </span>
        </span></>}
      </span>
    </button>
  );
}

function MessagePanel({ event, game, socialFeed, socialFeedResolved, supplyStop, onOpenSocialFeed, onOpenSupplyShop, onExploreHistory, onChoice, onContinue, onTravelPlan, onCambodiaSupply }) {
  const travelPlanRequired = requiresTravelPlan(game);
  return (
    <aside className="messages-panel" aria-label="Messages and decisions">

      <header className="panel-header">
        <div>
          <ChatCircleDots weight="duotone" aria-hidden="true" />
          <h2 tabIndex="-1" data-history-return>{game.phase === "outcome" ? "What happened" : "Decision point"}</h2>
        </div>
        {!isCambodiaJourney(game) && <span aria-label="Phone charge"><Phone weight="duotone" aria-hidden="true" /> {game.resources.battery}%</span>}
      </header>

      <SceneHistory game={game} onExplore={onExploreHistory} />
      {game.familyId === "cambodia-1979" && game.householdEdition === 3 && <CambodiaJourneyContext game={game} />}
      <CambodiaResupply game={game} onBuy={onCambodiaSupply} />
      <div className="message-thread">
        {event.messages.map((message) => (
          <article className={`message ${message.trusted ? "trusted-message" : "unknown-message"}`} key={`${message.sender}-${message.time}`}>
            <span className={`sender-avatar ${message.trusted ? "mara" : "unknown"}`}>{game.narrative && message.trusted ? <Portrait person={getPeople(game).find(p=>p.name===message.sender)} state={game.people[game.narrative.voices.find(v=>v.sender===message.sender)?.personId]} stress={game.resources.stress} family={game} alt={`${message.sender} speaking`} /> : message.initial}</span>
            <div>
              <header><strong>{message.sender}</strong><time>{message.time}</time></header>
              <small>{message.role}</small>
              <p>{message.body}</p>
            </div>
          </article>
        ))}
      </div>

      {socialFeed && (
        <SocialFeedTrigger
          compact
          feed={socialFeed}
          climate={game.socialClimate}
          resolved={socialFeedResolved}
          onOpen={onOpenSocialFeed}
        />
      )}

      {supplyStop && <SupplyStopTrigger compact stop={supplyStop} onOpen={onOpenSupplyShop} />}

      {game.phase === "decision" ? (
        <div className="decision-stack" aria-label="Decision options">
          {event.choices.map((choice, index) => {
            const Icon = choiceIcons[choice.icon] ?? Compass;
            const unavailable = getRequirementFailure(game, choice);
            return (
              <button
                className="decision"
                key={choice.id}
                onClick={() => onChoice(choice)}
                disabled={Boolean(unavailable)}
                title={unavailable ?? choice.hint}
                data-sound="choice"
              >
                <Icon weight={index === 0 ? "fill" : "duotone"} aria-hidden="true" />
                <span>
                  <strong>{choice.title}</strong>
                  <small>{unavailable ?? choice.hint}</small>
                </span>
                <ArrowRight weight="bold" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className={`outcome-card ${game.currentOutcome.tone}`} role="status">
          <span className="outcome-icon"><Check weight="bold" aria-hidden="true" /></span>
          <div>
            <small>Decision resolved</small>
            <h3>{game.currentOutcome.title}</h3>
            <p>{game.currentOutcome.copy}</p>
            {game.currentOutcome.returningConsequences?.length > 0 && (
              <div className="outcome-echoes">
                <small>Earlier choices return</small>
                {game.currentOutcome.returningConsequences.map((item) => <span className={item.kind} key={item.label}><ClockCountdown weight="fill" />{item.label}</span>)}
              </div>
            )}
            {game.currentOutcome.reactions?.length > 0 && (
              <div className="outcome-reactions">
                <small>Family voices</small>
                {game.currentOutcome.reactions.map((reaction) => (
                  <blockquote key={`${reaction.personId}-${reaction.text}`}>
                    <strong>{reaction.personName}</strong>
                    <span>“{reaction.text}”</span>
                    <em>{reaction.narrative ? "Family reflection" : reaction.trustDelta > 0 ? `Trust +${reaction.trustDelta}` : reaction.trustDelta < 0 ? `Trust ${reaction.trustDelta}` : "Trust holds"}</em>
                  </blockquote>
                ))}
              </div>
            )}
            <span className="outcome-consequence">{game.currentOutcome.consequence}</span>
            {game.currentOutcome.threadUpdates?.length > 0 && (
              <div className="outcome-thread-updates">
                {game.currentOutcome.threadUpdates.map((thread) => <span className={thread.status} key={thread.id}><BookOpenText weight="fill" />{thread.title}</span>)}
              </div>
            )}
          </div>
          {travelPlanRequired ? (
            game.controlModel ? <CambodiaTravelPlanner game={game} onChoose={onTravelPlan} /> : <div className="planning-travel-options">
              <small>Plan the next {game.currentOutcome.days} days</small>
              {getTravelPlanOptions(game).map((strategy) => (
                <button key={strategy.id} onClick={() => onTravelPlan(strategy.id)} disabled={Boolean(strategy.unavailable)} data-sound="choice">
                  <strong>{strategy.title}</strong><span>{strategy.unavailable ?? strategy.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <button className="continue-button" onClick={onContinue} data-sound="confirm">
              {game.pendingEnding ? "See journey result" : "Continue journey"}<ArrowRight weight="bold" />
            </button>
          )}
        </div>
      )}

      <section className="intel-section">
        <div className="intel-block known">
          <h3><Check weight="bold" aria-hidden="true" />What we know</h3>
          <ul>{event.known.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="intel-block assumed">
          <h3><Info weight="bold" aria-hidden="true" />What we assume</h3>
          <ul>{event.assumed.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <footer className="panel-footer">
        <div>
          <strong>{game.progress}% of the route behind you.</strong>
          <span>Plans can change. People endure.</span>
        </div>
      </footer>
    </aside>
  );
}


function CambodiaChoiceDialog({ children, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    dialog.querySelector("h2")?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (previous?.isConnected && previous.getClientRects().length) previous.focus();
      else document.querySelector("[data-history-return]")?.focus();
    };
  }, []);
  return <dialog ref={ref} className="choice-modal cambodia-choice-dialog" aria-labelledby="choice-title" onCancel={event => { event.preventDefault(); onCancel(); }} onClick={event => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onCancel();
  }}>{children}</dialog>;
}

function ChoiceModal({ choice, game, onCancel, onConfirm }) {
  if (!choice) return null;
  const Icon = choiceIcons[choice.icon] ?? Compass;
  const native = game.familyId === "cambodia-1979" && game.householdEdition === 3;
  const content = <>
        <button className="modal-close" onClick={onCancel} aria-label="Close decision" data-sound="dismiss"><X weight="bold" /></button>
        <span className="modal-symbol"><Icon weight="fill" /></span>
        <small>{isCambodiaJourney(game) && game.householdEdition !== 3 ? "Scene" : "Day"} {game.day} · choose carefully</small>
        <h2 id="choice-title" tabIndex={native ? -1 : undefined}>{choice.title}?</h2>
        <p>{choice.hint}. The family cannot know the outcome in advance. Actual consequences appear after you commit.</p>
        <div className="modal-actions">
          <button className="back-button" onClick={onCancel} data-sound="dismiss"><ArrowLeft weight="bold" />Keep thinking</button>
          <button className="confirm-button" onClick={onConfirm} data-sound="confirm">
            Make this choice<ArrowRight weight="bold" />
          </button>
        </div>
  </>;
  if (native) return <CambodiaChoiceDialog onCancel={onCancel}>{content}</CambodiaChoiceDialog>;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
    <section className="choice-modal" role="dialog" aria-modal="true" aria-labelledby="choice-title" onMouseDown={event => event.stopPropagation()}>{content}</section>
  </div>;
}

function JourneyLog({ game, onClose }) {
  const storyThreads = Object.values(game.storyThreads ?? {}).sort((a, b) => b.updatedDay - a.updatedDay);
  const entries = [
    ...game.history.map((entry) => ({ day: entry.day, id: `${entry.eventId}-${entry.choiceId}`, title: entry.choiceTitle, detail: `${entry.location} · ${entry.outcomeTitle}` })),
    ...(game.activityLog ?? []).map((entry, index) => ({ day: entry.day, id: `${entry.kind}-${index}`, title: entry.title, detail: entry.detail })),
  ].sort((a, b) => b.day - a.day);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="journey-log" role="dialog" aria-modal="true" aria-labelledby="log-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close journey log" data-sound="dismiss"><X weight="bold" /></button>
        <BookOpenText weight="duotone" aria-hidden="true" />
        <small>Saved automatically</small>
        <h2 id="log-title">Journey log</h2>
        {storyThreads.length > 0 && (
          <div className="log-story-threads">
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
        {entries.length ? (
          <ol>
            {entries.map((entry) => (
              <li key={`${entry.day}-${entry.id}`}>
                <span>{isCambodiaJourney(game) && game.householdEdition !== 3 ? "Scene" : "Day"} {entry.day}</span>
                <div><strong>{entry.title}</strong><small>{entry.detail}</small></div>
              </li>
            ))}
          </ol>
        ) : (
          <p>No choices recorded yet. The first decision begins at the family home.</p>
        )}
      </section>
    </div>
  );
}

function EndingModal({ game, onRestart, onExploreHistory }) {
  const people = getPeople(game);
  const livingPeople = Object.values(game.people).filter((person) => person.alive !== false);
  const won = game.status === "won";
  const reachedDestination = won && game.progress >= 100;
  const averageHealth = livingPeople.length ? Math.round(livingPeople.reduce((sum, person) => sum + person.health, 0) / livingPeople.length) : 0;
  return (
    <EndingDialog className="modal-backdrop ending-backdrop" labelledBy="ending-title">
      <section className={`ending-modal ${game.status} ${reachedDestination ? "destination-reached" : ""}`}>
        <span className="ending-symbol">
          {won ? <HouseLine weight="fill" /> : <Heartbeat weight="duotone" />}
        </span>
        <small>{reachedDestination ? "Destination reached · Route complete" : won ? "Journey complete · A new destination" : "The journey ends here"}</small>
        <h2 id="ending-title" tabIndex="-1">{game.ending.title}</h2>
        <p>{game.ending.copy}</p>
        <CambodiaEndingReflection game={game} />
        <p className="history-ending-period">{getJourneyDate(game)}</p>
        <button className="history-ending-button" onClick={onExploreHistory}>Explore the history</button>
        <JourneyMap game={game} compact />
        {won && (
          <div className="ending-route" aria-label={`${game.progress}% of the planned route completed`}>
            <span><i style={{ width: `${game.progress}%` }} /></span>
            <small>{game.progress}% route completion</small>
          </div>
        )}
        <div className="ending-stats">
          <div><strong>{isCambodiaJourney(game) ? game.history.length : game.day - 1}</strong><span>{isCambodiaJourney(game) ? "Scenes completed" : "Days traveled"}</span></div>
          <div><strong>{isCambodiaJourney(game) ? "Recorded" : `${averageHealth}%`}</strong><span>{isCambodiaJourney(game) ? "Household continuity" : "Average health"}</span></div>
          <div><strong>{game.history.length}</strong><span>Choices made</span></div>
        </div>
        <div className="ending-people">
          {people.map((person) => (
            <div key={person.id}>
              <Portrait person={person} state={game.people[person.id]} stress={game.resources.stress} family={game} />
              <span><strong>{person.name}</strong><small>{isCambodiaJourney(game) ? "Continuing life" : game.people[person.id].alive === false ? "Remembered" : `${game.people[person.id].health}% health`}</small></span>
            </div>
          ))}
        </div>
        <button className="start-again" onClick={onRestart} data-sound="confirm"><ArrowCounterClockwise weight="bold" />Begin a new journey</button>
      </section>
    </EndingDialog>
  );
}

function RestartModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="restart-modal" role="dialog" aria-modal="true" aria-labelledby="restart-title" onMouseDown={(event) => event.stopPropagation()}>
        <Warning weight="duotone" aria-hidden="true" />
        <small>Start over</small>
        <h2 id="restart-title">Begin a new journey?</h2>
        <p>This family's current route and decision history will be replaced with a fresh run. Other family saves and completed journey records will remain safe.</p>
        <div className="modal-actions">
          <button className="back-button" onClick={onCancel} data-sound="dismiss" autoFocus>Keep this journey</button>
          <button className="confirm-button danger" onClick={onConfirm} data-sound="warning">Start over<ArrowCounterClockwise weight="bold" /></button>
        </div>
      </section>
    </div>
  );
}

export function App() {
  const [game, setGame] = useJourneyGame();
  const [showFamilySelection, setShowFamilySelection] = useState(() => !isCambodiaJourney(game));
  const [familySelectionRequired, setFamilySelectionRequired] = useState(() => !isCambodiaJourney(game) && !hasSelectedFamily());
  const [selectedRoute, setSelectedRoute] = useState(game.route);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [showSupplyShop, setShowSupplyShop] = useState(false);
  const [soundtrackOn, setSoundtrackOn] = useState(false);
  const [soundtrackError, setSoundtrackError] = useState(false);
  const soundtrackRef = useRef(null);
  const interactionSoundsRef = useRef(null);

  const family = getFamilyPreset(game);
  const people = getPeople(game);
  const event = getEvent(game);
  const socialFeed = getSocialFeed(game);
  const socialFeedResolved = hasRespondedToSocialFeed(game);
  const socialOutcome = socialFeedResolved && game.lastSocialOutcome?.eventId === game.eventId
    ? game.lastSocialOutcome
    : null;
  const socialOptions = getSocialResponseOptions(game);
  const supplyStop = getSupplyStop(game);
  const selectedPerson = people.find((person) => person.id === selectedPersonId) ?? null;

  useEffect(() => {
    setSelectedRoute(game.route);
    setDrawerOpen(false);
    setSelectedPersonId(null);
    setShowSocialFeed(false);
    setShowSupplyShop(false);
  }, [game.eventId, game.route]);

  useEffect(() => () => soundtrackRef.current?.dispose(), []);
  useEffect(() => () => interactionSoundsRef.current?.dispose(), []);

  const metrics = useMemo(() => ({
    cash: `$${game.resources.cash}`,
    supplies: `${game.resources.supplies} ${game.resources.supplies === 1 ? "day" : "days"}`,
    water: `${game.resources.water} L`,
    battery: `${game.resources.battery}%`,
    stress: game.resources.stress,
    exposure: game.resources.exposure,
  }), [game.resources]);

  const soundtrackMood = useMemo(() => {
    const people = Object.values(game.people).filter((person) => person.alive !== false);
    const averageHealth = people.length ? people.reduce((sum, person) => sum + person.health, 0) / people.length : 0;
    const lastRecordedTone = game.history[game.history.length - 1]?.tone ?? null;
    return {
      stress: game.resources.stress,
      exposure: game.resources.exposure,
      progress: game.progress,
      averageHealth,
      outcomeTone: game.currentOutcome?.tone ?? lastRecordedTone,
      status: game.status,
    };
  }, [game.currentOutcome, game.history, game.people, game.progress, game.resources.exposure, game.resources.stress, game.status]);

  const soundtrackTheme = useMemo(() => selectSoundtrackTheme(soundtrackMood), [soundtrackMood]);

  useEffect(() => {
    soundtrackRef.current?.setMood(soundtrackMood);
  }, [soundtrackMood]);

  const inspectRoute = (route) => {
    setSelectedRoute(route);
    setSelectedPersonId(null);
    setDrawerOpen(true);
  };

  const inspectPerson = (person) => {
    setSelectedPersonId(person.id);
    setDrawerOpen(true);
  };

  const confirmChoice = () => {
    commitJourneyChoice(game, pendingChoice, setGame, () => setShowHistory(true));
    setPendingChoice(null);
  };

  const restart = () => {
    const fresh = selectFamilyGame(game.familyId, { restart: true });
    setGame(fresh);
    setPendingChoice(null);
    setShowRestart(false);
    setShowLog(false);
    setShowSocialFeed(false);
    setShowSupplyShop(false);
  };

  const toggleSoundtrack = async () => {
    const soundtrack = soundtrackRef.current ?? createJourneySoundtrack();
    soundtrackRef.current = soundtrack;

    if (soundtrackOn) {
      soundtrack.pause();
      setSoundtrackOn(false);
      return;
    }

    try {
      soundtrack.setMood(soundtrackMood);
      await soundtrack.play();
      setSoundtrackOn(true);
      setSoundtrackError(false);
    } catch {
      setSoundtrackError(true);
    }
  };

  const playInteractionSound = (clickEvent) => {
    const button = clickEvent.target.closest("button");
    if (!button || button.disabled) return;
    const sounds = interactionSoundsRef.current ?? createInteractionSounds();
    interactionSoundsRef.current = sounds;
    sounds.play(button.dataset.sound ?? "tap");
  };

  const continueWithIncidents = () => {
    const incidentRolls = [Math.random(), Math.random(), Math.random()];
    setGame((current) => continueJourney(current, { incidents: true, incidentRolls }));
  };

  return (
    <main className={`game-shell${isCambodiaJourney(game) && game.householdEdition !== 3 ? " cambodia-planning" : ""}`} onClickCapture={playInteractionSound}>
      <header className="game-header">
        <div className="brand-lockup">
          <div><h1>The Undocumented Trail</h1><p>Everything they carry</p></div>
          <Mountains weight="thin" aria-hidden="true" />
        </div>
        <div className="day-summary">
          <div>
            <strong><span className="planning-date">{getJourneyDate(game)}</span><span className="planning-region">{event.region}</span></strong>
            <small>{game.history.length ? `${game.history.length} choices saved` : "Different paths. A more human tomorrow."}</small>
          </div>
          <PlanningHeaderActions feedbackContext={{journey:game.familyId,edition:game.householdEdition,view:"planning"}} onChooseJourney={() => setShowFamilySelection(true)} onRestart={() => setShowRestart(true)} onHistory={() => setShowHistory(true)} onLog={() => setShowLog(true)} guidedHref={isCambodiaJourney(game) ? `/?story=${game.familyId}${game.familyId==="cambodia-1979"?`&edition=${game.householdEdition}`:game.householdEdition===1?"&edition=1":""}` : "/"} soundtrackOn={soundtrackOn} soundtrackTheme={soundtrackTheme} onToggleSoundtrack={toggleSoundtrack} />
          {soundtrackError && <span className="soundtrack-error" role="status">Sound is unavailable in this browser.</span>}
        </div>
        <>{isCambodiaJourney(game) ? <CambodiaResources game={game} /> : <div className="status-strip" aria-label="Group resources">
          <StatusMetric key={`cash-${metrics.cash}`} icon={Wallet} value={metrics.cash} label="Cash" tone="safe" tooltip="Money available for transport, shelter, food, and official fees." />
          <StatusMetric key={`supplies-${metrics.supplies}`} icon={ForkKnife} value={metrics.supplies} label="Supplies" tone={getResourceTone("supplies", game.resources.supplies)} tooltip="Food for the group. Reaching zero harms health and raises stress." />
          <StatusMetric key={`water-${metrics.water}`} icon={Drop} value={metrics.water} label="Water" tone={getResourceTone("water", game.resources.water)} tooltip="Drinking water carried by the group. Reaching zero causes dehydration." />
          <StatusMetric key={`battery-${metrics.battery}`} icon={BatteryMedium} value={metrics.battery} label="Phone" tone={getResourceTone("battery", game.resources.battery)} tooltip="Phone charge used for verification, calls, maps, and support." />
          <StatusMetric key={`medicine-${game.resources.medicine}`} icon={Pill} value={game.resources.medicine} label="Medicine" tone={getResourceTone("medicine", game.resources.medicine)} tooltip="Doses that can restore an injured or exhausted traveler’s health." />
          <StatusMetric key={`stress-${metrics.stress}`} icon={ShieldWarning} value={`${metrics.stress}%`} label="Stress" tone={getResourceTone("stress", game.resources.stress)} tooltip="Shared emotional strain. At 100%, the group cannot safely continue." />
          <StatusMetric key={`exposure-${metrics.exposure}`} icon={Eye} value={`${metrics.exposure}%`} label="Exposure" tone={getResourceTone("exposure", game.resources.exposure)} tooltip="How visible the group is to danger or enforcement. At 100%, the run ends." />
        </div>}</>
      </header>

      {isCambodiaJourney(game) && !(game.familyId==="cambodia-1979" && game.householdEdition===3) && <><img className="planning-cambodia-hero" style={{objectPosition:event.heroFocalPoint ?? "50% 45%"}} onError={e=>{if(e.currentTarget.dataset.fallback!=="cover"){e.currentTarget.dataset.fallback="cover";e.currentTarget.src=getFamilyPreset(game).heroImage;}}} src={event.heroImage} alt={event.heroAlt} /><p className="cambodia-hero-credit">{event.time}</p><CambodiaJourneyContext game={game} onChange={setGame} /></>}
      <div className="game-grid">
        <section className="map-stage geographic-map-stage" aria-label="Journey geography">
          {family.mapImage || (game.familyId === "cambodia-1979" && game.householdEdition === 3) ? <IllustratedJourneyMap game={game} /> : <JourneyMap game={game} fitViewport />}
          <details className="planning-map-approaches" hidden={Boolean(family.mapImage) || (game.familyId === "cambodia-1979" && game.householdEdition === 3)}>
            <summary>Weather and travel approach details</summary>
            <div className="planning-map-context">
              <strong>{isCambodiaJourney(game) && game.householdEdition !== 3 ? "Scene" : "Day"} {game.day} · {event.time} · {event.weather}</strong>
              <small>{event.weatherDetail}</small>
            </div>
            <p>These approaches describe support and risk, not geographic waypoints.</p>
            {!isCambodiaJourney(game) && Object.entries(ROUTES).map(([id, approach]) => <button key={id} onClick={() => inspectRoute(id)} data-sound="tap">{approach.title}</button>)}
          </details>

          {drawerOpen && selectedPerson && isCambodiaJourney(game) && game.householdEdition !== 3 && <CambodiaPersonDialog game={game} person={selectedPerson} onClose={() => setDrawerOpen(false)} />}
          {drawerOpen && (!isCambodiaJourney(game) || game.householdEdition === 3) && (
            <DetailDrawer
              person={selectedPerson}
              personState={selectedPerson ? game.people[selectedPerson.id] : null}
              relationshipNote={selectedPerson ? game.relationshipNotes?.[selectedPerson.id] : null}
              route={selectedPerson ? null : selectedRoute}
              medicine={game.resources.medicine}
              stress={game.resources.stress}
              familyId={game}
              onUseMedicine={isCambodiaJourney(game) && game.householdEdition !== 3 ? undefined : (personId) => setGame((current) => useMedicine(current, personId))}
              onClose={() => setDrawerOpen(false)}
            />
          )}
        </section>

        <section className="team-strip" aria-label="Traveling group">
          <header>
            <UsersThree weight="duotone" aria-hidden="true" />
            <div><strong>Traveling together</strong><small>{isCambodiaJourney(game) && game.householdEdition !== 3 ? "Select a person to read their story" : "Select a person to review health, trust, and skills"}</small></div>
          </header>
          <div className="team-grid">
            {people.map((person) => (
              <CharacterCard
                key={person.id}
                person={person}
                state={game.people[person.id]}
                stress={game.resources.stress}
                family={game}
                active={selectedPersonId === person.id && drawerOpen}
                onClick={inspectPerson}
              />
            ))}
          </div>
        </section>

        <MessagePanel
          key={`${game.eventId}-${game.phase}-${game.currentOutcome?.id ?? "decision"}`}
          event={event}
          game={game}
          socialFeed={socialFeed}
          socialFeedResolved={socialFeedResolved}
          supplyStop={supplyStop}
          onOpenSocialFeed={() => setShowSocialFeed(true)}
          onExploreHistory={() => setShowHistory(true)}
          onOpenSupplyShop={() => setShowSupplyShop(true)}
          onChoice={setPendingChoice}
          onContinue={continueWithIncidents}
          onTravelPlan={(strategyId,personId) => setGame((current) => planTravelLeg(current, strategyId,personId))}
          onCambodiaSupply={itemId=>setGame(current=>resupplyCambodia(current,itemId))}
        />
      </div>

      <ChoiceModal choice={pendingChoice} game={game} onCancel={() => setPendingChoice(null)} onConfirm={confirmChoice} />
      {showFamilySelection && <FamilySelection mode="full" currentFamilyId={game.familyId} required={familySelectionRequired} saves={loadFamilySaves()} archive={loadJourneyArchive()} onSelect={familyId => { setGame(selectFamilyGame(familyId)); setFamilySelectionRequired(false); setShowFamilySelection(false); }} onClose={() => setShowFamilySelection(false)} />}
      {showHistory && <JourneyHistoryDialog game={game} onClose={() => setShowHistory(false)} />}
      {showLog && <JourneyLog game={game} onClose={() => setShowLog(false)} />}
      {showRestart && <RestartModal onCancel={() => setShowRestart(false)} onConfirm={restart} />}
      {showSocialFeed && socialFeed && (
        <SocialFeedModal
          feed={socialFeed}
          climate={game.socialClimate}
          options={socialOptions}
          outcome={socialOutcome}
          resolved={socialFeedResolved}
          onRespond={(responseId) => setGame((current) => respondToSocialFeed(current, responseId))}
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
      {game.pendingIncident && <TravelIncident game={game} onResolve={(responseId) => setGame((current) => resolveTravelIncident(current, responseId))} />}
      {game.phase === "ended" && !showHistory && !showRestart && !showFamilySelection && <EndingModal game={game} onRestart={restart} onExploreHistory={() => setShowHistory(true)} />}
    </main>
  );
}
