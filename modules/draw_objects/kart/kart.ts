import { DynamicObject } from "../base/dynamic_object";
import { Point } from "../point";

export class Kart extends DynamicObject {
    private id
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

}