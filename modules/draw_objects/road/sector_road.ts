import { BaseObject } from "../base/base_object";
import { Point } from "../point";
export class SectorRoad extends BaseObject {
    constructor(
        protected lb,
        protected rb,
        protected rt,
        protected lt,
        protected point,
        protected startAngle,
        protected endAngle,
    ) {
        super(lb, rb, rt, lt)
    }

    isPointInsideObject(point) {
        // 扇形の中心から点までのベクトルを計算
        let dx = point.x - this.point.x;
        let dy = point.y - this.point.y;
        // 扇形の中心から点までの距離を計算
        let distance = Math.sqrt(dx * dx + dy * dy);
        // 距離が半径よりも大きい場合、点は扇形の外にある
        if (distance > this.width) {
            return false;
        }
        // 扇形の中心から点までの角度を計算
        let angle = Math.atan2(dy, dx);
        // 角度が扇形の開始角度と終了角度の間にあるかどうかを確認
        return angle >= this.startAngle && angle <= this.endAngle;
    }

    arePointsInsideObject(points) {

        return Object.values(points).every((point: Point) => {
            // 点Aとarcの中心との距離を計算
            const dx = point.x - this.point.x;
            const dy = point.y - this.point.y;
            const distance = Math.sqrt(dx * dx + dy * dy)
            // 距離がarcの半径よりも大きい場合、trueを返す
            return distance <= this.width;
        })
    }

    rotateObject(axis: Point, angle) {
        this.point.rotatePoint(axis, angle)
    }
}