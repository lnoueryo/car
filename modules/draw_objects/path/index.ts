import { Rectangle } from "./rectangle";
import { Curve } from "./curve";

class RoadFactory {

    static createRoad(pathJson) {
        const {type, material, vertices, position, color, mass, friction, restitution} = pathJson;
        switch (pathJson.type) {
            case 'rectangle':
                return new Rectangle(type, material, vertices, position, color, mass, friction, restitution);
            case 'curve':
                return new Curve(type, material, vertices, position, color, mass, friction, restitution)
            default:
                throw('Error')
          }
    }
}

export { Rectangle, Curve, RoadFactory}
