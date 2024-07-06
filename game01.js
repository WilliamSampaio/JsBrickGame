const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function resize() {
    if (innerWidth > innerHeight) {
        canvas.height = innerHeight * 0.97
        canvas.width = ((innerHeight * 0.97) / 4) * 3
    }
    if (innerWidth < innerHeight) {
        canvas.width = innerWidth * 0.97
        canvas.height = (canvas.width / 3) * 4
    }
}

function drawBlock(x, y, cellSize) {
    ctx.fillStyle = 'orange'
    ctx.fillRect(
        (cellSize * x) + (cellSize * 0.025),
        (cellSize * y) + (cellSize * 0.025),
        cellSize * 0.95,
        cellSize * 0.95
    )
    ctx.clearRect(
        (cellSize * x) + (cellSize * 0.2),
        (cellSize * y) + (cellSize * 0.2),
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

class Gun {
    constructor(boardH) {
        this.pos = new Position(1, boardH - 1)
    }

    draw(cellSize) {
        drawBlock(this.pos.x, this.pos.y - 1, cellSize)
        drawBlock(this.pos.x - 1, this.pos.y, cellSize)
        drawBlock(this.pos.x, this.pos.y, cellSize)
        drawBlock(this.pos.x + 1, this.pos.y, cellSize)
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

    draw(cellSize) {
        drawBlock(this.pos.x, this.pos.y, cellSize)
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

    draw(cellSize) {
        for (let y = 0; y < this.rows.length; y++) {
            for (let x = 0; x < this.rows[y].length; x++) {
                if (this.rows[y][x] == 1) drawBlock(x, y, cellSize)
            }
        }
    }
}

let screenWidth = null
let screenHeight = null
let cellSize = null
let gameBoardWidth = null
let gameBoardHeight = null
let score = null
let gun = null
let shots = []
let wall = null
let paused = false
let gameOver = false

function resizeGame() {
    screenWidth = canvas.width
    screenHeight = canvas.height
    cellSize = canvas.height / 20
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
        gameOver = true
    }
}

function draw() {

    ctx.fillStyle = '#00ff00'
    ctx.fillRect(0, 0, cellSize * gameBoardWidth, cellSize * gameBoardHeight)
    ctx.clearRect(1, 1, (cellSize * gameBoardWidth) - 2, (cellSize * gameBoardHeight) - 2)

    gun.draw(cellSize)

    wall.draw(cellSize)

    shots.forEach(b => {
        b.draw(cellSize)
    })

    ctx.clearRect(
        gameBoardWidth * cellSize,
        0,
        screenWidth - (gameBoardWidth * cellSize),
        screenHeight
    )

    ctx.font = `${cellSize}px Monospace`
    ctx.fillStyle = 'green'
    ctx.fillText(('000000' + score).slice(-6), screenWidth - (cellSize * 3.8), cellSize)
    ctx.fillText('SCORE', screenWidth - (cellSize * 3.2), cellSize * 2)

    if (paused) {
        ctx.fillStyle = 'yellow'
        ctx.fillText('PAUSE', screenWidth - (cellSize * 3.2), (gameBoardHeight - 4) * cellSize)
    }

    if (gameOver) {
        ctx.fillStyle = 'red'
        ctx.fillText('GAME', screenWidth - (cellSize * 3.2), (gameBoardHeight - 2) * cellSize)
        ctx.fillText('OVER', screenWidth - (cellSize * 3.2), (gameBoardHeight - 1) * cellSize)
    }
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
            init()
            break
    }
}

addEventListener('keydown', handleKey)

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
