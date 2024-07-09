const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const COLORS = {
    body: 'rgb(14,21,17)',
    screen: '#7e8f85',
    on: '#000000',
    off: 'rgba(0,0,0,.1)',
    label: 'rgba(255,255,255,.7)'
}

function resize() {
    if ((innerWidth / innerHeight) > (9 / 16)) {
        canvas.height = innerHeight * 0.97
        canvas.width = ((innerHeight * 0.97) / 16) * 9
    }
    if ((innerWidth / innerHeight) < (9 / 16)) {
        canvas.width = innerWidth * 0.97
        canvas.height = ((innerWidth * 0.97) / 9) * 16
    }
}

function drawBlock(posX, posY, boardX, boardY, cellSize, on = true) {
    ctx.fillStyle = on ? COLORS.on : COLORS.off
    ctx.fillRect(
        posX + (cellSize * boardX) + (cellSize * 0.025),
        posY + (cellSize * boardY) + (cellSize * 0.025),
        cellSize * 0.95,
        cellSize * 0.95
    )
    ctx.fillStyle = COLORS.screen
    ctx.fillRect(
        posX + (cellSize * boardX) + (cellSize * 0.15),
        posY + (cellSize * boardY) + (cellSize * 0.15),
        cellSize * 0.7,
        cellSize * 0.7
    )
    ctx.fillStyle = on ? COLORS.on : COLORS.off
    ctx.fillRect(
        posX + (cellSize * boardX) + (cellSize * 0.3),
        posY + (cellSize * boardY) + (cellSize * 0.3),
        cellSize * 0.4,
        cellSize * 0.4
    )
}

class Position {
    constructor(x, y) {
        this.x = x || 0
        this.y = y || 0
    }
}

class Button {
    constructor(text, x, y, radius) {
        this.text = text
        this.x = x
        this.y = y
        this.radius = radius
    }

    inBounds(posX, posY) {
        let r = this.radius * 1.20
        let x = this.x - r / 2
        let y = this.y - r / 2
        let w = r * 2
        let h = r * 2
        if (posX >= x && posX < x + w && posY >= y && posY < y + h) {
            return true
        }
        return false
    }

    draw(cellSize) {
        let grad = ctx.createRadialGradient(this.x, this.y, this.radius * .8, this.x, this.y, this.radius);
        grad.addColorStop(0, "#ffee00");
        grad.addColorStop(1, "orange");

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()

        ctx.font = `bold ${cellSize}px monospace`
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'orange'
        ctx.fillText(this.text, this.x, this.y);
    }
}

class Gun {
    constructor(boardH) {
        this.pos = new Position(1, boardH - 1)
    }

    draw(posX, posY, cellSize) {
        let xl = this.pos.x - 1
        let xr = this.pos.x + 1
        drawBlock(posX, posY, this.pos.x, this.pos.y - 1, cellSize)
        if (xl >= 0) {
            drawBlock(posX, posY, this.pos.x - 1, this.pos.y, cellSize)
        }
        drawBlock(posX, posY, this.pos.x, this.pos.y, cellSize)
        if (xr < 10) {
            drawBlock(posX, posY, this.pos.x + 1, this.pos.y, cellSize)
        }
    }
}

class Bullet {
    constructor(x, y) {
        this.pos = new Position(x, y)
        this.velY = -1
    }

    update() {
        this.pos.y += this.velY
    }

    draw(posX, posY, cellSize) {
        drawBlock(posX, posY, this.pos.x, this.pos.y, cellSize)
    }
}

class Wall {
    constructor() {
        this.rows = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
        this.delay = 3000
        this.lastUpdate = null
    }

    update() {
        let now = Date.now()
        if (this.lastUpdate + this.delay < now || this.lastUpdate == null) {
            this.rows.unshift([
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2),
                Math.floor(Math.random() * 2)
            ])
            this.rows.pop()
            this.lastUpdate = now
        }
    }

    checkCollision(x, y) {
        if (y > 0 && y < this.rows.length) {
            if (this.rows[y - 1][x] == 1) return true
        }
        return false
    }

    addBlock(x, y) {
        this.rows[y][x] = 1
    }

    checkFilledLine(line) {
        for (let x = 0; x < line.length; x++) {
            if (line[x] == 0) return false
        }
        return true
    }

    checkFilledLines() {
        for (let y = 0; y < this.rows.length; y++) {
            if (this.checkFilledLine(this.rows[y])) return true
        }
        return false
    }

    removeFilledLines() {
        for (let y = 0; y < this.rows.length; y++) {
            if (this.checkFilledLine(this.rows[y])) {
                this.rows.splice(y, 1)
                this.rows.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            }
        }
    }

    isGameOver() {
        let y = this.rows.length - 2
        for (let x = 0; x < this.rows[y].length; x++) {
            if (this.rows[y][x] == 1) return true
        }
        return false
    }

    draw(posX, posY, cellSize) {
        for (let y = 0; y < this.rows.length; y++) {
            for (let x = 0; x < this.rows[y].length; x++) {
                if (this.rows[y][x] == 1) {
                    drawBlock(posX, posY, x, y, cellSize)
                } else {
                    drawBlock(posX, posY, x, y, cellSize, false)
                }
            }
        }
    }
}

let screenPosX, screenPosY = null
let screenWidth, screenHeight = null
let cellSize = null
let gameBoardWidth, gameBoardHeight = null
let score = null
let gun = null
let shots = []
let wall = null
let paused = false
let gameOver = false
let lives = 4

let buttons = []

function resizeGame() {
    screenWidth = canvas.width * 0.7
    screenHeight = (screenWidth / 3) * 4
    screenPosX = (canvas.width - screenWidth) / 2
    screenPosY = (canvas.width - screenWidth) / 2
    cellSize = (screenHeight - 6) / 20
}

function initButtons() {
    buttons = [
        new Button('SPACE', canvas.width * 0.85, (canvas.height / 16) * 13, cellSize * 2),
        new Button('', canvas.width * .15, (canvas.height / 16) * 13, cellSize * 1.20),
        new Button('', canvas.width * .40, (canvas.height / 16) * 13, cellSize * 1.20),
        new Button('', canvas.width * .275, (canvas.height / 16) * 12, cellSize * 1.20),
        new Button('', canvas.width * .275, (canvas.height / 16) * 14, cellSize * 1.20),
        new Button('P', (canvas.width / 10) * 5, (canvas.height / 16) * 10.5, cellSize * .75),
        new Button('R', (canvas.width / 10) * 7, (canvas.height / 16) * 10.5, cellSize * .75)
    ]
}

function init() {
    resizeGame()
    gameBoardWidth = 10
    gameBoardHeight = 20
    score = 0
    gun = new Gun(gameBoardHeight)
    shots = []
    wall = new Wall()
    paused = false
    gameOver = false
    initButtons()
}

function update() {

    if (gameOver || paused) return

    shots.forEach((b, index) => {
        if (b.pos.y == 0) {
            wall.addBlock(b.pos.x, b.pos.y)
            shots.splice(index, 1)
        } else {
            b.update()
        }
        if (wall.checkCollision(b.pos.x, b.pos.y)) {
            wall.addBlock(b.pos.x, b.pos.y)
            shots.splice(index, 1)
        }
    })

    if (wall.checkFilledLines()) {
        score += 1000
        wall.removeFilledLines()
    }

    wall.update()

    if (wall.isGameOver()) {
        if (lives > 0) {
            lives--
            init()
        } else {
            gameOver = true
        }
    }
}

function draw() {

    ctx.fillStyle = COLORS.body
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = COLORS.screen
    ctx.fillRect(screenPosX, screenPosY, screenWidth, screenHeight)

    ctx.strokeStyle = COLORS.on
    ctx.strokeRect(screenPosX + 2, screenPosY + 2, (cellSize * gameBoardWidth) + 2, (cellSize * gameBoardHeight) + 2)

    wall.draw(screenPosX + 3, screenPosY + 3, cellSize)

    gun.draw(screenPosX + 3, screenPosY + 3, cellSize)

    shots.forEach(b => {
        b.draw(screenPosX + 3, screenPosY + 3, cellSize)
    })

    for (let l = 0; l < lives; l++) {
        drawBlock(screenPosX + 3, screenPosY + 3, gameBoardWidth + 2, 4 + l, cellSize)
    }

    ctx.textAlign = 'right'
    ctx.font = `${(cellSize * 1.4)}px DS-Digital`
    ctx.fillStyle = COLORS.on
    ctx.fillText(('000000' + score).slice(-6), (screenPosX + screenWidth) - (cellSize * .4), screenPosY + cellSize)

    ctx.font = `bold ${(cellSize)}px Arial`
    ctx.fillText('SCORE', (screenPosX + screenWidth) - (cellSize * .4), screenPosY + cellSize * 2.1)

    if (paused) {
        ctx.fillStyle = COLORS.on
        ctx.fillText('PAUSE', (screenPosX + screenWidth) - cellSize, screenPosY + (gameBoardHeight - 4) * cellSize)
    } else {
        ctx.fillStyle = COLORS.off
        ctx.fillText('PAUSE', (screenPosX + screenWidth) - cellSize, screenPosY + (gameBoardHeight - 4) * cellSize)
    }

    ctx.font = `bold ${(cellSize * 1.4)}px monospace`
    if (gameOver) {
        ctx.fillStyle = COLORS.on
        ctx.fillText('GAME', (screenPosX + screenWidth) - cellSize * .9, screenPosY + (gameBoardHeight - 2) * cellSize)
        ctx.fillText('OVER', (screenPosX + screenWidth) - cellSize * .9, screenPosY + (gameBoardHeight - 1) * cellSize + 3)
    } else {
        ctx.fillStyle = COLORS.off
        ctx.fillText('GAME', (screenPosX + screenWidth) - cellSize * .9, screenPosY + (gameBoardHeight - 2) * cellSize)
        ctx.fillText('OVER', (screenPosX + screenWidth) - cellSize * .9, screenPosY + (gameBoardHeight - 1) * cellSize + 3)
    }

    ctx.font = `bold ${(cellSize * .5)}px Arial`
    ctx.textAlign = 'center'
    ctx.fillStyle = COLORS.label
    ctx.fillText('PAUSE', buttons[5].x, buttons[5].y + (buttons[5].radius * 1.75))
    ctx.fillText('RESET', buttons[6].x, buttons[6].y + (buttons[6].radius * 1.75))

    buttons.forEach(btn => btn.draw(cellSize))
}

function move(x) {
    if (gameOver || paused) return
    if (x < 0 && gun.pos.x > 0) {
        gun.pos.x += x
    }
    if (x > 0 && gun.pos.x < gameBoardWidth - 1) {
        gun.pos.x += x
    }
}

function shoot() {
    if (gameOver || paused) return
    shots.push(new Bullet(gun.pos.x, gun.pos.y - 1))
}

function handleKey(e) {
    switch (e.code) {
        case 'ArrowLeft':
            move(-1)
            break
        case 'ArrowRight':
            move(1)
            break
        case 'Space':
            shoot()
            break
        case 'KeyP':
            if (!gameOver) {
                paused = !paused
            }
            break
        case 'KeyR':
            lives = 4
            init()
            break
    }
    navigator.vibrate([50])
}

addEventListener('keydown', handleKey)

function handleTouch(e) {
    let touch = e.touches[0]
    let rect = canvas.getBoundingClientRect()
    buttons.forEach((btn, index) => {
        if (btn.inBounds(touch.clientX - rect.left, touch.clientY - rect.top)) {
            switch (index) {
                case 0:
                    shoot()
                    break
                case 1:
                    move(-1)
                    break
                case 2:
                    move(1)
                    break
                case 5:
                    if (!gameOver) {
                        paused = !paused
                    }
                    break
                case 6:
                    lives = 4
                    init()
                    break
            }
        }
    })
}

addEventListener('touchstart', handleTouch)

addEventListener('resize', () => {
    resize()
    resizeGame()
    initButtons()
})

function run() {
    update()
    draw()
    requestAnimationFrame(run)
}

addEventListener('DOMContentLoaded', () => {
    resize()
    init()
    run()
})
