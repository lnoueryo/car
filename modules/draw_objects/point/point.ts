import { CanvasManager } from "../../canvas_manager";
import { DynamicObject } from "../base/dynamic_object";
import { Camera } from "../camera/camera";

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

    adjustCameraScale(camera: Camera) {
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
}