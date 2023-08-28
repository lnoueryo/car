import { Curve, Rectangle } from "../draw_objects/path";
import { Path } from "../draw_objects/path/path";
import { Point } from "../draw_objects/point";

export class Course {
    constructor(
        private courseName: string,
        private description: string,
        private difficulty: string,
        private _paths: Path[],
        // private items: Item[],
        // private obstacles: Obstacle[],
        // private background: BackgroundElement[],
        // private checkpoints: Checkpoint[]
    ) {

    }

    static convertJson(courseJson) {
        const paths = courseJson.paths.map(path => {
            const {type, material, vertices, position, color} = path
            const _vertices = vertices.map(vertex => Point.convertJson(vertex))
            const _position = Point.convertJson(position)
            return type == 'curve' ? new Curve(type, material, _vertices, _position, color, 0, 0, 0) : new Rectangle(type, material, _vertices, _position, color, 0, 0, 0)
        })
        return new Course(courseJson.name, courseJson.description, courseJson.difficulty, paths)
    }

    get paths() {
        return this._paths
    }
}