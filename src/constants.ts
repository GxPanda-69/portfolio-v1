const constants = {
  gravity: 0.5,
  timeScale: 1,
  maxSpringLength: -1,
  screenWidth: -1,
  screenHeight: -1,
};

export function getConstants() {
  return constants;
}

export function setConstant(
  key: "screenWidth" | "screenHeight",
  value: number,
) {
  constants[key] = value;
}
