var btPlay, btStop, btwave, audio, os=[], btSong, iSong=0, t, page=1,filter1;
var waveB="sine", gain=[], input1, btSave, frequency1, frequency2, textarea, visual;
var graph=[], real=[], imag=[], analyser=[],filter=[];
onload=function() {
    frequency1=new AdjustingWheelLog10(70,10,20,10,1000,100,changeSound, "frequency");      
    frequency2=new AdjustingWheel(50,10,20,0.87,1.13,1,changeSound, "detune");
    filter1=new AdjustingWheel(30,10,20,0,10000,5000,changeSound, "filter"); 
    graph[0]= new Graph(10,30,80,35,15,changeSound);
    visual=new Visualizer();
    visual.surface.style.display="none";
    textarea=document.getElementById('textarea');          
    btSave=document.getElementById('btSave');      
    sheet=new Sheet(10,20,80,75);
    sheet.surface.style.display="none";       
    real=graph[0].output;
    imag=graph[0].output;    
    createAudio();     
    btLeft=document.getElementById('switchLeft');
    btRight=document.getElementById('switchRight'); 
    btwave=document.getElementById('btwave');
    btPlay=document.getElementById('play');
    btStop=document.getElementById('stop'); 
    btSong=document.getElementById('song');  
    btwave.addEventListener('click',waveBox);          
}
function play() {
    os[0].start();
    os[1].start();    
    btStop.disabled=false;
    btPlay.disabled=true;
}
function stop() {
    audio.close();
    createAudio();
    btStop.disabled=true;
    btPlay.disabled=false;  
    btSong.disabled=false;
    clearInterval(t);      
    iSong=0;  
}
function waveBox() {
    switch (waveB) {
      case "sine":
        wave="square";
        waveB="square";
        break;
      case "square":
        wave="sawtooth";
        waveB="sawtooth"; 
        break;    
      case "sawtooth":
        wave="triangle";
        waveB="triangle";
        break;    
      case "triangle":
        waveB="custom"
        break;     
      case "custom":
        waveB="sine";
        wave="sine";
        break;                               
      default:
        wave="fehler";   
    }
    btwave.textContent=waveB;
    changeSound();
}
function changeSound() {
    os[0].frequency.value=frequency1.value; 
       os[1].frequency.value=frequency1.value*frequency2.value;    
    for(let i=0;i<=4;i++) {   
        filter[i].frequency.value=filter1.value;
        if(waveB=='custom') {
        wave=audio.createPeriodicWave(real,imag); 
            os[i].setPeriodicWave(wave); 
        }
        else {        
            os[i].type=wave;
        }    
    }
}
function createAudio() {
    audio=new AudioContext();
    for(let i=0;i<=4;i++) {
        os[i]=audio.createOscillator();  
        analyser[i]=audio.createAnalyser();
        gain[i]=audio.createGain();
        filter[i]=audio.createBiquadFilter();
        os[i].connect(filter[i]);
        filter[i].connect(analyser[i]);
        analyser[i].connect(gain[i]);
        gain[i].connect(audio.destination);         
        gain[i].gain.value=0.25;   
    }         
    changeSound();        
}
function playSong() {
    if(page>=3) {
        t=setInterval(interval, 250, mySong);
    }
    else {
        t=setInterval(interval, 125, song);    
    }
}
function interval(sng) {   
    if(sng[iSong]) {
        if(iSong==0) {
            btStop.disabled=false;
            btPlay.disabled=true;  
            btSong.disabled=true;  
            audio.close();
            createAudio();    
            for(let i=0;i<=4;i++) {
                os[i].start();
            }            
        }      
        for(let i=0;i<=4;i++) { 
            sng[iSong][i]==undefined?null:os[i].frequency.value=sng[iSong][i]; 
        }     
        if(page==2) {
          this.visual.draw(analyser[0]);
        }
        iSong++;           
    } 
    else {  
        audio.close();
        createAudio(); 
        clearInterval(t);   
        iSong=0; 
        btStop.disabled=true;
        btPlay.disabled=false;  
        btSong.disabled=false;  
    }
}
function saveSheet() {
    let str="";
    for(let i in mySong) {
        str+='[';
        for(let j in mySong[i]) {
            str+=Math.round(mySong[i][j]*10)/10+",";
        }
        str+='],';
    }
    textarea.innerHTML=str.substring(0,str.length-1);
    alert("saved");
}
function switchSide(side) {
    page+=side;
    switch(page) {
      case 1:
        graph[0].surface.style.display='block';
        frequency1.surface.style.display = "block";
        frequency2.surface.style.display = "block";
        filter1.surface.style.display = "block";
        visual.surface.style.display="none";  
        btLeft.disabled=true;   
      break; 
      case 2:  
        btLeft.disabled=false;
        visual.surface.style.display="block";
        sheet.surface.style.display='none'; graph[0].surface.style.display='none';
        btSave.style.display='none';
        frequency1.surface.style.display = "none";
        frequency2.surface.style.display = "none";
        filter1.surface.style.display = "none";
      break;
      case 3:
        btRight.disabled=false;
        textarea.style.display='none';
        visual.surface.style.display="none";
        btSave.style.display='block';
        sheet.surface.style.display='block';
      break; 
      case 4:
        btRight.disabled=true;
        textarea.style.display='block';
        sheet.surface.style.display='none';
        break;
    }   
}