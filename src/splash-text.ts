const splashMessages: string[] = [
  "Made in human",
  "100% Organic",
  "How can I be adopted when I have a twin sister ?",
  "Congolexicomatisation",
  "Made with real code",
  "Maintenance free",
  "The one in front of the gun lives forever",
  "Won't ever be totally finished",
  "Hi",
  "Cool people will stay",
  "There's lots of way to say the same thing",
  "Fall Seven Times, Stand Up Eight",
  "we might be cooked gng",
  "Stay curious",
  "Never stop learning",
  "idk brah",
  "goddayum",
  "`; DELETE FROM user WHERE 1 = 1;--",
];

export function getSplashText(): string {
  const ind: number = Math.floor(Math.random() * splashMessages.length);
  const result: string = splashMessages[ind];
  return `${result}!`;
}
