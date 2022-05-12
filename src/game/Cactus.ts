import { Graphics, Sprite } from "pixi.js";
import { PhysicsContainer } from "./PhysicsContainer";

export class Cactus extends PhysicsContainer {
    private spr: Sprite;
    public hitbox:Graphics;

    constructor() {
        super();

        if (Math.random() > 0.5)
        {
            this.spr = Sprite.from("Cactus 1")
        }
        else
        {
            this.spr = Sprite.from("Cactus 2")
        }
        this.spr.anchor.set(0.5,1);
        this.spr.scale.set(2);
        this.addChild(this.spr);

        const zero: Graphics = new Graphics();
        zero.beginFill(0xFF00FF);
        zero.drawCircle(0, 0, 10);
        zero.endFill;
        // this.addChild(zero);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.5);
        this.hitbox.drawRect(0, 0, 200, 200);
        this.hitbox.endFill;
        this.hitbox.x = -100;
        this.hitbox.y = -200;
        this.hitbox.visible = false;
        this.addChild(this.hitbox);

    }
}