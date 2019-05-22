var VideosJSON ='{"UrlDisease":"style/disease.png", "UrlPlayer":"style/player.png", '+
				'"UrlShootAudio": "style/shoot.ogg", "UrlMiniExplosion":"style/miniExplosion.ogg",'+
				'"Left1": "style/left1.png", "Left2":"style/left2.png", "Left3":"style/left3.png",'+
				'"Left4": "style/left4.png", "Right1":"style/right1.png", "Right2":"style/right2.png",'+
				'"Right3": "style/right3.png", "Right4":"style/right4.png", "Front":"style/front.png"}';

var obj = JSON.parse(VideosJSON);

var speed;
var Enemics = new Array(30);
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
var limitEnemics;
var divPuntos;
var divTitles;
var divTitles2;
var Punts;


document.addEventListener("keydown", function(event) {
	var key = event.which || event.keyCode;
    if (key === 13) { //Enter 
		if(Start == 0){
			Start = 1;
			
		}else if(Start == 1 && (Win == 1 || Lose == 1)){
			Lose = 0;
			Win = 0;
			Punts = 0;
			speed = 2;
			crearEnemics();
			Player.mort = 0;
		}	
		divTitles2.style('visibility', 'hidden');
		divTitles.style('visibility', 'hidden');
      
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
	
	playerSpriteLeft = loadAnimation(obj.Left1,obj.Left2,obj.Left3,obj.Left4);
	playerSpriteRight = loadAnimation(obj.Right1,obj.Right2,obj.Right3,obj.Right4);
	playerSpriteFront = loadAnimation(obj.Front);
	
}

function setup(){
    var canvas = createCanvas(500,400);
	speed = 2;
	Disparar = false;
	shotsJugador.length = 0;
    canvas.parent('canvas');
	Punts = 0;
	dir = 0;
	limitEnemics = 0;
	
	
	shootAudio = loadSound(obj.UrlShootAudio);
	miniExplosion = loadSound(obj.UrlMiniExplosion)
	
	
	img = loadImage(obj.UrlDisease);
	
	divPuntos = createDiv();
	divPuntos.position(300,-390);
	divPuntos.style('z-index','3');
	divPuntos.style('position','relative');
	divPuntos.style('font-family','DiseaseInvader');
	divPuntos.style('color','black');
	divPuntos.style('font-size', '25px');
	
	divTitles = createDiv();
	divTitles.position(435,-350);
	divTitles.style('z-index','3');
	divTitles.style('position','relative');
	divTitles.style('font-family','DiseaseInvader');
	divTitles.style('color','black');
	divTitles.style('font-size', '25px');
	divTitles.html('Press Enter to Start');
	
	divTitles2 = createDiv();
	divTitles2.position(360,-350);
	divTitles2.style('z-index','3');
	divTitles2.style('position','relative');
	divTitles2.style('font-family','DiseaseInvader');
	divTitles2.style('color','black');
	divTitles2.style('font-size', '25px');
	
	
	crearEnemics();
	Player = new Player(250, 350);
}

function draw(){
	background(255);
	if ((Start == 1) && (Win==0) && (Lose==0)){
		checkCollisions();
		
		
		var text = 'Points: ';
		
		text = text+Punts;
		
		divPuntos.html(text);

		var i = 0;

			enemicLimit()
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
		
		revisarVictoria();
		revisarDerrota();
	
	}	
			
}

function crearEnemics(){
	var x = 155;
	var y = 30;
	var i = 0;
	console.log('crear en');
	while(i < Enemics.length){
		Enemics[i] = new Enemy(x, y);
		x += 30;
		if(i == 9 || i == 19){
			y += 30;
			x = 155;
		}
		i += 1;
	}
	
}

function Enemy(xInicial, yInicial){
    
    //atribut
    this.x = xInicial;
    this.y = yInicial;
	this.mort = 0;
    this.velocitat = 3;

    
    //mètode per recalcular posició
    this.mou = function(){
		
		if(limitEnemics == 1){
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
    }
    
}
	
function checkCollisions(){

	// compruebo colision invader
	for(var i=0;i<Enemics.length;i++){
		if(Enemics[i].y + 80 >= Player.y){
			if( (Enemics[i].x >= Player.x && Enemics[i].x <= Player.x + 20) || (Enemics[i].x + 20 >= Player.x && Enemics[i].x + 20 <= Player.x + 20) ){ 
				Player.mort = 1;
			}
		}
	}
	
	// compruebo colision disparos jugador
	for(var i=0;i<Enemics.length;i++){
		for(var j=0;j<shotsJugador.length;j++){

			//if(!Enemics[i]) continue;
			
			if((Enemics[i].mort == 0) && shotsJugador[j].y <= Enemics[i].y + 20 && shotsJugador[j].y >= Enemics[i].y){
				if( (shotsJugador[j].x >= Enemics[i].x && shotsJugador[j].x <= Enemics[i].x + 20) || (shotsJugador[j].x + 2 >= Enemics[i].x && shotsJugador[j] + 2 <= Enemics[i].x + 20) ){
					Punts++;
					Enemics[i].mort = 1;
					miniExplosion.play();
					speed += 0.2;
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
		divTitles2.html('You Win, press enter to play again!');
		divTitles2.style('visibility', 'visible');
		divTitles.style('visibility', 'hidden');
		shotsJugador.splice(0, shotsJugador.length);
	}
	
}

function revisarDerrota(){
	
	if(Player.mort == 1){
		Lose = 1;
		divTitles2.html('You Lose, press enter to play again!');
		divTitles2.style('visibility', 'visible');
		divTitles.style('visibility', 'hidden');
		shotsJugador.splice(0, shotsJugador.length);
	}
	
}


function enemicLimit(){
	
	for(var i = 0; i<Enemics.length; i++){
		
		if(Enemics[i].x >= 456){
		   limitEnemics = 1;
			baixarEnemic();
		}else if(Enemics[i].x <= 26){
		   limitEnemics = 0;
			baixarEnemic();
		}
		
	}
	
}

function baixarEnemic(){
	for(var i = 0; i<Enemics.length; i++){
		
		Enemics[i].y += 5;
		
	}
}




