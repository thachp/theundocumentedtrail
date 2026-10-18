// Default focus scrolling uses "nearest", which can leave a fully onscreen
// heading hidden behind the guided view's fixed mobile choices cue. Center the
// target explicitly in its scroll containers, without animating or jumping twice.
export function focusSharedResult(heading) {
  if (!heading) return;
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
}
