var trex, trexImage
var ground, groundImage
var invisibleGround
var Clouds, CloudsImage
var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6
var Cloudsgroup, cactusgroup
var PLAY = 0
var END = 1
var gamestate = PLAY
var Score = 0
var gameOver, gameOverImage, restart, restartImage
var ToucingTrex
var die, jump, checkpoint


// to upload imiges,videos, audio, or any assets we use function Preload
function preload() {
    trexImage = loadAnimation("trex1.png", "trex3.png", "trex4.png")
    groundImage = loadImage("ground2.png")

    CloudsImage = loadImage("cloud.png")

    cactus1 = loadImage("Obstacle1.png")
    cactus2 = loadImage("Obstacle2.png")
    cactus3 = loadImage("Obstacle3.png")
    cactus4 = loadImage("Obstacle4.png")
    cactus5 = loadImage("Obstacle5.png")
    cactus6 = loadImage("Obstacle6.png")
    gameOverImage = loadImage("gameOver.png")
    restartImage = loadImage("restart.png")
    TouchingTrex = loadAnimation("trex_collided.png")

    die = loadSound("die.mp3")
    jump = loadSound("jump.mp3")
    checkpoint = loadSound("checkpoint.mp3")
}
// to create object one time or assigning task one time we use function setup
function setup() {
    createCanvas(600, 200)


    trex = createSprite(25, 150, 20, 20)

    trex.addAnimation("runner", trexImage)
    trex.scale = 0.4

    ground = createSprite(300, 180, 600, 10)
    ground.addImage("floor", groundImage)


    invisibleGround = createSprite(300, 195, 600, 30)
    invisibleGround.visible = false

    Cloudsgroup = createGroup()
    cactusgroup = createGroup()

    gameOver = createSprite(260, 80)
    gameOver.addImage("Over", gameOverImage)
    gameOver.scale = 0.5

    restart = createSprite(260, 105)
    restart.addImage("Over", restartImage)
    restart.scale = 0.3

    trex.debug = false
    //trex.setCollider("rectangle",1,0,50,50)
    trex.setCollider("circle", 0, 0, 50)

    trex.addAnimation("Collide", TouchingTrex)
}




function draw() {
    background("white")

    text("Score: " + Score, 400, 40)
    text(mouseX + " " + mouseY, mouseX, mouseY)
    if (gamestate === PLAY) {
        // Calling my own funtions
        spawnClouds()
        CreateObstacles()
        Score = Score + Math.round(getFrameRate()/ 60)
        // create infinite ground
        if (ground.x < 0) {
            ground.x = 300
        }

        if (keyDown("space") && trex.y >= 100) {
            trex.velocityY = -6
            jump.play()
        }

        //assigning grvity to the T-rex
        trex.velocityY = trex.velocityY + 0.5
        ground.velocityX = -6
        gameOver.visible = false
        restart.visible = false
        // Switching to end state
        if (cactusgroup.isTouching(trex)) {
            gamestate = END
            console.log(END)
            trex.changeAnimation("Collide", TouchingTrex)
            die.play()
        }
        if (Score >0 && Score % 100 === 0) {
            checkpoint.play()
        }
    }

    else if (gamestate === END) {
        ground.velocityX = 0
        trex.velocityY = 0
        cactusgroup.setVelocityXEach(0)
        Cloudsgroup.setVelocityXEach(0)
        gameOver.visible = true
        restart.visible = true
        // Adding -1 because then the lifetime won't go to 0 because its already past 0
        cactusgroup.setLifetimeEach(-1)
        Cloudsgroup.setLifetimeEach(-1)
        if(mousePressedOver(restart)){
        resetGame()
        }
    }




    trex.collide(invisibleGround)


    //console.log(trex.y)

    drawSprites()
}

function spawnClouds() {
    if (frameCount % 40 === 0) {
        Clouds = createSprite(520, 80, 80, 10)
        Clouds.addImage("clouds", CloudsImage)
        Clouds.scale = 0.5
        Clouds.velocityX = -2
        Clouds.y = Math.round(random(10, 115))
        Clouds.depth = trex.depth
        trex.depth += 1
        //console.log(Clouds.y)
        //console.log("Clouds depth "+ Clouds.depth)

        // console.log(trex.depth)
        //console.log(Clouds.lifetime)
        //Lifetime = distance / speed, clouds lifetime = 520 / 6 = 87
        Clouds.lifetime = 260
        // Adding clouds inside the cloud group
        Cloudsgroup.add(Clouds)
    }
}
function CreateObstacles() {
    if (frameCount % 50 === 0) {
        cactus = createSprite(570, 170, 10, 100)
        cactus.velocityX = -(4 + Score / 1000)
        cactus.lifetime = 143
        cactus.scale = 0.5
        cactusgroup.add(cactus)
        var Random = Math.round(random(1, 6))
        switch (Random) {
            case 1: cactus.addImage("cactus1", cactus1)
                break;
            case 2: cactus.addImage("cactus2", cactus2)
                break;
            case 3: cactus.addImage("cactus3", cactus3)
                break;
            case 4: cactus.addImage("cactus4", cactus4)
                break;
            case 5: cactus.addImage("cactus5", cactus5)
                break;
            case 6: cactus.addImage("cactus6", cactus6)
                break;
            default: break;

        }

    }





}
function resetGame(){
    gamestate= PLAY
    cactusgroup.destroyEach()
    Cloudsgroup.destroyEach()
    trex.changeAnimation("runner",trexImage)
    Score= 0

}




