import { CanvasManager } from "./canvas_manager"
import { Controller } from "./controller"
import { Course } from "./course/course";
import { Camera } from "./draw_objects/camera/camera";
import { MainKart } from "./draw_objects/kart/main_kart"

export class Game {
    private course: Course
    private players = []
    private startTime = 0
    private currentTime = 0
    private lastTimestamp = 0
    private keysPressed = {};
    private timers = {}
    constructor(private cm: CanvasManager, private controller: Controller, private mainKart: MainKart, private camera: Camera) {}

    mashButton = (func) => {
        return (e) => {
            this.timers[e.key] = setInterval(() => {
                if (!this.keysPressed[e.key]) {
                    clearInterval(this.timers[e.key]);
                    delete this.timers[e.key];
                } else {
                    func(e);
                }
            })
        }
    }

    endButton = (func) => {
        return  (e) => {
            clearInterval(this.timers[e.key]); // タイマーをクリアします
            delete this.timers[e.key]; // タイマーの参照を削除します
            func();
        }
    }

    pressKey = (func) => {
        return (e) => {
            if (!this.keysPressed[e.key]) {
                this.keysPressed[e.key] = true;
                func(e)
            }
        }
    }

    releaseKey = (func) => {
        return (e) => {
            func(e)
            this.keysPressed[e.key] = false;
        }
    }

    disableKey = (func, key) => {
        return (e) => {
            // console.log(key)
            if(this.keysPressed[key]) return console.log(key)
            func(e)
        }
    }

    startGame() {
        if(!this.course) throw('No Course')

        this.controller.setTop(
            this.pressKey(this.mashButton(() => this.mainKart.accelerate(this.cm.ratio * this.camera.scale))),
            this.releaseKey(this.endButton(() => this.mainKart.decelerate(this.cm.ratio * this.camera.scale)))
        )

        this.controller.setBottom(
            this.mashButton(() => this.mainKart.brake(this.cm.ratio)),
            this.endButton(() => this.mainKart.decelerate(this.cm.ratio))
        )

        this.controller.setLeft(
            this.pressKey(this.mashButton(this.disableKey(() => this.mainKart.turnLeft(), 'ArrowRight'))),
            this.releaseKey(this.endButton(() => this.mainKart.goStraight()))
        )

        this.controller.setRight(
            this.pressKey(this.mashButton(this.disableKey(() => this.mainKart.turnRight(), 'ArrowLeft'))),
            this.releaseKey(this.endButton(() => this.mainKart.goStraight()))
        )

        this.camera.changeScale(7)
        this.setCourse()
        this.loop(0)
    }

    private setCourse() {
        this.course.frame._vertices = this.course.frame.vertices.map(vertex => vertex.adjustCanvasScale(this.cm).adjustCameraScale(this.camera).addPoint(this.cm.width / 2, this.cm.height / 2, 0))
        this.course.frame._position = this.course.frame.position.adjustCanvasScale(this.cm).adjustCameraScale(this.camera)
        this.course._paths = this.course.paths.map(path => {
            path._vertices = path.vertices.map(vertex => vertex.adjustCanvasScale(this.cm).adjustCameraScale(this.camera).addPoint(this.cm.width / 2, this.cm.height / 2, 0))
            path._position = path.position.adjustCanvasScale(this.cm).adjustCameraScale(this.camera)
            return path
        })
        this.mainKart._vertices = this.mainKart.vertices.map(vertex => vertex.adjustCanvasScale(this.cm).adjustCameraScale(this.camera).addPoint(this.cm.width / 2, this.cm.height / 2, 0))
        this.mainKart._position = this.mainKart.position.adjustCanvasScale(this.cm).adjustCameraScale(this.camera)
        this.camera.chaseMainKart(this.mainKart)
    }

    private loop = (timestamp) => {

        this.updateCurrentTime(timestamp)
        this.cm.resetCanvas()
        this.cm.fillBackground()

        this.mainKart.moveOnIdle()
        this.camera.chaseMainKart(this.mainKart)
        if(!this.course.isInsideObject(this.camera)) {
            const {x, y, z} = this.course.checkCrossedEdge(this.camera)
            this.mainKart._position = this.mainKart._position.addPoint(x, y, z)
            this.mainKart.hitWall(this.cm.ratio * this.camera.scale)
            this.camera.chaseMainKart(this.mainKart)
        }
        this.cm.fillPolygon(this.course.frame, this.camera)
        for(let path of this.course.paths) {
            this.cm.fillPolygon(path, this.camera)
        }
        this.cm.fillPolygon(this.mainKart, this.camera)
        // if(up_push && left_push) {
        //     this.cm.ctx.fillStyle = "red" ;
        // }
        // this.ctx.fillRect(this.road.x, this.road.y, this.road.width, this.road.height);


        // if (this.isGameOver(players)) return this.endGame(players);
        // if(this.currentTime > PLAYER_DELAY) {
        //     for (const player of players) {
        //         player.moveOnIdle()

        //     }
        // }

        // for (const box of this.boxes) {

        //     box.moveOnIdle()
        //     if (box.isOutOfDisplay()) this.deleteBox(box);

        //     this.fillBox(box)
        //     players.forEach((player) => {
        //         if (player.isPlayerCollidingWithBox(box)) player.moveOnTopBox(box.y)
        //     })

        // }

        requestAnimationFrame((timestamp) => {
            this.loop(timestamp)
        });
    }

    isGameOver() {
        // return this.cm.isGameOver(this.players)
    }

    private updateCurrentTime(timestamp) {
        if (this.startTime === 0) {
            this.startTime = timestamp;
            this.lastTimestamp = timestamp;
        }
        const elapsedSinceLastFrame = timestamp - this.lastTimestamp;
        if (elapsedSinceLastFrame < 100) {
            this.currentTime += elapsedSinceLastFrame / 1000;
        }

        this.lastTimestamp = timestamp;
    }

    // rotateObjects() {
    //     for(let object of this.objects) {
    //         object.rotateObject(this.mainKart.findMidpoint(), this.mainKart.angle)
    //     }
    // }

    // moveObjects() {
    //     for(let object of this.objects) {
    //         object.moveObject(this.mainKart.angle)
    //     }
    // }

    loadCourse(course: Course) {
        this.course = course
    }

    get objects() {
        return [...this.course.paths]
    }
}