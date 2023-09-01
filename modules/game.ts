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
        return (e)=> {
            if (!this.keysPressed[e.key]) {
                this.keysPressed[e.key] = true;
                this.timers[e.key] = setInterval(() => {
                    if (!this.keysPressed[e.key]) {
                        clearInterval(this.timers[e.key]);
                        delete this.timers[e.key];
                    } else {
                        func();
                    }
                })
            }
        }
    }

    endButton = (func) => {
        return  (e) => {
            clearInterval(this.timers[e.key]); // タイマーをクリアします
            delete this.timers[e.key]; // タイマーの参照を削除します
            this.keysPressed[e.key] = false;
            func();
        }
    }

    startGame() {
        if(!this.course) throw('No Course')

        this.controller.setTop(
            this.mashButton(() => {
                this.mainKart.accelerate(this.cm.ratio * this.camera.scale)
            }),
            this.endButton(() => this.mainKart.decelerate(this.cm.ratio * this.camera.scale))
        )

        this.controller.setBottom(
            this.mashButton(() => this.mainKart.brake(this.cm.ratio)),
            this.endButton(() => this.mainKart.decelerate(this.cm.ratio))
        )

        this.controller.setLeft(
            () => this.mainKart.turnLeft(),
            () => this.mainKart.goStraight()
        )

        // this.controller.setLeft(
        //     this.mashButton(() => this.mainKart.turnLeft()),
        //     this.endButton(() => this.mainKart.goStraight())
        // )

        this.controller.setRight(
            () => this.mainKart.turnRight(),
            () => this.mainKart.goStraight()
        )

        // this.mainKart.addPosition(x, y, z)
        // this.mainKart.shiftBaselineForward()
        this.camera.changeScale(7)
        this.setCourse()
        this.loop(0)
    }

    setCourse() {
        for(const path of this.course.paths) {
            path.position.x = path.position.x * this.camera.scale * this.cm.ratio
            path.position.y = path.position.y * this.camera.scale * this.cm.ratio
        }
    }

    private loop = (timestamp) => {

        this.updateCurrentTime(timestamp)
        this.cm.resetCanvas()
        this.cm.fillBackground()
        this.mainKart.moveOnIdle(this.camera)
        this.camera.chaseMainKart(this.mainKart)
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