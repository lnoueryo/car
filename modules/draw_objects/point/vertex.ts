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

    adjustScale(camera: Camera) {
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

    rotatePoint(object: DynamicObject) {
        const rad = (Math.PI / 180) * object.angle;
        const cosAngle = Math.cos(rad);
        const sinAngle = Math.sin(rad);
        const midpoint = object.findMidpoint()
        const x = cosAngle * (this.x - midpoint.x) - sinAngle * (this.y - midpoint.y) + midpoint.x;
        const y = sinAngle * (this.x - midpoint.x) + cosAngle * (this.y - midpoint.y) + midpoint.y;
        const z = 0;
        return new Vertex(x, y, z, this.type)
    }
}
