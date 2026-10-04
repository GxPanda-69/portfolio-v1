import { Point, Sprite, Texture } from "pixi.js";
import { Spring } from "./spring";
import { Vector2 } from "./math-helper";
import { getConstants } from "./constants";

interface SpriteParameters {
  scale: number;
}

export class Card extends Sprite {
  spring: Spring;
  distanceToSpring: number;
  weight: number;

  constructor(
    texture: Texture,
    linkedSpring: Spring,
    distanceToSpring: number,
    anchorPoint: Vector2,
    weight: number,
    spriteParameters?: SpriteParameters,
  ) {
    super({ texture: texture, scale: spriteParameters?.scale });
    super.anchor.set(anchorPoint.x, anchorPoint.y);
    this.spring = linkedSpring;
    this.distanceToSpring = distanceToSpring;
    super.position.copyFrom(this.spring.point_2);
    super.position.y += this.distanceToSpring;
    this.weight = weight ? weight : 1;
  }

  update(deltaTime: number) {
    super.position.y += this.weight * getConstants().gravity * deltaTime;

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

    const targetRotation = Math.atan2(offset.y, offset.x) + Math.PI / 2;
    const difference = Math.atan2(
      Math.sin(targetRotation - this.rotation),
      Math.cos(targetRotation - this.rotation),
    );
    this.rotation += difference;

    super.position.x += distanceToTarget * offsetNormalized.x;
    super.position.y += distanceToTarget * offsetNormalized.y;
  }
}
