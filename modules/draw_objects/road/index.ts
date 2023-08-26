import { Point } from "../point";
import { RectangularRoad } from "./rectangular_road";
import { SectorRoad } from "./sector_road";

class RoadFactory {
    static createRoad(roadJson) {
        const {lb, rb, rt, lt} = RoadFactory.createCornerPoints(roadJson.points)
        switch (roadJson.type) {
            case 'rectangle':
                return new RectangularRoad(lb, rb, rt, lt);
            case 'sector':
                const point = Point.convertJson(roadJson.point)
                const { startAngle, endAngle } = roadJson
                return new SectorRoad(lb, rb, rt, lt, point, startAngle, endAngle)
            default:
                throw('Error')
          }
    }
    static createCornerPoints(points) {
        const lb = Point.convertJson(points.lb)
        const rb = Point.convertJson(points.rb)
        const rt = Point.convertJson(points.rt)
        const lt = Point.convertJson(points.lt)
        return {lb, rb, rt, lt}
    }
}

export { RectangularRoad, SectorRoad, RoadFactory}
