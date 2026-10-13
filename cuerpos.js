// ===== CUERPOS: jugador, PNJ y jefes REDIBUJADOS =====
// Sustituye bakeBody/bakeRoll (sprites.js) conservando tamaños, anclaje de los pies y poses, así que armas, hitboxes y
// animaciones siguen alineadas. Añade sombreado en 3 tonos, pliegues, capas deshilachadas, pelo/caras y detalles propios.
const ex=(i,o)=>KITS[i]&&Object.assign(KITS[i],o);
const _dk=(c,t)=>mixc(c,'#000000',t),_lt=(c,t)=>mixc(c,'#ffffff',t);
ex('player',{scarf:'#4aa8c8',satchel:'#3a2a1a',ring:0});
ex('soldier',{tabard:'#8a2a24',trim:'#c9a54a'});
ex('warden',{tabard:'#6a5a30',trim:'#c9a54a'});
ex('hollow',{rags:1});
ex('archer',{quiver:'#5a3a22'});
ex('brute',{fur:'#6a5040',apron:'#4a3220'});
ex('sepulturero',{apron:'#2a2418',stoop:1});
ex('pastora',{robe:1,lamp:'#ffb347'});
ex('cazador',{antlers:1,fur:'#5a4a38',quiver:'#3a2a1a'});
ex('caballero',{tabard:'#3a2a62',rivets:1,trim:'#b0b0c0',spikes:1});
ex('rey',{robe:1,ermine:'#e8e0f0',trim:'#c9a54a'});
ex('guardiana',{ribs:1,antlers:0});
ex('heraldo',{tabard:'#c9a54a',trim:'#5a3a14'});
ex('madre',{vines:1});ex('capataz',{apron:'#5a3a22',lampH:'#ff9a3c'});ex('vigia',{lamp:'#ffd88a'});
ex('mirela',{hair:'#cfc8c0',hairS:'bun'});ex('brenna',{hair:'#8a3a22',hairS:'braid'});ex('dorn',{hair:'#5a4a30',hairS:'short'});
ex('aldeano',{hair:'#5a4030',hairS:'short'});ex('anselmo',{hair:'#9a9a90',hairS:'bald'});
['soledad','elda','cartografa'].forEach(i=>{if(KITS[i])Object.assign(KITS[i],{hair:'#4a3020',hairS:i==='elda'?'bun':'long'})});
['bruno','marinero'].forEach(i=>{if(KITS[i])Object.assign(KITS[i],{hair:i==='bruno'?'#8a8a80':'#3a2a20',hairS:'short'})});
for(const i of['diego','andro','soledad','elda','bruno','marinero','cartografa','brenna','mirela','mirela2'])if(KITS[i])KITS[i].head='hair';
ex('caballero',{flare:2});ex('rey',{flare:2});ex('cazador',{flare:1});ex('pastora',{flare:1});ex('guardiana',{flare:1});ex('heraldo',{flare:1});ex('madre',{flare:1});ex('vigia',{flare:1});
if(KITS.diego)ex('diego',{hair:'#241a14',hairS:'short',face:'#e0b898',ring:1,scarf:'#4a4a62'});
if(KITS.andro)ex('andro',{hair:'#8a5a2a',hairS:'short',face:'#e8c4a0',ring:1,scarf:'#e8e0c8',tabard:'#f0e8d0',trim:'#c9a54a'});
for(const i of['capdorn','aldric','mirela2','dorn2'])if(KITS[i]){const b={capdorn:'dorn',aldric:'caballero',mirela2:'mirela',dorn2:'dorn'}[i];for(const f of['tabard','rivets','trim','hair','hairS'])if(KITS[b][f]!==undefined&&KITS[i][f]===undefined)KITS[i][f]=KITS[b][f]}

function bakeBody(k,dir,pose,fr){const big=!!k.big,W=big?52:36,H=big?64:44,c=mkc(W,H),x=c.getContext('2d'),cx=W>>1,fy=H-3;
 const {bw,th,lh,hw,hh,A}=k,s=[0,1,0,-1][fr&3],hun=(k.hunch||k.stoop)?1:0,fl=fr&1;let dy=0,lA=0,lB=0,aA=0,aB=0,aR=0;
 if(pose==='idle'){dy=fl?1:0}else if(pose==='walk'){dy=fl?0:-1;lA=s>0?2:0;lB=s<0?2:0;aA=-s;aB=s}
 else if(pose==='wind'){dy=-1;aR=4}else if(pose==='act'){dy=1;aR=-1}else if(pose==='rec'){dy=1}else if(pose==='hit'||pose==='stg'){dy=1;aA=-2;aB=-2}else if(pose==='flask'){aR=5}
 const legTop=fy-lh,tTop=legTop-th+dy+(hun?1:0),hTop=tTop-hh+2+(hun?1:0),front=dir==='d',back=dir==='u',side=dir==='s';
 const P=(X,Y,w,h,t)=>{rect(x,X,Y,w,h,t[0]);if(w>2)rect(x,X,Y,1,h,t[1]);if(w>3)rect(x,X+w-1,Y,1,h,t[2]);if(h>1)rect(x,X,Y,w,1,_lt(t[1],.1));if(h>2)rect(x,X,Y+h-1,w,1,_dk(t[2],.15))};   // bloque con luz izq., sombra der.
 const dith=(X,Y,w,h,col)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)if((i+j)%2===0)dot(x,X+i,Y+j,col)};
 // ---------- capa / manto ----------
 const cape=(sideV)=>{if(!k.cape)return;const fl2=(k.flare||0)*2,cw=sideV?5+(k.flare||0):bw+3+fl2,X=sideV?cx+bw*.25:cx-bw/2-1-(k.flare||0),ln=th+lh-1+(k.skirt?1:0),Y=tTop+1;
  P(X,Y,cw,ln,[k.cape,k.capeE,_dk(k.cape,.45)]);dith(X+1,Y+ln*.55,cw-2,Math.max(1,ln*.35),_dk(k.cape,.3));
  for(let i=1;i<cw-1;i+=3)rect(x,X+i,Y+3,1,ln-5,_dk(k.cape,.3));           // pliegues
  const sw=fl?1:0;for(let i=0;i<cw;i++){const j=((i*7+fr)%3);rect(x,X+i+(sideV?sw:0),Y+ln,1,j&1,i%2?k.capeE:_dk(k.cape,.2))}};
 // ---------- piernas / falda ----------
 const legs=()=>{
  if(!lh){const rw=bw+4;for(let i=0;i<lh+9;i++){const wv=Math.round(Math.sin((fr+i)*.9)*1.2),ww=Math.max(3,rw-i);const col=i%3===0?A[2]:i%3===1?A[0]:mixc(A[0],A[2],.5);rect(x,cx-ww/2+wv,legTop+i-3,ww,1,col);if(ww>4)dot(x,cx-ww/2+wv,legTop+i-3,A[1])}return}
  const lw=Math.max(3,Math.round(bw*.4)),st=pose==='walk'?s*3:0;
  if(front){P(cx-lw/2-st-1,legTop,lw,lh-lA,[A[0],A[1],A[2]]);P(cx-lw/2+st+1,legTop,lw,lh-lB,[A[2],A[0],_dk(A[2],.3)]);
   dot(x,cx-lw/2-st-1+1,legTop+(lh>>1),A[1]);rect(x,cx-lw/2-st-2,fy-2-lA,lw+2,2,k.boot);rect(x,cx-lw/2+st,fy-2-lB,lw+2,2,k.boot);rect(x,cx-lw/2-st-2,fy-3-lA,lw+2,1,_lt(k.boot,.25));rect(x,cx-lw/2+st,fy-3-lB,lw+2,1,_lt(k.boot,.25))}
  else{const w=Math.floor(bw/2)-1;P(cx-w-1,legTop,w,lh-lA,A);P(cx+1,legTop,w,lh-lB,[A[2],A[0],_dk(A[2],.3)]);
   rect(x,cx-w-2,fy-2-lA,w+1,2,k.boot);rect(x,cx+1,fy-2-lB,w+2,2,k.boot);rect(x,cx-w-2,fy-3-lA,w+1,1,_lt(k.boot,.25));rect(x,cx+1,fy-3-lB,w+2,1,_lt(k.boot,.25))}
  if(k.skirt||k.robe){const sh=k.robe?lh:5,X=cx-bw/2-(k.robe?1:0),w=bw+(k.robe?2:0);P(X,legTop-2,w,sh+2,A);for(let i=2;i<w-1;i+=3)rect(x,X+i,legTop,1,sh,_dk(A[0],.3));rect(x,X,legTop+sh,w,1,_lt(A[1],.1));if(k.trim)rect(x,X,legTop+sh-1,w,1,k.trim)}};
 // ---------- torso ----------
 const torso=(sd)=>{const w=sd?Math.round(bw*.62):bw,X=cx-w/2,h=legTop-tTop;P(X,tTop,w,h,A);dith(X+1,tTop+h*.72,w-2,Math.max(1,h*.28),_dk(A[0],.14));
  for(let i=3;i<w-2;i+=4)rect(x,X+i,tTop+2,1,h-4,_dk(A[0],.2));                                 // pliegues de tela
  if(k.ribs&&!sd&&!back){rect(x,X,tTop,w,h,A[2]);for(let r=1;r<h-1;r+=2){rect(x,X+1,tTop+r,w-2,1,A[0]);rect(x,cx,tTop+r,1,1,A[2])}rect(x,cx,tTop,1,h,A[1])}
  if(k.tabard&&!back){const tw=Math.max(3,Math.round(w*.42)),tx=cx-tw/2+(sd?-1:0),tl=h+2;rect(x,tx,tTop+1,tw,tl,k.tabard);rect(x,tx,tTop+1,1,tl,_lt(k.tabard,.3));rect(x,tx+tw-1,tTop+1,1,tl,_dk(k.tabard,.4));if(k.trim){rect(x,tx,tTop+tl,tw,1,k.trim);if(tw>3)dot(x,cx,tTop+3,k.trim)}}
  if(k.fur&&!back){const fw=w+4,fx=cx-fw/2;for(let i=0;i<fw;i++){const j=(i*5+3)%4;rect(x,fx+i,tTop-1,1,3+j%2,i%3?k.fur:_lt(k.fur,.25))}}
  if(k.belt){rect(x,X,legTop-2,w,2,k.belt);rect(x,X,legTop-2,w,1,_lt(k.belt,.2));if(k.buckle&&front)rect(x,cx-1,legTop-2,2,2,k.buckle);if(!back)rect(x,X+w-3,legTop-3,3,3,_dk(k.belt,.2))}
  if(k.apron&&!back){const aw=Math.round(w*.55),al=h+1;rect(x,cx-aw/2,tTop+3,aw,al,k.apron);rect(x,cx-aw/2,tTop+3,1,al,_lt(k.apron,.3));rect(x,cx-aw/2,tTop+2+al,aw,1,_lt(k.apron,.15))}
  if(k.emblem&&front)rect(x,cx-1,tTop+2,2,2,k.emblem);
  if(k.chains&&front){pline(x,X,tTop+1,X+w-1,legTop-3,'#a0a0b0');pline(x,X+w-1,tTop+1,X,legTop-3,'#7a7a88');dot(x,cx,tTop+h/2|0,'#c0c0d0')}
  if(k.rivets&&!back){for(let i=1;i<w-1;i+=3)dot(x,X+i,tTop+1,k.trim||'#a0a0b0');for(let i=1;i<w-1;i+=3)dot(x,X+i,legTop-4,k.trim||'#a0a0b0')}
  if(k.rags){for(let i=0;i<w;i+=2){rect(x,X+i,legTop-1,1,2+(i%3),A[2])}}
  if(k.vines&&!back){pline(x,X,tTop+1,X+w-1,legTop-2,'#3a8a3a');dot(x,X+2,tTop+4,'#7aff6a');dot(x,X+w-3,tTop+h-3,'#7aff6a');dot(x,cx,tTop+h-2,'#9aff7a')}
  if(k.pauld){const p=k.pauld;const PA=[A[1],_lt(A[1],.25),A[2]];if(!sd){P(X-2,tTop-1,3+p,3+p,PA);P(X+w-1-p,tTop-1,3+p,3+p,[A[0],A[1],A[2]]);if(k.rivets||p>1){dot(x,X-1,tTop,_lt(A[1],.5));dot(x,X+w-2,tTop,_lt(A[1],.5))}}else{P(cx-2,tTop-1,4+p,3+p,PA)}}
  if(k.ermine&&!back){const ew=w+4;rect(x,X-2,tTop-1,ew,3,k.ermine);rect(x,X-2,tTop-1,ew,1,'#ffffff');for(let i=1;i<ew-1;i+=3)dot(x,X-2+i,tTop,'#2a2030')}
  if(k.spikes&&!sd&&!back){for(const sx of[X-1,X+w])pline(x,sx,tTop-1,sx+(sx<cx?-1:1),tTop-5,k.trim||'#b0b0c0',1)}
  if(k.scarf&&!back){rect(x,X,tTop,w,2,k.scarf);rect(x,X,tTop,w,1,_lt(k.scarf,.25));if(front){rect(x,cx+1,tTop+2,2,4+(fl?1:0),k.scarf);rect(x,cx+1,tTop+5+(fl?1:0),2,1,_dk(k.scarf,.3))}else rect(x,cx+w/2-1,tTop+2,2,3+(fl?1:0),k.scarf)}
  if(k.satchel&&back){rect(x,cx-bw/2,tTop+3,bw,1,k.satchel);rect(x,cx+bw/4,tTop+4,4,5,k.satchel);rect(x,cx+bw/4,tTop+4,4,1,_lt(k.satchel,.3))}
  if(k.quiver&&(back||side)){const qx=side?cx+1:cx+bw/4;pline(x,qx,tTop-2,qx-3,legTop-2,k.quiver,3);dot(x,qx,tTop-3,'#d8d0b8');dot(x,qx+1,tTop-4,'#d8d0b8');dot(x,qx-1,tTop-4,'#c0b8a0')}};
 // ---------- brazos ----------
 const alen=th-3+(k.arm||0),hand=k.face||'#c9a888',arm=(X,y,len,col,gl)=>{P(X,y,2,len,[col,_lt(col,.2),_dk(col,.3)]);rect(x,X,y+len-1,2,1,_dk(col,.2));rect(x,X,y+len,2,2,gl);if(k.ring&&gl===hand)dot(x,X+1,y+len+1,'#ffd24a')};
 const arms=(sd)=>{const gl=k.face?hand:A[2],yy=tTop+2;
  if(pose==='block'){if(sd){P(cx-bw*.5-1,yy+1,4,alen-1,[A[1],_lt(A[1],.2),A[2]]);rect(x,cx-bw*.5-1,yy+alen-1,3,2,gl)}else{P(cx-bw/2-1,yy+1,bw+2,3,[A[1],_lt(A[1],.2),A[2]]);rect(x,cx-bw/2-1,yy+4,bw+2,2,A[0])}return}
  if(sd){arm(cx-2,yy+aA,alen,A[1],gl);return}
  arm(cx-bw/2-2,yy+aA,alen,A[1],gl);arm(cx+bw/2,yy+aB-aR,alen+(aR>0?-1:0),A[2],gl)};
 // ---------- cabeza ----------
 const headF=()=>{const X=cx-hw/2+(hun&&side?-1:0),Y=hTop+(hun?1:0),hc=k.hc,eyeY=Y+Math.round(hh*.5),eye=(X0,Y0)=>{dot(x,X0,Y0,k.eye);dot(x,X0,Y0-1,_dk(k.eye,.55))};
  const base=(col,l,d)=>{rect(x,X,Y+1,hw,hh-1,col);rect(x,X+1,Y,hw-2,1,l);rect(x,X,Y+1,1,hh-1,l);rect(x,X+hw-1,Y+1,1,hh-1,d);rect(x,X+1,Y+hh-1,hw-2,1,_dk(d,.1))};
  const hairD=()=>{if(!k.hair||back&&!k.hair)return;const hr=k.hair,st=k.hairS||'short';if(st==='bald')return;
   rect(x,X,Y,hw,2,hr);rect(x,X,Y+1,1,hh-3,hr);rect(x,X+hw-1,Y+1,1,hh-4,_dk(hr,.3));rect(x,X+1,Y,hw-2,1,_lt(hr,.25));
   if(st==='long'||st==='braid'){rect(x,X-1,Y+2,2,hh+1,hr);rect(x,X+hw-1,Y+2,2,hh+1,_dk(hr,.25));if(st==='braid')pline(x,X+hw,Y+hh,X+hw+1,Y+hh+4,hr,2)}
   if(st==='bun')rect(x,cx-2,Y-2,4,3,hr);if(back)rect(x,X,Y,hw,hh-1,hr)};
  const faceBox=(X1,w1)=>{rect(x,X1,Y+2,w1,hh-3,k.face);rect(x,X1,Y+2,w1,1,_dk(k.face,.12));rect(x,X1+w1-1,Y+3,1,hh-4,_dk(k.face,.18));if(!back)dot(x,side?X1:cx,eyeY+2,_dk(k.face,.3))};
  if(k.head==='hood'){base(hc[0],hc[1],hc[2]);rect(x,cx-1,Y-1,2,1,hc[0]);dot(x,cx,Y-2,hc[0]);rect(x,X+1,Y+hh-1,hw-2,1,_dk(hc[0],.3));
   if(!back){const fx=X+1,fw=side?hw-4:hw-2;rect(x,fx,Y+2,fw,hh-3,k.face?k.face:'#06030c');
    if(k.face){rect(x,fx,Y+2,fw,2,_dk(hc[0],.1));rect(x,fx,Y+2,fw,1,hc[0]);eye(side?X+2:X+hw/2-2,eyeY);if(!side)eye(X+hw/2+1,eyeY);dot(x,side?X+1:cx,eyeY+2,_dk(k.face,.3))}
    else{if(side)rect(x,X+1,eyeY,2,1,k.eye);else{rect(x,X+hw/2-3,eyeY,2,1,k.eye);rect(x,X+hw/2+1,eyeY,2,1,k.eye)}dot(x,side?X+1:X+hw/2-3,eyeY-1,_dk(k.eye,.6));if(!side)dot(x,X+hw/2+2,eyeY-1,_dk(k.eye,.6))}}
   if(k.hair&&k.face&&!back){rect(x,X+1,Y+2,hw-2,1,k.hair);if(k.hairS==='long'||k.hairS==='braid')rect(x,X,Y+3,1,hh-2,k.hair)}if(k.hair&&k.hairS==='bun')rect(x,cx-2,Y-2,4,2,k.hair)}
  else if(k.head==='helm'||k.head==='crown'){base(hc[0],hc[1],hc[2]);rect(x,X,Y+hh-2,hw,2,hc[2]);rect(x,X+1,Y+1,hw-2,1,_lt(hc[1],.2));
   if(!back){const sx=side?X:X+1,sw=side?hw/2+1:hw-2;rect(x,sx,eyeY-1,sw,2,'#06030c');if(side)eye(X+1,eyeY-1);else{eye(X+hw/2-2,eyeY-1);eye(X+hw/2+1,eyeY-1)}rect(x,side?X+1:cx-1,eyeY+1,1,hh-(eyeY-Y)-2,hc[2]);if(!side)for(let i=1;i<3;i++)dot(x,cx-2+i*2-(i>1?0:0),eyeY+2,hc[2])}
   if(k.plume){rect(x,cx-1,Y-3,2,3,k.plume);rect(x,cx,Y-4,2,1,_lt(k.plume,.25));rect(x,cx-1,Y-3,1,3,_dk(k.plume,.3));if(side||back)rect(x,cx+1,Y-2,3,2,k.plume)}
   if(k.horns){pline(x,X,Y+1,X-3,Y-3,'#e8e0c8',2);pline(x,X+hw-1,Y+1,X+hw+2,Y-3,'#e8e0c8',2);dot(x,X-3,Y-4,'#fff');dot(x,X+hw+2,Y-4,'#fff')}
   if(k.lampH){disc(x,cx,Y-2,2,k.lampH);dot(x,cx,Y-3,'#fff4c0')}
   if(k.head==='crown'){rect(x,X-1,Y-2,hw+2,3,'#c9a54a');for(let i=0;i<4;i++)rect(x,X-1+i*Math.round((hw+1)/3),Y-4,2,2,'#c9a54a');rect(x,X-1,Y-2,hw+2,1,'#ffe9a0');rect(x,X-1,Y,hw+2,1,'#8a6a1a');dot(x,cx,Y-1,'#ff4d6d')}}
  else if(k.head==='hair'){const hr=k.hair||'#4a3020',st=k.hairS||'short',sk=k.face||'#e0b898',hl=_lt(hr,.28),hd=_dk(hr,.35);
   rect(x,X+1,Y+1,hw-2,hh-1,sk);rect(x,X,Y+2,hw,hh-3,sk);rect(x,X+hw-1,Y+3,1,hh-4,_dk(sk,.18));rect(x,X+1,Y+hh-1,hw-2,1,_dk(sk,.22));
   if(back){rect(x,X,Y+1,hw,hh-1,hr);rect(x,X+1,Y,hw-2,1,hl);rect(x,X+hw-1,Y+2,1,hh-3,hd);if(st==='long'||st==='braid')rect(x,X,Y+hh,hw,3,hr);if(st==='braid')pline(x,cx,Y+hh+2,cx,Y+hh+7,hr,2)}
   else{rect(x,X,Y,hw,3,hr);rect(x,X+1,Y-1,hw-2,1,hr);rect(x,X+1,Y-1,hw-3,1,hl);rect(x,X+hw-1,Y+1,1,2,hd);
    if(st!=='bald'){rect(x,X,Y+3,1,2,hr);rect(x,X+hw-1,Y+3,1,2,hd)}else{rect(x,X,Y,hw,2,_dk(sk,.08));rect(x,X+1,Y+1,hw-2,1,_lt(sk,.15))}
    if(st==='long'||st==='braid'){rect(x,X-1,Y+2,2,hh+1,hr);rect(x,X+hw-1,Y+2,2,hh+1,hd);if(st==='braid')pline(x,X+hw,Y+hh,X+hw+1,Y+hh+5,hr,2)}
    if(st==='bun'){rect(x,cx-2,Y-3,4,3,hr);rect(x,cx-2,Y-3,4,1,hl)}
    const ey=Y+Math.round(hh*.55);if(side){dot(x,X+2,ey,'#1a1410');dot(x,X+2,ey-1,hd)}else{dot(x,cx-2,ey,'#1a1410');dot(x,cx+1,ey,'#1a1410');rect(x,cx-3,ey-1,2,1,hd);rect(x,cx+1,ey-1,2,1,hd)}
    dot(x,side?X+1:cx-1,ey+2,_dk(sk,.35));if(!side)dot(x,cx,ey+2,_dk(sk,.35))}}
  else if(k.head==='skull'){base(hc[0],hc[1],hc[2]);rect(x,X+1,Y+1,hw-2,1,_lt(hc[1],.25));
   if(!back){rect(x,X+1,eyeY-1,3,3,'#120d08');rect(x,X+hw-4,eyeY-1,3,3,'#120d08');eye(X+2,eyeY);eye(X+hw-3,eyeY);rect(x,cx-1,eyeY+2,2,1,'#2a2018');for(let i=0;i<hw-2;i+=2)rect(x,X+1+i,Y+hh-1,1,1,'#120d08')}
   if(k.antlers!==0){pline(x,X+1,Y+1,X-2,Y-4,'#e8e0c8',1);pline(x,X-2,Y-4,X-5,Y-6,'#e8e0c8',1);pline(x,X-1,Y-2,X+1,Y-6,'#e8e0c8',1);pline(x,X+hw-2,Y+1,X+hw+1,Y-4,'#e8e0c8',1);pline(x,X+hw+1,Y-4,X+hw+4,Y-6,'#e8e0c8',1);pline(x,X+hw,Y-2,X+hw-2,Y-6,'#e8e0c8',1)}}
  else if(k.head==='hat'){faceBox(X+1,hw-2);rect(x,X,Y+2,hw,hh-2,k.face);rect(x,X+hw-1,Y+2,1,hh-2,'#8a8272');if(!back){rect(x,X+2,eyeY,2,1,'#1a1410');rect(x,X+hw-4,eyeY,2,1,'#1a1410');dot(x,X+2,eyeY,k.eye);dot(x,X+hw-3,eyeY,k.eye);rect(x,X+2,Y+hh-1,hw-4,1,'#3a3426')}
   rect(x,X-3,Y+1,hw+6,2,hc[1]);rect(x,X-3,Y+2,hw+6,1,hc[2]);rect(x,X+1,Y-3,hw-2,4,hc[0]);rect(x,X+1,Y-3,hw-2,1,hc[1]);rect(x,X+1,Y,hw-2,1,'#7a4a2a')}
  if(k.lamp){const lx=side?X-3:X+hw+3,ly=Y+hh;rect(x,lx,ly-2,3,4,'#3a3030');rect(x,lx+1,ly-1,1,2,k.lamp)}};
 if(front){cape(0);legs();torso(0);arms(0);headF()}
 else if(back){legs();torso(0);if(k.cape){const ln=th+lh-1+(k.skirt?1:0);P(cx-bw/2-1,tTop+1,bw+2,ln,[k.cape,k.capeE,_dk(k.cape,.45)]);rect(x,cx,tTop+2,1,ln-2,_dk(k.cape,.3));dith(cx-bw/2,tTop+ln*.55,bw,ln*.4,_dk(k.cape,.3));for(let i=0;i<bw+2;i++)rect(x,cx-bw/2-1+i,tTop+1+ln,1,((i*7+fr)%3)&1,i%2?k.capeE:_dk(k.cape,.2))}arms(0);headF()}
 else{const hand2=k.face?k.face:A[2];P(cx+1,tTop+3+aB,2,alen,[A[2],A[0],_dk(A[2],.3)]);rect(x,cx+1,tTop+3+aB+alen,2,2,hand2);cape(1);legs();torso(1);arms(1);headF()}
 if(k.lamp&&false){}
 return finish(c,k.ghost?'#1a2438':'#0b0714')}
function bakeRoll(k,fr){const c=mkc(30,30),x=c.getContext('2d'),A=k.A;x.translate(15,15);x.rotate(fr*Math.PI/2);x.translate(-15,-15);
 disc(x,15,17,7,A[0]);disc(x,14,15,5,A[1]);disc(x,12,13,2,_lt(A[1],.2));rect(x,9,19,12,3,A[2]);rect(x,20,12,5,7,k.cape||A[2]);rect(x,20,12,1,7,k.capeE||A[1]);rect(x,24,14,3,3,k.capeE||A[1]);rect(x,9,10,4,3,k.hc[0]);rect(x,9,10,4,1,k.hc[1]);dot(x,10,12,k.eye);dot(x,11,12,k.eye);rect(x,12,21,6,2,k.boot);if(k.scarf)rect(x,12,20,6,1,k.scarf);
 x.setTransform(1,0,0,1,0,0);return finish(c)}
// los sprites que otros scripts ya hubieran horneado con el dibujo antiguo se descartan
for(const i in KITS)for(const k in ART)if(k.startsWith('b'+i)||k.startsWith('r'+i))delete ART[k];
