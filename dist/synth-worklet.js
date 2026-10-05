const TAU=Math.PI*2;
// Jede Welle hat eine eigene Grundphase theta; Teilton n schwingt mit n·theta, so bleibt die Form exakt.
// Bei einer Umkonfiguration läuft theta derselben Welle weiter (keine Pegeleinbrüche oder Knackser beim
// Ziehen der Regler); alle älteren Fassungen übernehmen die neue Frequenz, überblendet werden nur Form und
// Amplitude. Neue oder wieder eingeschaltete Wellen starten in der Phase, die sie seit dem Start
// gehabt hätten; so stimmen Phasenbeziehungen zwischen Wellen mit der berechneten Ansicht überein.
// Mehrere Fassungen können gleichzeitig ausblenden; ihre Gewichte ergeben stets 1, auch wenn eine neue
// Umkonfiguration mitten in einer Überblendung eintrifft (sonst springt das Signal).
class AdditiveSynth extends AudioWorkletProcessor {
 constructor(){super();this.time=0;this.step=1/(sampleRate*.025);this.banks=[{waves:[],norm:1,gain:1}];this.port.onmessage=e=>{if(e.data?.type!=='configure')return;const old=this.banks[this.banks.length-1],next={norm:e.data.norm,gain:0,waves:e.data.waves.map(w=>{for(const bank of this.banks)for(const o of bank.waves)if(o.index===w.index)o.f=w.f;const before=old.waves.find(o=>o.index===w.index);return{index:w.index,f:w.f,parts:w.parts,theta:before?before.theta:TAU*(w.f*this.time/sampleRate%1)};})};this.banks.push(next);};}
 sample(bank){let value=0;for(const w of bank.waves){for(const q of w.parts)value+=q.a*Math.sin(q.n*w.theta+q.p);w.theta=(w.theta+TAU*w.f/sampleRate)%TAU;}return value*bank.norm;}
 process(inputs,outputs){const out=outputs[0][0];if(!out)return true;for(let i=0;i<out.length;i++){const banks=this.banks,cur=banks[banks.length-1];if(banks.length===1)out[i]=this.sample(cur);else{cur.gain=Math.min(1,cur.gain+this.step);let rest=0;for(let k=0;k<banks.length-1;k++)rest+=banks[k].gain;const scale=rest>0?(1-cur.gain)/rest:0;let value=0;for(let k=0;k<banks.length-1;k++){banks[k].gain*=scale;value+=banks[k].gain*this.sample(banks[k]);}out[i]=value+cur.gain*this.sample(cur);if(cur.gain>=1)this.banks=[cur];}this.time++;}return true;}
}
registerProcessor('additive-synth',AdditiveSynth);
