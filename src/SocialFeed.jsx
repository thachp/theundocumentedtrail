import {
  ArrowRight,
  ChatCircleDots,
  Check,
  Eye,
  Handshake,
  Info,
  ShieldWarning,
  X,
} from "@phosphor-icons/react";
import { getSocialClimateLabel } from "./game.js";

const actionIcons = {
  verify: Info,
  support: Handshake,
  ignore: Eye,
  respond: ChatCircleDots,
};

export function SocialFeedTrigger({ feed, climate, resolved, onOpen, compact = false }) {
  if (!feed) return null;
  const climateState = getSocialClimateLabel(climate);
  return (
    <button
      className={`social-feed-trigger ${compact ? "compact" : ""} ${resolved ? "resolved" : "unread"}`}
      onClick={onOpen}
      aria-label={`Open The Current social feed: ${feed.headline}`}
      data-sound="tap"
    >
      <span className="social-feed-trigger-icon"><ChatCircleDots weight="duotone" /></span>
      <span className="social-feed-trigger-copy">
        <small>The Current · {resolved ? "response recorded" : "new posts"}</small>
        <strong>{feed.headline}</strong>
      </span>
      <em className={climateState.tone}>{climateState.label}</em>
    </button>
  );
}

export function SocialFeedModal({ feed, climate, options, outcome, resolved, onRespond, onClose }) {
  if (!feed) return null;
  const climateState = getSocialClimateLabel(climate);
  return (
    <div className="social-feed-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="social-feed-dialog" role="dialog" aria-modal="true" aria-labelledby="social-feed-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="social-feed-close" onClick={onClose} aria-label="Close The Current" data-sound="dismiss"><X weight="bold" /></button>

        <header className="social-feed-header">
          <span className="social-feed-logo"><ChatCircleDots weight="fill" /></span>
          <div>
            <small>Fictional social network</small>
            <h2 id="social-feed-title">The Current</h2>
            <p>{feed.eyebrow} · {feed.location}</p>
          </div>
          <div className={`social-climate ${climateState.tone}`}>
            <span><small>Public climate</small><strong>{climateState.label} · {climate}%</strong></span>
            <i><b style={{ width: `${climate}%` }} /></i>
          </div>
        </header>

        <div className="social-feed-context">
          <ShieldWarning weight="duotone" />
          <p>Posts are fictional composites. A source label describes what an account is—not whether every claim inside a post is true.</p>
        </div>

        <div className="social-posts" aria-label="Posts in The Current">
          {feed.posts.map((post) => (
            <article className={`social-post ${post.tone}`} key={post.id}>
              <span className="social-avatar">{post.initials}</span>
              <div>
                <header>
                  <span><strong>{post.author}</strong><small>{post.handle}</small></span>
                  <em>{post.label}</em>
                </header>
                <p>{post.body}</p>
                <footer><ChatCircleDots weight="duotone" />{post.reach}</footer>
              </div>
            </article>
          ))}
        </div>

        {resolved && outcome ? (
          <section className={`social-feed-result ${outcome.tone}`} aria-live="polite">
            <span><Check weight="bold" /></span>
            <div>
              <small>Response recorded</small>
              <h3>{outcome.title}</h3>
              <p>{outcome.copy}</p>
              <strong>{outcome.consequence}</strong>
              {outcome.reactions?.map((reaction) => (
                <blockquote key={`${reaction.personId}-${reaction.text}`}>
                  <b>{reaction.personName}</b>
                  <span>“{reaction.text}”</span>
                  <em>{reaction.trustDelta > 0 ? `Trust +${reaction.trustDelta}` : reaction.trustDelta < 0 ? `Trust ${reaction.trustDelta}` : "Trust holds"}</em>
                </blockquote>
              ))}
            </div>
            <aside>
              <small>What verification found</small>
              <ul>{feed.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
            <button onClick={onClose} data-sound="confirm">Return to the journey<ArrowRight weight="bold" /></button>
          </section>
        ) : (
          <section className="social-response-section">
            <header><small>Choose how to respond</small><strong>Attention, safety, and credibility all have a cost.</strong></header>
            <div className="social-response-options">
              {options.map((option) => {
                const Icon = actionIcons[option.id] ?? ChatCircleDots;
                return (
                  <button

                    key={option.id}
                    onClick={() => onRespond(option.id)}
                    disabled={Boolean(option.unavailable)}
                    data-sound="choice"
                  >
                    <Icon weight="duotone" />
                    <span><strong>{option.title}</strong><small>{option.unavailable ?? option.hint}</small></span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
