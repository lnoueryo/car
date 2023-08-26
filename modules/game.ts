import { CanvasManager } from "./canvas_manager"
import { Controller } from "./controller"
import { MainPlayer } from "./draw_objects/player/main_player"
import { RoadFactory } from './draw_objects/road';

export class Game {
    private roads
    private players = []
    private startTime = 0
    private currentTime = 0
    private lastTimestamp = 0
    private keysPressed = {};
    constructor(private cm: CanvasManager, private controller: Controller, private mainPlayer) {}

    mashButton = (func) => {
        return (e)=> {
            if (!this.keysPressed[e.key]) {
                this.keysPressed[e.key] = true;
                let timer = setInterval(() => {
                    func()
                    this.keysPressed[e.key] || clearInterval(timer);
                })
            }
        }
    }

    endButton = (func) => {
        return  (e) => {
            this.keysPressed[e.key] = false;
            func()
        }
    }

    startGame() {
        if(!this.roads) throw('No Course')

        this.controller.setTop(
            this.mashButton(() => this.mainPlayer.accelerate()),
            this.endButton(() => this.mainPlayer.decelerate())
        )
        this.controller.setBottom(
            this.mashButton(() => this.mainPlayer.brake()),
            this.endButton(() => this.mainPlayer.decelerate())
        )

        this.controller.setLeft(
            () => this.mainPlayer.turnLeft(),
            () => this.mainPlayer.goStraight()
        )
        this.controller.setRight(
            () => this.mainPlayer.turnRight(),
            () => this.mainPlayer.goStraight()
        )

        for(let road of this.roads) {
            road.adjustSize(this.cm.ratio)
            road.rb.x *= 7
            road.rt.x *= 7
            road.lb.x *= 7
            road.lt.x *= 7
            road.lt.y *= 7
            road.rt.y *= 7
            road.lb.y *= 7
            road.rb.y *= 7

            road.lb.x += this.cm.width / 2
            road.rb.x += this.cm.width / 2
            road.lt.x += this.cm.width / 2
            road.rt.x += this.cm.width / 2

            road.lb.y += this.cm.height / 2
            road.rb.y += this.cm.height / 2
            road.lt.y += this.cm.height / 2
            road.rt.y += this.cm.height / 2
        }
        this.mainPlayer.adjustSize(this.cm.ratio)
        this.mainPlayer.adjustSpeed(this.cm.ratio)
        this.mainPlayer.lb.x += this.cm.width / 2
        this.mainPlayer.lt.x += this.cm.width / 2
        this.mainPlayer.rb.x += this.cm.width / 2
        this.mainPlayer.rt.x += this.cm.width / 2
        this.mainPlayer.lt.y += this.cm.height / 2
        this.mainPlayer.rt.y += this.cm.height / 2
        this.mainPlayer.lb.y += this.cm.height / 2
        this.mainPlayer.rb.y += this.cm.height / 2
        this.mainPlayer.shiftBaselineForward(this.cm.ratio)
        this.loop(0)
    }

    private loop = (timestamp) => {

        this.updateCurrentTime(timestamp)
        this.cm.resetCanvas()
        this.rotateObjects()
        this.moveObjects()
        for(let road of this.roads) {
            this.cm.fillCourse(road)
        }
        this.cm.fillPlayer(this.mainPlayer)
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

        // if (Math.random() < this.boxCreationProbability) {
        //     this.createBox();
        // }

        // players.forEach(player => {
        //     this.fillPlayer(player)
        // });

        // this.fillMaguma();

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

    rotateObjects() {
        for(let object of this.objects) {
            object.rotateObject(this.mainPlayer.findMidpoint(), this.mainPlayer.steeringAngle)
        }
    }

    moveObjects() {
        for(let object of this.objects) {
            object.moveObject(this.mainPlayer.currentSpeed)
        }
    }

    loadCourse(roadsJson) {
        this.roads = roadsJson.map(road => {
            return RoadFactory.createRoad(road)
        })
    }

    get objects() {
        return [...this.roads]
    }
}