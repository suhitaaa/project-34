
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var player, playerBase, playerArcher;
var playerArrows = [];
var board1;
var numberOfArrows = 10;

var score = 0;

function preload() {
  backgroundImg = loadImage("background.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, 400, 180, 150);
  player = new Player(285, 270, 50, 180);
  playerArcher = new PlayerArcher( 350, 270, 120, 120);

  board1 = new Board(width - 300, 330, 50, 200);
  
}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  playerBase.display();
  player.display();
  playerArcher.display();

  board1.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      if (board1Collision) {
        score += 1;
      }
      
      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          playerArrows[i].trajectory = [];
        }
      }
    }
  }



  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Score " + score, width - 200, 100);

  
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);

}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

