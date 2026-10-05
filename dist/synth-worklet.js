const TAU=Math.PI*2;
// Jede Welle hat eine eigene Grundphase theta; Teilton n schwingt mit n·theta, so bleibt die Form exakt.
// Bei einer Umkonfiguration läuft theta derselben Welle weiter (keine Pegeleinbrüche oder Knackser beim
// Ziehen der Regler); die ausblendende Fassung übernimmt die neue Frequenz, überblendet werden nur Form und
// Amplitude. Neue oder wieder eingeschaltete Wellen starten in der Phase, die sie seit dem Start
// gehabt hätten; so stimmen Phasenbeziehungen zwischen Wellen mit der berechneten Ansicht überein.
class AdditiveSynth extends AudioWorkletProcessor {
 constructor(){super();this.time=0;this.current={waves:[],norm:1};this.previous=null;this.fade=1;this.port.onmessage=e=>{if(e.data?.type!=='configure')return;const old=this.current,next={norm:e.data.norm,waves:e.data.waves.map(w=>{const before=old.waves.find(o=>o.index===w.index);if(before)before.f=w.f;return{index:w.index,f:w.f,parts:w.parts,theta:before?before.theta:TAU*(w.f*this.time/sampleRate%1)};})};this.previous=old;this.current=next;this.fade=0;};}
 sample(bank){let value=0;for(const w of bank.waves){for(const q of w.parts)value+=q.a*Math.sin(q.n*w.theta+q.p);w.theta=(w.theta+TAU*w.f/sampleRate)%TAU;}return value*bank.norm;}
 process(inputs,outputs){const out=outputs[0][0];if(!out)return true;for(let i=0;i<out.length;i++){const value=this.sample(this.current);if(this.previous&&this.fade<1){const old=this.sample(this.previous);out[i]=old*(1-this.fade)+value*this.fade;this.fade=Math.min(1,this.fade+1/(sampleRate*.025));}else{this.previous=null;out[i]=value;}this.time++;}return true;}
}
registerProcessor('additive-synth',AdditiveSynth);
