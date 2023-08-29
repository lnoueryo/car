import { DynamicObject } from "../base/dynamic_object";
import { Point } from "../point/point";
import { Vertex } from "../point/vertex";

export class Kart extends DynamicObject {
    private id
    constructor(
        vertices: Vertex[],
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