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
      position.x + Math.random() * 200,
      position.y + config.rest_length,
    );

    super({
      points: [point_1, point_2],
      texture: texture,
      width: width,
    });

    this.point_1 = point_1;
    this.point_1_vel = { x: 0, y: 0 };
    this.point_2 = point_2;
    this.point_2_vel = { x: 0, y: Math.random() * 10 };
    this.k = config.stiffness;
    this.damping = config.resistance;
    this.rest_length = config.rest_length;
  }

  update(deltaTime: number) {
    // Get distance between point1 & point2
    const delta: Vector2 = {
      x: this.point_2.x - this.point_1.x,
      y: this.point_2.y - this.point_1.y,
    };
    const current_distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    // Calculate spring force magnitude
    const displacement = current_distance - this.rest_length;
    const spring_force_magnitude = -this.k * displacement;

    // Create vector
    const direction: Vector2 =
      current_distance === 0
        ? { x: 0.1, y: 0 } // Arbitrary small value to prevent division by 0
        : {
            x: delta.x / current_distance,
            y: delta.y / current_distance,
          };

    // Damping
    const relative_vel: Vector2 = {
      x: this.point_2_vel.x - this.point_1_vel.x,
      y: this.point_2_vel.y - this.point_1_vel.y,
    };
    const damping_force_magnitude =
      this.damping *
      (relative_vel.x * direction.x + relative_vel.y * direction.y);

    const total_force_magnitude =
      spring_force_magnitude - damping_force_magnitude;
    const force: Vector2 = {
      x: direction.x * total_force_magnitude,
      y: direction.y * total_force_magnitude,
    };

    this.point_2_vel.x += force.x * deltaTime;
    this.point_2_vel.y += force.y * deltaTime + getConstants().gravity;

    this.point_2.x += this.point_2_vel.x * deltaTime;
    this.point_2.y += this.point_2_vel.y * deltaTime;
  }

  getLength() {
    const delta: Vector2 = {
      x: this.point_2.x - this.point_1.x,
      y: this.point_2.y - this.point_1.y,
    };
    const current_distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);

    return current_distance;
  }
}
