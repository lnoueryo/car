import { CanvasManager } from "../../canvas_manager";
import { Camera } from "../camera/camera";
import { Point } from "../point/point"
import { Vertex } from "../point/vertex";

export class BaseObject {

    constructor(
        protected _vertices: Vertex[],
        protected _position: Point,
        protected _color: string,
        protected mass: number,
        protected friction: number, //物体が他の物体と接触する際の摩擦の強さ
        protected restitution: number, //物体が他の物体に衝突したときの反発の強さ
    ) {}

    get left() {
        return this._vertices.reduce((leftmost, vertex) => {
            return vertex.x < leftmost.x ? vertex : leftmost;
        }, this.baseVertex);
    }

    get right() {
        return this._vertices.reduce((rightmost, vertex) => {
            return vertex.x > rightmost.x ? vertex : rightmost;
        }, this.baseVertex);
    }

    get top() {
        return this._vertices.reduce((topmost, vertex) => {
            return vertex.y < topmost.y ? vertex : topmost;
        }, this.baseVertex);
    }

    get bottom() {
        return this._vertices.reduce((bottommost, vertex) => {
            return vertex.y > bottommost.y ? vertex : bottommost;
        }, this.baseVertex);
    }

    get position() {
        return this._position
    }

    get vertices() {
        return this._vertices
    }

    get baseVertex() {
        return this._vertices[0]
    }

    get color() {
        return this._color
    }

    addPosition(x, y, z) {
        this._position = this._position.addPoint(x, y, z)
    }

    isPointInPolygon(point) {
        let intersections = 0;
        let prevVertex = this._vertices[this._vertices.length - 1];

        for (let vertex of this._vertices) {
            if (Math.min(vertex.y, prevVertex.y) <= point.y && Math.max(vertex.y, prevVertex.y) > point.y) {
                let intersectionX = vertex.x + (point.y - vertex.y) / (prevVertex.y - vertex.y) * (prevVertex.x - vertex.x);
                if (intersectionX < point.x) {
                    intersections++;
                }
            }
            prevVertex = vertex;
        }

        return intersections % 2 !== 0;
    }

    isInsideObject(object: BaseObject, camera: Camera, cm: CanvasManager) {
        return object.vertices.every(vertex => this.isPointInsidePolygon(vertex.addPoint(object.position.x, object.position.y, object.position.z), camera, cm))
    }

    isPointInsidePolygon(point: Point, camera: Camera, cm: CanvasManager) {
        point.x /= camera.scale * cm.ratio
        point.y /= camera.scale * cm.ratio
        let inside = false;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[i].x, yi = this.vertices[i].y;
            let xj = this.vertices[j].x, yj = this.vertices[j].y;

            let intersect = ((yi > point.y) !== (yj > point.y))
                && (point.x <= (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    findMidpoint() {
        const sum = this._vertices.reduce((acc, vertex) => {
            return {
                x: acc.x + vertex.x,
                y: acc.y + vertex.y,
                z: acc.z + vertex.z, // 3Dを考慮する場合はコメントを外してください。
            };
        }, { x: 0, y: 0, z: 0 }); // 初期値

        const num_Vertices = this._vertices.length;
        return new Point(sum.x / num_Vertices, sum.y / num_Vertices, sum.z / num_Vertices); // 3Dの場合はこちらも変更
    }

    shiftBaselineForward() {
        this._position.y += this.top.y;
    }

    createVerticesForDrawing(camera: Camera, cm: CanvasManager): Vertex[] {
        // 新しく作成したverticesのインスタンスにcanvasとcameraのスケールを計算し、現在地、カメラの位置、スタートの位置を足し
        const { x, y, z } = this.position.adjustCanvasScale(cm).adjustScale(camera)
        return this._vertices.map(vertex => {
            return vertex
            .adjustCanvasScale(cm).adjustScale(camera)
            .addPoint(x, y, z)
            .addPoint(-camera.position.x, -camera.position.y, -camera.position.z)
            .rotatePoint(camera)
            .addPoint(cm.width / 2, cm.height / 2, camera.position.z)
        })
    }

    protected angleAtVertex(prev: Vertex, current: Vertex, next: Vertex) {
        const a = prev.getDistance(current);
        const b = current.getDistance(next);
        const c = next.getDistance(prev);

        const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        return angle * (180 / Math.PI);
    }

    anglesForPolygon() {
        const angles = [];

        for (let i = 0; i < this._vertices.length; i++) {
            const prev = this._vertices[(i - 1 + this._vertices.length) % this._vertices.length];
            const current = this._vertices[i];
            const next = this._vertices[(i + 1) % this._vertices.length];

            angles.push(this.angleAtVertex(prev, current, next));
        }

        return angles;
    }

    // TODO毎回していると計算量が上がる。オブジェクト作成前に一度でもいいかもしれない。
    orientation(p, q, r) {
        const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (value === 0) return 0;
        return (value > 0) ? 1 : 2;
    }

    convexHull(points) {
        // _verticesを順番に並べる。凸多角形のみ有効。
        const n = points.length;

        if (n < 3) return [];

        let hull = [];

        let l = 0;
        for (let i = 1; i < n; i++) {
            if (points[i].x < points[l].x) {
                l = i;
            }
        }

        let p = l, q;
        do {
            hull.push(points[p]);
            q = (p + 1) % n;
            for (let i = 0; i < n; i++) {
                if (this.orientation(points[p], points[i], points[q]) === 2) {
                    q = i;
                }
            }
            p = q;

        } while (p !== l);

        return hull;
    }
}