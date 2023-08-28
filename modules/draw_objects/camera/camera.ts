import { Point } from "../point";
import { DynamicObject } from "../base/dynamic_object";
import { MainKart } from "../kart/main_kart";

export class Camera extends DynamicObject {
    protected _scale: number = 1
    constructor(
        vertices: Point[],
        position: Point,
        color: string,
        mass: number,
        friction: number,
        restitution: number,
        maxVelocity: number,
        accelerationTime: number,
        decelerationRate: number,
        brakeDecelerationRate: number
    ) {
        super(vertices, position, color, mass, friction, restitution, maxVelocity, accelerationTime, decelerationRate, brakeDecelerationRate)
    }

    get scale() {
        return this._scale
    }

    chaseMainKart(mainKart: MainKart) {
        this._position = mainKart.position
        this._angle += mainKart.angle
    }

    changeScale(scale: number) {
        this._scale = scale;
    }
}