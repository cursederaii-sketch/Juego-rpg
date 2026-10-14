// ===== EL REY · FASE I con sprite dibujado a mano (frente / lado / espalda) =====
// Se carga después de reyfases.js. Solo sustituye el cuerpo del Rey en su aspecto original (fase I);
// las fases III y IV (rey1 / rey2) siguen horneándose con cuerpos.js + reyfases.js.
// Lienzo 52x64, pies a 3 px del borde de abajo (última fila del dibujo = fila 60), igual que bakeBody.
// El arma, el anclaje de la mano y los hitboxes no cambian: dependen de x,y del Rey, no del sprite.
(function(){
if(typeof KITS==='undefined'||!KITS.rey||typeof bakeBody==='undefined'||typeof mkc==='undefined')return;
const PAL=["#e0dfc7", "#f9e131", "#dcc862", "#cfae29", "#b6912d", "#a77c3a", "#a16945", "#796242", "#6a4e4e", "#733678", "#662d8a", "#652d8b", "#652b8b", "#652b8a", "#652b89", "#642c89", "#642b8b", "#642b8a", "#642b89", "#622e7f", "#47382c", "#652779", "#56267b", "#502473", "#47206a", "#361e45", "#31174c", "#291344", "#211035", "#17101b", "#150926", "#0b0512", "#050307", "#030103", "#010101", "#000101", "#030002", "#010001", "#010000", "#000000"];
const CH='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn';
const ROWS={
'd':[
'.................g................',
'.........l......HFh.....ll........',
'........iHU.....HFi....dFh........',
'........mDFU...ICCF...dHDk........',
'........mEBH..dFDEDd..UBEk........',
'........nFBBHnFCGCGDjUCBEh........',
'.........hFBHkFDGGGDiUBEk.........',
'.........lFBBBBBEFDBBBBEi.........',
'.........iFDDDDDEEDDDDDEi.........',
'..........UHHHGGGGGGGHUU..........',
'..........labaRNMPPPQYgi..........',
'..........labZLKPTPKTYgi..........',
'..........labhHGhhUAhhgh..........',
'..........labiffnngdjigh..........',
'..........labhlliiiiifah..........',
'......jiiilaTYaaaaaaaaahiiii......',
'.....dAAAAAIcaccccccccdAAAAAU.....',
'.....dAAAAAIUUeeeeeeeedAAAAAU.....',
'.....fAAAAAIHHhgggggggdAAAAAU.....',
'.....gIIIIIHFEEcbbbbbbZIIIIId.....',
'.....fcccHgJFEFEPSSPSXXhUcecf.....',
'.....eYYJCfSGEFEGGSSKKPgCJYYe.....',
'.....eYSJCgWWIFFEEGOLKXgCJKYe.....',
'....daWSJCgYSWIBGGDTOMXfCJKWbd....',
'....cXSSJCgYSRKHDDHDDKWgCJLKXc....',
'...lcXRRJCgYSRRWIIDGGFXgCJKLXc....',
'...lcXLNJCgYSPLSWTGEEGGfCJLKXc....',
'...lbXLLJCgbXWWWWWYEEYFgCJMKXc....',
'...gbXRNJDgdFHIEHHEUHFdfDJMMXch...',
'..hbWRROJDfUEFIDHGDUFEddDJLMMXcl..',
'..hbWRROJDfUUUZUZUIZUUddDJLMMWcl..',
'..ibWNNOJDgZaaaaaaaaaabgDJKKMWci..',
'..ibWKLKJDgaWYWYXYXXYWagDJKKKWbh..',
'..hbWKLLJDgaPXTXWXWWXPagDJKKKWbk..',
'..cYSNKLJAgaTXTXWXWWXPafCJKKKSYc..',
'.lbWOONQJAgaTXTXWXWWXPafCJKLONWbl.',
'.lbWJFPQJCgaSXSXWXWWWPagCJKLFJWbl.',
'.lbWKJLQJCgaTXSXWXWWXPagCJKLJKWbl.',
'.lbGJJGPJCgaYYXYYYYXYXagCJKGJPFZl.',
'.lbTKKJPJDheeeceeeecccehEJKJKPJbi.',
'.UHGGGGGFEiffffhljhffffhEFFFFFFHU.',
'lHEDDDDDDFhccccghhgccccgFDDDDDDEFl',
'hUGFFFFFFHkecccg..hececgHFFFFFFGUi',
'.himiliiiimljjlm..lmjljjiiiiillih.'],
's':[
'...................h..',
'......l...........HHh.',
'......dH.........HDEh.',
'......UDH.......IDBEh.',
'......UDBU.....hEBBEc.',
'......UDBCdffgggEBEGAi',
'.......dDBCCCCCCBBEGGh',
'.......dDBBBBBBBBBBEU.',
'.......dDDDDDDDDDDDFd.',
'........UGGGGUHGGGHU..',
'........gLLPPfYPPSah..',
'........fKLPPfYKPTZh..',
'........fKLRSfiAIhlh..',
'........gNLRSfnfgnnh..',
'........gPPPPdlllllh..',
'........igggfYaaaach..',
'.......dAAAAAZfffff...',
'.......dAAAAAUHdih....',
'.......dAAAAAUEIe.....',
'.......gIIIIIHGEIc....',
'.......gcccHdUFEEUh...',
'......ebXXXCUaHEEFF...',
'......cYSSSCUYWIFEEU..',
'.....daWRRPCUYRXFEGU..',
'.....cXKRRRAIYQPXFBF..',
'.....cXKLPRAIYQPRYcf..',
'.....cXNLLPCUYLQRah...',
'.....cXNLLPCUeYYYch...',
'.....cXNNLRCUeHDHHFh..',
'....cXRRRRRDUeHDHHHh..',
'...icXMRRRRDUeZUZZch..',
'...icXRRRRRDUcaaacf...',
'...hcXRRRRRDUaXXXbh...',
'...daWRRRRNDUYWWWbh...',
'..hbWRRRRRNDUYWWWbh...',
'..hbWNSSPPRDUYWWTbh...',
'..ibWNJGPPRDUYWWWbh...',
'..fZTSJJSRSCUYWWWbh...',
'.iaIJGJTFSSCUcaaach...',
'.ibWOJOOJNOEUfffff....',
'.UHGGGGGGGGDUfffff....',
'mFDDDDDDDDDEUecccef...',
'hIFFFFFFFFFHdecceeeh..',
'.hiimllmliilijkljiih..'],
'u':[
'..................................',
'........ll......HH......ll........',
'........iHd....iFHh....UHl........',
'........iDFd...HCCH...UEEm........',
'........mEBU..UCBBEd.UHBEm........',
'........iEBBUlCBBBBEjHBDFm........',
'.........kEBUhDBBBBEkHDFh.........',
'.........iEBBBBBBBBBBBDFi.........',
'.........iEDDDDDDDDDDDDFi.........',
'..........UHGGGGGGGGGHHU..........',
'..........ibWSSPPPOPOXch..........',
'..........ibWRSPPPPNKXch..........',
'..........hbWRRRPPPKLXch..........',
'..........ibWRPPPPLLLXch..........',
'..........hbWKLLLLKLKXch..........',
'......iiniiaWKKMMRNKKXciiiii......',
'.....UAAAAAUaYYYYYYYYcIAAAAAd.....',
'.....UAAAAAUbaaaaaaaacIAAAAAd.....',
'.....UAAAAAUaYYYYYYYYcIAAAAAd.....',
'.....dIIIIIYWNOORROPLXZIIIIIg.....',
'....lfcccccXRRNNNNLLLLYcccccf.....',
'....lcYYXXXTRRRRRRPPPPWXXXYYe.....',
'....lcXNNRRRRRRRRRPPPRLLRRRXe.....',
'....daWNNNRRRRRRRRPPPPLLRRNWad....',
'...lbWMMNNNRRRRRRRRPPPPRRRNMWbl...',
'...lbWKNNNNRRRRRRRRPPPPRRRNMXbl...',
'...lbWKKNNNRNRRRRRRRPPPRRRRMXbl...',
'...lbWKKNNRRRNNNRRRRRRRRRRRQXbl...',
'...hbWKNRNNSPONNNNRRRRRRRRRMWbh...',
'..gbWNKLLRRSPONNNNRRRRRRRRRMSWbl..',
'..gaWNLLLRSPSNNNNNNRRRRRRNRNNWbl..',
'..hbWPNLLRSPRNNNNRRRRRRRNNNRKWbl..',
'..ibWNNLLLSPRRRNORRRRRRNNNNNNWbl..',
'..hbWONLLLRRRRRRPORRRRRNNRNRNWbl..',
'.hcYGJMKKKNRRRRNKKRRRQQNNNNRGGYch.',
'.iaWJJNKKKNPSRNNLPRRRRSQNNNMJJWai.',
'.iaWKJIKKLLGJRNRLLPRPGGQRRRGJRWai.',
'.iaTPJJNLLLKKSNSNLOLKTTSSRRJJOVai.',
'.iaGTJJMMLFJGGIFNNFJGGJGSSRGJTHai.',
'.iaWQJJNNNJJJJJJNNJJJJJJSSPJJRWai.',
'.UHGGGGFFFGGGGGGGGGGGGGGGGGFFGGHU.',
'iFEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDFm',
'lIFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFIh',
'.iimiimmmmmimlimmmmmmmmmmmimmmmmh.'],
};
const W=52,H=64,FY=H-3,TOP=FY-44;   // TOP = fila de la corona sin animar
// decodifica una vez: lista de columnas por fila
const DEC={};for(const k in ROWS)DEC[k]=ROWS[k].map(r=>[...r].map(ch=>ch==='.'?null:PAL[CH.indexOf(ch)]));
function art(dir,pose,fr){
 const R=DEC[dir==='u'?'u':dir==='d'?'d':'s'],h=R.length,w=R[0].length,fl=fr&1,s=[0,1,0,-1][fr&3];
 let dy=0,lA=0,lB=0;
 if(pose==='idle')dy=fl?1:0;
 else if(pose==='walk'){dy=fl?0:-1;lA=s>0?1:0;lB=s<0?1:0}
 else if(pose==='wind')dy=-1;
 else if(pose==='act'||pose==='rec'||pose==='hit'||pose==='stg')dy=1;
 const c=mkc(W,H),x=c.getContext('2d'),ox=(W-w)>>1,flip=dir!=='d'&&dir!=='u';   // el lado se dibujó mirando a la derecha; el juego espera izquierda
 for(let j=0;j<h;j++){
  for(let i=0;i<w;i++){
   const col=R[j][i];if(!col)continue;
   const half=i<(w>>1)?lA:lB,up=j>=h-2?half:0;          // al caminar, cada pie sube 1 px
   x.fillStyle=col;x.fillRect(ox+(flip?w-1-i:i),TOP+j+dy-up,1,1)}}
 return c}
const bb=bakeBody;
bakeBody=function(k,dir,pose,fr){if(k===KITS.rey)return art(dir,pose,fr);return bb.apply(this,arguments)};
// descarta sprites del Rey ya horneados antes de cargar este archivo
if(typeof ART!=='undefined')for(const k in ART)if(k.startsWith('brey')&&!k.startsWith('brey1')&&!k.startsWith('brey2'))delete ART[k];
})();
