import { CanvasManager } from "../../canvas_manager";
import { Point } from "../point";
import { BaseObject } from "./base_object";

export class DynamicObject extends BaseObject {
    protected _velocity: number = 0;
    protected startTime: number | null = null;
    protected _angle = 0
    constructor(
        vertices: Point[],
        position: Point,
        color: string,
        mass: number,
        friction: number,
        restitution: number,
        protected maxVelocity: number,
        protected accelerationTime,
        protected decelerationRate,
        protected brakeDecelerationRate
    ) {
        super(vertices, position, color, mass, friction, restitution)
    }

    get angle() {
        return this._angle
    }

    get velocity() {
        return this._velocity
    }

    accelerate() {
        if (this.startTime === null) {
            this.startTime = Date.now();
        }
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const accelerationRatio = Math.min(elapsedTime / this.accelerationTime, 1);
        this._velocity = this.maxVelocity * accelerationRatio;
    }

    decelerate() {
        let timer = setInterval(() => {
            this._velocity -= this.decelerationRate;
            if (this._velocity < 1) {
                this._velocity = 0;
                this.startTime = null;
                clearInterval(timer)
            }
        })
    }

    brake() {
        this._velocity -= this.brakeDecelerationRate;
        if (this._velocity < 0) this._velocity = 0;
    }

    goStraight() {
        this._angle = 0
    }

    turnLeft() {
        // if(this._velocity < 1) return this._angle = 0
        this._angle += 5
        // this._angle = 5 / this._velocity
    }

    turnRight() {
        // if(this._velocity < 1) return this._angle = 0
        this._angle -= 5
        // this._angle = -5 / this._velocity
    }

    moveOnIdle() {
        // 角度をラジアンに変換する (もしangleがすでにラジアンであればこの行は不要です)
        const radianAngle = this.angle * (Math.PI / 180);
        // 角度と速度を使用してxとyの変位を計算
        const deltaX = this._velocity * Math.cos(radianAngle);
        const deltaY = this._velocity * Math.sin(radianAngle);

        this.position.addPoint(deltaX, deltaY, 0)
    }

}