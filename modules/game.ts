import { CanvasManager } from "./canvas_manager"
import { Controller } from "./controller"
import { Course } from "./course/course";
import { BaseObject } from "./draw_objects/base/base_object";
import { Camera } from "./draw_objects/camera/camera";
import { MainKart } from "./draw_objects/kart/main_kart"
import { Point } from "./draw_objects/point/point";
import { Vertex } from "./draw_objects/point/vertex";

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
            this.pressKey(this.mashButton(() => this.mainKart.accelerate(this.cm.sizeRatio * this.camera.zoom))),
            this.releaseKey(this.endButton(() => this.mainKart.decelerate(this.cm.sizeRatio * this.camera.zoom)))
        )

        this.controller.setBottom(
            this.mashButton(() => this.mainKart.brake(this.cm.sizeRatio)),
            this.endButton(() => this.mainKart.decelerate(this.cm.sizeRatio))
        )

        this.controller.setLeft(
            this.pressKey(this.mashButton(this.disableKey(() => this.mainKart.turnLeft(), 'ArrowRight'))),
            this.releaseKey(this.endButton(() => this.mainKart.goStraight()))
        )

        this.controller.setRight(
            this.pressKey(this.mashButton(this.disableKey(() => this.mainKart.turnRight(), 'ArrowLeft'))),
            this.releaseKey(this.endButton(() => this.mainKart.goStraight()))
        )

        this.camera.zoom = 7
        this.camera.canvasRatio = this.cm.sizeRatio
        this.camera.canvasCenter = new Point(this.cm.width / 2, this.cm.height / 2, 0)
        this.setCourse()
        this.loop(0)
    }

    private setCourse() {
        this.course.frame._vertices = this.course.frame._vertices.map(vertex => vertex.multipliedByScale(BaseObject._zoomScale))
        this.course.frame._position = this.course.frame._position.multipliedByScale(BaseObject._zoomScale)
        this.course._paths = this.course.paths.map(path => {
            path._vertices = path._vertices.map(vertex => vertex.multipliedByScale(BaseObject._zoomScale))
            path._position = path._position.multipliedByScale(BaseObject._zoomScale)
            return path
        })
        this.mainKart._vertices = this.mainKart._vertices.map(vertex => vertex.multipliedByScale(BaseObject._zoomScale))
        this.mainKart._position = this.mainKart._position.multipliedByScale(BaseObject._zoomScale)
        this.camera.chaseMainKart(this.mainKart)
    }

    private loop = (timestamp) => {

        this.updateCurrentTime(timestamp)
        this.cm.resetCanvas()
        this.cm.fillBackground()

        this.mainKart.moveOnIdle()
        this.camera.chaseMainKart(this.mainKart)
        if(!this.course.isInsideObject(this.camera)) {
            this.mainKart._position = this.mainKart._position.movePoint(this.course.checkCrossedEdge(this.camera))
            this.mainKart.hitWall(this.cm.sizeRatio * this.camera.zoom)
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