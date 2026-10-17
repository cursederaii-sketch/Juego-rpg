// ===== CRIPTA AMPLIADA (mapa inicial): menos claustrofobia =====
// Carga DESPUÉS de cripta2.js y puzzles_v2.js. Sin mover ni una coordenada de lo ya existente:
//  - El mapa crece hacia el sur (44 -> 54 filas).
//  - Salón de inicio ~2.5x más grande, unido al pasillo, que ahora es una galería ancha.
//  - NAVE DE LOS CAÍDOS (nueva): gran salón con pilares al sur, con hoguera, botín y una segunda entrada a la sala de las tumbas (rodeo).
//  - Pasillo norte y sala de tumbas más anchos.
//  Los secretos (osario, guardián, cámara oculta) y la sala del puzzle siguen sellados: solo se vacían muros normales.
(function(){
const C=RG.find(r=>r.id==='cripta');if(!C)return;
C.rows=54;

Object.assign(NOTES,{
 cripta_nave:['Lápida en la Nave de los Caídos','«Aquí los pusieron en fila, de a cien, para que el rey los contara una sola vez.» Debajo, alguien rascó el número.'],
 cripta_nave2:['Estandarte hecho jirones','Un tercer regimiento que no llegó a marchar. Los jirones cuelgan todos hacia la salida, como si el viento hubiera soplado hacia afuera durante años.']
});
Object.assign(REGINFO,{cripta:['Despertar del jugador (salón amplio)','Nave de los Caídos · hoguera y botín','Jefe: Sepulturero','Osario secreto (grietas)','Puzzle de cirios','Vigía nocturna','Salida hacia Valdora']});

const b=C.build;
C.build=function(W){
 b.call(this,W);
 const sb=S.bk.sepulturero;
 // vaciar solo muros normales (respeta muros falsos y de juramento)
 const carve=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let k=x;k<x+w;k++){if(!W.ok(k,j))continue;const i=W.i(k,j);if(W.on[i]==='wall'&&!W.fw[i]&&!W.ow[i])W.on[i]=null}};
 carve(3,27,15,16);   // salón de inicio ampliado (hacia el oeste y el sur)
 carve(17,27,10,8);   // pasillo -> galería ancha
 carve(3,43,38,9);    // Nave de los Caídos
 carve(31,40,9,3);    // acceso de la nave a la sala de tumbas
 carve(32,15,7,8);    // pasillo norte ancho
 carve(27,22,16,2);   // sala de tumbas: un poco más alta

 // --- Nave de los Caídos ---
 for(const y of [45,49])for(const x of [8,14,20,26,32,38])W.o('pillar',x,y,1,1);
 [[5,44],[16,44],[27,44],[38,44],[5,50],[38,50]].forEach(([x,y])=>W.o('brazier',x,y,1,1));
 W.fire(21,47);
 W.o('tomb',20,43,1,1);W.note(20,43,'cripta_nave');
 W.o('cross',33,47,1,1);W.note(33,47,'cripta_nave2');
 W.item(6,48,{sou:300});W.item(37,48,{n:2});W.item(21,50,{sou:200});W.item(12,50,{n:1});
 if(!sb){W.en('hollow',14,47);W.en('hollow',28,48);W.en('soldier',35,46)}
 // --- decoración del salón y la galería nuevos ---
 [[5,29],[5,36],[15,36],[15,41],[24,29],[24,33]].forEach(([x,y])=>{if(!W.on[W.i(x,y)])W.o('pillar',x,y,1,1)});
 for(let x=4;x<=24;x+=4)W.torch(x,26);
 for(let x=19;x<=29;x+=5)W.torch(x,42);
 W.sc('rubble',8,3,36,15,7,{seed:12,gap:2});
 W.sc('tomb',5,3,43,38,9,{seed:13,gap:3});
 W.sc('urn',6,3,43,38,9,{seed:14,gap:3});
 W.sc('rubble',10,3,43,38,9,{seed:15,gap:2});
 W.sc('crate',3,3,43,38,9,{seed:16,gap:3});
};
})();
