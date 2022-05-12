import { Container, Rectangle, Texture, TilingSprite } from "pixi.js";
import { WIDTH } from "..";
import { Cactus } from "../game/Cactus";
import { Player } from "../game/Player";

export class GameScene extends Container {
	private static readonly GAME_SPEED_BASE = 600;

	public static readonly FLOOR_LEVEL = 865;
	private backgrounds: TilingSprite[];
	private player: Player;

	private cacti: Cactus[];
	private distanceBeforeCactus: number = 0;

	private score: number = 0;
	private gameOver: boolean = false;
	constructor() {
		super();

		this.backgrounds = [];

		for (let i = 6; i > -1; i--) {
			const aux = new TilingSprite(
				Texture.from("Background " + i),
				1280,
				960
			);
			this.addChild(aux);
			this.backgrounds.push(aux);
		}

		this.player = new Player();
		this.player.x = 200;
		this.player.y = 600;
		this.addChild(this.player);

		this.on("pointerdown", this.player.jump, this.player);
		this.on("pointerup", this.player.stopJump, this.player);
		this.interactive = true;

		this.cacti = [];

	}

	public update(dt: number) {
		if (this.gameOver) return;
		const diff = (this.score / 10) + 1;
		const adjustedSpeed = GameScene.GAME_SPEED_BASE * diff;

		for (let i = 0; i < this.backgrounds.length; i++) {
			const background = this.backgrounds[i];
			const factor = i / 5;
			background.tilePosition.x -= adjustedSpeed * factor * dt;
		}

		for (const cactus of this.cacti) {
			cactus.speed.x = -adjustedSpeed;
			cactus.update(dt);
		}

		const filteredCacti = this.cacti.filter(c => c.x > -c.width);
		this.score += this.cacti.length - filteredCacti.length;
		this.cacti = filteredCacti;

		this.distanceBeforeCactus -= adjustedSpeed * dt;
		if (this.distanceBeforeCactus <= 0) {
			const cactus = new Cactus();
			this.addChild(cactus);
			this.cacti.push(cactus);
			cactus.x = WIDTH + cactus.width / 2;
			cactus.y = GameScene.FLOOR_LEVEL;
			this.distanceBeforeCactus = WIDTH * (diff + Math.random() - 0.5);
		}

		this.player.update(dt);
		this.player.fixRunSpeed(adjustedSpeed);

		//
		for (const cactus of this.cacti) {
			if (this.checkCollision(this.player.hitbox.getBounds(), cactus.hitbox.getBounds())) {
				//console.log("Game Over");
				this.gameOver = true;
				console.log("Tu puntaje fue:", this.score);
			}

		}
	}


	private checkCollision(rA: Rectangle, rB: Rectangle): Rectangle | null {
		const rightmostLeft = rA.left < rB.left ? rB.left : rA.left;
		const leftmostRight = rA.right > rB.right ? rB.right : rA.right;
		const bottommostTop = rA.top < rB.top ? rB.top : rA.top;
		const topmostBottom = rA.bottom > rB.bottom ? rB.bottom : rA.bottom;

		// "make sense" means that left is left and right is right.
		const makesSenseHorizontal = rightmostLeft < leftmostRight;
		const makesSenseVertical = bottommostTop < topmostBottom;
		if (makesSenseHorizontal && makesSenseVertical) {
			const retval = new Rectangle();
			retval.x = rightmostLeft;
			retval.y = bottommostTop;
			retval.width = leftmostRight - rightmostLeft;
			retval.height = topmostBottom - bottommostTop;
			return retval;
		}
		else {
			return null;
		}
	}
}