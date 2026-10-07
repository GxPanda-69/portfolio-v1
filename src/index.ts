let panelStates: Record<string, "peek" | "out" | undefined> = {};

const peekingAnimKeyframes: Keyframe[] = [
  { transform: "translateY(0%)" },
  { transform: "translateY(5%)" },
];

const peekingAnimOptions: KeyframeAnimationOptions = {
  duration: 500,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  fill: "forwards",
};

const showAnimKeyframes: Keyframe[] = [
  { transform: "translateY(5%)" },
  { transform: "translateY(100%)" },
];

const showAnimOptions: KeyframeAnimationOptions = {
  duration: 1000,
  easing: "cubic-bezier(0.3, 0.7, 0.4, 1)",
  fill: "forwards",
};

const hideAnimKeyframes: Keyframe[] = [{ transform: "translateY(0%)" }];

const hideAnimOptions: KeyframeAnimationOptions = {
  duration: 500,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  fill: "forwards",
};

const closeAnimOptions: KeyframeAnimationOptions = {
  duration: 1000,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  fill: "forwards",
};

export function panelPeek(panelId: string) {
  if (panelStates[panelId]) return;

  const panelElement = document.getElementById(panelId);
  const peekingAnimation = panelElement?.animate(
    peekingAnimKeyframes,
    peekingAnimOptions,
  );
  peekingAnimation?.play();

  panelStates[panelId] = "peek";
}

export function panelShow(panelId: string) {
  if (panelStates[panelId] !== "peek") return;

  const panelElement = document.getElementById(panelId);
  const showAnimation = panelElement?.animate(
    showAnimKeyframes,
    showAnimOptions,
  );
  showAnimation?.play();

  panelStates[panelId] = "out";
}

export function panelHide(panelId: string) {
  if (panelStates[panelId] === "out") return;

  const panelElement = document.getElementById(panelId);
  const hideAnimation = panelElement?.animate(
    hideAnimKeyframes,
    hideAnimOptions,
  );
  hideAnimation?.play();

  panelStates[panelId] = undefined;
}

export function panelClose(panelId: string) {
  if (panelStates[panelId] !== "out") return;

  const panelElement = document.getElementById(panelId);
  const hideAnimation = panelElement?.animate(
    hideAnimKeyframes,
    closeAnimOptions,
  );
  hideAnimation?.play();

  panelStates[panelId] = undefined;
}

export function getPanelState(panelId: string) {
  return panelStates[panelId];
}

document
  .getElementById("panel-close-button")
  ?.addEventListener("click", (_ev) => {
    for (const [key, _state] of Object.entries(panelStates)) {
      panelClose(key);
    }
  });
