import { Point } from "../point";
import { Path } from "./path";
export class Curve extends Path {
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

    get startAngle() {
        // cos(theta) = base / hypotenuse
        const cosTheta = this.vertices[0].getBase(this.vertices[1]) / this.vertices[0].getDistance(this.vertices[1]);
        // acos関数を使ってθをラジアンで求め、ラジアンを度に変換する
        const thetaInRadians = Math.acos(cosTheta);
        // ラジアンを度に変換
        const thetaInDegrees = thetaInRadians * (180 / Math.PI);
        return thetaInDegrees;
    }

    get endAngle() {
        const prev = this.vertices[this.vertices.length - 1];
        const current = this.vertices[0];
        const next = this.vertices[1];
        const angle = this.angleAtVertex(prev, current, next)
        return angle + this.startAngle;
    }

}