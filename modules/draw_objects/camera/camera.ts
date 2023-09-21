import { Point } from "../point/point";
import { DynamicObject } from "../base/dynamic_object";
import { MainKart } from "../kart/main_kart";
import { Vertex } from "../point/vertex";
import { BaseObject } from "../base/base_object";

export class Camera extends DynamicObject {
    protected _zoom: number = 1
    private _canvasRatio: number = 1
    constructor(
        vertices: Vertex[],
        position: Point,
        color: string,
        mass: number,
        friction: number,
        restitution: number,
        maxVelocity: number,
        accelerationTime: number,
        decelerationRate: number,
        brakeDecelerationRate: number
    ) {
        super(vertices, position, color, mass, friction, restitution, maxVelocity, accelerationTime, decelerationRate, brakeDecelerationRate)
    }

    get zoom() {
        return this._zoom
    }

    get canvasRatio() {
        return this._canvasRatio
    }

    get canvasCenter() {
        return BaseObject._canvasCenter;
    }

    set zoom(zoom) {
        this._zoom = zoom
        BaseObject._zoomScale = this.canvasRatio * this.zoom
    }

    set canvasRatio(canvasRatio) {
        this._canvasRatio = canvasRatio
        BaseObject._zoomScale = this.canvasRatio * this.zoom
    }

    set canvasCenter(canvasCenter) {
        BaseObject._canvasCenter = canvasCenter
    }

    chaseMainKart(mainKart: MainKart) {
        this._position = mainKart._position
        this._angle = mainKart.direction
    }

    createCourseCamera(vertices: Vertex[]) {
        const newCamera = new Camera(
            vertices,
            this._position,
            this.color,
            this.mass,
            this.friction,
            this.restitution,
            this.maxVelocity,
            this.accelerationTime,
            this.decelerationRate,
            this.brakeDecelerationRate
        )
        newCamera._angle = -this._angle
        return newCamera
    }

    rotationMatrix() {
        const axis = this.position
        const angle = this.angle

        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let t = 1 - c;

        // Normalize the axis vector.
        let magnitude = Math.sqrt(axis.x*axis.x + axis.y*axis.y + axis.z*axis.z);
        let x = axis.x / magnitude;
        let y = axis.y / magnitude;
        let z = axis.z / magnitude;

        return [
            [t*x*x + c,    t*x*y - z*s,  t*x*z + y*s],
            [t*x*y + z*s,  t*y*y + c,    t*y*z - x*s],
            [t*x*z - y*s,  t*y*z + x*s,  t*z*z + c]
        ];
    }

}