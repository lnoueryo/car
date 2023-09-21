import { CanvasManager } from "../../canvas_manager";
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
        const x = this.x * camera.zoom;
        const y = this.y * camera.zoom;
        const z = this.z * camera.zoom;
        return new Point(x, y, z)
    }

    adjustCanvasScale(cm: CanvasManager) {
        const x = this.x * cm.sizeRatio;
        const y = this.y * cm.sizeRatio;
        const z = this.z * cm.sizeRatio;
        return new Point(x, y, z)
    }

    multipliedByScale(scale: number) {
        const {x, y, z} = this
        return new Point(x * scale, y * scale, z * scale)
    }

    addPoint(point: Point) {
        return new Point(point.x, point.y, point.z)
    }

    movePoint(point: Point) {
        const {x, y, z} = point
        return new Point(this.x + x, this.y + y, this.z + z)
    }
}