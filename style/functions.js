var VideosJSON ='{"UrlDisease":"style/disease.png", "UrlPlayer":"style/player.png", '+
				'"UrlShootAudio": "style/shoot.ogg", "UrlMiniExplosion":"style/miniExplosion.ogg"}';

var obj = JSON.parse(VideosJSON);

var speed;
var Enemics = new Array(15);
var Start = 0;
var Win = 0;
var Lose = 0;
var img;
var Player;
var dir;
var Disparar;
var shotsJugador = [];
var punts;
var shootAudio;
var miniExplosion;
var playerSpriteLeft;
var playerSpriteRight;
var playerSpriteFront;

document.addEventListener("keydown", function(event) {
	var key = event.which || event.keyCode;
    if (key === 13) { //Enter 
		if(Start == 0){
			Start = 1;
			
		}else if(Start == 1 && (Win == 1 || Lose == 1)){
			Enemics.splice(0, Enemics.length);
			Lose = 0;
			Win = 0;
			punts = 0;
			speed = 2;
			crearEnemics();
		}	
		
		document.getElementById("key").style.visibility="hidden";
		document.getElementById("punts").style.visibility="visible";
      
    }else if (key == 65){//D
	  dir = 2;	
      Player.mou(dir);
	}else if (key == 68){ //A
	  dir = 1;	
	  Player.mou(dir);  		  
    }else if(key == 18){//Alt
		Disparar = true;	
		shootAudio.play();
	}
	
	
});

document.addEventListener("keyup", function(event) {
	var key = event.which || event.keyCode;
    if ((key == 65) || (key == 68)){
		dir = 0;		
	}
	
	
});



function preload(){
	
	playerSpriteLeft = loadAnimation('style/left1.png','style/left2.png','style/left3.png','style/left4.png');
	playerSpriteRight = loadAnimation('style/right1.png','style/right2.png','style/right3.png','style/right4.png');
	playerSpriteFront = loadAnimation('style/front.png');
	
}

function setup(){
    var canvas = createCanvas(500,400);
	speed = 2;
	Disparar = false;
	shotsJugador.length = 0;
    canvas.parent('canvas');
	Punts = 0;
	dir = 0;
	
	shootAudio = new Audio(obj.UrlShootAudio);
	miniExplosion = new Audio(obj.UrlMiniExplosion)
	
	
	img = loadImage("style/disease.png");
	
	
	
	crearEnemics();
	Player = new Player(250, 350);
}

function draw(){
	background(255);
	if ((Start == 1) && (Win==0) && (Lose==0)){
		checkCollisions();
		revisarVictoria();
		revisarDerrota();
		//document.getElementById("punts").innerHTML = "Punts: " + punts.toString();

		var i = 0;


			while(i < Enemics.length){
			 if(Enemics[i].mort == 0){
			   Enemics[i].mou();
			   Enemics[i].dibuixa();
			}

				i += 1;
			}
		if(Player.mort == 0){
			Player.dibuixa();
		}	



		if(Disparar == true){
			shotsJugador.push({'x':Player.x, 'y':Player.y});
			
			Disparar = false;
		}

		for(var i=0;i<shotsJugador.length;i++){							
			//fill(shotsJugador[i].color);
			rect(shotsJugador[i].x+10, shotsJugador[i].y, 3, 4);	
		}

		for(var i=0;i<shotsJugador.length;i++){

			shotsJugador[i].y -= 3;

			// si disparo jugador se sale del canvas							
			if(shotsJugador[i].y <= 0){
				shotsJugador.splice(i, 1);
				continue;
			}
		}
		
		
		
		if(dir==2){
			animation(playerSpriteLeft, Player.x, Player.y);	
		}else if (dir == 1){
			animation(playerSpriteRight, Player.x, Player.y);		  
				  
		}else{
			animation(playerSpriteFront, Player.x, Player.y);
		}
		
		
	
	}	
			
}

function crearEnemics(){
	var x = 30;
	var y = 30;
	var i = 0;
	
	while(i < 15){
		Enemics[i] = new Enemy(x, y);
		x += 30;
		i += 1;
	}
	
}

function Enemy(xInicial, yInicial){
	
	var limit; 
	
	limit = 0;
    
    //atribut
    this.x = xInicial;
    this.y = yInicial;
	this.mort = 0;
    this.velocitat = 3;

    
    //mètode per recalcular posició
    this.mou = function(){
		
		if(this.x >= 456){
		   limit = 1;
		   this.y += 30;
		}else if(this.x <= 26){
		   limit = 0;
		   this.y += 30;
		}
		
		if(limit == 1){
			this.x -= speed;
		}else{
			this.x += speed;
		}
        
    }
    
    this.dibuixa = function(){
		fill(0);
		image(img, this.x, this.y, 20, 20);
		//rect(this.x, this.y, 20, 20);
    }
	
    
}

function Player(xInicial, yInicial){
	
	var limit; 
	
	limit = 0;
    
    //atribut
    this.x = xInicial;
    this.y = yInicial;
	this.mort = 0;
    this.velocitat = 3;
    
	
    this.mou = function(dir){
		
		if(dir == 1){
			if(this.x < 456){
			this.x += 10;	
			}
		}
		else if(dir == 2){
			if(this.x > 26){
			this.x -= 10;	
			}
		}
        
    }
    
    this.dibuixa = function(){
		fill(0);
		//rect(this.x, this.y, 20, 20);
    }
    
}
	
function checkCollisions(){

	// compruebo colision invader
	for(var i=0;i<Enemics.length;i++){
		if(Enemics[i].y + 20 >= Player.y){
			if( (Enemics[i].x >= Player.x && Enemics[i].x <= Player.x + 20) || (Enemics[i].x + 20 >= Player.x && Enemics[i].x + 20 <= Player.x + 20) ){ 
				console.log("Col1");
				Player.mort = 1;
			}
		}
	}
	
	// compruebo colision disparos jugador
	for(var i=0;i<Enemics.length;i++){
		for(var j=0;j<shotsJugador.length;j++){

			if(!Enemics[i]) continue;
			
			if((Enemics[i].mort == 0) && shotsJugador[j].y <= Enemics[i].y + 20 && shotsJugador[j].y >= Enemics[i].y){
				if( (shotsJugador[j].x >= Enemics[i].x && shotsJugador[j].x <= Enemics[i].x + 20) || (shotsJugador[j].x + 2 >= Enemics[i].x && shotsJugador[j] + 2 <= Enemics[i].x + 20) ){
					Punts++;
					console.log("Col2");
					Enemics[i].mort = 1;
					miniExplosion.play();
					speed += 1;
					shotsJugador.splice(j, 1);
				}
			}
		}
	}
}

function revisarVictoria(){
	
	var victoria = 1;
	
	for(var i = 0; i<Enemics.length; i++){
		if(Enemics[i].mort == 0){
		     victoria = 0;
		   }
		
	}
	
	if(victoria == 1){
		console.log("WIN");
		Win = 1;
		document.getElementById("key").innerHTML = "You Win!";
		document.getElementById("key").style.visibility="visible";
	}
	
}

function revisarDerrota(){
	
	if(Player.mort == 1){
		Lose = 1;
		document.getElementById("key").innerHTML = "You Lose...";
		document.getElementById("key").style.visibility="visible";
	}
	
}


