// ===== MAPA DEL REINO: la Capital ahora mide 120x96, así que las regiones de abajo bajan para no solaparse =====
// Carga DESPUÉS de todos los LAY (campos, castillo, jorge...). MH sube de 1900 a 2010 en sistemas.js.
(function(){const DY=96;LAY.valdora=[254,230];
 for(const k of Object.keys(LAY)){if(k==='valdora')continue;const l=LAY[k];if(l&&l[1]>=534)l[1]+=DY}})();

// ===== MAPA DEL REINO: el Bosque Marchito ahora mide 96x72 (384x288 en el mapa) =====
// El Valle Sereno se corre a la derecha del bosque, el Foso del Rebaño queda debajo del Valle y todo lo
// que está desde las Puertas de la Capital hacia abajo baja DY para no solaparse. MH sube de 2010 a 2158.
(function(){const DY=148;
 for(const k of Object.keys(LAY)){const l=LAY[k];if(l&&l[1]>=822)l[1]+=DY}
 LAY.bosque=[4,630];LAY.valle=[396,630];LAY.fosa=[396,814]})();
