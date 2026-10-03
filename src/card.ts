import { Point, Sprite, Texture } from "pixi.js";
import { Spring } from "./spring";
import { Vector2 } from "./math-helper";
import { getConstants } from "./constants";

export class Card extends Sprite {
  spring: Spring;
  distanceToSpring: number;

  constructor(
    texture: Texture,
    linkedSpring: Spring,
    distanceToSpring: number,
    anchorPoint: Vector2,
  ) {
    super({ texture: texture });
    super.anchor.set(anchorPoint.x, anchorPoint.y);
    this.spring = linkedSpring;
    this.distanceToSpring = distanceToSpring;
  }

  update(deltaTime: number) {
    const offset: Vector2 = {
      x: this.spring.point_2.x - super.position.x,
      y: this.spring.point_2.y - super.position.y,
    };
    const offsetMagnitude = Math.sqrt(offset.x ** 2 + offset.y ** 2);
    const offsetNormalized = {
      x: offset.x / offsetMagnitude,
      y: offset.y / offsetMagnitude,
    };
    const distanceToTarget = offsetMagnitude - this.distanceToSpring;

    super.rotation = Math.atan(offset.y / offset.x);

    super.position.x += distanceToTarget * offsetNormalized.x;
    super.position.y += distanceToTarget * offsetNormalized.y;

    super.position.y += getConstants().gravity;
  }
}
