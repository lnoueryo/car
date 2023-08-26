import { Player } from ".";

export class MainPlayer extends Player {
    constructor(
        protected lb,
        protected rb,
        protected rt,
        protected lt,
        protected maxSpeed,
        protected accelerationTime,
        protected decelerationRate,
        protected brakeDecelerationRate
    ) {
        super(lb, rb, rt, lt, maxSpeed, accelerationTime, decelerationRate, brakeDecelerationRate)
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