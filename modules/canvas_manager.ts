import { Box } from './box'
import { BaseObject } from './draw_objects/base/base_object';
import { Camera } from './draw_objects/camera/camera';
import { Kart } from './draw_objects/kart/kart';
let up_push = false;
let down_push = false;
let left_push = false;
let right_push = false;

const CANVAS_WIDTH_PIXEL = 1000;
const CANVAS_HEIGHT_PIXEL = 1000;
const CANVAS_RATIO = CANVAS_WIDTH_PIXEL / CANVAS_HEIGHT_PIXEL
const SIZE_RATIO = 1000
const PLAYER_DELAY = 1
export class CanvasManager {
    public ctx;
    private boxCreationProbability = 0.07
    constructor(private canvas: HTMLCanvasElement) {
        canvas.width = CANVAS_WIDTH_PIXEL;
        canvas.height = CANVAS_HEIGHT_PIXEL;
        this.ctx = this.canvas.getContext('2d')
        this.adjustCanvasSize()
        window.addEventListener('resize', () => {
            this.adjustCanvasSize()
        });
    // document.addEventListener('keydown', (event) => {
    //     if(event.key == "ArrowUp"){
    //         up_push = true;
    //     }
    //     if(event.key == "ArrowDown"){
    //         down_push = true;
    //     }
    //     if(event.key == "ArrowLeft"){
    //         left_push = true;
    //     }
    //     if(event.key == "ArrowRight"){
    //         right_push = true;
    //     }

    // });
    // //keyが離されたなら
    // document.addEventListener('keyup', (event) => {
    //     if(event.key == "ArrowUp"){
    //         up_push = false;
    //     }
    //     if(event.key == "ArrowDown"){
    //         down_push = false;
    //     }
    //     if(event.key == "ArrowLeft"){
    //         left_push = false;
    //     }
    //     if(event.key == "ArrowRight"){
    //         right_push = false;
    //     }

    // });
    }

    fillCourse(road) {
        this.ctx.fillStyle = "#e2e2e2";
        this.ctx.beginPath();
        this.ctx.moveTo(road.lt.x, road.lt.y);
        this.ctx.lineTo(road.lb.x, road.lb.y);
        this.ctx.lineTo(road.rb.x, road.rb.y);
        this.ctx.lineTo(road.rt.x, road.rt.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        // this.fillPlayer(players[0])
    }

    isGameOver(players) {
        return players.find((player) => {
            return player.y + player.height > this.canvas.height;
        })
    }

    // endGame(players) {
    //     this.fillEndText(`${this.isGameOver(players).id ? '黒' : '白'}の勝ち。`, `頑張った時間: ${(this.currentTime - PLAYER_DELAY).toFixed(2)} 秒`)
    // }

    fillBox(box) {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(box.x, box.y, box.width, box.height);
    }

    fillPolygon(object: BaseObject, camera: Camera) {
        this.ctx.fillStyle = object.color;
        this.ctx.strokeStyle = 'blue';
        const [firstVertex, ...restVertices] = object.createVerticesForDrawing(camera, this)
        console.log(restVertices, 'Hello')
        this.ctx.beginPath();
        this.ctx.moveTo(firstVertex.x, firstVertex.y);
        restVertices.forEach(vertex => {
            console.log(vertex)
            this.ctx.lineTo(vertex.x, vertex.y);
        });
        this.ctx.closePath();
        this.ctx.fill();
    }

    fillPlayer(kart: Kart) {
        this.ctx.strokeStyle = 'blue';
        // this.ctx.strokeStyle = "#0ff";
        this.ctx.fillStyle = 'red';
        // this.ctx.beginPath();
        // this.ctx.moveTo(player.lt.x, player.lt.y);
        // this.ctx.lineTo(player.lb.x, player.lb.y);
        // this.ctx.lineTo(player.rb.x, player.rb.y);
        // this.ctx.lineTo(player.rt.x, player.rt.y);
        // this.ctx.closePath();
        // this.ctx.fill();
        // this.ctx.strokeRect(player.lt.x, player.lt.y, player.width, player.height);
        // this.ctx.fillRect(player.lt.x, player.lt.y, player.width, player.height);
        // this.ctx.fillRect(170, -1, 50, 50);
        // this.ctx.fillRect(player.x + player.width - 15, player.y + 5, player.width / 5, player.height / 5);
        // this.ctx.fillRect(player.x + 10, player.y + player.height - 15, player.width - 20, player.height / 5);
    }

    createBox() {
        const width = Math.random() * this.canvas.width / 4.2
        const height = Math.random() * 50 + 20
        const x = this.canvas.width
        const y = this.canvas.height - 100 - Math.random() * 100
        const speed = (Math.random() * (15 - 3) + 3)
        const box = new Box(width, height, x, y, speed)
        // this.boxes.push(box);
    }

    deleteBox(box) {
        // const index = this.boxes.indexOf(box);
        // this.boxes.splice(index, 1);
    }

    resetCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fillEndText(firstText, secondText) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.fillText(firstText, 180, this.canvas.height / 4);
        this.ctx.fillText(secondText, 180, this.canvas.height / 3);
    }

    adjustCanvasSize = () => {
        const height = window.innerHeight;
        this.canvas.width = height * CANVAS_RATIO;
        this.canvas.height = height;
        this.canvas.style.width = height * CANVAS_RATIO + 'px';
        this.canvas.style.height = height + 'px';
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    get ratio() {
        return this.width / SIZE_RATIO;
    }

}