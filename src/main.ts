import { Application, Assets, Point } from "pixi.js";
import { Spring } from "./spring";
import { Card } from "./card";
import { getConstants } from "./constants";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/rope_base.png");

  const springs: Spring[] = [
    new Spring(
      texture,
      new Point((app.screen.width / 3) * 1, 0),
      {
        rest_length: 75 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
    ),
    new Spring(
      texture,
      new Point((app.screen.width / 3) * 2, 0),
      {
        rest_length: 75 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
    ),
  ];

  const cards: Card[] = [
    new Card(
      await Assets.load("/assets/card_about_me.png"),
      springs[0],
      30,
      {
        x: 0.5,
        y: 0.3,
      },
      20,
      {
        scale: 0.5,
      },
    ),
    new Card(
      await Assets.load("/assets/card_about_me.png"),
      springs[1],
      30,
      {
        x: 0.5,
        y: 0.3,
      },
      20,
      {
        scale: 0.5,
      },
    ),
  ];

  // Add the bunny to the stage
  springs.forEach((spring) => {
    app.stage.addChild(spring);
  });
  cards.forEach((card) => {
    app.stage.addChild(card);
  });

  // Listen for animate update
  app.ticker.add((time) => {
    const dt = time.deltaTime * getConstants().timeScale;

    springs.forEach((spring) => {
      spring.update(dt);
    });
    cards.forEach((card) => {
      card.update(dt);
    });
  });
})();
