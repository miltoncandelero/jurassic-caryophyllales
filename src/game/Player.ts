import { AnimatedSprite, Graphics, Texture } from "pixi.js";
import { GameScene } from "../scenes/GameScene";
import { PhysicsContainer } from "./PhysicsContainer";

export class Player extends PhysicsContainer {
    private static readonly GRAVITY = 3000;
    private static readonly JUMP_SPEED = 1600;

    private dinoRun: AnimatedSprite;
    private dinoJump: AnimatedSprite;
    public hitbox: Graphics;
    private canJump: boolean = false;

    constructor() {
        super();

        this.dinoRun = new AnimatedSprite([
            Texture.from("DinoRun0"),
            Texture.from("DinoRun1"),
            Texture.from("DinoRun2"),
            Texture.from("DinoRun3"),
            Texture.from("DinoRun4"),
            Texture.from("DinoRun5"),
            Texture.from("DinoRun6"),
            Texture.from("DinoRun7"),
        ], false);
        this.dinoRun.loop = true;
        this.dinoRun.anchor.set(0.3, 0.8);
        this.dinoRun.animationSpeed = 0.2;
        this.dinoRun.scale.set(0.6);
        this.dinoRun.play();
        this.addChild(this.dinoRun);

        this.dinoJump = new AnimatedSprite([
            Texture.from("DinoJump0"),
            Texture.from("DinoJump1"),
            Texture.from("DinoJump2"),
            Texture.from("DinoJump3"),
            Texture.from("DinoJump4"),
            Texture.from("DinoJump5"),
            Texture.from("DinoJump6"),
            Texture.from("DinoJump7"),
            Texture.from("DinoJump8"),
            Texture.from("DinoJump9"),
            Texture.from("DinoJump10"),
            Texture.from("DinoJump11"),
        ], false);
        this.dinoJump.animationSpeed = 0.2;
        this.dinoJump.scale.set(0.6);
        this.dinoJump.loop = false;
        this.dinoJump.anchor.set(0.3, 0.8);
        this.dinoJump.visible = false;
        this.dinoJump.play();
        this.addChild(this.dinoJump);

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

        this.acceleration.y = Player.GRAVITY;
    }

    public fixRunSpeed(gameSpeed: number) {
        this.dinoRun.animationSpeed = gameSpeed / 4000
    }

    public override update(deltaSeconds: number) {
        super.update(deltaSeconds);

        if (this.y > GameScene.FLOOR_LEVEL) {
            this.y = GameScene.FLOOR_LEVEL;
            this.speed.y = 0;
            this.canJump = true;
            this.dinoJump.visible = false;
            this.dinoRun.visible = true;
        }

        this.dinoRun.update(deltaSeconds / (1 / 60));
        this.dinoJump.update(deltaSeconds / (1 / 60));
    }

    public jump() {
        if (this.canJump) {
            this.canJump = false;
            this.speed.y = -Player.JUMP_SPEED;
            this.dinoRun.visible =false;
            this.dinoJump.visible=true;
            this.dinoJump.gotoAndPlay(0);
        }
    }
    public stopJump() {
        if (this.speed.y < 0) {
            this.speed.y = 0;
        }
    }

}