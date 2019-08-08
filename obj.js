

class Circle{

	constructor(radius=0, x=0, y=0, freq=0, next=this) {
		this.freq = freq;
		this.ratio = 1;//specify the speed par rappot à frequence (permet de ralentir l'affichage du cercle par rapport à la frequence réel de l'oscillateur)
		this.control;//pointeur vers un éventuel oscillateur
		this.x = x;
		this.y = y;
		this.radius = radius; //rayon du cercle
		this.teta = 0; //variable symbolisant le temps
		this.n = 1; //only used in beauty mode
		this.setNext(next);
		this.refreshPoint(this.next);
		}

	show(){

		ellipseMode(CENTER);
		stroke(255);
		noFill();
		ellipse(this.x, this.y, 2*this.radius);
		fill(255);
		line(this.x,this.y,this.px,this.py);
	}

	showPoint(){
		fill(255);
		ellipse(this.px, this.py, 10);
	}

	setAngle(time, plus=0){
		this.teta = time;
		this.refreshPoint(this.next);
	}

	refreshPoint(next=this){

		if(this.freq == 0){ //beauty with ratio = 0.5

		let c_teta = ( this.n * (this.teta*this.ratio) /  PI);

		this.px = this.radius * cos(c_teta) + this.x;
		this.py = this.radius * sin(c_teta) + this.y;

		}

		else{

		let c_teta = 2*PI*this.freq*this.ratio*this.teta; //2PI*frequence*temps

		this.px = this.radius * cos(c_teta) + this.x; //calcul des nouvelles positions par rapport à l'angle teta
		this.py = this.radius * sin(c_teta) + this.y;

		this.control.f = this.freq;
		}

		if(next != this){//on modifie la position du prochain cercle
			next.x = this.px;
			next.y = this.py;
		}




	}

	setNext(circle){
		this.next = circle;
	}

	Freq(value){
		this.freq = value;
	}

}







///////////////////////////////////////////////////////////////////////////





class CircleChain{

	constructor(x,y) {
		this.Circles = [];
		this.Circles[0] = new Circle(10,x,y, this.Circles[0]);
		this.c_size = 0;
		this.graphique = new Graph();

		}

	addCircle(radius){//on ajouteun cercle au début de la chaine
		this.c_size++;
		let x = this.Circles[0].px;
		let y = this.Circles[0].py;


		this.Circles.unshift(new Circle(radius,x,y));
		this.Circles[1].setNext(this.Circles[0]);
		this.Circles[0].n = this.Circles[1].n + 2;
	}

	show(){
		for(let i = 0; i < this.c_size; i++){
			this.Circles[i].show();
			// if(i != 0)
			this.Circles[i].showPoint();
		}
	}

	showGraph(x,y){
		this.graphique.show(x,y);
	}


	refreshTime(time){//the fonction, , tout part d'ici

		for(let i =  this.c_size - 1; i >= 0; i--){
			this.Circles[i].setAngle(time);
		}

		this.graphique.addValue(this.Circles[0].px, this.Circles[0].py);
	}
}





/////////////////////////////////////////////////////////////////////



class Graph{
	constructor(x=0,y=0){
		this.x = x;
		this.y = y;
		this.positions = [];
	}

	addValue(x,y){
		this.positions.unshift(new Position(x,y)); //on ajoute une position au debut du tableau

		if(this.positions.length > 250){//si on possède trop de points , on enlèves les plus vieux
			this.positions.pop();
		}
	}

	show(x=this.x,y=this.y){
		this.x = x;
		this.y = y;
		noFill();
		beginShape();
		for(let i=0; i < this.positions.length; i++){
			vertex(x+i, this.positions[i].y); //tie points
		}
		endShape();
	}
}

/////////////////////////////////////////////////////////////////


class OscChain{

	constructor() {
		this.Oscillator = [];
		this.output = new Tone.Volume (-3);
		this.output.toMaster();
		this.o_size = 0;
		}

	addOsc(frequency, volume=-10, type='sine'){
		if(this.Oscillator.length < 20){
			this.o_size++;
			this.Oscillator.unshift(new Tone.Oscillator(frequency,type));
			this.Oscillator[0];
			this.Oscillator[0].syncFrequency();
				this.Oscillator[0].connect(this.output);
			//this.Effects.setSource(this.Oscillator[0]);
			if(volume <= -3)//-3db
							this.Oscillator[0].volume.value = volume;
		}
	}

	start(){
		for(let i = 0; i < this.o_size; i++){
			this.Oscillator[i].start();
		}
	}


	stop(){
		for(let i = 0; i < this.o_size; i++){
			this.Oscillator[i].stop();
		}
	}
}

/////////////////////////////////////////



class EffectRack{

	constructor() {
		//this.Phaser = new Tone.Phaser(0.5 , 10 , 220);
		//this.Vibrato = new Tone.Vibrato(100,0.8);
		//this.Chorus = new Tone.Chorus();
		this.Distorsion = new Tone.Distortion(0.5);
			//this.Reverb = new Tone.Reverb();
			this.Distorsion.toMaster();

		/*this.Chorus.toMaster();
		this.Vibrato.toMaster();
		this.Distorsion.toMaster();
		//this.Reverb.toMaster();*/
		}
/*
	setSource(source){
			source.connect(this.Phaser);
			//source.connect(this.Chorus);
			//source.connect(this.Distorsion);
			//source.connect(this.Vibrato);
			//source.connect(this.Reverb);
	}

	connect(destination){
		//this.Chorus.connect(destination);
		//this.Vibrato.connect(destination);
		this.Phaser.connect(destination);
		//this.Distorsion.connect(destination);
		//this.Reverb.connect(destination);
	}*/
}














class Position{
	constructor(x=0,y=0){
		this.x = x;
		this.y = y;
	}
}









///////////////////////////////////////////////////////////////////////////
