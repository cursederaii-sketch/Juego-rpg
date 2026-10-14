// ===== EL REY SIN ARMA desde la fase III =====
// Fase I (ph 0): espadón como siempre. Fase III y IV (ph 1 y 2): pelea sin arma.
// Solo se deja de DIBUJAR la espada del Rey (greatsword con el brillo dorado de WK.rey), también en la cinemática de caida.js.
// Ataques, alcance, daño y hitboxes no cambian: salen de los datos del jefe, no del dibujo.
(function(){
if(typeof weapon==='undefined'||typeof WK==='undefined'||!WK.rey||typeof E==='undefined')return;
const GL=WK.rey[2];
const w0=weapon;
weapon=function(k,ox,oy,a,len,o){
 if(k==='greatsword'&&o&&o.glow===GL){
  let e=null;try{e=E.find(q=>q.id==='rey'&&q.b)}catch(er){}
  if(e&&(e.ph|0)>=1)return}
 return w0.apply(this,arguments)};
})();
