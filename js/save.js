'use strict';
(function(global){
  const KEY='valsaelite_save_v1';
  const VER=1;

  function missionSnap(stations){
    const out=[];
    (stations||[]).forEach(st=>{
      (st.missionsList||[]).forEach(m=>{
        out.push({sid:st.sd.id,id:m.id,done:!!m.done,active:!!m.active,killsDone:m.killsDone|0});
      });
    });
    return out;
  }

  function storyMissionSnap(STORY){
    return (STORY.chapters||[]).map(ch=>({
      id:ch.mission&&ch.mission.id,
      done:!!(ch.mission&&ch.mission.done),
      active:!!(ch.mission&&ch.mission.active),
      killsDone:(ch.mission&&ch.mission.killsDone)|0
    }));
  }

  global.buildSavePayload=function(){
    const ps=global.PS,ship=global.playerShip;
    if(!ps||!ship||!ship.mesh)return null;
    const looted={};
    (global.HULKS||[]).forEach(h=>{looted[h.id]=!!h.looted;});
    return{
      v:VER,t:Date.now(),
      PS:{
        credits:ps.credits,cargo:{...ps.cargo},cargoMax:ps.cargoMax,
        crew:[...ps.crew],modules:[...ps.modules],bpInv:{...ps.bpInv},
        hullPaintHex:ps.hullPaintHex,missiles:ps.missiles,
        activeMissionIds:ps.activeMissions.map(m=>m.id),
        sandboxMode:!!ps.sandboxMode,
        rootSeen:{...(ps.rootSeen||{})},
        loreFlags:{...(ps.loreFlags||{})},
        beghelliAppeared:!!ps.beghelliAppeared,
        beghelliAidUsed:ps.beghelliAidUsed|0
      },
      STORY:{chapter:global.STORY.chapter,won:!!global.STORY.won},
      storyFlags:global.StorySys&&global.StorySys.flags?{
        suborbitDone:!!global.StorySys.flags.suborbitDone,
        hulkBoarded:!!global.StorySys.flags.hulkBoarded,
        boardingsTotal:global.StorySys.flags.boardingsTotal|0
      }:null,
      storyMissions:storyMissionSnap(global.STORY),
      rep:{...global.rep},
      bpGrid:global.bpGrid.map(row=>[...row]),
      crewHired:global.CREW_POOL.filter(c=>c.hired).map(c=>c.id),
      missions:missionSnap(global.stations),
      ship:{
        health:ship.health,energy:ship.energy,
        x:ship.mesh.position.x,y:ship.mesh.position.y,z:ship.mesh.position.z,
        rotY:ship.mesh.rotation.y,
        vx:ship.velocity.x,vy:ship.velocity.y,vz:ship.velocity.z
      },
      game:{
        state:global.GAME.state,
        dockedStId:global.GAME.dockedSt&&global.GAME.dockedSt.sd?global.GAME.dockedSt.sd.id:null,
        dockActiveTab:global.GAME.dockActiveTab||null
      },
      navDestId:global.navDestId||null,
      hulksLooted:looted,
      econ:{marketMood:{...global.ECON.marketMood}},
      boost:{heat:global.BOOST.heat,overheated:global.BOOST.overheated,overheatTimer:global.BOOST.overheatTimer},
      stats:global.RUN_STATS?{...global.RUN_STATS}:null,
      hullRepSnap:global._hullRepSnapHex,
      interludes:global._shownInterludes?[...global._shownInterludes]:[]
    };
  };

  function restoreMissionStates(data){
    const map={};
    (data.missions||[]).forEach(m=>{map[m.sid+'::'+m.id]=m;});
    (global.stations||[]).forEach(st=>{
      (st.missionsList||[]).forEach(m=>{
        const s=map[st.sd.id+'::'+m.id];
        if(!s)return;
        m.done=s.done;m.active=s.active;
        if(m.killsDone!=null)m.killsDone=s.killsDone;
      });
    });
    (data.storyMissions||[]).forEach((sm,i)=>{
      const ch=global.STORY.chapters[i];
      if(!ch||!ch.mission||ch.mission.id!==sm.id)return;
      ch.mission.done=sm.done;ch.mission.active=sm.active;
      if(ch.mission.killsDone!=null)ch.mission.killsDone=sm.killsDone;
    });
    psRebuildActiveMissions(data.PS.activeMissionIds||[]);
  }

  function psRebuildActiveMissions(ids){
    global.PS.activeMissions=[];
    ids.forEach(id=>{
      for(const st of global.stations||[]){
        const m=st.missionsList.find(x=>x.id===id);
        if(m&&!m.done){m.active=true;global.PS.activeMissions.push(m);break;}
      }
    });
  }

  global.applySavePayload=function(data){
    if(!data||data.v!==VER)return false;
    const ps=global.PS,d=data.PS;
    Object.assign(ps,{
      credits:d.credits,cargo:{...d.cargo},cargoMax:d.cargoMax,
      crew:[...d.crew],modules:[...d.modules],bpInv:{...d.bpInv},
      hullPaintHex:d.hullPaintHex,missiles:d.missiles,
      sandboxMode:!!d.sandboxMode,activeMissions:[],
      rootSeen:{...(d.rootSeen||{})},
      loreFlags:{...(d.loreFlags||{})},
      beghelliAppeared:!!d.beghelliAppeared,
      beghelliAidUsed:d.beghelliAidUsed|0
    });
    global.STORY.chapter=data.STORY.chapter|0;
    global.STORY.won=!!data.STORY.won;
    if(global.StorySys&&global.StorySys.flags&&data.storyFlags){
      global.StorySys.flags.suborbitDone=!!data.storyFlags.suborbitDone;
      global.StorySys.flags.hulkBoarded=!!data.storyFlags.hulkBoarded;
      global.StorySys.flags.boardingsTotal=data.storyFlags.boardingsTotal|0;
    }
    Object.assign(global.rep,data.rep||{});
    if(data.bpGrid)global.bpGrid=data.bpGrid.map(row=>[...row]);
    global.CREW_POOL.forEach(c=>{c.hired=(data.crewHired||[]).includes(c.id);});
    restoreMissionStates(data);
    const ship=global.playerShip;
    if(ship&&data.ship){
      // Revive dopo game over: die() rimuove la mesh e lascia alive=false.
      ship.alive=true;
      ship.health=Math.max(1,data.ship.health);
      ship.energy=data.ship.energy;
      if(ship.mesh){
        ship.mesh.visible=true;
        ship.mesh.position.set(data.ship.x,data.ship.y,data.ship.z);
        ship.mesh.rotation.set(0,data.ship.rotY,0);
        if(!ship.mesh.parent&&global.scene)global.scene.add(ship.mesh);
      }
      ship.velocity.set(data.ship.vx,data.ship.vy,data.ship.vz);
    }
    global.navDestId=data.navDestId||null;
    global.navDestPending=null;
    if(typeof global.BEGHELLI!=='undefined'){
      global.BEGHELLI.aidUsed=ps.beghelliAidUsed|0;
      if(ps.beghelliAppeared||(global.STORY.chapter|0)>=4||global.STORY.won){
        if(typeof global.ensureBeghelliPalace==='function')global.ensureBeghelliPalace(true);
      }
    }
    if(data.hulksLooted){
      (global.HULKS||[]).forEach(h=>{
        if(data.hulksLooted[h.id]){
          h.looted=true;
          if(h.mesh&&typeof THREE!=='undefined')h.mesh.traverse(o=>{
            if(!o.material)return;
            if('emissiveIntensity' in o.material)o.material.emissiveIntensity*=.18;
            if(o.material.blending===THREE.AdditiveBlending&&o.material.transparent)o.material.opacity*=.35;
          });
        }
      });
    }
    if(data.econ&&data.econ.marketMood)global.ECON.marketMood={...data.econ.marketMood};
    if(data.boost){
      global.BOOST.heat=data.boost.heat||0;
      global.BOOST.overheated=!!data.boost.overheated;
      global.BOOST.overheatTimer=data.boost.overheatTimer||0;
    }
    if(data.stats)Object.assign(global.RUN_STATS,data.stats);
    if(data.hullRepSnap)global._hullRepSnapHex=data.hullRepSnap;
    if(global._shownInterludes&&data.interludes){
      global._shownInterludes.clear();
      data.interludes.forEach(id=>global._shownInterludes.add(id));
    }
    if(typeof global.applyModules==='function')global.applyModules();
    if(typeof global.rebuildPlayerMesh==='function')global.rebuildPlayerMesh();
    if(typeof global.renderRep==='function')global.renderRep();
    // Pulisci pause residue (game over / story / overlay).
    if(global.GAME&&global.GAME.pausedReasons){
      Object.keys(global.GAME.pausedReasons).forEach(k=>{
        if(k!=='docked')global.GAME.pausedReasons[k]=false;
      });
    }
    const g=data.game||{};
    if(g.state==='docked'&&g.dockedStId){
      const st=global.stations.find(s=>s.sd.id===g.dockedStId);
      if(st){
        global.GAME.state='docked';
        global.GAME.dockedSt=st;
        global.setPausedReason('docked',true);
        ship.mesh.visible=false;
        document.getElementById('dkscr').style.display='block';
        document.getElementById('hud').style.display='none';
        document.getElementById('radar').style.display='none';
        document.getElementById('mtick').style.display='none';
        document.body.classList.add('docked-ui');
        if(g.dockActiveTab)global.GAME.dockActiveTab=g.dockActiveTab;
        if(typeof global.buildDock==='function')global.buildDock(st);
      }
    }else{
      global.GAME.state='flying';
      global.GAME.dockedSt=null;
      global.setPausedReason('docked',false);
      ship.mesh.visible=true;
      document.body.classList.remove('docked-ui','story-open','menu-open');
      document.getElementById('dkscr').style.display='none';
      document.getElementById('hud').style.display='flex';
      document.getElementById('radar').style.display='block';
    }
    if(typeof global.updateHUD==='function')global.updateHUD();
    return true;
  };

  global.saveGame=function(silent){
    try{
      const p=global.buildSavePayload();
      if(!p)return false;
      localStorage.setItem(KEY,JSON.stringify(p));
      if(!silent&&typeof global.notify==='function')global.notify('Partita salvata.',1800);
      if(typeof global.playChime==='function')global.playChime('success');
      return true;
    }catch(_){return false;}
  };

  global.loadGame=function(silent){
    try{
      const raw=localStorage.getItem(KEY);
      if(!raw)return false;
      const data=JSON.parse(raw);
      if(!global.applySavePayload(data))return false;
      if(!silent&&typeof global.notify==='function')global.notify('Partita caricata.',2000);
      if(typeof global.playChime==='function')global.playChime('success');
      return true;
    }catch(_){return false;}
  };

  global.hasSaveGame=function(){
    try{return!!localStorage.getItem(KEY);}catch(_){return false;}
  };

  global.clearSaveGame=function(){
    try{localStorage.removeItem(KEY);}catch(_){}
  };

  global.newGameConfirm=function(){
    if(confirm('Iniziare una nuova partita? Il salvataggio attuale verrà cancellato.')){
      global.clearSaveGame();
      location.reload();
    }
  };
})(window);
