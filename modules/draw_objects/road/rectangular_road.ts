import { Point } from "../point";
import { BaseObject } from "../base/base_object";
export class RectangularRoad extends BaseObject {
    constructor(
        protected lb,
        protected rb,
        protected rt,
        protected lt,
    ) {
        super(lb, rb, rt, lt)
    }

}