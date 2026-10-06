import { Application, Assets, Point } from "pixi.js";
import { Spring } from "./spring";
import { Card } from "./card";
import { getConstants } from "./constants";
import { panelPeek, panelShow } from ".";

const TAGS_SPACING = 200;

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
      new Point(app.screen.width / 2 + -100, 0),
      {
        rest_length: 50 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
      "about-me-panel",
    ),
    new Spring(
      texture,
      new Point(app.screen.width / 2 + 100, 0),
      {
        rest_length: 50 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
      "about-me-panel",
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

    springs.forEach((spring, idx) => {
      spring.point_1.x =
        (idx - (springs.length - 1) / 2) * TAGS_SPACING + app.screen.width / 2;
      spring.point_1.y =
        document.getElementById(spring.linkedPanel)?.getBoundingClientRect()
          .bottom || 0;

      spring.update(dt);

      if (spring.getLength() > 400) {
        panelShow(spring.linkedPanel);
      }
    });
    cards.forEach((card, _idx) => {
      card.update(dt);
    });
  });
})();
