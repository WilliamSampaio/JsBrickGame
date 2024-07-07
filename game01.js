const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function resize() {
    if (innerWidth > innerHeight) {
        canvas.height = innerHeight * 0.97
        canvas.width = ((innerHeight * 0.97) / 16) * 9
    }
    if (innerWidth < innerHeight) {
        canvas.width = innerWidth * 0.97
        canvas.height = ((innerWidth * 0.97) / 9) * 16
    }
}

function drawBlock(posX, posY, boardX, boardY, cellSize) {
    ctx.fillStyle = 'orange'
    ctx.fillRect(
        posX + (cellSize * boardX) + (cellSize * 0.025),
        posY + (cellSize * boardY) + (cellSize * 0.025),
        cellSize * 0.95,
        cellSize * 0.95
    )
    ctx.clearRect(
        posX + (cellSize * boardX) + (cellSize * 0.2),
        posY + (cellSize * boardY) + (cellSize * 0.2),
        cellSize * 0.6,
        cellSize * 0.6
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
        let x = this.x - this.radius / 2
        let y = this.y - this.radius / 2
        let w = this.radius * 2
        let h = this.radius * 2
        if (posX >= x && posX < x + w && posY >= y && posY < y + h) {
            return true
        }
        return false
    }

    draw() {
        ctx.strokeStyle = 'lightblue'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'lightblue'
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
                if (this.rows[y][x] == 1) drawBlock(posX, posY, x, y, cellSize)
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
    cellSize = screenHeight / 20
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

    buttons.push(new Button('SPACE', canvas.width * 0.85, (canvas.height / 16) * 13, 40))
    buttons.push(new Button('<', canvas.width * .15, (canvas.height / 16) * 13, 20))
    buttons.push(new Button('>', canvas.width * .35, (canvas.height / 16) * 13, 20))
    buttons.push(new Button('^', canvas.width * .25, (canvas.height / 16) * 12, 20))
    buttons.push(new Button('v', canvas.width * .25, (canvas.height / 16) * 14, 20))
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

    ctx.clearRect(0, 0, screenWidth, screenHeight)

    ctx.fillStyle = '#00ff00'
    ctx.fillRect(screenPosX, screenPosY, screenWidth, screenHeight)
    ctx.fillStyle = '#000000'
    ctx.fillRect(screenPosX + 1, screenPosY + 1, screenWidth - 2, screenHeight - 2)
    ctx.fillStyle = '#00ff00'
    ctx.fillRect(screenPosX, screenPosY, cellSize * gameBoardWidth, cellSize * gameBoardHeight)
    ctx.fillStyle = '#000000'
    ctx.fillRect(screenPosX + 1, screenPosY + 1, (cellSize * gameBoardWidth) - 2, (cellSize * gameBoardHeight) - 2)

    gun.draw(screenPosX, screenPosY, cellSize)

    wall.draw(screenPosX, screenPosY, cellSize)

    shots.forEach(b => {
        b.draw(screenPosX, screenPosY, cellSize)
    })

    for (let l = 0; l < lives; l++) {
        drawBlock(screenPosX, screenPosY, gameBoardWidth + 2, 4 + l, cellSize)
    }

    ctx.font = `${cellSize}px Monospace`
    ctx.fillStyle = 'green'
    ctx.fillText(('000000' + score).slice(-6), (screenPosX + screenWidth) - (cellSize * 3.8), screenPosY + cellSize)
    ctx.fillText('SCORE', (screenPosX + screenWidth) - (cellSize * 3.2), screenPosY + cellSize * 2)

    if (paused) {
        ctx.fillStyle = 'yellow'
        ctx.fillText('PAUSE', (screenPosX + screenWidth) - (cellSize * 3.2), screenPosY + (gameBoardHeight - 4) * cellSize)
    }

    if (gameOver) {
        ctx.fillStyle = 'red'
        ctx.fillText('GAME', (screenPosX + screenWidth) - (cellSize * 3.2), screenPosY + (gameBoardHeight - 2) * cellSize)
        ctx.fillText('OVER', (screenPosX + screenWidth) - (cellSize * 3.2), screenPosY + (gameBoardHeight - 1) * cellSize)
    }

    buttons.forEach(btn => btn.draw())
}

function move(x) {
    if (gameOver || paused) return
    if (x < 0 && gun.pos.x > 0) {
        gun.pos.x += x
    }
    if (x > 0 && gun.pos.x < gameBoardWidth - 1) {
        gun.pos.x += x
    }
    navigator.vibrate([200])
}

function shoot() {
    if (gameOver || paused) return
    shots.push(new Bullet(gun.pos.x, gun.pos.y - 1))
    navigator.vibrate([200])
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
            }
        }
    })
}

addEventListener('touchstart', handleTouch)

addEventListener('resize', () => {
    resize()
    resizeGame()
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
