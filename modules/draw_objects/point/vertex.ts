import { CanvasManager } from "../../canvas_manager";
import { DynamicObject } from "../base/dynamic_object";
import { Camera } from "../camera/camera";
import { Point } from "./point";

export class Vertex extends Point {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        private _type: string,
    ) {
        super(x, y, z)
    }

    static convertJson(vertexJson) {
        const { x, y, z, type } = vertexJson;
        return new Vertex(x, y, z, type)
    }

    get type() {
        return this._type
    }

    addPoint(x: number, y: number, z: number) {
        return new Vertex(this.x + x, this.y + y, this.z + z, this.type)
    }

    adjustCameraScale(camera: Camera) {
        const x = this.x * camera.scale;
        const y = this.y * camera.scale;
        const z = this.z * camera.scale;
        return new Vertex(x, y, z, this.type)
    }

    adjustCanvasScale(cm: CanvasManager) {
        const x = this.x * cm.ratio;
        const y = this.y * cm.ratio;
        const z = this.z * cm.ratio;
        return new Vertex(x, y, z, this.type)
    }

    rotatePoint(midpoint: Point, angle: number) {
        const rad = (Math.PI / 180) * angle;
        const cosAngle = Math.cos(rad);
        const sinAngle = Math.sin(rad)
        const x = cosAngle * (this.x - midpoint.x) - sinAngle * (this.y - midpoint.y) + midpoint.x;
        const y = sinAngle * (this.x - midpoint.x) + cosAngle * (this.y - midpoint.y) + midpoint.y;
        const z = 0;
        // const matrix = camera.rotationMatrix()
        // const x = this.x * matrix[0][0] + this.y * matrix[0][1] + this.z * matrix[0][2];
        // const y = this.x * matrix[1][0] + this.y * matrix[1][1] + this.z * matrix[1][2];
        // const z = this.x * matrix[2][0] + this.y * matrix[2][1] + this.z * matrix[2][2];

        return new Vertex(x, y, z, this.type)
    }
}
