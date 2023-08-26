import { Point, Points } from "../point"
export interface ObjectIF {
    isPointInsideObject(point: Point): boolean
    arePointsInsideObject(points: Points): boolean
    rotateObject(axis: Point, angle): void
    findMidpoint(): Point
}

export class BaseObject implements ObjectIF {
    constructor(
        protected lb: Point,
        protected rb: Point,
        protected rt: Point,
        protected lt: Point,
    ) {}
    isPointInsideObject(point: Point) {
        return (
            point.x >= this.lb.x && point.x <= this.rt.x &&
            point.y >= this.lb.y && point.y <= this.rt.y
        );
    }

    arePointsInsideObject(points: Points) {
        return Object.values(points).every((point: Point) => {
            return this.lb.x <= point.x && point.x <= this.rb.x
        })
    }

    rotateObject(axis: Point, angle: number) {
        this.lt.rotatePoint(axis, angle)
        this.lb.rotatePoint(axis, angle)
        this.rt.rotatePoint(axis, angle)
        this.rb.rotatePoint(axis, angle)
    }

    findMidpoint() {
        const {x, y, z} = {
            x: (this.lb.x + this.rb.x + this.rt.x + this.lt.x) / 4,
            y: (this.lb.y + this.rb.y + this.rt.y + this.lt.y) / 4,
            z: (this.lb.z + this.rb.z + this.rt.z + this.lt.z) / 4,
        }
        return new Point(x, y, z);
    }

    adjustSize(ratio: number) {
        this.rb.x *= ratio
        this.rt.x *= ratio
        this.lb.x *= ratio
        this.lt.x *= ratio
        this.rb.y *= ratio
        this.rt.y *= ratio
        this.lb.y *= ratio
        this.lt.y *= ratio
    }

    shiftBaselineForward() {
        const height = this.height;
        this.rb.y += height;
        this.lb.y += height;
        this.rt.y += height;
        this.lt.y += height;
    }

    moveObject(speed) {
        this.rb.y += speed;
        this.lb.y += speed;
        this.rt.y += speed;
        this.lt.y += speed;
    }

    get width() {
        return Math.abs(this.rt.x - this.lt.x);
    }

    get height() {
        return Math.abs(this.rb.y - this.rt.y);
    }
}