import { Application, Assets, Point } from "pixi.js";
import { Spring } from "./spring";
import { Card } from "./card";
import { getConstants, setConstant } from "./constants";
import { panelShow } from ".";
import { Star } from "./star";

const TAGS_SPACING = 200;

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#18161d", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const springTexture = await Assets.load("/assets/rope_base.png");
  const starTexture = await Assets.load("/assets/star.png");

  setConstant("screenWidth", app.screen.width);
  setConstant("screenHeight", app.screen.height);

  const springs: Spring[] = [
    new Spring(
      springTexture,
      new Point(getConstants().screenWidth / 2 + -200, 0),
      {
        rest_length: 50 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
      "about-me-panel",
    ),
    new Spring(
      springTexture,
      new Point(getConstants().screenWidth / 2 + 0, 0),
      {
        rest_length: 50 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
      "aston-panel",
    ),
    new Spring(
      springTexture,
      new Point(getConstants().screenWidth / 2 + 200, 0),
      {
        rest_length: 50 + Math.random() * 50,
        resistance: 0.1,
        stiffness: 0.01,
      },
      1,
      "music-panel",
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
    new Card(
      await Assets.load("/assets/card_about_me.png"),
      springs[2],
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
  let starTimeCounter = 0;

  app.ticker.add((time) => {
    setConstant("screenWidth", app.screen.width);
    setConstant("screenHeight", app.screen.height);

    const dt = time.deltaTime * getConstants().timeScale;

    starTimeCounter += dt;

    springs.forEach((spring, idx) => {
      spring.point_1.x =
        (idx - (springs.length - 1) / 2) * TAGS_SPACING +
        getConstants().screenWidth / 2;
      spring.point_1.y =
        document.getElementById(spring.linkedPanel)?.getBoundingClientRect()
          .bottom || 0;

      spring.update(dt);

      if (spring.getLength() > 400 && spring.dragging) {
        panelShow(spring.linkedPanel);
      }
    });
    cards.forEach((card, _idx) => {
      card.update(dt);
    });

    if (starTimeCounter > (Math.random() + 1) * 10) {
      starTimeCounter = 0;
      const star = new Star(starTexture);
      app.stage.addChild(star);
    }
  });
})();
