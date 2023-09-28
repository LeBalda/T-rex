var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage, cloudsGroup;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;
var score;
// variables en mayusculas es para indicar que la variable va a tener un valor fijo
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, gameOver; 
var restartImg, restart;
var jumpSound, checkpointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  // Cargar el audio
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound ("checkPoint.mp3");
  dieSound = loadSound ("die.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5

  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  console.log("Hola" + " Mundo");
  
  score = 0;

  trex.setCollider("circle", 0, 0, 40);
}

function draw() {
  background(180);
  text("Puntuación: "+ score, 500,50);
  
  if(gameState === PLAY){
    // hacer invisible el modo restart
    gameOver.visible = false;
    restart.visible = false;

    //aumentar puntuacion 
    score = score + Math.round(frameCount/60);

    //Movimiento de piso 
    ground.velocityX = - (4+ 3*score/100);

    //Restablecer piso al centro 
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //Hacer que Trex salte
    if(keyDown("space")&& trex.y >= 155) {
      trex.velocityY = -13;
      jumpSound.play();
    }

    //Darle gravedad al trex
    trex.velocityY = trex.velocityY + 0.8 ;
    

    if(obstaclesGroup.isTouching(trex)) {
      gameState = END;
      gameOver.visible = true;
      restart.visible = true;
      dieSound.play();
    }

    //aparecer nubes
   spawnClouds();
  
   //aparecer obstáculos en el suelo
   spawnObstacles();

   if(score > 0 && score % 100 === 0){
    checkpointSound.play()
   }
  }
 
  if (gameState === END){
    
    ground.velocityX = 0 ;

    // quitar velocidad a los grupos de obstaculos y nubes
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //hacer que el dinosaurio se quede quieto al perder
    trex.changeAnimation("collided", trex_collided);

    //Hacer que los sprites no desaparezcan
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //hacer que el dinosaurio no se mueva
    trex.velocityY = 0;

  }

  //Hacer que el Trex se mantenga en el piso 
  trex.collide (invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,164,10,40);
   obstacle.velocityX = - (6 + score/100)
   
    //generar obstáculos al azar
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
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //agregar trex al grupo
    obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    // agregar el sprite de nubes al grupo
    cloudsGroup.add(cloud);
  }
  
}