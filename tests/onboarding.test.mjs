import assert from "node:assert/strict";
import test from "node:test";
import {
  completeTutorialOverlayState,
  createInitialOnboardingState,
} from "../src/onboarding.js";

test("a new player sees the tutorial before journey selection", () => {
  assert.deepEqual(
    createInitialOnboardingState({ tutorialComplete: false, familySelected: false }),
    {
      familySelectionRequired: true,
      showFamilySelection: false,
      showTutorial: true,
      tutorialIsOnboarding: true,
    },
  );
});

test("a returning player sees journey selection on launch", () => {
  assert.deepEqual(
    createInitialOnboardingState({ tutorialComplete: true, familySelected: true }),
    {
      familySelectionRequired: false,
      showFamilySelection: true,
      showTutorial: false,
      tutorialIsOnboarding: false,
    },
  );
});

test("finishing first-run tutorial advances to journey selection", () => {
  assert.deepEqual(completeTutorialOverlayState({ tutorialIsOnboarding: true }), {
    showFamilySelection: true,
    showTutorial: false,
    tutorialIsOnboarding: false,
  });
});

test("finishing a replayed tutorial returns to the game", () => {
  assert.deepEqual(completeTutorialOverlayState({ tutorialIsOnboarding: false }), {
    showFamilySelection: false,
    showTutorial: false,
    tutorialIsOnboarding: false,
  });
});
