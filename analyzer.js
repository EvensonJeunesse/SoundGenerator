//display
let WIDTH = 600;
let HEIGHT = 400;



let origine_time = 0;
let time = 0;
let bpm_time = 0;
let Chain;
let ChainO;
let Effects;
let nb_circle = 4;//nombre d'oscillateur

let button;
let playing=false;
let infos = "";

let OSC_Types = ['sine','square', 'triangle','sawtooth'];

let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A' ,'A#', 'B'];
let fundamental_frequences = [32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49, 51.91, 55, 58.27, 61.74];
																															//C1, C1#, D1, D1#, E1, F1, F1#, G1, G1#,A1 ,A1#, B1
																															// separation de 1/2 ton
let gammes = [];
gammes['majeure'] = [1,1,0.5,1,1,1,0.5];// 1 = 1 ton = 2 * 1/2ton
gammes['mineur naturelle'] = [1,0.5,1,1,0.5,1,1];
// [ I, II, III, IV, V, VI, VII ]

let Envelopes= [];






const actx  = Tone.context;
const dest  = actx.createMediaStreamDestination();
const recorder2 = new MediaRecorder(dest.stream);
console.log(actx);







function setup(){

	createCanvas(WIDTH,HEIGHT);
	button = createButton('Sound');
	button.mousePressed(toggle);


	tempo = new Tone.Loop(BPM, '10n');//Xn = 1s / X
	Tone.Transport.start();
	tempo.start(0);



	Chain = new CircleChain(150,200);
	ChainO = new OscChain();

	let random_fondamental = Math.trunc(random(0,fundamental_frequences.length-1));

 for(let i =0; i < nb_circle; i++){
				let frequency = fundamental_frequences[random_fondamental] * i+1;
				let volume =	Math.trunc(random(-3,-30))/(i+1);
				//let wave_type = randomWaveForm(OSC_Types);
				let wave_type = 'sine';
	 		Chain.addCircle(45+volume);//volume is negative
			//Chain.addCircle(10);//le mode beauty est meilleur avec un radius constant
	 		Chain.Circles[0].ratio = 0.5;//modifier le ratio pour faire varier la vitesse d'affichage des cercles, mode beauty
	 		Chain.Circles[0].Freq(frequency);//commenté cette ligne pour rentrer en mode beauty

				ChainO.addOsc(frequency, volume, wave_type);//feq, volume
	 		Chain.Circles[0].control = ChainO.Oscillator[0];
				//ChainO.Oscillator[0].connect(dest);//On connecte l'oscillateur au stream de destination

				infos += "#"+i+"~("+frequency+","+volume+","+wave_type+") | ";
 }
	Effects = new EffectRack();
	ChainO.output.connect(Effects.Distorsion);
	Effects.Distorsion.toMaster();
	Effects.Distorsion.connect(dest);//On connecte l'oscillateur au stream de destination

	display_static();
	time = origine_time = millis()/1000;
}




function draw(){
fill(0);
rect(0,0, WIDTH, HEIGHT - 50);

Chain.refreshTime(time);
Chain.show();
Chain.showGraph(320, 200);

stroke(255);
fill(255);
line(Chain.Circles[0].px, Chain.Circles[0].py, Chain.graphique.positions[0].x,Chain.graphique.positions[0].y);
line(Chain.Circles[0].px,Chain.Circles[0].py,Chain.graphique.x, Chain.graphique.positions[0].y);
time = millis()/1000 - origine_time;
}





    function touchStarted() {
      if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
      }
    }


    function toggle(){
    	if(playing == false){
    		playing = true;
    		ChainO.start();
    	}else{
    		playing = false;
    		ChainO.stop();
    	}
    }


function	random_note(bottom, top){
			let x = -1;
			while( x < bottom || x > top){
				x =  Math.trunc(random(1,8));
				x = Math.pow(2, x) * fundamental_frequences[Math.trunc(random(0,11))];
			}
			return x;
		}


function	random_note_gamme(root_note, gamme, bottom=0, top=4){
	let touch = root_note;
 let choix = Math.trunc(random(1,7));

			for(let i=0; i < choix; i++){
				touch += (gamme[i]*2) % 12;
			}

			let	x =  Math.trunc(random(top,bottom));
			let freq =  Math.pow(2, x) * fundamental_frequences[touch];
				//2^x * frequence_fondamentale
				console.log("Frequence : "+notes[touch]+x+" "+freq);
			return freq;
}


function display_static(){

	textSize(12);
	noStroke();

	fill(0);
	text(infos, 20,HEIGHT - 10);
	console.log(infos);

	textSize(20);
	textAlign(CENTER);
	if (getAudioContext().state !== 'running') {
		text('click to start audio', width/2, height/2);
	}
}


function BPM(time2){
	bpm_time = time2;
}

function randomWaveForm(Type_Array){
	let nb = Math.trunc(random(1,5));
	let chain = Type_Array[Math.trunc(random(0,Type_Array.length))].toString();
	chain = chain+nb.toString();
	return chain;
}
