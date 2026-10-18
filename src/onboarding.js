export function createInitialOnboardingState({ tutorialComplete, familySelected }) {
  return {
    familySelectionRequired: !familySelected,
    showFamilySelection: true,
    showTutorial: false,
    tutorialIsOnboarding: false,
  };
}

export function completeTutorialOverlayState({ tutorialIsOnboarding }) {
  return {
    showFamilySelection: tutorialIsOnboarding,
    showTutorial: false,
    tutorialIsOnboarding: false,
  };
}
