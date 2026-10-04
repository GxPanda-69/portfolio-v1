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

  const spring = new Spring(
    texture,
    new Point(app.screen.width / 2, 0),
    {
      rest_length: 100,
      resistance: 0.1,
      stiffness: 0.01,
    },
    1,
  );

  const card = new Card(
    await Assets.load("/assets/card_about_me.png"),
    spring,
    40,
    {
      x: 0.5,
      y: 0.3,
    },
    20,
  );

  // Add the bunny to the stage
  app.stage.addChild(spring);
  app.stage.addChild(card);

  // Listen for animate update
  app.ticker.add((time) => {
    const dt = time.deltaTime * getConstants().timeScale;

    spring.update(dt);
    card.update(dt);
  });
})();
