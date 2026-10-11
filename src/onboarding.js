export function createInitialOnboardingState({ tutorialComplete, familySelected }) {
  return {
    familySelectionRequired: !familySelected,
    showFamilySelection: tutorialComplete,
    showTutorial: !tutorialComplete,
    tutorialIsOnboarding: !tutorialComplete,
  };
}

export function completeTutorialOverlayState({ tutorialIsOnboarding }) {
  return {
    showFamilySelection: tutorialIsOnboarding,
    showTutorial: false,
    tutorialIsOnboarding: false,
  };
}
