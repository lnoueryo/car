import { BaseObject } from "../base/base_object";
import { Point } from "../point/point";
import { Vertex } from "../point/vertex";

export class Frame extends BaseObject {

    constructor(
        protected material: string,
        vertices: Vertex[],
        position: Point,
        color: string,
        mass: number,
        friction: number,
        restitution: number,
    ) {
        super(vertices, position, color, mass, friction, restitution)
    }

}
