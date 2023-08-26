export class Point {
    constructor(public x: number, public y: number, public z: number) {}
    static convertJson(pointJson) {
        const { x, y, z } = pointJson;
        return new Point(x, y, z)
    }
    // rotatePoint(axis: Point, angle: number) {
    //     const rad = (Math.PI / 180) * angle;
    //     const cosAngle = Math.cos(rad);
    //     const sinAngle = Math.sin(rad);

    //     // Translate point to the origin
    //     const px = this.x - axis.x;
    //     const py = this.y - axis.y;
    //     const pz = this.z - axis.z;

    //     // Rotation matrix for rotation around arbitrary axis
    //     const [ux, uy, uz] = [axis.x, axis.y, axis.z];
    //     const ux2 = ux * ux;
    //     const uy2 = uy * uy;
    //     const uz2 = uz * uz;

    //     const rotatedX = (cosAngle + ux2 * (1 - cosAngle)) * px
    //                     + (ux * uy * (1 - cosAngle) - uz * sinAngle) * py
    //                     + (ux * uz * (1 - cosAngle) + uy * sinAngle) * pz;

    //     const rotatedY = (uy * ux * (1 - cosAngle) + uz * sinAngle) * px
    //                     + (cosAngle + uy2 * (1 - cosAngle)) * py
    //                     + (uy * uz * (1 - cosAngle) - ux * sinAngle) * pz;

    //     const rotatedZ = (uz * ux * (1 - cosAngle) - uy * sinAngle) * px
    //                     + (uz * uy * (1 - cosAngle) + ux * sinAngle) * py
    //                     + (cosAngle + uz2 * (1 - cosAngle)) * pz;

    //     // Translate back
    //     this.x = rotatedX + axis.x;
    //     this.y = rotatedY + axis.y;
    //     this.z = rotatedZ + axis.z;
    //     console.log(axis, angle)
    // }
    rotatePoint(axis: Point, angle: number) {
        const rad = (Math.PI / 180) * angle;
        const cosAngle = Math.cos(rad);
        const sinAngle = Math.sin(rad);

        const x = cosAngle * (this.x - axis.x) - sinAngle * (this.y - axis.y) + axis.x;
        const y = sinAngle * (this.x - axis.x) + cosAngle * (this.y - axis.y) + axis.y;
        this.x = x
        this.y = y
    }
}

export interface Points {
    lb: Point,
    rb: Point,
    rt: Point,
    lt: Point,
}