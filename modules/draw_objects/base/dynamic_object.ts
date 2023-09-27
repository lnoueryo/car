import { Camera } from "../camera/camera";
import { Point } from "../point/point";
import { Vertex } from "../point/vertex";
import { BaseObject } from "./base_object";

export class DynamicObject extends BaseObject {
    protected _velocity: number = 0;
    protected _direction: number = 0;
    protected startTime: number | null = null;
    protected isDecelerating: boolean = false;
    constructor(
        vertices: Vertex[],
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

    get velocity() {
        return this._velocity
    }

    get direction() {
        return this._direction
    }


    accelerate(ratio) {
        if (this.startTime === null) this.startTime = Date.now();
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const accelerationRatio = Math.min(elapsedTime / this.accelerationTime, 1);
        if(this.isDecelerating) {
            const time = this._velocity / (ratio * this.maxVelocity / this.accelerationTime)
            this.startTime = (Date.now() - time * 1000)
            this.isDecelerating = false
        }
        const maxVelocity = ratio * this.maxVelocity;
        this._velocity = maxVelocity * accelerationRatio;
        if(this._velocity > maxVelocity) {
            this._velocity = maxVelocity
        }
    }

    hitWall(ratio) {
        this._velocity *= 0.95;
        const time = this._velocity / (ratio * this.maxVelocity / this.accelerationTime)
        this.startTime = (Date.now() - time * 1000)
    }

    decelerate(ratio) {
        this.isDecelerating = true;
        let timer = setInterval(() => {
            this._velocity -= this.decelerationRate * ratio;
            if (this._velocity <= 0) {
                this._velocity = 0;
                this.isDecelerating = false;
                this.startTime = null;
                clearInterval(timer)
            }
        })
    }

    brake(ratio) {
        this._velocity -= this.brakeDecelerationRate * ratio;
        if (this._velocity < 0) this._velocity = 0;
    }

    goStraight() {
        this._angle = 0
    }

    turnLeft() {
        // if(this._velocity < 1) return this._angle = 0
        this._angle = -2
    }

    turnRight() {
        // if(this._velocity < 1) return this._angle = 0
        this._angle = 2
    }

    moveOnIdle() {
        this._direction += this.angle
        // 角度をラジアンに変換する (もしangleがすでにラジアンであればこの行は不要です)
        const radianAngle = (this.direction + 90) * (Math.PI / 180);

        // 角度と速度を使用してxとyの変位を計算
        const deltaX = -this._velocity * Math.cos(radianAngle);
        const deltaY = -this._velocity * Math.sin(radianAngle);
        this._position.x += deltaX
        this._position.y += deltaY
    }

    createVerticesForDrawing(camera: Camera): Vertex[] {
        return this._vertices.map(vertex => {
            const point = new Point(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z)
            return vertex
            .multipliedByScale(BaseObject._zoomScale)
            .movePoint(BaseObject._canvasCenter)
            .movePoint(point)
            .rotatePoint(camera.findMidpoint().multipliedByScale(BaseObject._zoomScale).movePoint(BaseObject._canvasCenter), this.direction - camera.angle)
        })
    }

}