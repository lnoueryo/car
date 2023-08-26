import { MovableObject } from "../base/movable_object";

export class Player extends MovableObject {
    private id
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
        super(lb, rb, rt, lt, maxSpeed, accelerationTime, decelerationRate, brakeDecelerationRate)
    }

}