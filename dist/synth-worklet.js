class AdditiveSynth extends AudioWorkletProcessor {
 constructor(){super();this.current={partials:[],norm:1,phases:[]};this.previous=null;this.fade=1;this.port.onmessage=e=>{if(e.data?.type==='configure'){const parts=e.data.partials;this.previous=this.current;this.current={partials:parts,norm:e.data.norm,phases:parts.map(()=>0)};this.fade=0;}};}
 sample(bank){let value=0;for(let j=0;j<bank.partials.length;j++){const p=bank.partials[j];if(p.f<sampleRate/2)value+=p.a*Math.sin(bank.phases[j]+p.p);bank.phases[j]=(bank.phases[j]+Math.PI*2*p.f/sampleRate)%(Math.PI*2);}return value*bank.norm;}
 process(inputs,outputs){const out=outputs[0][0];if(!out)return true;for(let i=0;i<out.length;i++){const value=this.sample(this.current);if(this.previous&&this.fade<1){const old=this.sample(this.previous);out[i]=old*(1-this.fade)+value*this.fade;this.fade=Math.min(1,this.fade+1/(sampleRate*.025));}else{this.previous=null;out[i]=value;}}return true;}
}
registerProcessor('additive-synth',AdditiveSynth);
