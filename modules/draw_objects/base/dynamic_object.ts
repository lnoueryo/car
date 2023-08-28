import { CanvasManager } from "../../canvas_manager";
import { Camera } from "../camera/camera";
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

    accelerate(ratio) {
        if (this.startTime === null) {
            this.startTime = Date.now();
        }
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const accelerationRatio = Math.min(elapsedTime / this.accelerationTime, 1);
        const maxVelocity = ratio * this.maxVelocity;
        this._velocity = maxVelocity * accelerationRatio;
        if(this._velocity > maxVelocity) {
            this._velocity = maxVelocity
        }
    }

    decelerate(ratio) {
        let timer = setInterval(() => {
            this.startTime = Date.now();
            this._velocity -= this.decelerationRate * ratio;
            if (this._velocity < 1) {
                this._velocity = 0;
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
        this._angle = 3
    }

    turnRight() {
        // if(this._velocity < 1) return this._angle = 0
        this._angle = -3
    }

    moveOnIdle(camera: Camera) {
        // 角度をラジアンに変換する (もしangleがすでにラジアンであればこの行は不要です)
        const radianAngle = (camera.angle - 270) * (Math.PI / 180);

        // 角度と速度を使用してxとyの変位を計算
        const deltaX = this._velocity * Math.cos(radianAngle);
        const deltaY = -this._velocity * Math.sin(radianAngle);
        this.addPosition(deltaX, deltaY, 0)
    }

    createVerticesForDrawing(camera: Camera, cm): Point[] {
        // 新しく作成したverticesのインスタンスにcanvasとcameraのスケールを計算し、現在地、カメラの位置、スタートの位置を足し
        return this._vertices.map(vertex => {
            return vertex
            .adjustCanvasScale(cm).adjustScale(camera)
            .addPoint(this.position.x, this.position.y, this.position.z)
            .addPoint(-camera.position.x, -camera.position.y, -camera.position.z)
            .addPoint(cm.width / 2, cm.height / 2, camera.position.z)
        })
    }

}