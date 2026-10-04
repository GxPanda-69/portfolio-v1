import { MeshRope, Point, Texture } from "pixi.js";
import { getConstants } from "./constants";
import { Vector2 } from "./math-helper";

interface SpringConfig {
  rest_length: number;
  resistance: number;
  stiffness: number;
}

export class Spring extends MeshRope {
  point_1: Point;
  point_1_vel: Vector2;
  point_2: Point;
  point_2_vel: Vector2;
  k: number;
  damping: number;
  rest_length: number;

  constructor(
    texture: Texture,
    position: Point,
    config: SpringConfig,
    width: number,
  ) {
    const point_1 = position.clone();
    const point_2 = new Point(
      position.x + (Math.random() - 0.5) * 20,
      position.y + config.rest_length * 0.25,
    );

    super({
      points: [point_1, point_2],
      texture: texture,
      width: width,
    });

    this.point_1 = point_1;
    this.point_1_vel = { x: 0, y: 0 };
    this.point_2 = point_2;
    this.point_2_vel = { x: 0, y: 0 };
    this.k = config.stiffness;
    this.damping = config.resistance;
    this.rest_length = config.rest_length;
  }

  private clampLength() {
    const maxLength = getConstants().maxSpringLength;

    const delta: Vector2 = {
      x: this.point_2.x - this.point_1.x,
      y: this.point_2.y - this.point_1.y,
    };
    const currentDistance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    if (currentDistance > maxLength) {
      const normalizedDelta: Vector2 = {
        x: delta.x / currentDistance,
        y: delta.y / currentDistance,
      };
      this.point_2.set(
        this.point_1.x + normalizedDelta.x * maxLength,
        this.point_1.y + normalizedDelta.y * maxLength,
      );
    }
  }

  update(deltaTime: number) {
    // Get distance between point1 & point2
    const delta: Vector2 = {
      x: this.point_2.x - this.point_1.x,
      y: this.point_2.y - this.point_1.y,
    };
    const currentDistance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    // Calculate spring force magnitude
    const displacement = currentDistance - this.rest_length;
    const springForceMagnitude = -this.k * displacement;

    // Create vector
    const direction: Vector2 =
      currentDistance === 0
        ? { x: 0.1, y: 0 } // Arbitrary small value to prevent division by 0
        : {
            x: delta.x / currentDistance,
            y: delta.y / currentDistance,
          };

    // Damping
    const relativeVel: Vector2 = {
      x: this.point_2_vel.x - this.point_1_vel.x,
      y: this.point_2_vel.y - this.point_1_vel.y,
    };
    const dampingForceMagnitude =
      this.damping *
      (relativeVel.x * direction.x + relativeVel.y * direction.y);

    const totalForceMagnitude = springForceMagnitude - dampingForceMagnitude;
    const force: Vector2 = {
      x: direction.x * totalForceMagnitude,
      y: direction.y * totalForceMagnitude,
    };

    this.point_2_vel.x += force.x * deltaTime;
    this.point_2_vel.y += (force.y + getConstants().gravity) * deltaTime;

    this.point_2.x += this.point_2_vel.x * deltaTime;
    this.point_2.y += this.point_2_vel.y * deltaTime;

    this.clampLength();
  }

  getLength() {
    const delta: Vector2 = {
      x: this.point_2.x - this.point_1.x,
      y: this.point_2.y - this.point_1.y,
    };
    const currentDistance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    return currentDistance;
  }
}
