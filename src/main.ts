import { Application, Assets, Point } from "pixi.js";
import { Spring } from "./spring";
import { Card } from "./card";

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
    new Point(app.screen.width / 2, app.screen.height / 2),
    {
      rest_length: 100,
      resistance: 5,
      stiffness: 1,
    },
    1,
  );

  const card = new Card(await Assets.load("/assets/bunny.png"), spring, 50, {
    x: 0.5,
    y: 0.5,
  });

  // Add the bunny to the stage
  app.stage.addChild(spring);
  app.stage.addChild(card);

  // Listen for animate update
  app.ticker.add((time) => {
    spring.update(time.deltaTime);
    card.update(time.deltaTime);
  });
})();
