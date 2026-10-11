import {
  ArrowRight,
  BatteryMedium,
  Drop,
  ForkKnife,
  Pill,
  Storefront,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { getSupplyOptions, getSupplyStop } from "./game.js";
import "./supplyShop.css";

const ITEM_ICONS = {
  medicine: Pill,
  supplies: ForkKnife,
  water: Drop,
  battery: BatteryMedium,
};

function resourceValue(item, value) {
  if (item.resource === "medicine") return `${value} ${value === 1 ? "dose" : "doses"}`;
  if (item.resource === "supplies") return `${value} ${value === 1 ? "day" : "days"}`;
  return `${value}${item.unit === "%" ? "%" : ` ${item.unit}`}`;
}

export function SupplyStopTrigger({ stop, onOpen, compact = false }) {
  if (!stop) return null;
  return (
    <button
      className={`supply-stop-trigger ${compact ? "compact" : ""}`}
      onClick={onOpen}
      data-sound="tap"
      aria-label={`Open resupply stop: ${stop.title}`}
    >
      <span className="supply-stop-trigger-icon"><Storefront weight="duotone" /></span>
      <span className="supply-stop-trigger-copy">
        <small>Resupply stop</small>
        <strong>{stop.title}</strong>
      </span>
      <span>Medicine · food · water · charging</span>
      <ArrowRight weight="bold" aria-hidden="true" />
    </button>
  );
}

export function SupplyShop({ game, onBuy, onClose }) {
  const stop = getSupplyStop(game);
  const options = getSupplyOptions(game);
  if (!stop) return null;

  return (
    <div className="supply-shop-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="supply-shop-dialog" role="dialog" aria-modal="true" aria-labelledby="supply-shop-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="supply-shop-close" onClick={onClose} aria-label="Close resupply stop" data-sound="dismiss"><X weight="bold" /></button>

        <header className="supply-shop-header">
          <span className="supply-shop-logo"><Storefront weight="duotone" /></span>
          <div>
            <small>Resupply stop · Day {game.day}</small>
            <h2 id="supply-shop-title">{stop.title}</h2>
            <p>{stop.detail}</p>
          </div>
          <div className="supply-shop-wallet" aria-label={`${game.resources.cash} dollars available`}>
            <Wallet weight="duotone" />
            <span><small>Available cash</small><strong>${game.resources.cash}</strong></span>
          </div>
        </header>

        <p className="supply-shop-note">Buy as much as the group can carry. Shopping does not replace the story decision waiting outside.</p>

        <div className="supply-shop-grid" aria-label="Supplies available to purchase">
          {options.map((item) => {
            const Icon = ITEM_ICONS[item.id];
            const current = game.resources[item.resource];
            const next = Math.min(item.cap, current + item.amount);
            return (
              <article className={item.unavailable ? "unavailable" : ""} key={item.id}>
                <span className="supply-item-icon"><Icon weight="duotone" /></span>
                <div className="supply-item-copy">
                  <small>{item.shortTitle}</small>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <span className="supply-item-level">Carrying {resourceValue(item, current)} <ArrowRight weight="bold" /> {resourceValue(item, next)}</span>
                </div>
                <button
                  onClick={() => onBuy(item.id)}
                  disabled={Boolean(item.unavailable)}
                  data-sound="confirm"
                >
                  <strong>{item.unavailable ?? `Buy · $${item.cost}`}</strong>
                  {!item.unavailable && <span>Cash after purchase: ${game.resources.cash - item.cost}</span>}
                </button>
              </article>
            );
          })}
        </div>

        <footer className="supply-shop-footer">
          <span>Capacity limits prevent the group from carrying unlimited supplies.</span>
          <button onClick={onClose} data-sound="dismiss">Return to the journey<ArrowRight weight="bold" /></button>
        </footer>
      </section>
    </div>
  );
}
