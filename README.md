# MySound

Bilingual educational sound laboratory in the My design system (MySound: scheme The Life Aquatic, accent Tiefsee, whale icon); all audio stays in the browser.

## Run locally

Requires Python 3 (for the local server only). No packages or build needed.

```sh
cd /Users/manuelbenz/MySound_Code
npm start
```

Open http://127.0.0.1:4173. AudioWorklet and microphone capture require HTTPS or localhost; opening index.html directly does not suffice.

## Interface

One mode: all tools are visible, fine settings (frequency/phase/solo table, FFT settings) are collapsible. Experiments reduce the view to the controls they need: two frequencies for beats, phases and A/B for the phase experiment, fundamental mute for the missing fundamental, partial count for square-wave synthesis, and spectrum comparison/spectrogram for vowels. The top bar holds three dropdowns: Experiments, Sound & sharing (save/load/share/export) and Settings; only one is open at a time. Partial bars show their level in dB relative to the strongest partial on hover/focus, matching the dB spectrum.

## Included

- Additive synthesizer with 9, 16 or 32 sine partials, sine/triangle/sawtooth/square presets, individual amplitude, phase, free/harmonic frequencies, mute and solo.
- Separate audio thread, 25 ms configuration crossfades, anti-clipping normalization, Nyquist exclusion and low initial volume.
- Time waveform, Blackman-windowed FFT (2048–32768), logarithmic/linear frequency axis, peak/cursor readout, adjustable smoothing, freeze, stored spectrum overlay, spectrogram.
- Microphone input without speaker monitoring, local audio-file decoding/playback/seek/loop.
- Five bilingual experiments: beats, square-wave synthesis, missing fundamental, phase, vowels. Predict/explore/explain stages.
- A/B sound comparison with a blind test (random A or B, charts hidden, score), saved sounds as a list with waveform preview and delete, hash-based sharing, 3-second PCM WAV export.
- Tap a peak in the spectrum to solo that partial (synthesizer); spectrogram export as PNG.
- On phones the playback bar is fixed at the bottom.
- Saved DE/EN preference, appearance (system/light/dark), colour scheme and accent tone, responsive layout, offline service worker and web app manifest.
- Optional browser WebMCP read/configure tools (never start sound or recording).

## Measurement conventions

FFT values use Web Audio's 1/N magnitude convention and Blackman window. This affects measured peak levels; values are digital relative levels, not calibrated SPL. The dashed theoretical lines show normalized relative amplitudes, not dBFS. Analysis taps the synthesizer before the output volume control. Partials at or above Nyquist are excluded. Waveform presets approximate ideal shapes with finite harmonics. Individual-wave overlays are offered in the stopped, calculated view, where phases can be shown consistently.

## Tests

```sh
npm test
```

Node's built-in test runner checks spectral peak position, normalization, presets, mute/solo, Nyquist exclusion, beats, shared-input bounds, PCM WAV output and worklet phase relationships.

## Source

`dist/` contains the editable, deployable source. `app.js` owns interface and Web Audio routing; `dsp.js` holds pure signal utilities; `synth-worklet.js` synthesizes audio; `i18n.js` contains both languages and experiments. No build process, analytics, external fonts or third-party runtime dependencies.

`dist/design/` is a copy from `~/MySuite` (tokens, schemes, icons, DESIGN.md). Never edit it here; change it in MySuite and run `~/MySuite/sync.sh sound`. `style.css` only maps app roles onto the tokens. Deviation: `app.js` picks `--akzent-ink` by contrast, because `my-schemen.css` fixes it per scheme (Zissou: dark ink for yellow) even when `data-ton` selects a dark tone.

The original Synthesizer.jar in the parent directory is preserved. Inspired by Martin Lieberherr's educational Synthesizer (2011); this is an independent implementation with no copied Java code.
