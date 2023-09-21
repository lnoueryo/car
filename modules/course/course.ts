import { Camera } from "../draw_objects/camera/camera";
import { MainKart } from "../draw_objects/kart/main_kart";
import { Path } from "../draw_objects/path/path";
import { Point } from "../draw_objects/point/point";
import { Vertex } from "../draw_objects/point/vertex";

export class Course {
    constructor(
        private courseName: string,
        private description: string,
        private difficulty: string,
        private _frame: Path,
        public _paths: Path[],
        // private items: Item[],
        // private obstacles: Obstacle[],
        // private background: BackgroundElement[],
        // private checkpoints: Checkpoint[]
    ) {

    }

    static convertJson(courseJson) {
        const _position = Point.convertJson(courseJson.frame.position)
        const _vertices = courseJson.frame.vertices.map(vertex => Vertex.convertJson(vertex))
        const frame = new Path(courseJson.frame.material, _vertices, _position, courseJson.frame.color, 0, 0, 0)
        const paths = courseJson.paths.map(path => {
            const {material, vertices, position, color} = path
            const _pathVertices = vertices.map(vertex => Vertex.convertJson(vertex))
            const _pathPosition = Point.convertJson(position)
            return new Path(material, _pathVertices, _pathPosition, color, 0, 0, 0)
        })
        return new Course(courseJson.name, courseJson.description, courseJson.difficulty, frame, paths)
    }

    get paths() {
        return this._paths
    }

    get frame() {
        return this._frame
    }

    isInsideObject(camera: Camera) {
        const {x, y, z} = camera.position
        const vertices = camera.vertices.map(vertex => vertex.movePoint(x,y,z))
        const newCamera = camera.createCourseCamera(vertices)
        return vertices.every(vertex => this.frame.isPointInsidePolygon(vertex.rotatePoint(newCamera.findMidpoint(), newCamera.angle)));
    }

    checkCrossedEdge(camera: Camera) {
        const {x, y, z} = camera.position
        const vertices = camera.vertices.map(vertex => vertex.movePoint(x,y,z))
        const newCamera = camera.createCourseCamera(vertices)
        const newVertices = vertices.filter(vertex => !this.frame.isPointInsidePolygon(vertex.rotatePoint(newCamera.findMidpoint(), newCamera.angle)));
        return newVertices.length != 0 ? this.frame.checkCrossedEdge(newVertices.map(vertex => vertex.rotatePoint(newCamera.findMidpoint(), newCamera.angle))) : new Point(0,0,0)
    }

}