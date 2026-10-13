// ===== NITIDEZ: escalado "bilineal nítido" a la resolución real de la pantalla =====
// El juego se dibuja a 480x270. En vez de dejar que el navegador estire ese canvas (píxeles desiguales y parpadeo al mover
// la cámara cuando la escala no es entera, algo muy común en móviles), se amplía primero por un factor entero sin suavizar y luego
// se ajusta al tamaño exacto de pantalla. Resultado: píxeles parejos y bordes limpios a cualquier resolución.
(function(){
const out=document.createElement('canvas');out.id='cv2';cv.parentNode.insertBefore(out,cv.nextSibling);cv.style.display='none';
const o=out.getContext('2d',{alpha:false}),tmp=document.createElement('canvas'),t=tmp.getContext('2d',{alpha:false});
function present(){
 const dpr=window.devicePixelRatio||1,bw=Math.max(1,Math.round(out.clientWidth*dpr)),bh=Math.max(1,Math.round(out.clientHeight*dpr));
 if(out.width!==bw||out.height!==bh){out.width=bw;out.height=bh}
 const s=Math.min(bw/GW,bh/GH),dw=Math.round(GW*s),dh=Math.round(GH*s),dx=(bw-dw)>>1,dy=(bh-dh)>>1;
 if(dw<bw||dh<bh){o.fillStyle='#000';o.fillRect(0,0,bw,bh)}
 if(CFG.smooth||s<1){o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';o.drawImage(cv,0,0,GW,GH,dx,dy,dw,dh);return}
 if(Math.abs(s-Math.round(s))<.001){o.imageSmoothingEnabled=false;o.drawImage(cv,0,0,GW,GH,dx,dy,dw,dh);return}
 const k=Math.min(6,Math.ceil(s));if(tmp.width!==GW*k||tmp.height!==GH*k){tmp.width=GW*k;tmp.height=GH*k}
 t.imageSmoothingEnabled=false;t.drawImage(cv,0,0,GW,GH,0,0,GW*k,GH*k);
 o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';o.drawImage(tmp,0,0,GW*k,GH*k,dx,dy,dw,dh)}
const d=draw;draw=function(){d.apply(this,arguments);present()};
addEventListener('resize',()=>{try{present()}catch(e){}});
})();
