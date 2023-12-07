var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Trex, Trex_running, Trex_collided;
var ground, invisibleGround, groundImage;

var cloudGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

function preload(){
    Trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    Trex_collided = loadImage("trex_collided.png");

    groundImage = loadImage("ground2.png")

    cloudImage = loadImage("cloud.png");

    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");

    gameOverImg = loadImage("gameOver.png");
    restartImg =loadImage("restart.png");
}

function setup(){
    createCanvas(600,400)

    Trex = createSprite(50,180,20,50);

    Trex.addAnimation("running",Trex_running);
    Trex.addAnimation("collided", Trex_collided);

    ground = createSprite(200,225,400,20);
    ground.addImage("ground",groundImage)
    ground.x = ground.width /2;
    ground.velocityX = -6

    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);
    gameOver.visible = false;

    restart = createSprite(300,100);
    restart.addImage(restartImg);
    restart.visible = false;

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    invisibleGround = createSprite(200,190,400,10);
    invisibleGround.visible = false;

    score = 0;
}

function draw(){
    background("white");
    text("puntuación:"+ score, 500, 50);

    if(gameState===PLAY){
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(6 + 3*score/100);

        if(keyDown("space") && Trex.y >= 159) {
            Trex.velocityY = -12;
        }

        Trex.velocityY = Trex.velocityY + 0.8

        if (ground.x < 0){
            ground.x = ground.width/2;
        }

        Trex.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if(obstaclesGroup.isTouching(Trex)){
            gameState = END;
        }
    }
    else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        Trex.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);

        Trex.changeAnimation("collided",Trex_collided);

        obstaclesGroup.setlifetimeEach(-1);
        cloudGroup.setlifetimeEach(-1);

        if(mousePressedOver(restart)){
            reset();
        }
    }
    drawSprites();
}

function spawnClouds() {
    if (frameCount % 60 === 0) {
        var cloud = createSprite(600,120,40,10);
        cloud.y = Math.round(random(80,120));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;

        cloud.lifetime = 200;

        cloud.depth = Trex.depth;
        Trex.depth = Trex.depth + 1;

        cloudGroup.add(cloud);
    }

}

function spawnObstacles () {
    if(frameCount % 60 === 0) {
        var obstacle = createSprite(600,165,10,40);
        obstacle.velocityX = -(6 + 3*score/100);

        var rand = Math.round(random(1,6));
        switch(rand) {
            case 1: obstacle.addImage(obstacle1);
                    break;
            case 2: obstacle.addImage(obstacle2);
                    break;
            case 3: obstacle.addImage(obstacle3);
                    break;
            case 4: obstacle.addImage(obstacle4);
                    break;
            case 5: obstacle.addImage(obstacle5);
                    break;
            case 6: obstacle.addImage(obstacle6);
                    break;
            default: break;
        }
        obstacle.scale = 0.5;
        obstacle.lifetime = 300;
        obstaclesGroup.add(obstacle);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    cloudGroup.destroyEach();
    Trex.changeAnimation("running",Trex_running);
     score = 0;

}