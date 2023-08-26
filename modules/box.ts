const LEFT_LIMT = 0
const TOP_LIMIT = 0
const MOVE_Y_PROBABILITY = 0.1
const Y_MOVE_SCALE = 25
export class Box {
  constructor(
    public width,
    public height,
    public x,
    public y,
    public speed,
  ) { }

  moveOnIdle() {
    this.x -= this.speed;
    this.y += Math.random() < MOVE_Y_PROBABILITY ? Math.sin(this.speed) * Y_MOVE_SCALE : 0;
  }

  isOutOfDisplay() {
    return this.x + this.width < LEFT_LIMT || this.y + this.height < TOP_LIMIT;
  }
}