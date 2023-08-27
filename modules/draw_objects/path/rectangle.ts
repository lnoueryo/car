import { Point } from "../point";
import { Path } from "./path";
export class Rectangle extends Path {
    constructor(
        type: string,
        material: string,
        vertices: Point[],
        position: Point,
        color: string,
        mass: number,
        friction: number, //物体が他の物体と接触する際の摩擦の強さ
        restitution: number, //物体が他の物体に衝突したときの反発の強さ
    ) {
        super(type, material, vertices, position, color, mass, friction, restitution)
    }

}