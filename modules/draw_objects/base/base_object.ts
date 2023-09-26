import { CanvasManager } from "../../canvas_manager";
import { Camera } from "../camera/camera";
import { Point } from "../point/point"
import { Vertex } from "../point/vertex";
import { DynamicObject } from "./dynamic_object";

export class BaseObject {
    protected _angle = 0
    static _zoomScale = 1;
    static _canvasCenter = new Point(0, 0, 0);
    constructor(
        public _vertices: Vertex[],
        public _position: Point,
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

    get angle() {
        return this._angle
    }

    get zoomScale() {
        return BaseObject._zoomScale
    }

    get canvasCenter() {
        return BaseObject._canvasCenter
    }

    isPointInsidePolygon(point: Vertex) {
        let intersections = 0;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi = this.vertices[i].movePoint(BaseObject._canvasCenter).x, yi = this.vertices[i].movePoint(BaseObject._canvasCenter).y;
            let xj = this.vertices[j].movePoint(BaseObject._canvasCenter).x, yj = this.vertices[j].movePoint(BaseObject._canvasCenter).y;
            ((yi >= point.y) !== (yj >= point.y)) && (point.x <= (xj - xi) * (point.y - yi) / (yj - yi) + xi) && intersections++
        }
        return intersections % 2 === 1;
    }

    checkCrossedEdge(points: Vertex[]) {
        const REBOUND_DISTANCE = 3
        const minX = Math.min(...this.vertices.map(v => v.movePoint(BaseObject._canvasCenter).x));
        const maxX = Math.max(...this.vertices.map(v => v.movePoint(BaseObject._canvasCenter).x));
        const minY = Math.min(...this.vertices.map(v => v.movePoint(BaseObject._canvasCenter).y));
        const maxY = Math.max(...this.vertices.map(v => v.movePoint(BaseObject._canvasCenter).y));
        let x = 0;
        let y = 0;
        let z = 0;
        for (const point of points) {
            if (point.x < minX) {
                x = minX - point.x + REBOUND_DISTANCE;
            } else if (point.x > maxX) {
                x = maxX - point.x - REBOUND_DISTANCE;
            } else if (point.y < minY) {
                y = minY - point.y + REBOUND_DISTANCE;
            } else if (point.y > maxY) {
                y = maxY - point.y - REBOUND_DISTANCE;
            }
        }
        return new Point(x, y, z)
    }

    findMidpoint() {
        const sum = this._vertices.reduce((acc, vertex) => {
            return {
                x: acc.x + vertex.movePoint(BaseObject._canvasCenter).x,
                y: acc.y + vertex.movePoint(BaseObject._canvasCenter).y,
                z: acc.z + vertex.movePoint(BaseObject._canvasCenter).z, // 3Dを考慮する場合はコメントを外してください。
            };
        }, { x: 0, y: 0, z: 0 }); // 初期値

        const num_Vertices = this._vertices.length;
        return new Point(sum.x / num_Vertices, sum.y / num_Vertices, sum.z / num_Vertices); // 3Dの場合はこちらも変更
    }

    shiftBaselineForward() {
        this._position.y += this.top.y;
    }

    createVerticesForDrawing(camera: Camera): Vertex[] {
        // 新しく作成したverticesのインスタンスにcanvasとcameraのスケールを計算し、現在地、カメラの位置、スタートの位置を足し
        return this._vertices.map(vertex => {
            const point = new Point(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z)
            return vertex
            .movePoint(BaseObject._canvasCenter)
            .movePoint(point)
            .rotatePoint(camera.findMidpoint(), this.angle - camera.angle)
        })
    }

    protected angleAtVertex(prev: Vertex, current: Vertex, next: Vertex) {
        const a = prev.getDistance(current);
        const b = current.getDistance(next);
        const c = next.getDistance(prev);

        const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        return angle * (180 / Math.PI);
    }
    //使用してない？
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