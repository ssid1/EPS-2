/*
Code by Ewan Peng [2023]

References:

1.Tone.js https://tonejs.github.io/

2.DDEM: Sound with Tone.js https://pdm.lsupathways.org/3_audio/

3.Zonesound https://zonesoundcreative.com/en/

*/

let synth, synth2, synth4, 

//--------------synth----------------------
sineButton, squareButton, triButton, sawButton, 
volslider, attack, decay, sus, release, detune,
HPfreq, LPfreq, HPfilter, LPfilter,

//----------synth 2----------------------------
sine2Button, square2Button, tri2Button, saw2Button,
vol2slider, EQ, EQhigh, EQmid, EQlow, Eattack, Edecay,

//-----------synth 4---------------------------
vol3slider, 

//----------------waveform--------------------
analyzer,analyzer2, analyzer4, waveform, waveform2, waveform4, MeterAnalyser, 

//------------sequencer-------------------------
seq, seq2, seq3, seq4, startbutton, stopbutton, BPMinput, 

//---------------synth steps--------------------------
step1, step2, step3, step4, step5, step6, step7, step8,
step9, step10, step11, step12, step13, step14, step15, step16,

//-------------synth2 steps----------------------------
Sstep1, Sstep2, Sstep3, Sstep4, Sstep5, Sstep6, Sstep7, Sstep8,
Sstep9, Sstep10, Sstep11, Sstep12, Sstep13, Sstep14, Sstep15, Sstep16,

//------------synth4 steps----------------------------
Fstep1, Fstep2, Fstep3, Fstep4, Fstep5, Fstep6, Fstep7, Fstep8,
Fstep9, Fstep10, Fstep11, Fstep12, Fstep13, Fstep14, Fstep15, Fstep16;

let oscTypeText = "FMSine";
let osc2TypeText = "Sine";
let StartTextColor = [255];
let backColor = [0,0,0];
let keynotetext = " ";
let notes = ['0', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];


function setup() {
 //createCanvas(windowWidth, windowHeight);
 print(windowWidth,windowHeight);
 createCanvas(1350, 670);
 background(backColor);

 //======================================================================
 //===========================synth set==================================
 //======================================================================

  //----------------HPfilter-------------------------

  HPfilter = new Tone.Filter({

   frequency: 0,
   type: "highpass"

  }).toMaster();

  //-------------LPfilter------------------------

  LPfilter = new Tone.Filter({

    frequency: 0,
    type: "lowpass"
 
   }).connect(HPfilter);

  //----------------------synth1-------------------

  synth = new Tone.FMSynth({

    oscillator: {
     type: "fmsine"
     
    },


    envelope: { 
     attack: 0.5,
     decay: 0.5,
     sustain: 0.5,
     release: 5
    },

    volume : 0,
    detune : 0,
  
  }).connect(LPfilter);

  //-----------------EQ---------------------
  EQ = new Tone.EQ3({

      low : 0,
      mid : 0,
      high : 0
   
  }).toDestination();


  //----------------synth2------------------
  synth2 = new Tone.Synth({

    oscillator:{
      type: "sine"
    },

    envelope: { 
      attack: 0.01,
      decay: 0.2,
      sustain: 0.01,
      release: 2.5
     },
    
     volume: -10,
     detune: 1200,

  }).connect(EQ);

  //---------------synth3-----------------

  synth4 = new Tone.Synth({

    oscillator:{
      type: "sine"
    },

    envelope: { 
      attack: 0.01,
      decay: 0.6,
      sustain: 0.3,
      release: 2.5
     },
    
     volume: 5,
     detune: -1200,

  }).toMaster();

 //-------------------seq----------------------
 seq = new Tone.Sequence(
    function(time, note) {
     synth.triggerAttackRelease(note, 0.5, time);
     console.log(note,time)},
     [],
    '12n'
  );

 //------------------seq2------------------------
 seq2 = new Tone.Sequence(
   function(time, note) {
     synth2.triggerAttackRelease(note, 0.5, time);
    }, 
    [],
    '12n'
  );

  //------------------seq4------------------------
 seq4 = new Tone.Sequence(
  function(time, note) {
    synth4.triggerAttackRelease(note, 0.5, time);
  }, 
  [],
  '12n'
 );

  //------------------seq set---------------------
  //Tone.Transport.bpm.value = 90;
  //Tone.Transport.start();
  Tone.start();
  
 //======================================================================
 //=======================analyzer set===================================
 //======================================================================
  analyzer = new Tone.Analyser("waveform", 1024);
  analyzer2 = new Tone.Analyser("waveform", 1024);
  analyzer4 = new Tone.Analyser("waveform", 1024);

  HPfilter.connect(analyzer);
  EQ.connect(analyzer2);
  synth4.connect(analyzer4);
 
 //MeterAnalyser = new Tone.Meter(0.8);
 //synth.connect(MeterAnalyser);

 //========================================================================
 //=======================slider and button set============================
 //========================================================================
 //---------------------slider set--------------------
  volslider = createSlider(-40, 20, 0, 0.1);
  volslider.position(width / 10 +150, height - (height / 2.6)-5);
 
  detune = createSlider(-2400, 2400, 0, 1200);
  detune.position(volslider.x +50, volslider.y);

  attack = createSlider(0, 1, 0.06, 0.01);
  attack.position(detune.x +50, detune.y);

  decay = createSlider(0, 1, 0.1, 0.01);
  decay.position(attack.x +50, attack.y);

  sus = createSlider(0, 1, 0.15, 0.01);
  sus.position(decay.x + 50, decay.y);

  release = createSlider(0, 10, 5, 0.1);
  release.position(sus.x + 50, sus.y);

  HPfreq = createSlider(0,3000,0,1);
  HPfreq.position(release.x + 50, release.y);
 
  LPfreq = createSlider(0,3000,3000,1);
  LPfreq.position(HPfreq.x + 50, HPfreq.y);

  vol2slider = createSlider(-40, 20, 0, 0.1);
  //vol2slider.position(width / 10 +626,height - (height / 2.6));
  vol2slider.position(volslider.x + 486, volslider.y);

  EQhigh = createSlider(-10, 10, 0, 0.1);
  EQhigh.position(vol2slider.x +50,vol2slider.y);

  EQmid = createSlider(-10, 10, 0, 0.1);
  EQmid.position(EQhigh.x +50,EQhigh.y);

  EQlow = createSlider(-10, 10, 0, 0.1);
  EQlow.position(EQmid.x +50,EQmid.y);

  Eattack = createSlider(0.01, 1, 0.1, 0.01);
  Eattack.position(EQlow.x +50,EQlow.y);

  Edecay = createSlider(0.01, 1, 0.5, 0.01);
  Edecay.position(Eattack.x +50,Eattack.y);

  vol3slider = createSlider(-30, 20, 0, 0.01);
  //vol3slider.position(width / 10 +942,height - (height / 2.6));
  vol3slider.position(volslider.x + 802, volslider.y);

 //-------------------button set-----------------------
  sineButton = createButton("  ");
  sineButton.size(50,20);
  sineButton.position(volslider.x -20,volslider.y -53);
  sineButton.style('background-color', '#e91e63');
  sineButton.style('border-color', '#e91e63');
  sineButton.mousePressed(changeSine);

  squareButton = createButton("  ");
  squareButton.size(50,20);
  squareButton.position(sineButton.x ,sineButton.y +35);
  squareButton.style('background-color', 'transparent');
  squareButton.style('border-color', '#e91e63');

  squareButton.mousePressed(changeSquare);

  triButton = createButton("  ");
  triButton.size(50,20);
  triButton.position(squareButton.x ,squareButton.y + 35);
  triButton.style('background-color', 'transparent');
  triButton.style('border-color', '#e91e63');
  triButton.mousePressed(changeTri);

  sawButton = createButton("  ");
  sawButton.size(50,20);
  sawButton.position(triButton.x ,triButton.y + 35);
  sawButton.style('background-color', 'transparent');
  sawButton.style('border-color', '#e91e63');
  sawButton.mousePressed(changeSaw);

  sine2Button = createButton("  ");
  sine2Button.size(50,20);
  sine2Button.position(vol2slider.x -20,vol2slider.y -53);
  sine2Button.style('background-color', '#00FFB3');
  sine2Button.style('border-color', '#00FFB3');
  sine2Button.mousePressed(changeSine2);

  square2Button = createButton("  ");
  square2Button.size(50,20);
  square2Button.position(sine2Button.x ,sine2Button.y +35);
  square2Button.style('background-color', '	transparent');
  square2Button.style('border-color', '#00FFB3');
  square2Button.mousePressed(changeSquare2);

  tri2Button = createButton("  ");
  tri2Button.size(50,20);
  tri2Button.position(square2Button.x ,square2Button.y + 35);
  tri2Button.style('background-color', 'transparent');
  tri2Button.style('border-color', '#00FFB3');
  tri2Button.mousePressed(changeTri2);

  saw2Button = createButton("  ");
  saw2Button.size(50,20);
  saw2Button.position(tri2Button.x ,tri2Button.y + 35);
  saw2Button.style('background-color', 'transparent');
  saw2Button.style('border-color', '#00FFB3');
  saw2Button.mousePressed(changeSaw2);

  //-----------------------start/stop button-----------------
  startbutton = createButton("  ");
  startbutton.size(50,20);
  startbutton.position(volslider.x -100, volslider.y +6);
  startbutton.style('background-color', '#00FFB3');
  startbutton.style('border-color', '#00FFB3');
  startbutton.mousePressed(seqstart);

  stopbutton = createButton("  ");
  stopbutton.size(50,20);
  stopbutton.position(startbutton.x , volslider.y +52);
  stopbutton.style('background-color', '#00FFB3');
  stopbutton.style('border-color', '#00FFB3');
  stopbutton.mousePressed(seqstop);

 //-------------------BPM input set-----------------------
  BPMinput = createInput('90');
  BPMinput.position(60, height / 2 - 300);
  BPMinput.style('border-color','rgba(0, 0, 0, 0)');
  BPMinput.style('background-color','rgba(0, 0, 0, 0)');
  BPMinput.style('color','#00FFB3');
  BPMinput.size(112,80);
  BPMinput.style("font-family", "Impact");
  BPMinput.style("font-size", "80px");
  BPMinput.input(bpminput);
 
 //===============================================================
 //=======================step button for synth===================
 //===============================================================
  step1 =createSelect();
  step1.position(sineButton.x + 90,sineButton.y +200);
  step1.style('border-color','#e91e63');
  step1.style('background-color','black');
  step1.style('color','#e91e63');
  step1.size(41,20);
  for (let i = 0; i < notes.length; i++) {
    step1.option(notes[i]);
  }
  step1.changed(stepinput);

  step2 = createSelect();
  step2.position(step1.x +50,step1.y);
  step2.style('border-color','#e91e63');
  step2.style('background-color','black');
  step2.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step2.option(notes[i]);
  }
  step2.size(41,20);
  step2.changed(stepinput);

  step3 = createSelect();
  step3.position(step2.x +50,step2.y);
  step3.style('border-color','#e91e63');
  step3.style('background-color','black');
  step3.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step3.option(notes[i]);
  }
  step3.size(41,20);
  step3.changed(stepinput);

  step4 = createSelect();
  step4.position(step3.x +50,step3.y);
  step4.style('border-color','#e91e63');
  step4.style('background-color','black');
  step4.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step4.option(notes[i]);
  }
  step4.size(41,20);
  step4.changed(stepinput);

  step5 = createSelect();
  step5.position(step4.x +60,step4.y);
  step5.style('border-color','#e91e63');
  step5.style('background-color','black');
  step5.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step5.option(notes[i]);
  }
  step5.size(41,20);
  step5.changed(stepinput);

  step6 = createSelect();
  step6.position(step5.x +50,step5.y);
  step6.style('border-color','#e91e63');
  step6.style('background-color','black');
  step6.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step6.option(notes[i]);
  }
  step6.size(41,20);
  step6.changed(stepinput);

  step7 = createSelect();
  step7.position(step6.x +50,step6.y);
  step7.style('border-color','#e91e63');
  step7.style('background-color','black');
  step7.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step7.option(notes[i]);
  }
  step7.size(41,20);
  step7.changed(stepinput);

  step8 = createSelect();
  step8.position(step7.x +50,step7.y);
  step8.style('border-color','#e91e63');
  step8.style('background-color','black');
  step8.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step8.option(notes[i]);
  }
  step8.size(41,20);
  step8.changed(stepinput);

  step9 = createSelect();
  step9.position(step8.x +60,step8.y);
  step9.style('border-color','#e91e63');
  step9.style('background-color','black');
  step9.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step9.option(notes[i]);
  }
  step9.size(41,20);
  step9.changed(stepinput);

  step10 = createSelect();
  step10.position(step9.x +50,step9.y);
  step10.style('border-color','#e91e63');
  step10.style('background-color','black');
  step10.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step10.option(notes[i]);
  }
  step10.size(41,20);
  step10.changed(stepinput);

  step11 = createSelect();
  step11.position(step10.x +50,step10.y);
  step11.style('border-color','#e91e63');
  step11.style('background-color','black');
  step11.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step11.option(notes[i]);
  }
  step11.size(41,20);
  step11.changed(stepinput);

  step12 = createSelect();
  step12.position(step11.x +50,step11.y);
  step12.style('border-color','#e91e63');
  step12.style('background-color','black');
  step12.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step12.option(notes[i]);
  }
  step12.size(41,20);
  step12.changed(stepinput);

  step13 = createSelect();
  step13.position(step12.x +60,step12.y);
  step13.style('border-color','#e91e63');
  step13.style('background-color','black');
  step13.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step13.option(notes[i]);
  }
  step13.size(41,20);
  step13.changed(stepinput);

  step14 = createSelect();
  step14.position(step13.x +50,step13.y);
  step14.style('border-color','#e91e63');
  step14.style('background-color','black');
  step14.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step14.option(notes[i]);
  }
  step14.size(41,20);
  step14.changed(stepinput);

  step15 = createSelect();
  step15.position(step14.x +50,step14.y);
  step15.style('border-color','#e91e63');
  step15.style('background-color','black');
  step15.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step15.option(notes[i]);
  }
  step15.size(41,20);
  step15.changed(stepinput);

  step16 = createSelect();
  step16.position(step15.x +50,step15.y);
  step16.style('border-color','#e91e63');
  step16.style('background-color','black');
  step16.style('color','#e91e63');
  for (let i = 0; i < notes.length; i++) {
    step16.option(notes[i]);
  }
  step16.size(41,20);
  step16.changed(stepinput);

 //=======================step button for synth2==============================
 //=========================================================================== 
  Sstep1 =createSelect();
  Sstep1.position(step1.x,sineButton.y + 165);
  Sstep1.style('border-color','#00FFB3');
  Sstep1.style('background-color','black');
  Sstep1.style('color','#00FFB3');
  Sstep1.size(41,20);
  for (let i = 0; i < notes.length; i++) {
    Sstep1.option(notes[i]);
  }
  Sstep1.changed(Sstepinput);

  Sstep2 = createSelect();
  Sstep2.position(Sstep1.x +50,Sstep1.y);
  Sstep2.style('border-color','#00FFB3');
  Sstep2.style('background-color','black');
  Sstep2.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep2.option(notes[i]);
  }
  Sstep2.size(41,20);
  Sstep2.changed(Sstepinput);

  Sstep3 = createSelect();
  Sstep3.position(Sstep2.x +50,Sstep2.y);
  Sstep3.style('border-color','#00FFB3');
  Sstep3.style('background-color','black');
  Sstep3.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep3.option(notes[i]);
  }
  Sstep3.size(41,20);
  Sstep3.changed(Sstepinput);

  Sstep4 = createSelect();
  Sstep4.position(Sstep3.x +50,Sstep3.y);
  Sstep4.style('border-color','#00FFB3');
  Sstep4.style('background-color','black');
  Sstep4.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep4.option(notes[i]);
  }
  Sstep4.size(41,20);
  Sstep4.changed(Sstepinput);

  Sstep5 = createSelect();
  Sstep5.position(Sstep4.x +60,Sstep4.y);
  Sstep5.style('border-color','#00FFB3');
  Sstep5.style('background-color','black');
  Sstep5.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep5.option(notes[i]);
  }
  Sstep5.size(41,20);
  Sstep5.changed(Sstepinput);

  Sstep6 = createSelect();
  Sstep6.position(Sstep5.x +50,Sstep5.y);
  Sstep6.style('border-color','#00FFB3');
  Sstep6.style('background-color','black');
  Sstep6.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep6.option(notes[i]);
  }
  Sstep6.size(41,20);
  Sstep6.changed(Sstepinput);

  Sstep7 = createSelect();
  Sstep7.position(Sstep6.x +50,Sstep6.y);
  Sstep7.style('border-color','#00FFB3');
  Sstep7.style('background-color','black');
  Sstep7.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep7.option(notes[i]);
  }
  Sstep7.size(41,20);
  Sstep7.changed(Sstepinput);

  Sstep8 = createSelect();
  Sstep8.position(Sstep7.x +50,Sstep7.y);
  Sstep8.style('border-color','#00FFB3');
  Sstep8.style('background-color','black');
  Sstep8.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep8.option(notes[i]);
  }
  Sstep8.size(41,20);
  Sstep8.changed(Sstepinput);

  Sstep9 = createSelect();
  Sstep9.position(Sstep8.x +60,Sstep8.y);
  Sstep9.style('border-color','#00FFB3');
  Sstep9.style('background-color','black');
  Sstep9.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep9.option(notes[i]);
  }
  Sstep9.size(41,20);
  Sstep9.changed(Sstepinput);

  Sstep10 = createSelect();
  Sstep10.position(Sstep9.x +50,Sstep9.y);
  Sstep10.style('border-color','#00FFB3');
  Sstep10.style('background-color','black');
  Sstep10.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep10.option(notes[i]);
  }
  Sstep10.size(41,20);
  Sstep10.changed(Sstepinput);

  Sstep11 = createSelect();
  Sstep11.position(Sstep10.x +50,Sstep10.y);
  Sstep11.style('border-color','#00FFB3');
  Sstep11.style('background-color','black');
  Sstep11.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep11.option(notes[i]);
  }
  Sstep11.size(41,20);
  Sstep11.changed(Sstepinput);

  Sstep12 = createSelect();
  Sstep12.position(Sstep11.x +50,Sstep11.y);
  Sstep12.style('border-color','#00FFB3');
  Sstep12.style('background-color','black');
  Sstep12.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep12.option(notes[i]);
  }
  Sstep12.size(41,20);
  Sstep12.changed(Sstepinput);

  Sstep13 = createSelect();
  Sstep13.position(Sstep12.x +60,Sstep12.y);
  Sstep13.style('border-color','#00FFB3');
  Sstep13.style('background-color','black');
  Sstep13.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep13.option(notes[i]);
  }
  Sstep13.size(41,20);
  Sstep13.changed(Sstepinput);

  Sstep14 = createSelect();
  Sstep14.position(Sstep13.x +50,Sstep13.y);
  Sstep14.style('border-color','#00FFB3');
  Sstep14.style('background-color','black');
  Sstep14.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep14.option(notes[i]);
  }
  Sstep14.size(41,20);
  Sstep14.changed(Sstepinput);

  Sstep15 = createSelect();
  Sstep15.position(Sstep14.x +50,Sstep14.y);
  Sstep15.style('border-color','#00FFB3');
  Sstep15.style('background-color','black');
  Sstep15.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep15.option(notes[i]);
  }
  Sstep15.size(41,20);
  Sstep15.changed(Sstepinput);

  Sstep16 = createSelect();
  Sstep16.position(Sstep15.x +50,Sstep15.y);
  Sstep16.style('border-color','#00FFB3');
  Sstep16.style('background-color','black');
  Sstep16.style('color','#00FFB3');
  for (let i = 0; i < notes.length; i++) {
    Sstep16.option(notes[i]);
  }
  Sstep16.size(41,20);
  Sstep16.changed(Sstepinput);

 //======================step button for syth3====================
 //=============================================================
 Fstep1 =createSelect();
 Fstep1.position(Sstep1.x,sineButton.y + 235);
 Fstep1.style('border-color','#7cfc00');
 Fstep1.style('background-color','black');
 Fstep1.style('color','#7cfc00');
 Fstep1.size(41,20);
 for (let i = 0; i < notes.length; i++) {
   Fstep1.option(notes[i]);
 }
 Fstep1.changed(Fstepinput);

 Fstep2 = createSelect();
 Fstep2.position(Fstep1.x +50,Fstep1.y);
 Fstep2.style('border-color','#7cfc00');
 Fstep2.style('background-color','black');
 Fstep2.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep2.option(notes[i]);
 }
 Fstep2.size(41,20);
 Fstep2.changed(Fstepinput);

 Fstep3 = createSelect();
 Fstep3.position(Fstep2.x +50,Fstep2.y);
 Fstep3.style('border-color','#7cfc00');
 Fstep3.style('background-color','black');
 Fstep3.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep3.option(notes[i]);
 }
 Fstep3.size(41,20);
 Fstep3.changed(Fstepinput);

 Fstep4 = createSelect();
 Fstep4.position(Fstep3.x +50,Fstep3.y);
 Fstep4.style('border-color','#7cfc00');
 Fstep4.style('background-color','black');
 Fstep4.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep4.option(notes[i]);
 }
 Fstep4.size(41,20);
 Fstep4.changed(Fstepinput);

 Fstep5 = createSelect();
 Fstep5.position(Fstep4.x +60,Fstep4.y);
 Fstep5.style('border-color','#7cfc00');
 Fstep5.style('background-color','black');
 Fstep5.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep5.option(notes[i]);
 }
 Fstep5.size(41,20);
 Fstep5.changed(Fstepinput);

 Fstep6 = createSelect();
 Fstep6.position(Fstep5.x +50,Fstep5.y);
 Fstep6.style('border-color','#7cfc00');
 Fstep6.style('background-color','black');
 Fstep6.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep6.option(notes[i]);
 }
 Fstep6.size(41,20);
 Fstep6.changed(Fstepinput);

 Fstep7 = createSelect();
 Fstep7.position(Fstep6.x +50,Fstep6.y);
 Fstep7.style('border-color','#7cfc00');
 Fstep7.style('background-color','black');
 Fstep7.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep7.option(notes[i]);
 }
 Fstep7.size(41,20);
 Fstep7.changed(Fstepinput);

 Fstep8 = createSelect();
 Fstep8.position(Fstep7.x +50,Fstep7.y);
 Fstep8.style('border-color','#7cfc00');
 Fstep8.style('background-color','black');
 Fstep8.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep8.option(notes[i]);
 }
 Fstep8.size(41,20);
 Fstep8.changed(Fstepinput);

 Fstep9 = createSelect();
 Fstep9.position(Fstep8.x +60,Fstep8.y);
 Fstep9.style('border-color','#7cfc00');
 Fstep9.style('background-color','black');
 Fstep9.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep9.option(notes[i]);
 }
 Fstep9.size(41,20);
 Fstep9.changed(Fstepinput);

 Fstep10 = createSelect();
 Fstep10.position(Fstep9.x +50,Fstep9.y);
 Fstep10.style('border-color','#7cfc00');
 Fstep10.style('background-color','black');
 Fstep10.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep10.option(notes[i]);
 }
 Fstep10.size(41,20);
 Fstep10.changed(Fstepinput);

 Fstep11 = createSelect();
 Fstep11.position(Fstep10.x +50,Fstep10.y);
 Fstep11.style('border-color','#7cfc00');
 Fstep11.style('background-color','black');
 Fstep11.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep11.option(notes[i]);
 }
 Fstep11.size(41,20);
 Fstep11.changed(Fstepinput);

 Fstep12 = createSelect();
 Fstep12.position(Fstep11.x +50,Fstep11.y);
 Fstep12.style('border-color','#7cfc00');
 Fstep12.style('background-color','black');
 Fstep12.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep12.option(notes[i]);
 }
 Fstep12.size(41,20);
 Fstep12.changed(Fstepinput);

 Fstep13 = createSelect();
 Fstep13.position(Fstep12.x +60,Fstep12.y);
 Fstep13.style('border-color','#7cfc00');
 Fstep13.style('background-color','black');
 Fstep13.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep13.option(notes[i]);
 }
 Fstep13.size(41,20);
 Fstep13.changed(Fstepinput);

 Fstep14 = createSelect();
 Fstep14.position(Fstep13.x +50,Fstep13.y);
 Fstep14.style('border-color','#7cfc00');
 Fstep14.style('background-color','black');
 Fstep14.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep14.option(notes[i]);
 }
 Fstep14.size(41,20);
 Fstep14.changed(Fstepinput);

 Fstep15 = createSelect();
 Fstep15.position(Fstep14.x +50,Fstep14.y);
 Fstep15.style('border-color','#7cfc00');
 Fstep15.style('background-color','black');
 Fstep15.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep15.option(notes[i]);
 }
 Fstep15.size(41,20);
 Fstep15.changed(Fstepinput);

 Fstep16 = createSelect();
 Fstep16.position(Fstep15.x +50,Fstep15.y);
 Fstep16.style('border-color','#7cfc00');
 Fstep16.style('background-color','black');
 Fstep16.style('color','#7cfc00');
 for (let i = 0; i < notes.length; i++) {
   Fstep16.option(notes[i]);
 }
 Fstep16.size(41,20);
 Fstep16.changed(Fstepinput);
}

//================================================================
//=========================Display================================
//================================================================
function draw() {
  background(0,0,0,20);
  stroke(0,255,0);
  strokeWeight(0.5);
  fill(255);
  textAlign(CENTER);
  textSize(10);

  text('Volume', volslider.x + 65, volslider.y - 70);
  text('Detune', volslider.x + 117, volslider.y - 70);
  text('Attack',volslider.x + 167, volslider.y - 70);
  text('Decay', volslider.x + 216, volslider.y - 70);
  text('Sustain', volslider.x + 268, volslider.y - 70);
  text('Release', volslider.x + 317, volslider.y - 70);
  text('LPFilter', volslider.x + 368, volslider.y - 70);
  text('HPFilter', volslider.x + 417, volslider.y - 70);

  text('Volume', vol2slider.x + 65, vol2slider.y - 70);
  text('High', vol2slider.x + 116, vol2slider.y - 70);
  text('Mid', vol2slider.x + 166, vol2slider.y - 70);
  text('Low', vol2slider.x + 216, vol2slider.y - 70);
  text('Attack', vol2slider.x + 265, vol2slider.y - 70);
  text('Decay', vol2slider.x + 317, vol2slider.y - 70);

  text('Volume', vol3slider.x + 65, vol3slider.y - 70);
  
  push();
   textSize(40);
   strokeWeight(2);
   text(keynotetext, sineButton.x -55.5, sineButton.y+18);
  pop();

  push();
   textSize(12);
   fill(StartTextColor);
   text('Start',startbutton.x +25,startbutton.y - 9);
  pop();

  push();
   textSize(12);
   text('Stop',stopbutton.x +25,stopbutton.y - 9);
   text('BPM',BPMinput.x +20 ,BPMinput.y);
   text(oscTypeText, sineButton.x + 25, sineButton.y -18);
   text(osc2TypeText, sine2Button.x + 25, sine2Button.y -18);
  pop();

  push();
   fill(255);
   stroke(00,255,149);
   strokeWeight(2);
   textFont('Courier');
   textAlign(CENTER);
   textSize(30);
   textStyle('italic');
   text('EPS-2', width -(width/9 -60) ,height/9 -30);
  pop();

  //-------------waveform-----------------------------------
  waveform = analyzer.getValue();
  push();
  
  beginShape();
  noFill();
  stroke(233, 30, 99);
  strokeWeight(3);

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, volslider.x + 950);
    let y = map(waveform[i], -1, 1, height -(height / 3), 0);
    vertex(x, y);
  }
   
  endShape();
  pop();
  
  //-------------waveform2-----------------------------------
  waveform2 = analyzer2.getValue();
   push();
  
   beginShape();
     noFill();
     stroke(0, 255, 179);
     strokeWeight(2);

     for (let i = 0; i < waveform2.length; i++) {
       let x = map(i, 0, waveform2.length, 0, volslider.x + 930);
       let y = map(waveform2[i], -1, 1, height -(height / 3.2), 0);
       vertex(x, y);
      }
   
    endShape();
  pop();

  //-------------waveform4---------------------------------
  waveform4 = analyzer4.getValue();
  push();
    
    beginShape();
     fill(0,0,0,50);
     stroke(102, 255, 0);
     strokeWeight(2);
  
     for (let i = 0; i < waveform4.length; i++) {
       let x = map(i, 0, waveform4.length, 0, volslider.x + 970);
       let y = map(waveform4[i], -1, 1, height -(height / 2.8), 0);
       vertex(x, y);
      }
     
    endShape();
  pop();

  //---------------UI setting-----------------
  push();
  
    noFill();
    stroke(233, 30, 99);
    strokeWeight(2.2);
  
    rect(volslider.x -135,volslider.y -100,1035,190,5);
    rect(volslider.x -112, volslider.y-80,72,60,20);
    line(vol3slider.x + 35,vol3slider.y +90,vol3slider.x + 35,vol3slider.y-100);
    line(vol2slider.x - 40 ,vol2slider.y +90,vol2slider.x - 40,vol2slider.y-100);
   //-----------------blue line-----------------  
    stroke(0, 255, 179);
    beginShape();
    for (let i = 0; i < waveform2.length; i++) {
     let b = map(waveform2[i], -1, 1, height -(height / 3.2), 0);
      beginShape();
       vertex(volslider.x + 930, b);
       vertex(volslider.x + 930, Sstep1.y+10);
       vertex(volslider.x -94, Sstep1.y+10);
       vertex(volslider.x -94, Sstep1.y-10);
      endShape();
    }
    endShape();

    //----------------red line-------------------
    stroke(233,30,99);
    for (let i = 0; i < waveform.length; i++) {
     let r = map(waveform[i], -1, 1, height -(height / 3), 0);
      beginShape();
       vertex(volslider.x + 950, r);
       vertex(volslider.x + 950, Sstep1.y+44);
       vertex(volslider.x -98, Sstep1.y+44);
       vertex(volslider.x -98, Sstep1.y -10);
      endShape();
    }
    
    //------------green line---------------------
    stroke(102, 255, 0);
    for (let i = 0; i < waveform4.length; i++) {
     let g = map(waveform4[i], -1, 1, height -(height / 2.8), 0);
      beginShape();
       vertex(volslider.x + 970, g);
       vertex(volslider.x + 970, Sstep1.y+78);
       vertex(volslider.x -102, Sstep1.y+78);
       vertex(volslider.x -102, Sstep1.y -10);
      endShape();
    }

   //-----------------number line----------------- 
    stroke(233,30,99);
    beginShape();
     vertex(volslider.x + 890, Sstep1.y+108);
     vertex(volslider.x -100, Sstep1.y+108);
     vertex(volslider.x -106, volslider.y +220);
     vertex(volslider.x -106, volslider.y +100);
    endShape();
    circle(volslider.x + 890, Sstep1.y+107.7,5);
    rect(volslider.x -110, volslider.y+90,20,10,2);

    //----------4line text at the bottom------------
    push();
     stroke(0);
     strokeWeight(5);
     noFill();
     textFont('Courier');
     textAlign(CENTER);
     textSize(16);
     textStyle('italic');
     text('HighSynth Step',Sstep1.x - 84, Sstep1.y + 14);
     text('FM  Synth Step',Sstep1.x - 84, Sstep1.y + 47);
     text('FM Synth',volslider.x +20, volslider.y -95);
     text('Low Synth Step',Sstep1.x - 84, Sstep1.y + 81);
     text('Step   Numbers',Sstep1.x - 85, Sstep1.y + 110);
     text('High Synth',vol2slider.x +20, vol2slider.y -95);
     text('LowSyn',vol3slider.x +65, vol3slider.y -95);
     textStyle('bold');
     textSize(15);
     text('1',Sstep1.x + 20, Sstep1.y + 111);
     text('2',Sstep1.x + 70, Sstep1.y + 111);
     text('3',Sstep1.x + 120, Sstep1.y + 111);
     text('4',Sstep1.x + 170, Sstep1.y + 111);
     text('5',Sstep1.x + 230, Sstep1.y + 111);
     text('6',Sstep1.x + 280, Sstep1.y + 111);
     text('7',Sstep1.x + 330, Sstep1.y + 111);
     text('8',Sstep1.x + 380, Sstep1.y + 111);
     text('9',Sstep1.x + 440, Sstep1.y + 111);
     text('10',Sstep1.x + 490, Sstep1.y + 111);
     text('11',Sstep1.x + 540, Sstep1.y + 111);
     text('12',Sstep1.x + 590, Sstep1.y + 111);
     text('13',Sstep1.x + 650, Sstep1.y + 111);
     text('14',Sstep1.x + 700, Sstep1.y + 111);
     text('15',Sstep1.x + 750, Sstep1.y + 111);
     text('16',Sstep1.x + 800, Sstep1.y + 111);
   pop();

    push();
     textFont('Courier');
     textAlign(CENTER);
     textSize(16);
     textStyle('italic');
     strokeWeight(1.2);

     stroke(0, 255, 179);
     fill(0, 255, 179);
     text('HighSynth Step',Sstep1.x - 84, Sstep1.y + 14);

     stroke(233, 30, 99);
     fill(233, 30, 99);
     text('FM  Synth Step',Sstep1.x - 84, Sstep1.y + 47);
     text('FM Synth',volslider.x +20, volslider.y -95);
     text('High Synth',vol2slider.x +20, vol2slider.y -95);
     text('LowSyn',vol3slider.x +65, vol3slider.y -95);

     stroke(124,252,0);
     fill(124,252,0);
     text('Low Synth Step',Sstep1.x - 84, Sstep1.y + 81);

     stroke(233, 30, 99);
     fill(233, 30, 99);
     text('Step   Numbers',Sstep1.x - 85, Sstep1.y + 110);
     noStroke();
     fill(233, 30, 99);
     textStyle('bold');
     textSize(15);
     text('1',Sstep1.x + 20, Sstep1.y + 111);
     text('2',Sstep1.x + 70, Sstep1.y + 111);
     text('3',Sstep1.x + 120, Sstep1.y + 111);
     text('4',Sstep1.x + 170, Sstep1.y + 111);
     text('5',Sstep1.x + 230, Sstep1.y + 111);
     text('6',Sstep1.x + 280, Sstep1.y + 111);
     text('7',Sstep1.x + 330, Sstep1.y + 111);
     text('8',Sstep1.x + 380, Sstep1.y + 111);
     text('9',Sstep1.x + 440, Sstep1.y + 111);
     text('10',Sstep1.x + 490, Sstep1.y + 111);
     text('11',Sstep1.x + 540, Sstep1.y + 111);
     text('12',Sstep1.x + 590, Sstep1.y + 111);
     text('13',Sstep1.x + 650, Sstep1.y + 111);
     text('14',Sstep1.x + 700, Sstep1.y + 111);
     text('15',Sstep1.x + 750, Sstep1.y + 111);
     text('16',Sstep1.x + 800, Sstep1.y + 111);
    pop();
  pop();

  //-------------------------------------------
  //--------------value set--------------------
  //-------------------------------------------
  push();
   synth.envelope.attack = attack.value();
   synth.envelope.decay = decay.value();
   synth.envelope.sustain = sus.value();
   synth.envelope.release = release.value();
   synth.volume.value = volslider.value();
   synth.detune.value = detune.value();
   HPfilter.frequency.value = HPfreq.value();
   LPfilter.frequency.value = LPfreq.value();

   synth2.volume.value = vol2slider.value();
   EQ.high.value = EQhigh.value();
   EQ.mid.value = EQmid.value();
   EQ.low.value = EQlow.value();
   synth2.envelope.attack = Eattack.value();
   synth2.envelope.decay = Edecay.value();

   synth4.volume.value = vol3slider.value();
  pop();
}

//=================================================================
//======================Keyboard===================================
//=================================================================
function keyPressed() {
  // fill(0, 255, 179);
  // rect(volslider.x -112, volslider.y-80,72,60,20);

  if (keyCode == 65) {
    synth.triggerAttackRelease("C3", 1);
    synth2.triggerAttackRelease("C3", 1);
    keynotetext = "C";
    
  } 
  else if (keyCode == 87) {
    synth.triggerAttackRelease("C#3", 1);
    synth2.triggerAttackRelease("C#3", 1);
    keynotetext = "C#";
  } 
  else if (keyCode == 69) {
    synth.triggerAttackRelease("D#3", 1);
    synth2.triggerAttackRelease("D#3", 1);
    keynotetext = "D#";
  } 
  else if (keyCode == 83) {
    synth.triggerAttackRelease("D3", 1);
    synth2.triggerAttackRelease("D3", 1);
    keynotetext = "D";
  } 
  else if (keyCode == 68) {
    synth.triggerAttackRelease("E3", 1);
    synth2.triggerAttackRelease("E3", 1);
    keynotetext = "E";
  }
  else if (keyCode == 70) {
    synth.triggerAttackRelease("F3", 1);
    synth2.triggerAttackRelease("F3", 1);
    keynotetext = "F";
  }
  else if (keyCode == 84) {
    synth.triggerAttackRelease("F#3", 1);
    synth2.triggerAttackRelease("F#3", 1);
    keynotetext = "F#";
  }
  else if (keyCode == 71) {
    synth.triggerAttackRelease("G3", 1);
    synth2.triggerAttackRelease("G3", 1);
    keynotetext = "G";
  }
  else if (keyCode == 89) {
    synth.triggerAttackRelease("G#3", 1);
    synth2.triggerAttackRelease("G#3", 1);
    keynotetext = "G#";
  }
  else if (keyCode == 72) {
    synth.triggerAttackRelease("A3", 1);
    synth2.triggerAttackRelease("A3", 1);
    keynotetext = "A";
  }
  else if (keyCode == 85) {
    synth.triggerAttackRelease("A#3", 1);
    synth2.triggerAttackRelease("A#3", 1);
    keynotetext = "A#";
  } 
  else if (keyCode == 74) {
    synth.triggerAttackRelease("B3", 1);
    synth2.triggerAttackRelease("B3", 1);
    keynotetext = "B";
  } 
  else if (keyCode == 75) {
    synth.triggerAttackRelease("C4", 1);
    synth2.triggerAttackRelease("C4", 1);
    keynotetext = "C";
  } 
  else if (keyCode == 79) {
    synth.triggerAttackRelease("C#4", 1);
    synth2.triggerAttackRelease("C#4", 1);
    keynotetext = "C#";
  } 
  else if (keyCode == 76) {
  synth.triggerAttackRelease("D4", 1);
  synth2.triggerAttackRelease("D4", 1);
  keynotetext = "D";
  } 
  else if (keyCode == 80) {
    synth.triggerAttackRelease("D#4", 1);
    synth2.triggerAttackRelease("D#4", 1);
    keynotetext = "D#";
  } 
  else if (keyCode == 186) {
    synth.triggerAttackRelease("E4", 1);
    synth2.triggerAttackRelease("E4", 1);
    keynotetext = "E";
  }
  else if (keyCode == 222) {
    synth.triggerAttackRelease("F4", 1);
    synth2.triggerAttackRelease("F4", 1);
    keynotetext = "F";
  }
}

//==============================================================
//===============4 OSC switch in synth1=========================
//==============================================================
function changeSine() {
  fill(0);
  noStroke();
  rect(sineButton.x , sineButton.y-30,50,30);
  synth.oscillator.type = "fmsine";
  //backColor = [0, 128, 255];
  fill(0,255,0);
  oscTypeText = "FMSine";
  sineButton.style('background-color', '#e91e63');
  sineButton.style('border-color', '#e91e63');
  squareButton.style('background-color', 'transparent');
  squareButton.style('border-color', '#e91e63');
  triButton.style('background-color', 'transparent');
  triButton.style('border-color', '#e91e63');
  sawButton.style('background-color', 'transparent');
  sawButton.style('border-color', '#e91e63');

}

function changeSquare() {
  fill(0);
  noStroke();
  rect(sineButton.x , sineButton.y-30,50,30);
  synth.oscillator.type = "fmsquare";
  //backColor = [255, 51, 51];
  fill(0,255,0);
  oscTypeText = "FMSquare";
  sineButton.style('background-color', 'transparent');
  sineButton.style('border-color', '#e91e63');
  squareButton.style('background-color', '#e91e63');
  squareButton.style('border-color', '#e91e63');
  triButton.style('background-color', 'transparent');
  triButton.style('border-color', '#e91e63');
  sawButton.style('background-color', 'transparent');
  sawButton.style('border-color', '#e91e63');
}

function changeTri() {
  fill(0);
  noStroke();
  rect(sineButton.x , sineButton.y-30,50,30);
  synth.oscillator.type = "fmtriangle";
  //backColor = [127, 0, 253];
  fill(0,255,0);
  oscTypeText = "FMTriangle";
  sineButton.style('background-color', 'transparent');
  sineButton.style('border-color', '#e91e63');
  squareButton.style('background-color', 'transparent');
  squareButton.style('border-color', '#e91e63');
  triButton.style('background-color', '#e91e63');
  triButton.style('border-color', '#e91e63');
  sawButton.style('background-color', 'transparent');
  sawButton.style('border-color', '#e91e63');
}

function changeSaw() {
  fill(0);
  noStroke();
  rect(sineButton.x , sineButton.y-30,50,30);
  synth.oscillator.type = "fmsawtooth";
  fill(0,255,0);
  oscTypeText = "FMSawtooth";
  sineButton.style('background-color', 'transparent');
  sineButton.style('border-color', '#e91e63');
  squareButton.style('background-color', 'transparent');
  squareButton.style('border-color', '#e91e63');
  triButton.style('background-color', 'transparent');
  triButton.style('border-color', '#e91e63');
  sawButton.style('background-color', '#e91e63');
  sawButton.style('border-color', '#e91e63');
}

//==============================================================
//===============4 OSC switch in synth2=========================
//==============================================================
function changeSine2() {
  fill(0);
  noStroke();
  rect(sine2Button.x , sine2Button.y-30,50,30);
  synth2.oscillator.type = "sine";
  //backColor = [0, 128, 255];
  fill(0,255,0);
  osc2TypeText = "Sine";
  sine2Button.style('background-color', '#00FFB3');
  sine2Button.style('border-color', '#00FFB3');
  square2Button.style('background-color', '	transparent');
  square2Button.style('border-color', '#00FFB3');
  tri2Button.style('background-color', 'transparent');
  tri2Button.style('border-color', '#00FFB3');
  saw2Button.style('background-color', 'transparent');
  saw2Button.style('border-color', '#00FFB3');

}

function changeSquare2() {
  fill(0);
  noStroke();
  rect(sine2Button.x , sine2Button.y-30,50,30);
  synth2.oscillator.type = "square";
  //backColor = [255, 51, 51];
  fill(0,255,0);
  osc2TypeText = "Square";
  sine2Button.style('background-color', 'transparent');
  sine2Button.style('border-color', '#00FFB3');
  square2Button.style('background-color', '#00FFB3');
  square2Button.style('border-color', '#00FFB3');
  tri2Button.style('background-color', 'transparent');
  tri2Button.style('border-color', '#00FFB3');
  saw2Button.style('background-color', 'transparent');
  saw2Button.style('border-color', '#00FFB3');
}

function changeTri2() {
  fill(0);
  noStroke();
  rect(sine2Button.x , sine2Button.y-30,50,30);
  synth2.oscillator.type = "triangle";
  //backColor = [127, 0, 253];
  fill(0,255,0);
  osc2TypeText = "Triangle";
  sine2Button.style('background-color', 'transparent');
  sine2Button.style('border-color', '#00FFB3');
  square2Button.style('background-color', 'transparent');
  square2Button.style('border-color', '#00FFB3');
  tri2Button.style('background-color', '#00FFB3');
  tri2Button.style('border-color', '#00FFB3');
  saw2Button.style('background-color', 'transparent');
  saw2Button.style('border-color', '#00FFB3');
}

function changeSaw2() {
  fill(0);
  noStroke();
  rect(sine2Button.x , sine2Button.y-30,50,30);
  synth2.oscillator.type = "sawtooth";
  fill(0,255,0);
  osc2TypeText = "Sawtooth";
  sine2Button.style('background-color', 'transparent');
  sine2Button.style('border-color', '#00FFB3');
  square2Button.style('background-color', 'transparent');
  square2Button.style('border-color', '#00FFB3');
  tri2Button.style('background-color', 'transparent');
  tri2Button.style('border-color', '#00FFB3');
  saw2Button.style('background-color', '#00FFB3');
  saw2Button.style('border-color', '#00FFB3');
}

//=============================================================
//================seq start/stop/bpm switch====================
//=============================================================
function seqstart(){
  StartTextColor = [0,255,0];
  startbutton.style('background-color', '#e91e63');
  startbutton.style('border-color', '#e91e63');
  text('Start',startbutton.x +25,startbutton.y - 12);
  Tone.start();
  Tone.Transport.start();
  seq.start();
  seq2.start();
  //seq3.start();
  seq4.start();
}

function seqstop(){
  StartTextColor = [255];
  startbutton.style('background-color', '#00FFB3');
  startbutton.style('border-color', '#00FFB3');
  Tone.Transport.stop();
  seq.stop();
  seq2.stop();
  //seq3.stop();
  seq4.stop();
  
}

function bpminput(){
  Tone.Transport.bpm.value = BPMinput.value();
  //console.log(bpm);
}

//=======================================================
//=======================step set========================
//=======================================================
function stepinput(){
  seq.events[0] = step1.value();
  seq.events[1] = step2.value();
  seq.events[2] = step3.value();
  seq.events[3] = step4.value();
  seq.events[4] = step5.value();
  seq.events[5] = step6.value();
  seq.events[6] = step7.value();
  seq.events[7] = step8.value();
  seq.events[8] = step9.value();
  seq.events[9] = step10.value();
  seq.events[10] = step11.value();
  seq.events[11] = step12.value();
  seq.events[12] = step13.value();
  seq.events[13] = step14.value();
  seq.events[14] = step15.value();
  seq.events[15] = step16.value();
}

function Sstepinput(){
  seq2.events[0] = Sstep1.value();
  seq2.events[1] = Sstep2.value();
  seq2.events[2] = Sstep3.value();
  seq2.events[3] = Sstep4.value();
  seq2.events[4] = Sstep5.value();
  seq2.events[5] = Sstep6.value();
  seq2.events[6] = Sstep7.value();
  seq2.events[7] = Sstep8.value();
  seq2.events[8] = Sstep9.value();
  seq2.events[9] = Sstep10.value();
  seq2.events[10] = Sstep11.value();
  seq2.events[11] = Sstep12.value();
  seq2.events[12] = Sstep13.value();
  seq2.events[13] = Sstep14.value();
  seq2.events[14] = Sstep15.value();
  seq2.events[15] = Sstep16.value();
}

function Fstepinput(){
  seq4.events[0] = Fstep1.value();
  seq4.events[1] = Fstep2.value();
  seq4.events[2] = Fstep3.value();
  seq4.events[3] = Fstep4.value();
  seq4.events[4] = Fstep5.value();
  seq4.events[5] = Fstep6.value();
  seq4.events[6] = Fstep7.value();
  seq4.events[7] = Fstep8.value();
  seq4.events[8] = Fstep9.value();
  seq4.events[9] = Fstep10.value();
  seq4.events[10] = Fstep11.value();
  seq4.events[11] = Fstep12.value();
  seq4.events[12] = Fstep13.value();
  seq4.events[13] = Fstep14.value();
  seq4.events[14] = Fstep15.value();
  seq4.events[15] = Fstep16.value();
}
