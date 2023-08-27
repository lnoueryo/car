import { CanvasManager } from "../canvas_manager";
import { DynamicObject } from "./base/dynamic_object";
import { Camera } from "./camera/camera";

export class Point {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    static convertJson(pointJson) {
        const { x, y, z } = pointJson;
        return new Point(x, y, z)
    }

    addPoint(x: number, y: number, z: number) {
        return new Point(this.x + x, this.y + y, this.z + z)
    }

    getBase(point) {
        //底辺
        return point.x - this.x;
    }

    getDistance(point) {
        // 斜辺
        const deltaX = point.x - this.x;
        const deltaY = point.y - this.y;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }

    adjustScale(camera: Camera) {
        const x = this.x * camera.scale;
        const y = this.y * camera.scale;
        const z = this.z * camera.scale;
        return new Point(x, y, z)
    }

    adjustCanvasScale(cm: CanvasManager) {
        const x = this.x * cm.ratio;
        const y = this.y * cm.ratio;
        const z = this.z * cm.ratio;
        return new Point(x, y, z)
    }

    rotatePoint(object: DynamicObject) {
        const rad = (Math.PI / 180) * object.angle;
        const cosAngle = Math.cos(rad);
        const sinAngle = Math.sin(rad);
        const midpoint = object.findMidpoint()
        const x = cosAngle * (this.x - midpoint.x) - sinAngle * (this.y - midpoint.y) + midpoint.x;
        const y = sinAngle * (this.x - midpoint.x) + cosAngle * (this.y - midpoint.y) + midpoint.y;
        const z = 0;
        return new Point(x, y, z)
    }
}