import { BaseObject } from "./base_object";

export class MovableObject extends BaseObject {
    private currentSpeed: number = 0;
    private startTime: number | null = null;
    private steeringAngle = 0
    constructor(
        protected lb,
        protected rb,
        protected rt,
        protected lt,
        protected maxSpeed,
        protected accelerationTime,
        protected decelerationRate,
        protected brakeDecelerationRate
    ) {
        super(lb, rb, rt, lt)
    }
    accelerate() {
        if (this.startTime === null) {
            this.startTime = Date.now();
        }
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const accelerationRatio = Math.min(elapsedTime / this.accelerationTime, 1);
        this.currentSpeed = this.maxSpeed * accelerationRatio;
    }

    decelerate() {
        let timer = setInterval(() => {
            this.currentSpeed -= this.decelerationRate;
            if (this.currentSpeed < 1) {
                this.currentSpeed = 0;
                this.startTime = null;
                clearInterval(timer)
            }
        })
    }

    brake() {
        this.currentSpeed -= this.brakeDecelerationRate;
        if (this.currentSpeed < 0) this.currentSpeed = 0;
    }

    goStraight() {
        this.steeringAngle = 0
    }

    turnLeft() {
        if(this.currentSpeed < 1) return this.steeringAngle = 0
        this.steeringAngle = 5 / this.currentSpeed
    }

    turnRight() {
        if(this.currentSpeed < 1) return this.steeringAngle = 0
        this.steeringAngle = -5 / this.currentSpeed
    }

    adjustSpeed(ratio) {
        console.log(ratio)
        this.maxSpeed *= ratio
        this.accelerationTime *= ratio
        this.decelerationRate *= ratio
        this.brakeDecelerationRate *= ratio
    }
}