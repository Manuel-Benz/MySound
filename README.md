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

Stage layout: the waves sit in one row at the top (scrolls sideways, a list on phones), waveform and spectrum of their sum below, side by side and equally tall. Each wave card has a shape (sine/triangle/sawtooth/square), frequency (log slider snapping to 5 Hz, arrow keys ±5 Hz, number field takes any value such as 222 or 440.5), amplitude in 1 % steps with its dB level relative to the strongest wave, phase, mute and solo; non-sine waves can be split into their sine waves. Each wave carries its own tone of the chosen colour scheme on its card, as an individual wave in the waveform (shown by default while stopped) and on its theoretical lines in the spectrum; the sum stays in the accent colour, and the accent and comparison tones are never given to a wave. Experiments reduce the view to what they need. The top bar holds three dropdowns (Experiments, Sound & sharing, Settings; only one open at a time) and a Full screen button wherever the browser supports it (not on iPhone).

## Included

- Synthesizer of up to 16 superimposed waves; triangle, sawtooth and square are built from up to 25 sine partials (all waves together share a budget of 160 partials, so very many waves get fewer harmonics each). Older saved sounds and share links (fundamental plus partial bars) are converted to waves, keeping mute/solo; beyond 16 partials the strongest are kept and partials below 20 Hz are dropped.
- Separate audio thread, 25 ms configuration crossfades, anti-clipping normalization, Nyquist exclusion and low initial volume.
- Time waveform, Blackman-windowed FFT (2048–32768), logarithmic/linear frequency axis, peak/cursor readout, adjustable smoothing, freeze, stored spectrum overlay, spectrogram.
- Microphone input without speaker monitoring, local audio-file decoding/playback/seek/loop.
- Five bilingual experiments: beats, square-wave synthesis, missing fundamental, phase, vowels. Predict/explore/explain stages.
- A/B sound comparison with a blind test (random A or B, charts, A/B buttons and the sound menu hidden, score), saved sounds as a list with waveform preview and delete, hash-based sharing, 3-second PCM WAV export.
- Tap a peak in the spectrum to solo that wave (synthesizer); spectrogram export as PNG.
- On phones the playback bar is fixed at the bottom.
- Saved DE/EN preference, appearance (system/light/dark), colour scheme and accent tone, responsive layout, offline service worker and web app manifest.
- Optional browser WebMCP read/configure tools (never start sound or recording).

## Measurement conventions

FFT values use Web Audio's 1/N magnitude convention and Blackman window. This affects measured peak levels; values are digital relative levels, not calibrated SPL. The dashed theoretical lines show normalized relative amplitudes, not dBFS. Analysis taps the synthesizer before the output volume control. Partials at or above Nyquist are excluded. Waveform presets approximate ideal shapes with finite harmonics. Individual-wave overlays are offered in the stopped, calculated view, where phases can be shown consistently.

## Tests

```sh
npm test
```

Node's built-in test runner checks spectral peak position, wave shapes and normalization, mute/solo, Nyquist exclusion, beats, wave phase as time shift, shared-input bounds and defaults, conversion of older sounds, the dB rule, PCM WAV output, worklet phases and continuity (including waves switched back on), matching DE/EN message tables, and two regressions (blind-test CSS, old service-worker caches). The Pages workflow runs the tests before every deploy.

## Source

`dist/` contains the editable, deployable source. `app.js` owns interface and Web Audio routing; `dsp.js` holds pure signal utilities; `synth-worklet.js` synthesizes audio; `i18n.js` contains both languages and experiments. No build process, analytics, external fonts or third-party runtime dependencies.

`dist/design/` is a copy from `~/MySuite` (tokens, schemes, icons, DESIGN.md). Never edit it here; change it in MySuite and run `~/MySuite/sync.sh sound`. `style.css` only maps app roles onto the tokens. Deviation: `app.js` picks `--akzent-ink` by contrast, because `my-schemen.css` fixes it per scheme (Zissou: dark ink for yellow) even when `data-ton` selects a dark tone.

The original Synthesizer.jar in the parent directory is preserved. Inspired by Martin Lieberherr's educational Synthesizer (2011); this is an independent implementation with no copied Java code.
