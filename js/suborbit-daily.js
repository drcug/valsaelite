'use strict';
(function(global){
  function getDailySuborbitChallenge(){
    const d=(typeof Date!=='undefined'?new Date().toISOString().slice(0,10):'0');
    const seed=parseInt(d.replace(/-/g,''),10)||0;
    const pool=['Completa un corridoio senza urti al suolo','10+ kill in una singola discesa','Raccogli 6+ container con trazione (F)'];
    return pool[seed%pool.length];
  }
  function getDailyChallengeKey(){
    return(typeof Date!=='undefined'?new Date().toISOString().slice(0,10):'0');
  }
  global.getDailySuborbitChallenge=getDailySuborbitChallenge;
  global.getDailyChallengeKey=getDailyChallengeKey;
  global.checkDailySuborbitChallenge=function(sum){
    const ch=getDailySuborbitChallenge();
    const tr=global.SUBORBIT&&global.SUBORBIT.dailyTrack||{};
    let ok=false;
    if(ch.indexOf('senza urti')>=0)ok=sum.completed&&(sum.rough|0)===0;
    else if(ch.indexOf('10+ kill')>=0)ok=sum.kills>=10;
    else if(ch.indexOf('6+ container')>=0)ok=(tr.tractoredPickups|0)>=6;
    return{challenge:ch,completed:ok};
  };
  global.rewardDailySuborbitChallenge=function(ok){
    if(!ok)return null;
    const key='valsaelite_daily_'+getDailyChallengeKey();
    try{if(localStorage.getItem(key)==='1')return{already:true,streak:0,bonus:0};}catch(_){}
    let streak=0;
    try{streak=(parseInt(localStorage.getItem('valsaelite_daily_streak'),10)||0)+1;}catch(_){streak=1;}
    const bonus=120+Math.min(streak,7)*40;
    if(global.PS)global.PS.credits+=bonus;
    try{
      localStorage.setItem(key,'1');
      localStorage.setItem('valsaelite_daily_streak',String(streak));
    }catch(_){}
    return{already:false,streak,bonus};
  };
})(window);
