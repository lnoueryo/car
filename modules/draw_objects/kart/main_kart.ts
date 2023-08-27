import { Kart } from "./kart";
import { Point } from "../point";

export class MainKart extends Kart {
    constructor(
        vertices: Point[],
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
    // ステアリング角から曲率半径を計算する関数
    curvatureRadiusFromSteeringAngle(delta, wheelbase) {
        // tan()関数はラジアンで動作するため、角度をラジアンに変換
        const deltaInRadians = (delta * Math.PI) / 180;
        return wheelbase / Math.tan(deltaInRadians);
    }

    // 曲率半径からステアリング角を計算する関数
    steeringAngleFromCurvatureRadius(R, wheelbase) {
        const deltaInRadians = Math.atan(wheelbase / R);
        // ラジアンを角度に変換
        return (deltaInRadians * 180) / Math.PI;
    }
}