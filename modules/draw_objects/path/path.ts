import { BaseObject } from "../base/base_object";
import { Point } from "../point";

export class Path extends BaseObject {

    constructor(
        protected type: string,
        protected material: string,
        vertices: Point[],
        position: Point,
        color: string,
        mass: number,
        friction: number, //物体が他の物体と接触する際の摩擦の強さ
        restitution: number, //物体が他の物体に衝突したときの反発の強さ
    ) {
        super(vertices, position, color, mass, friction, restitution)
    }

}
