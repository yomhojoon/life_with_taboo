// 480×270 monochrome documentary-pixel cutscenes. All artworks stay local / first-party.
(function(root){
'use strict';
const ART={room:'room',sleep:'room',rest:'room',meal:'meal',home:'room',work:'desk',store:'desk',research:'monitor',desk:'monitor',monitor:'monitor',shop:'monitor',ritual:'ritual',purify:'ritual',shaman:'ritual',ghost:'ritual',street:'street',walk:'street',park:'park',cafe:'street',city:'city',terminal:'terminal'};
const IMAGES={};
let last=null, tick=0,context=null;
for(const kind of [...new Set([...Object.values(ART),'ghost'])]){
 const img=new Image();img.decoding='async';img.src=(root.YG_ART_DATA&&root.YG_ART_DATA[kind])||`assets/${kind}.png`;
 img.onload=()=>{if(last)draw(last);};IMAGES[kind]=img;
}
const rectangle=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function fallback(c,kind,h){
 rectangle(c,0,0,480,270,'#050505');
 for(let i=0;i<9;i++)rectangle(c,10+i*53,70+(i*17)%34,45,173-(i*17)%34,i%2?'#131313':'#242424');
 rectangle(c,0,208,480,62,'#131313');
 if(kind==='monitor'||kind==='research'||kind==='shop'){
  rectangle(c,150,35,265,164,'#363636');rectangle(c,161,47,243,140,'#c6c6c6');
  rectangle(c,171,57,223,11,'#111');for(let i=0;i<11;i++)rectangle(c,174,78+i*9,135-(i%3)*17,3,'#555');
  rectangle(c,260,202,51,17,'#555');rectangle(c,190,220,240,8,'#333');
 }else{rectangle(c,170,54,140,143,'#414141');rectangle(c,178,62,124,130,'#070707');}
}
function vignette(c){const w=480,h=270;const g=c.createRadialGradient(240,124,35,240,130,295);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.7,'rgba(0,0,0,.03)');g.addColorStop(1,'rgba(0,0,0,.8)');c.fillStyle=g;c.fillRect(0,0,w,h);}
function ghost(c,phase=0){
 // An unlit, intermittently present figure rather than a jump-scare portrait.
 const img=IMAGES.ghost;
 c.save();c.globalAlpha=.53+Math.sin(phase/2)*.12;
 if(img?.complete&&img.naturalWidth)c.drawImage(img,303,32,146,197);
 else{rectangle(c,352,45,55,48,'#8e8e8e');rectangle(c,330,96,90,135,'#4b4b4b');}
 c.restore();
 for(let y=35;y<243;y+=23){if((tick+y)%5===0)rectangle(c,320,y,125,1,'rgba(246,246,246,.15)');}
}
function ritualMark(c){
 c.strokeStyle='#bbb';c.lineWidth=1;c.globalAlpha=.23;
 c.beginPath();c.ellipse(238,212,94,26,0,0,Math.PI*2);c.stroke();
 c.beginPath();c.moveTo(189,188);c.lineTo(288,223);c.lineTo(199,232);c.lineTo(280,184);c.closePath();c.stroke();c.globalAlpha=1;
 rectangle(c,145,188,3,33,'#eee');rectangle(c,144,184,5,6,'#d8d8d8');
}
function mealOverlay(c){
 rectangle(c,57,199,365,33,'#151515');rectangle(c,183,192,126,14,'#666');rectangle(c,218,184,52,11,'#d0d0d0');
 rectangle(c,220,173,48,11,'#eee');
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
 if(s.pending?.kind==='skills'&&s.pending.source==='shop')kind='monitor';
 if(scene.tone==='ghost')kind='ritual';
 const img=IMAGES[kind];
 if(img?.complete&&img.naturalWidth){c.drawImage(img,0,0,480,270);}else fallback(c,kind,hour);
 // Darkness follows the hour, while morning remains cold grayscale.
 if(hour>=21||hour<=4){rectangle(c,0,0,480,270,'rgba(0,0,0,.28)');}
 else if(hour>=18){rectangle(c,0,0,480,270,'rgba(0,0,0,.13)');}
 if(['ritual'].includes(kind))ritualMark(c);
 if(scene.action==='meal')mealOverlay(c);
 if(scene.tone==='ghost'||scene.action==='ghost'||(scene.action==='shaman'&&s.ghosts?.some(x=>x.state!=='active')))ghost(c,tick);
 if((kind==='monitor'||kind==='desk')&&tick%3===0)screenFlicker(c);
 vignette(c);
 // Small high-contrast timestamp with no decorative overlays.
 rectangle(c,0,0,480,2,'#bbb');
}
function animate(){tick=(tick+1)%48;if(last&&document.visibilityState!=='hidden')draw(last);}
if(typeof window!=='undefined')setInterval(animate,530);
root.YGPixel={draw};
})(typeof window!=='undefined'?window:globalThis);
