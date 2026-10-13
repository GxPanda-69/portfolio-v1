import { Point, Sprite, Texture } from "pixi.js";
import { getConstants } from "./constants";
import gsap from "gsap";

export class Star extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.position.copyFrom(
      new Point(
        Math.random() * getConstants().screenWidth,
        Math.random() * getConstants().screenHeight,
      ),
    );
    this.scale = 0;
    this.alpha = 0;
    this.anchor = { x: 0.5, y: 0.5 };
    this.zIndex = -100;
    gsap
      .timeline({
        onComplete: () => this.destroy(),
      })
      .to(this, {
        scale: Math.random(),
        alpha: Math.random(),
        duration: Math.random() * 2,
        ease: "power2.out",
      })
      .to(
        this,
        {
          alpha: 0,
          duration: 0.8,
          ease: "power2.in",
        },
        "+=0.2",
      );
  }
}
