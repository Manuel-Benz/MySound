const TAU=Math.PI*2;
// Phasen laufen über Umkonfigurationen weiter; sonst überblendet jede Änderung zwei gegeneinander verschobene
// Schwingungen (Pegeleinbrüche und Knackser beim Ziehen der Regler). Harmonische Klänge teilen eine Grundphase
// theta (Teilton n schwingt mit n·theta), damit die vorgegebenen Phasenbeziehungen auch dabei exakt bleiben.
class AdditiveSynth extends AudioWorkletProcessor {
 constructor(){super();this.current=this.bank([],1,0);this.previous=null;this.fade=1;this.port.onmessage=e=>{if(e.data?.type==='configure'){const old=this.current,next=this.bank(e.data.partials,e.data.norm,e.data.fundamental);if(next.f0)next.theta=old.f0?old.theta:old.phases[0]??0;else next.phases=next.partials.map((_,j)=>old.f0?(old.n[j]??0)*old.theta%TAU:old.phases[j]??0);this.previous=old;this.current=next;this.fade=0;}};}
 bank(partials,norm,fundamental){const f0=fundamental>0?fundamental:0;return{partials,norm,f0,theta:0,n:partials.map(p=>f0?Math.round(p.f/f0):0),phases:partials.map(()=>0)};}
 sample(bank){let value=0;if(bank.f0){for(let j=0;j<bank.partials.length;j++){const p=bank.partials[j];value+=p.a*Math.sin(bank.n[j]*bank.theta+p.p);}bank.theta=(bank.theta+TAU*bank.f0/sampleRate)%TAU;}else for(let j=0;j<bank.partials.length;j++){const p=bank.partials[j];if(p.f<sampleRate/2)value+=p.a*Math.sin(bank.phases[j]+p.p);bank.phases[j]=(bank.phases[j]+TAU*p.f/sampleRate)%TAU;}return value*bank.norm;}
 process(inputs,outputs){const out=outputs[0][0];if(!out)return true;for(let i=0;i<out.length;i++){const value=this.sample(this.current);if(this.previous&&this.fade<1){const old=this.sample(this.previous);out[i]=old*(1-this.fade)+value*this.fade;this.fade=Math.min(1,this.fade+1/(sampleRate*.025));}else{this.previous=null;out[i]=value;}}return true;}
}
registerProcessor('additive-synth',AdditiveSynth);
