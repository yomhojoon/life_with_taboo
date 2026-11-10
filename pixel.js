// 480x270 photobased monochrome pixel cutscenes, including user-provided photographic reference crops. No anime/illustration.
(function(root){
'use strict';
const ART={room:'room',sleep:'room',rest:'room',meal:'meal',home:'room',work:'desk',store:'desk',research:'photo_research',desk:'photo_research',monitor:'photo_research',shop:'photo_terminal_detail',ritual:'ritual',purify:'ritual',shaman:'ritual',ghost:'photo_abandoned_apartment',street:'street',walk:'street',park:'park',cafe:'meal',city:'photo_urban_night',terminal:'photo_terminal_detail',alley:'alley',shrine:'shrine',temple:'temple',window:'window',apartment:'apartment'};
const IMAGES={};
const GHOST_IMAGE=new Image();
GHOST_IMAGE.decoding='async';
GHOST_IMAGE.src=(root.YG_ART_DATA&&root.YG_ART_DATA.ghost)||'assets/ghost.png';
GHOST_IMAGE.onload=()=>{if(last)draw(last);};

let last=null, tick=0,context=null;
for(const kind of [...new Set([...Object.values(ART),'ghost'])]){
 const img=new Image();img.decoding='async';img.src=(root.YG_ART_DATA&&root.YG_ART_DATA[kind])||`assets/${kind}.png`;
 img.onload=()=>{if(last)draw(last);};IMAGES[kind]=img;
}
const rectangle=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function vignette(c){const w=480,h=270;const g=c.createRadialGradient(240,124,35,240,130,295);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.7,'rgba(0,0,0,.03)');g.addColorStop(1,'rgba(0,0,0,.8)');c.fillStyle=g;c.fillRect(0,0,w,h);}
function ghost(c,id,phase=0){
 const g=GHOST_IMAGE;
 // All ghosts deliberately share the original unmodified monochrome portrait.
 c.save(); c.globalAlpha=.82+(Math.sin(phase/3)*.04);
 c.fillStyle='#030303';c.fillRect(279,20,184,223);
 if(g?.complete&&g.naturalWidth)c.drawImage(g,293,28,159,204);
 else{rectangle(c,326,51,81,87,'#6d6d6d');rectangle(c,309,129,115,95,'#202020');}
 c.strokeStyle='#d3d3d3';c.lineWidth=1;c.strokeRect(288,23,170,215);
 c.restore();
}
function ritualMark(c){
 c.strokeStyle='#bbb';c.lineWidth=1;c.globalAlpha=.23;
 c.beginPath();c.ellipse(238,212,94,26,0,0,Math.PI*2);c.stroke();
 c.beginPath();c.moveTo(189,188);c.lineTo(288,223);c.lineTo(199,232);c.lineTo(280,184);c.closePath();c.stroke();c.globalAlpha=1;
 rectangle(c,145,188,3,33,'#eee');rectangle(c,144,184,5,6,'#d8d8d8');
}
function screenFlicker(c){
 const a=.018+((tick%5)===0?.035:0);rectangle(c,0,0,480,270,`rgba(255,255,255,${a})`);
}
function draw(s){
 const el=document.getElementById('pixelCanvas');if(!el)return;
 if(el.width!==480)el.width=480;if(el.height!==270)el.height=270;
 last=s;const c=el.getContext('2d',{alpha:false});c.imageSmoothingEnabled=false;
 const scene=s.scene||{}, hour=scene.hour??s.hour??0;
 let kind=ART[scene.action]||'room';
 if(s.pending?.kind==='skills'&&s.pending.source==='shop')kind='photo_terminal_detail';
 if(scene.tone==='ghost')kind=(s.ghosts?.length? 'photo_abandoned_apartment':'photo_apparition');
 if(scene.action==='shaman'||scene.action==='purify')kind='shrine';
 if(scene.action==='walk'){const day=s.day||1;kind=(hour>=18||hour<6)?(day%2?'photo_urban_night':'alley'):(day%3?'park':'temple');}
 if(scene.action==='rest'&&hour>=17&&hour<=21)kind='photo_urban_night';
 const img=IMAGES[kind];
 if(img?.complete&&img.naturalWidth){c.drawImage(img,0,0,480,270);}else if(IMAGES.room?.complete&&IMAGES.room.naturalWidth){c.drawImage(IMAGES.room,0,0,480,270);}else{c.fillStyle='#050505';c.fillRect(0,0,480,270);}
 // Darkness follows the hour, while morning remains cold grayscale.
 if(hour>=21||hour<=4){rectangle(c,0,0,480,270,'rgba(0,0,0,.28)');}
 else if(hour>=18){rectangle(c,0,0,480,270,'rgba(0,0,0,.13)');}
 if(['ritual','shrine'].includes(kind))ritualMark(c);
 if((scene.tone==='ghost'&&s.ghosts?.length)||((scene.action==='ghost'&&s.ghosts?.length))||(scene.action==='shaman'&&s.ghosts?.some(x=>x.state!=='active'))){
  const found=s.ghosts?.find(g=>g.id===scene.ghost_id) || s.ghosts?.[s.ghosts.length-1];
  ghost(c,scene.ghost_id||found?.id||"original",tick);
 }
 if((kind==='monitor'||kind==='desk')&&tick%3===0)screenFlicker(c);
 vignette(c);
 // Small high-contrast timestamp with no decorative overlays.
 rectangle(c,0,0,480,2,'#bbb');
}
function animate(){tick=(tick+1)%48;if(last&&document.visibilityState!=='hidden')draw(last);}
if(typeof window!=='undefined')setInterval(animate,530);
root.YGPixel={draw};
})(typeof window!=='undefined'?window:globalThis);
