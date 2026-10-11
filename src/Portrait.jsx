import { getFamilyPreset, getPortraitImage } from "./game.js";
import { getPortraitCropGeometry } from "./portrait.js";
import "./portrait.css";

export function Portrait({ person, state, stress = 0, family, alt = "", className = "" }) {
  const familyPreset = getFamilyPreset(family);
  const image = getPortraitImage(person, state, stress, family);
  const index = Math.max(0, familyPreset.people.findIndex((traveler) => traveler.id === person.id));
  const geometry = getPortraitCropGeometry(index, familyPreset.portraitSheet.width, familyPreset.portraitSheet.height);
  return (
    <svg
      className={`portrait-crop ${className}`.trim()}
      viewBox={geometry.viewBox}
      preserveAspectRatio="xMidYMid slice"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : "true"}
      focusable="false"
    >
      <image href={image} width={geometry.imageWidth} height={geometry.imageHeight} preserveAspectRatio="none" />
    </svg>
  );
}
