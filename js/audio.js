'use strict';
(function(global){
  let ambOsc=null,ambGain=null,ambStarted=false;
  const AUDIO={enabled:true,ambVol:0.028,sfxVol:1};

  function prefs(){
    try{
      if(localStorage.getItem('valsaelite_sfx')==='0')AUDIO.enabled=false;
      const v=parseFloat(localStorage.getItem('valsaelite_sfx_vol'));
      if(!isNaN(v))AUDIO.sfxVol=Math.max(0,Math.min(1,v));
    }catch(_){}
  }
  prefs();

  global.setAudioEnabled=function(on){
    AUDIO.enabled=!!on;
    try{localStorage.setItem('valsaelite_sfx',on?'1':'0');}catch(_){}
    if(!on&&ambGain)ambGain.gain.value=0;
    else if(on&&ambStarted&&ambGain)ambGain.gain.value=AUDIO.ambVol;
    const btn=document.getElementById('a11y-sfx');
    if(btn)btn.textContent='Audio: '+(on?'ON':'OFF');
  };

  global.startAmbientDrone=function(){
    if(ambStarted||!global.gameAudioCtx)return;
    try{
      const ctx=global.gameAudioCtx;
      if(ctx.state!=='running')return;
      ambOsc=ctx.createOscillator();
      ambGain=ctx.createGain();
      const lfo=ctx.createOscillator();
      const lfoG=ctx.createGain();
      ambOsc.type='sine';ambOsc.frequency.value=42;
      lfo.type='sine';lfo.frequency.value=0.07;lfoG.gain.value=8;
      lfo.connect(lfoG);lfoG.connect(ambOsc.frequency);
      ambGain.gain.value=AUDIO.enabled?AUDIO.ambVol:0;
      ambOsc.connect(ambGain).connect(ctx.destination);
      ambOsc.start();lfo.start();
      ambStarted=true;
    }catch(_){}
  };

  global.playCombatSfx=function(kind){
    if(!AUDIO.enabled||typeof global.playTone!=='function')return;
    const v=AUDIO.sfxVol;
    if(kind==='fire')global.playTone(880,.04,.032*v,'square');
    else if(kind==='hit'){global.playTone(220,.06,.04*v,'sawtooth');setTimeout(()=>global.playTone(140,.08,.03*v,'triangle'),30);}
    else if(kind==='explode'){global.playTone(90,.12,.05*v,'sawtooth');setTimeout(()=>global.playTone(55,.18,.04*v,'triangle'),60);}
    else if(kind==='dock'){global.playTone(330,.1,.035*v,'sine');setTimeout(()=>global.playTone(440,.12,.04*v,'sine'),90);}
  };

  global.toggleAudioEnabled=function(){
    global.setAudioEnabled(!AUDIO.enabled);
    if(typeof global.notify==='function')global.notify('Audio '+(AUDIO.enabled?'attivato':'disattivato'),1400);
  };

  const origPlayTone=global.playTone;
  if(typeof origPlayTone==='function'){
    global.playTone=function(freq,dur,vol,type){
      if(!AUDIO.enabled)return;
      origPlayTone(freq,dur,(vol||0.04)*AUDIO.sfxVol,type);
    };
  }
})(window);
