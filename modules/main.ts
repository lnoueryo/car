import { CanvasManager } from './canvas_manager'
import { Game } from './game'
import { Controller } from './controller'
import { MainPlayer } from './draw_objects/player/main_player'
import { Point } from './draw_objects/point'
import course from '../courses/basic.json'

const createMainPlayer = () => {
    const lb = new Point(-25, 0, 0)
    const rb = new Point(25, 0, 0)
    const rt = new Point(25, -75, 0)
    const lt = new Point(-25, -75, 0)
    return new MainPlayer(
        lb,
        rb,
        rt,
        lt,
        200,
        10,
        0.1,
        0.2
    )
}

export const onStartGameClicked = () => {
    const buttons = document.getElementById('start-buttons')
    buttons.classList.add('hide');
    console.log(course.roads)
    game.loadCourse(course.roads)
    game.startGame()
    // timer = setInterval(() => {
    //     if(game.isGameOver()) {
    //         clearInterval(timer)
    //         buttons.classList.remove('hide');
    //     }
    // }, 100)
}

const showController = () => {
    const wrapper = document.getElementById('wrapper')
    const sideContainers = document.getElementsByClassName('side-container')
    const warning = document.getElementById('warning')

    if (isMobileDevice()) {
        if ((window.innerWidth - 200) < window.innerHeight) {
            // 縦向きまたは十分な画面サイズではない端末
            wrapper.classList.add('hide')
            warning.classList.remove('hide')
            return;
        }

        // 横向き
        Array.from(sideContainers).forEach(element => {
            element.classList.remove('hide');
        });
    } else {
        // PCの場合
        Array.from(sideContainers).forEach(element => {
            element.classList.add('hide');
        });
    }

    wrapper.classList.remove('hide')
    warning.classList.add('hide')
    // this.cm.adjustCanvasSize()
}

const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

const main = () => {
    const top = document.getElementById('top')
    const bottom = document.getElementById('bottom')
    const left = document.getElementById('left')
    const right = document.getElementById('right')
    const execute = document.getElementById('execute')
    const cancel = document.getElementById('cancel')
    const contoller = new Controller(
        top,
        bottom,
        left,
        right,
        execute,
        cancel
    )

    const cm = new CanvasManager(canvas)
    const mainPlayer = createMainPlayer()

    game = new Game(cm, contoller, mainPlayer)
    // document.documentElement.requestFullscreen();
    showController()
    window.addEventListener('resize', () => {
        showController()
    });
    document.addEventListener('keyup', (e) => {
        if(e.key == 'Enter') onStartGameClicked()
    })
}

let game = null;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

main()

