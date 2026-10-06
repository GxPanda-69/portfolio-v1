import { Sprite, Texture } from "pixi.js";
import { Spring } from "./spring";
import { Vector2 } from "./math-helper";
import { getConstants } from "./constants";
import { getPanelState, panelHide, panelPeek, panelStates } from ".";

interface SpriteParameters {
  scale: number;
}

export class Card extends Sprite {
  spring: Spring;
  distanceToSpring: number;
  weight: number;
  dragging: boolean = false;

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

    this.eventMode = "static";

    this.on("pointerdown", (_event) => {
      this.dragging = true;
      this.spring.dragging = true;
    });
    this.on("pointerup", (_event) => {
      this.dragging = false;
      this.spring.dragging = false;
    });
    this.on("pointerupoutside", (_event) => {
      this.dragging = false;
      this.spring.dragging = false;
    });
    this.on("globalmousemove", (event) => {
      if (this.dragging && getPanelState(this.spring.linkedPanel) !== "out") {
        this.position = event.client;
        this.spring.point_2.copyFrom(event.client);
      }
    });
    this.on("pointerenter", (_event) => {
      panelPeek(this.spring.linkedPanel);
    });
    this.on("pointerleave", (_event) => {
      panelHide(this.spring.linkedPanel);
    });
  }

  update(deltaTime: number) {
    if (this.dragging && getPanelState(this.spring.linkedPanel) !== "out") {
      this.spring.point_2.copyFrom(this.position);
      this.spring.point_2_vel = { x: 0, y: 0 };
      return;
    }

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

    this.position.x += distanceToTarget * offsetNormalized.x;
    this.position.y += distanceToTarget * offsetNormalized.y;
  }
}
