// // src/components/VideoOCR.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { createWorker } from 'tesseract.js';

// export default function VideoOCR({
//   videoConstraints = { video: true, audio: false },
//   lang = 'eng',
//   workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
//   corePath   = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core-simd-lstm.wasm.js',
//   langPath   = 'https://tessdata.projectnaptha.com/4.0.0',
//   whitelist  = '',
//   sampleMs   = 700,
//   downscale  = 0.6,
//   onText,
//   onWord,
//   onChars,
// }) {
//   const videoRef   = useRef(null);
//   const overlayRef = useRef(null);
//   const workerRef  = useRef(null);
//   const [busy, setBusy] = useState(true);

//   useEffect(() => {
//     let stop = false, raf = 0, last = 0;
//     // console.log("BUSSSY1", busy)
//     (async () => {
//       // 1) Worker from CDN, versions match local installs
//       console.log("BUSSSY1", busy)

//       // const worker = await createWorker({ workerPath, corePath, langPath });
//       // const worker = await createWorker(); 
//       const worker = await createWorker({
//         workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
//         corePath:   'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core-simd.wasm.js',
//         langPath:   'https://tessdata.projectnaptha.com/4.0.0'
//         // logger: m => console.log(m) // see progress/errors
//       });

//       workerRef.current = worker;
//       console.log("BUSSSY2", busy)

//       await worker.loadLanguage(lang);
//       console.log("BUSSSY3", busy)

//       await worker.initialize(lang);
//       console.log("BUSSSY4", busy)

//       await worker.setParameters({
//         tessedit_char_whitelist: whitelist,
//         preserve_interword_spaces: '1',
//         user_defined_dpi: '96',
//         tessedit_pageseg_mode: '6',
//       });

//       // 2) Start camera
//       const video = videoRef.current;
//       const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
//       video.srcObject = stream;
//       await video.play();

//       // ✅ Wait once for natural dimensions
//       if (!video.videoWidth || !video.videoHeight) {
//         await new Promise(res => {
//           const onMeta = () => { video.removeEventListener('loadedmetadata', onMeta); res(); };
//           video.addEventListener('loadedmetadata', onMeta);
//         });
//       }

//       // 3) Canvases
//       const displayW = video.videoWidth  || 640;
//       const displayH = video.videoHeight || 480;
//       const overlay  = overlayRef.current;
//       overlay.width  = displayW;
//       overlay.height = displayH;

//       const capW = Math.max(1, Math.round(displayW * downscale));
//       const capH = Math.max(1, Math.round(displayH * downscale));
//       const grab = document.createElement('canvas');
//       grab.width  = capW;
//       grab.height = capH;

//       setBusy(false);


//       // 4) Loop
//       const loop = async (t) => {
//         if (stop) return;
//         raf = requestAnimationFrame(loop);

//         if (!last || t - last >= sampleMs) {
//           last = t;
//           try {
//             const gctx = grab.getContext('2d');
//             gctx.drawImage(video, 0, 0, capW, capH);

//             const { data } = await worker.recognize(grab);

//             const text = (data.text || '');
//             onText && onText(text.trim());

//             // best word
//             let bestWord = '', bestConf = -Infinity;
//             for (const w of data.words || []) {
//               const txt = (w.text || '').trim();
//               if (txt && w.confidence > bestConf) { bestConf = w.confidence; bestWord = txt; }
//             }
//             onWord && onWord(bestWord);

//             // all chars
//             const rawChars = text.replace(/\s+/g, '').split('');
//             const charFilter = whitelist ? new RegExp(`^[${whitelist}]$`) : null;
//             const chars = charFilter ? rawChars.filter(c => charFilter.test(c)) : rawChars;
//             onChars && onChars(chars);

//             // draw boxes
//             const ctx = overlay.getContext('2d');
//             ctx.clearRect(0, 0, displayW, displayH);
//             ctx.strokeStyle = 'rgba(0,200,255,0.9)';
//             ctx.lineWidth = 2;
//             ctx.font = '14px system-ui, sans-serif';
//             ctx.fillStyle = 'rgba(0,0,0,0.6)';

//             const sx = displayW / capW, sy = displayH / capH;
//             for (const w of data.words || []) {
//               const b = w.bbox || {};
//               if (b.x0 == null) continue;
//               const rx = b.x0 * sx, ry = b.y0 * sy;
//               const rw = (b.x1 - b.x0) * sx, rh = (b.y1 - b.y0) * sy;
//               ctx.strokeRect(rx, ry, rw, rh);

//               const label = (w.text || '').trim();
//               if (label) {
//                 const pad = 2, tw = ctx.measureText(label).width, th = 16;
//                 ctx.fillRect(rx, Math.max(0, ry - th), tw + pad * 2, th);
//                 ctx.fillStyle = 'white';
//                 ctx.fillText(label, rx + pad, Math.max(12, ry - 4));
//                 ctx.fillStyle = 'rgba(0,0,0,0.6)';
//               }
//             }
//           } catch {
//             // keep loop alive on per-iteration errors
//           }
//         }
//       };
//       raf = requestAnimationFrame(loop);
//     })().catch(console.error);

//     return () => {
//       stop = true;
//       if (raf) cancelAnimationFrame(raf);
//       const v = videoRef.current;
//       if (v?.srcObject) {
//         v.srcObject.getTracks().forEach(t => t.stop());
//         v.srcObject = null;
//       }
//       workerRef.current?.terminate?.();
//     };
//   }, [videoConstraints, lang, whitelist, sampleMs, downscale, workerPath, corePath, langPath, onText, onWord, onChars]);

//   return (
//     <div className="relative w-full max-w-3xl mx-auto">
//       <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
//         <video ref={videoRef} className="absolute inset-0 w-full h-full" autoPlay muted playsInline />
//         <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
//         {busy && <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">Loading OCR…</div>}
//       </div>
//     </div>
//   );
// }


// // src/components/VideoOCR.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { createWorker, OEM } from 'tesseract.js';

// export default function VideoOCR({
//   videoConstraints = { video: true, audio: false },
//   lang = 'eng',
//   workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
//   corePath   = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core-simd.wasm.js',
//   langPath   = 'https://tessdata.projectnaptha.com/4.0.0',
//   whitelist  = '',
//   sampleMs   = 700,
//   downscale  = 0.6,
//   onText,
//   onWord,
//   onChars,
// }) {
//   const videoRef    = useRef(null);
//   const overlayRef  = useRef(null);
//   const workerRef   = useRef(null);
//   const inFlightRef = useRef(false);
//   const [busy, setBusy] = useState(true);

//   useEffect(() => {
//     let stop = false, raf = 0, last = 0;

//     (async () => {
//       // IMPORTANT: use positional args: (lang, oem, options)
//       const worker = await createWorker(
//         lang,
//         OEM.LSTM_ONLY,
//         {
//           workerPath,
//           corePath,
//           langPath,
//           // logger: m => console.log(m),
//         }
//       );
//       workerRef.current = worker;

//       // NOTE: in this version, loadLanguage/initialize are deprecated no-ops.
//       // The worker is already loaded/initialized by createWorker internally.

//       // Start camera
//       const video = videoRef.current;
//       const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
//       video.srcObject = stream;
//       await video.play();

//       if (!video.videoWidth || !video.videoHeight) {
//         await new Promise(res => {
//           const onMeta = () => { video.removeEventListener('loadedmetadata', onMeta); res(); };
//           video.addEventListener('loadedmetadata', onMeta);
//         });
//       }

//       // Canvases
//       const displayW = video.videoWidth  || 640;
//       const displayH = video.videoHeight || 480;
//       const overlay  = overlayRef.current;
//       overlay.width  = displayW;
//       overlay.height = displayH;

//       const capW = Math.max(1, Math.round(displayW * downscale));
//       const capH = Math.max(1, Math.round(displayH * downscale));
//       const grab = document.createElement('canvas');
//       grab.width  = capW;
//       grab.height = capH;

//       // Parameters
//       const params = {
//         preserve_interword_spaces: '1',
//         user_defined_dpi: '96',
//         tessedit_pageseg_mode: '6',
//       };
//       if (whitelist) params.tessedit_char_whitelist = whitelist;
//       await worker.setParameters(params);

//       setBusy(false);

//       // Loop
//       const loop = async (t) => {
//         if (stop) return;
//         raf = requestAnimationFrame(loop);

//         if (!last || t - last >= sampleMs) {
//           last = t;

//           if (inFlightRef.current) return;
//           inFlightRef.current = true;

//           try {
//             const gctx = grab.getContext('2d', { willReadFrequently: true });
//             gctx.imageSmoothingEnabled = false;
//             gctx.drawImage(video, 0, 0, capW, capH);

//             const { data } = await worker.recognize(grab);

//             const text = (data?.text || '').trim();
//             onText && onText(text);

//             const words = Array.isArray(data?.words) ? data.words : [];
//             // best word
//             let bestWord = '', bestConf = -Infinity;
//             for (const w of words) {
//               const txt = (w.text || '').trim();
//               if (txt && (w.confidence ?? -Infinity) > bestConf) {
//                 bestConf = w.confidence; bestWord = txt;
//               }
//             }
//             onWord && onWord(bestWord);

//             // chars
//             const rawChars = text.replace(/\s+/g, '').split('');
//             const charFilter = whitelist ? new RegExp(`^[${whitelist}]$`) : null;
//             const chars = charFilter ? rawChars.filter(c => charFilter.test(c)) : rawChars;
//             onChars && onChars(chars);

//             // draw boxes
//             const ctx = overlay.getContext('2d');
//             ctx.clearRect(0, 0, displayW, displayH);
//             ctx.strokeStyle = 'rgba(0,200,255,0.9)';
//             ctx.lineWidth = 2;
//             ctx.font = '14px system-ui, sans-serif';
//             ctx.fillStyle = 'rgba(0,0,0,0.6)';

//             const sx = displayW / capW, sy = displayH / capH;
//             for (const w of words) {
//               const b = w.bbox || {};
//               if (b.x0 == null) continue;
//               const rx = b.x0 * sx, ry = b.y0 * sy;
//               const rw = (b.x1 - b.x0) * sx, rh = (b.y1 - b.y0) * sy;
//               ctx.strokeRect(rx, ry, rw, rh);

//               const label = (w.text || '').trim();
//               if (label) {
//                 const pad = 2, tw = ctx.measureText(label).width, th = 16;
//                 ctx.fillRect(rx, Math.max(0, ry - th), tw + pad * 2, th);
//                 ctx.fillStyle = 'white';
//                 ctx.fillText(label, rx + pad, Math.max(12, ry - 4));
//                 ctx.fillStyle = 'rgba(0,0,0,0.6)';
//               }
//             }
//           } catch (e) {
//             console.error('recognize failed:', e);
//           } finally {
//             inFlightRef.current = false;
//           }
//         }
//       };

//       raf = requestAnimationFrame(loop);
//     })().catch(console.error);

//     return () => {
//       stop = true;
//       if (raf) cancelAnimationFrame(raf);
//       const v = videoRef.current;
//       if (v?.srcObject) {
//         v.srcObject.getTracks().forEach(t => t.stop());
//         v.srcObject = null;
//       }
//       workerRef.current?.terminate?.();
//     };
//   }, [
//     JSON.stringify(videoConstraints), // stabilize object dep
//     lang, whitelist, sampleMs, downscale,
//     workerPath, corePath, langPath,
//     onText, onWord, onChars
//   ]);

//   return (
//     <div className="relative w-full max-w-3xl mx-auto">
//       <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
//         <video ref={videoRef} className="absolute inset-0 w-full h-full" autoPlay muted playsInline />
//         <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
//         {busy && (
//           <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
//             Loading OCR…
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// // src/components/VideoOCR.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { createWorker, OEM } from 'tesseract.js';

// export default function VideoOCR({
//   videoConstraints = { video: true, audio: false },
//   lang        = 'eng',
//   workerPath  = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
//   corePath    = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core-simd.wasm.js',
//   langPath    = 'https://tessdata.projectnaptha.com/4.0.0',

//   // OCR tuning
//   whitelist   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
//   psm         = '6',        // small block (more robust than 7 for tiny text)
//   confFloor   = 50,

//   // Capture loop
//   sampleMs    = 900,
//   downscale   = 1.0,
//   scaleUp     = 2.0,        // base multiplier; we adapt from here
//   minWorkW    = 560,        // target min width (adaptive scale ensures ROI >= this)
//   threshold   = 140,
//   dilateIters = 1,

//   // NEW: Region Of Interest (percentages of frame) — default is a center band
//   roi         = { x: 0.1, y: 0.35, w: 0.8, h: 0.30 },

//   onText,
//   onWord,
//   onChars,
// }) {
//   const videoRef    = useRef(null);
//   const overlayRef  = useRef(null);
//   const workerRef   = useRef(null);
//   const inFlightRef = useRef(false);
//   const streamRef   = useRef(null);
//   const [busy, setBusy] = useState(true);

//   // stable callbacks
//   const cbRef = useRef({ onText, onWord, onChars });
//   useEffect(() => { cbRef.current = { onText, onWord, onChars }; }, [onText, onWord, onChars]);

//   const waitFor = (el, event) =>
//     new Promise(res => el.addEventListener(event, function h(e){ el.removeEventListener(event, h); res(e); }));

//   // ---- preprocessing helpers ----
//   const preprocessGrayInPlace = (canvas) => {
//     const ctx = canvas.getContext('2d', { willReadFrequently: true });
//     const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const d = img.data;
//     for (let i = 0; i < d.length; i += 4) {
//       const y = (d[i]*0.2126 + d[i+1]*0.7152 + d[i+2]*0.0722) | 0;
//       d[i] = d[i+1] = d[i+2] = y;
//       d[i+3] = 255;
//     }
//     ctx.putImageData(img, 0, 0);
//     ctx.imageSmoothingEnabled = false;
//   };

//   const preprocessBWInPlace = (canvas, thr = 140, iters = 1) => {
//     const w = canvas.width, h = canvas.height;
//     const ctx = canvas.getContext('2d', { willReadFrequently: true });
//     let img = ctx.getImageData(0, 0, w, h);
//     const d = img.data;

//     // grayscale + min/max
//     let min = 255, max = 0;
//     for (let i = 0; i < d.length; i += 4) {
//       const y = (d[i]*0.2126 + d[i+1]*0.7152 + d[i+2]*0.0722) | 0;
//       if (y < min) min = y;
//       if (y > max) max = y;
//       d[i] = d[i+1] = d[i+2] = y;
//     }
//     const range = Math.max(1, max - min);

//     // normalize contrast
//     for (let i = 0; i < d.length; i += 4) {
//       const y = ((d[i] - min) * 255 / range) | 0;
//       d[i] = d[i+1] = d[i+2] = y;
//     }

//     // threshold to black text (0) / white bg (255)
//     for (let i = 0; i < d.length; i += 4) {
//       const v = d[i] < thr ? 0 : 255;
//       d[i] = d[i+1] = d[i+2] = v;
//       d[i+3] = 255;
//     }

//     // tiny 3x3 dilation to thicken strokes
//     const dilateOnce = () => {
//       const src = img.data;
//       const out = new Uint8ClampedArray(src);
//       for (let y = 1; y < h - 1; y++) {
//         for (let x = 1; x < w - 1; x++) {
//           const i = (y * w + x) * 4;
//           if (src[i] === 0) continue;
//           let blackNeighbor = false;
//           for (let dy = -1; dy <= 1 && !blackNeighbor; dy++) {
//             for (let dx = -1; dx <= 1; dx++) {
//               const j = ((y + dy) * w + (x + dx)) * 4;
//               if (src[j] === 0) { blackNeighbor = true; break; }
//             }
//           }
//           if (blackNeighbor) out[i] = out[i+1] = out[i+2] = 0;
//         }
//       }
//       img = new ImageData(out, w, h);
//     };
//     for (let k = 0; k < iters; k++) dilateOnce();

//     ctx.putImageData(img, 0, 0);
//     ctx.imageSmoothingEnabled = false;
//   };

//   useEffect(() => {
//     let stop = false, raf = 0, last = 0;

//     (async () => {
//       // Worker
//       const worker = await createWorker(
//         lang,
//         OEM.LSTM_ONLY,
//         { workerPath, corePath, langPath }
//       );
//       workerRef.current = worker;

//       // Camera (race-free play)
//       const video = videoRef.current;
//       video.muted = true;
//       video.setAttribute('playsinline', 'true');

//       if (!streamRef.current) {
//         const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
//         streamRef.current = stream;
//         video.srcObject = stream;
//       } else if (video.srcObject !== streamRef.current) {
//         video.srcObject = streamRef.current;
//       }
//       if (!video.videoWidth || !video.videoHeight) await waitFor(video, 'loadedmetadata');
//       if (video.readyState < 2) await waitFor(video, 'canplay');
//       const isPlaying = !video.paused && !video.ended && video.readyState >= 2;
//       if (!isPlaying) { try { await video.play(); } catch (e) {} }

//       // Canvases
//       const displayW = video.videoWidth  || 640;
//       const displayH = video.videoHeight || 480;
//       const overlay  = overlayRef.current;
//       overlay.width  = displayW;
//       overlay.height = displayH;

//       const capW = Math.max(1, Math.round(displayW * downscale));
//       const capH = Math.max(1, Math.round(displayH * downscale));

//       const grab = document.createElement('canvas'); // full frame (downscaled)
//       grab.width = capW; grab.height = capH;

//       // ROI scratch
//       const roiCanvas = document.createElement('canvas');
//       const work = document.createElement('canvas'); // what goes to OCR

//       // OCR parameters
//       const params = {
//         preserve_interword_spaces: '1',
//         tessedit_pageseg_mode: psm,
//         user_defined_dpi: '150', // neutral; we’ll upscale pixels explicitly
//       };
//       if (whitelist) params.tessedit_char_whitelist = whitelist;
//       await worker.setParameters(params);

//       setBusy(false);

//       const loop = async (t) => {
//         if (stop) return;
//         raf = requestAnimationFrame(loop);
//         if (!last || t - last >= sampleMs) {
//           last = t;
//           if (inFlightRef.current) return;
//           inFlightRef.current = true;

//           try {
//             // 1) draw full frame
//             const gctx = grab.getContext('2d', { willReadFrequently: true });
//             gctx.imageSmoothingEnabled = false;
//             gctx.drawImage(video, 0, 0, capW, capH);

//             // 2) crop ROI from grab
//             const rx = Math.round(roi.x * capW);
//             const ry = Math.round(roi.y * capH);
//             const rw = Math.max(1, Math.round(roi.w * capW));
//             const rh = Math.max(1, Math.round(roi.h * capH));

//             roiCanvas.width = rw; roiCanvas.height = rh;
//             const rctx = roiCanvas.getContext('2d', { willReadFrequently: true });
//             rctx.imageSmoothingEnabled = false;
//             rctx.clearRect(0, 0, rw, rh);
//             rctx.drawImage(grab, rx, ry, rw, rh, 0, 0, rw, rh);

//             // 3) compute adaptive scale so ROI width >= minWorkW
//             const needed = Math.max(scaleUp, minWorkW / rw);
//             const wW = Math.max( Math.round(rw * needed),  64);
//             const wH = Math.max( Math.round(rh * needed),  64);

//             if (work.width !== wW || work.height !== wH) {
//               work.width = wW; work.height = wH;
//             }

//             const wctx = work.getContext('2d', { willReadFrequently: true });
//             wctx.imageSmoothingEnabled = false;
//             wctx.clearRect(0, 0, wW, wH);
//             wctx.drawImage(roiCanvas, 0, 0, wW, wH);

//             // 4) preprocess (binarize+dilate) then OCR, with fallback+retry on pix errors
//             let data, words = [], text = '', avgConf = 0;

//             const tryRecognize = async (mode /* 'bw'|'gray' */, scaleBump=1) => {
//               if (scaleBump !== 1) {
//                 const newW = Math.floor(wW * scaleBump);
//                 const newH = Math.floor(wH * scaleBump);
//                 const tmp = document.createElement('canvas');
//                 tmp.width = newW; tmp.height = newH;
//                 const tctx = tmp.getContext('2d', { willReadFrequently: true });
//                 tctx.imageSmoothingEnabled = false;
//                 tctx.drawImage(work, 0, 0, newW, newH);
//                 // swap into work for this attempt
//                 work.width = newW; work.height = newH;
//                 wctx.clearRect(0,0,newW,newH);
//                 wctx.drawImage(tmp, 0, 0);
//               }

//               if (mode === 'bw') preprocessBWInPlace(work, threshold, dilateIters);
//               else preprocessGrayInPlace(work);

//               const res = await worker.recognize(work);
//               return res.data;
//             };

//             const isPixErr = (e) => {
//               const msg = (e && (e.message || e.toString())) || '';
//               return /pix|ImageData|scale/i.test(msg);
//             };

//             try {
//               data = await tryRecognize('bw');
//             } catch (e1) {
//               // If Leptonica/pix error, bump scale and soften
//               if (isPixErr(e1)) {
//                 try {
//                   data = await tryRecognize('gray', 1.5);
//                 } catch (e2) {
//                   if (isPixErr(e2)) {
//                     data = await tryRecognize('gray', 2.0); // last resort
//                   } else {
//                     throw e2;
//                   }
//                 }
//               } else {
//                 // non-pix error: fallback once to gray
//                 data = await tryRecognize('gray');
//               }
//             }

//             text  = (data?.text || '').trim();
//             words = Array.isArray(data?.words) ? data.words : [];
//             avgConf = words.length
//               ? words.reduce((s, w) => s + (w.confidence || 0), 0) / words.length
//               : 0;

//             if (text && avgConf >= confFloor) {
//               cbRef.current.onText && cbRef.current.onText(text);
//               let bestWord = '', bestC = -Infinity;
//               for (const w of words) {
//                 const txt = (w.text || '').trim();
//                 if (txt && (w.confidence ?? -Infinity) > bestC) {
//                   bestC = w.confidence; bestWord = txt;
//                 }
//               }
//               cbRef.current.onWord && cbRef.current.onWord(bestWord);
//               const rawChars = text.replace(/\s+/g, '').split('');
//               const charFilter = whitelist ? new RegExp(`^[${whitelist}]$`) : null;
//               const chars = charFilter ? rawChars.filter(c => charFilter.test(c)) : rawChars;
//               cbRef.current.onChars && cbRef.current.onChars(chars);
//             }

//             // 5) overlay (map work-space bboxes back to display via ROI)
//             const ctx = overlay.getContext('2d');
//             ctx.clearRect(0, 0, displayW, displayH);
//             ctx.strokeStyle = 'rgba(0,200,255,0.9)';
//             ctx.lineWidth = 2;
//             ctx.font = '14px system-ui, sans-serif';
//             ctx.fillStyle = 'rgba(0,0,0,0.6)';

//             // ROI → display mapping
//             const sx = (roi.w * displayW) / work.width;
//             const sy = (roi.h * displayH) / work.height;
//             const dx = roi.x * displayW;
//             const dy = roi.y * displayH;

//             for (const w of words) {
//               const b = w?.bbox || {};
//               if (b.x0 == null) continue;
//               const rx = dx + b.x0 * sx, ry = dy + b.y0 * sy;
//               const rw2 = (b.x1 - b.x0) * sx, rh2 = (b.y1 - b.y0) * sy;
//               ctx.strokeRect(rx, ry, rw2, rh2);

//               const label = (w.text || '').trim();
//               if (label) {
//                 const pad = 2, tw = ctx.measureText(label).width, th = 16;
//                 ctx.fillRect(rx, Math.max(0, ry - th), tw + pad * 2, th);
//                 ctx.fillStyle = 'white';
//                 ctx.fillText(label, rx + pad, Math.max(12, ry - 4));
//                 ctx.fillStyle = 'rgba(0,0,0,0.6)';
//               }
//             }

//             // Optional: visualize ROI rectangle
//             // ctx.strokeStyle = 'rgba(255,255,0,0.6)';
//             // ctx.strokeRect(roi.x*displayW, roi.y*displayH, roi.w*displayW, roi.h*displayH);
//           } finally {
//             inFlightRef.current = false;
//           }
//         }
//       };

//       raf = requestAnimationFrame(loop);
//     })().catch(console.error);

//     return () => {
//       stop = true;
//       if (raf) cancelAnimationFrame(raf);
//       const v = videoRef.current;
//       if (v) v.srcObject = null;
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(t => t.stop());
//         streamRef.current = null;
//       }
//       workerRef.current?.terminate?.();
//     };
//   }, [
//     JSON.stringify(videoConstraints),
//     lang, whitelist, psm, confFloor,
//     sampleMs, downscale, scaleUp, minWorkW, threshold, dilateIters,
//     roi.x, roi.y, roi.w, roi.h,
//     workerPath, corePath, langPath
//   ]);

//   return (
//     <div className="relative w-full max-w-3xl mx-auto">
//       <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
//         <video ref={videoRef} className="absolute inset-0 w-full h-full" autoPlay muted playsInline />
//         <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
//         {busy && (
//           <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
//             Loading OCR…
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// src/components/VideoOCR.jsx
import React, { useEffect, useRef, useState } from 'react';
import { createWorker, OEM } from 'tesseract.js';

export default function VideoOCR({
  // Camera
  videoConstraints = { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }, audio: false },

  // OCR config
  lang = 'eng',
  whitelist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
  numericOnly = false,     // if true, tight whitelist + numeric mode
  charConfFloor = 35,        // (kept) display-only threshold
  confFloor = 45,        // (kept) avg confidence info

  // NEW: decoding hints (defaults are safe)
  expectedMask = '',        // e.g., 'AAA-000', 'AA0000', '0000-0000', '' = none
  beamWidth = 4,         // how many alternatives to consider per position
  raiseCharFloor = 60,        // stricter floor for symbol choices

  // PSM passes
  psmCandidates = ['7', '13', '6'], // single-line, raw line, block (you can swap to ['6','4','11','7'] if you liked that set)

  // Capture & scaling
  sampleMs = 800,
  downscale = 1.0,
  minWorkW = 1400,
  minWorkH = 220,
  maxRetries = 3,

  // ROI (fraction of frame)
  roi = { x: 0.08, y: 0.35, w: 0.84, h: 0.30 },
  showRoiBox = true,

  // Tesseract assets
  workerPath = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
  corePath = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core-simd-lstm.wasm.js', // LSTM build
  langPath = 'https://tessdata.projectnaptha.com/4.0.0',

  // Optional callbacks
  onText,
  onWord,
  onChars,
}) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const workerRef = useRef(null);
  const streamRef = useRef(null);
  const inFlightRef = useRef(false);

  const [busy, setBusy] = useState(true);
  const [outRaw, setOutRaw] = useState('');
  const [outFiltered, setOutFiltered] = useState('');
  const [outBest, setOutBest] = useState('');

  const cbRef = useRef({ onText, onWord, onChars });
  useEffect(() => { cbRef.current = { onText, onWord, onChars }; }, [onText, onWord, onChars]);

  const waitFor = (el, event) =>
    new Promise(res => el.addEventListener(event, function h(e) { el.removeEventListener(event, h); res(e); }));

  // ---------- Image helpers ----------
  const toGray = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const y = (d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722) | 0;
      d[i] = d[i + 1] = d[i + 2] = y; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
  };

  const otsuBinarize = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { width: w, height: h } = canvas;
    let img = ctx.getImageData(0, 0, w, h);
    const d = img.data;

    const hist = new Array(256).fill(0);
    for (let i = 0; i < d.length; i += 4) hist[d[i]]++;
    const total = w * h;
    let sum = 0; for (let t = 0; t < 256; t++) sum += t * hist[t];
    let sumB = 0, wB = 0, varMax = -1, thr = 127;

    for (let t = 0; t < 256; t++) {
      wB += hist[t]; if (wB === 0) continue;
      const wF = total - wB; if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const between = wB * wF * (mB - mF) * (mB - mF);
      if (between > varMax) { varMax = between; thr = t; }
    }
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i] < thr ? 0 : 255;
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
  };

  // Ensure dark glyphs on light background (auto-polarity)
  const ensureDarkTextOnLight = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { width: w, height: h } = canvas;
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    let black = 0, white = 0;
    for (let i = 0; i < d.length; i += 4) (d[i] === 0 ? black++ : white++);
    if (black > white) {
      for (let i = 0; i < d.length; i += 4) {
        const v = d[i] ? 0 : 255;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
  };

  // gentle open+close; used on retries
  const morphOpenClose = (canvas) => {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let img = ctx.getImageData(0, 0, w, h);
    const src = img.data;

    const pass = (mode) => {
      const out = new Uint8ClampedArray(src);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4;
          let v = (mode === 'erode') ? 255 : 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const j = ((y + dy) * w + (x + dx)) * 4;
              const on = src[j] === 0; // black pixel = text
              if (mode === 'erode') { if (!on) { v = 255; dx = dy = 2; break; } else v = 0; }
              else { if (on) { v = 0; dx = dy = 2; break; } else v = 255; }
            }
          }
          out[i] = out[i + 1] = out[i + 2] = v; out[i + 3] = 255;
        }
      }
      img = new ImageData(out, w, h);
    };
    pass('erode'); pass('dilate'); // open
    pass('dilate'); pass('erode'); // close
    ctx.putImageData(img, 0, 0);
  };

  // ---------- NEW decoding helpers ----------
  const maskToChecks = (mask) => {
    if (!mask) return null;
    return [...mask].map(m => {
      if (m === 'A') return (c) => /[A-Z]/.test(c);
      if (m === '0') return (c) => /[0-9]/.test(c);
      return (c) => c === m; // literal (e.g., '-')
    });
  };

  const topChoicesPerSymbol = (symbols, whitelistRe, K = 4) => {
    const per = [];
    for (const s of (symbols || [])) {
      const pool = [];
      if (Array.isArray(s?.choices) && s.choices.length) {
        for (const ch of s.choices) {
          const c = (ch.text || '').trim().toUpperCase();
          const conf = ch.confidence || 0;
          if (!c) continue;
          if (whitelistRe && !whitelistRe.test(c)) continue;
          pool.push({ c, conf });
        }
      }
      const raw = (s?.text || '').trim().toUpperCase();
      if (raw && (!whitelistRe || whitelistRe.test(raw))) {
        pool.push({ c: raw, conf: s?.confidence || 0 });
      }
      pool.sort((a, b) => b.conf - a.conf);
      per.push(pool.slice(0, Math.max(1, K)));
    }
    return per;
  };

  const chooseDigitOrLetter = (c, conf, left, right, maskCheck) => {
    if (c !== '0' && c !== 'O') return { c, conf };
    const leftIsDigit = left && /[0-9]/.test(left);
    const rightIsDigit = right && /[0-9]/.test(right);
    const digitContext = (leftIsDigit ? 1 : 0) + (rightIsDigit ? 1 : 0);

    // light mask preference if defined
    let maskPrefersDigit = false, maskPrefersLetter = false;
    if (maskCheck) {
      maskPrefersDigit = maskCheck('0');
      maskPrefersLetter = maskCheck('A');
    }

    if (digitContext >= 1 || maskPrefersDigit) return { c: '0', conf: conf + 2 };
    if (maskPrefersLetter) return { c: 'O', conf: conf + 2 };
    return { c, conf };
  };

  const collapseNoisyRuns = (arr, minRun = 3, confCap = 55) => {
    const out = [];
    for (let i = 0; i < arr.length;) {
      let j = i + 1;
      while (j < arr.length && arr[j].c === arr[i].c) j++;
      const runLen = j - i;
      const avgConf = (arr.slice(i, j).reduce((s, x) => s + (x.conf || 0), 0)) / runLen;
      if (runLen >= minRun && avgConf < confCap) {
        out.push({ c: arr[i].c, conf: avgConf });
      } else {
        out.push(...arr.slice(i, j));
      }
      i = j;
    }
    return out;
  };

  const decodeWithMask = (choiceGrid, maskChecks, K = 4) => {
    let beam = [{ str: '', score: 0 }];
    for (let i = 0; i < choiceGrid.length; i++) {
      const choices = choiceGrid[i];
      const next = [];
      const maskOk = maskChecks ? maskChecks[i] : null;

      for (const state of beam) {
        const left = state.str[state.str.length - 1] || '';
        for (const opt of choices) {
          let { c, conf } = opt;
          const picked = chooseDigitOrLetter(c, conf, left, '', maskOk);
          c = picked.c; conf = picked.conf;

          if (maskOk && !maskOk(c)) continue;

          const bonus = maskOk ? 2 : 0;
          const score = state.score + Math.log((conf || 0) + 1) + bonus;
          next.push({ str: state.str + c, score });
        }
      }

      next.sort((a, b) => b.score - a.score);
      beam = next.slice(0, K);
      if (!beam.length) {
        // if mask is too strict, relax by using top choices without mask at this pos
        const relax = (choiceGrid[i] || []).slice(0, K).map(opt => ({
          str: (''), score: Math.log((opt.conf || 0) + 1)
        }));
        beam = relax.length ? relax : [{ str: '', score: -1e9 }];
      }
    }
    beam.sort((a, b) => b.score - a.score);
    return beam[0]?.str || '';
  };

  useEffect(() => {
    let stop = false, raf = 0, last = 0;

    (async () => {
      const worker = await createWorker(
        lang,
        OEM.LSTM_ONLY,
        { workerPath, corePath, langPath, logger: m => console.log('[tesseract]', m) }
      );
      workerRef.current = worker;

      const wl = numericOnly ? '0123456789-' : whitelist;
      await worker.setParameters({
        user_defined_dpi: '300',
        preserve_interword_spaces: '1',
        tessedit_char_whitelist: wl,
      });
      if (numericOnly) {
        await worker.setParameters({ classify_bln_numeric_mode: '1' });
      }

      // Camera
      const video = videoRef.current;
      video.muted = true;
      video.setAttribute('playsinline', 'true');

      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        streamRef.current = stream;
        video.srcObject = stream;
      } else if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      if (!video.videoWidth || !video.videoHeight) await waitFor(video, 'loadedmetadata');
      if (video.readyState < 2) await waitFor(video, 'canplay');
      if (video.paused) { try { await video.play(); } catch { } }

      // Canvases
      const displayW = video.videoWidth || 1280;
      const displayH = video.videoHeight || 720;
      const overlay = overlayRef.current;
      overlay.width = displayW;
      overlay.height = displayH;

      const capW = Math.max(1, Math.round(displayW * downscale));
      const capH = Math.max(1, Math.round(displayH * downscale));
      const frame = document.createElement('canvas');
      frame.width = capW; frame.height = capH;

      const roiCanvas = document.createElement('canvas');
      const work = document.createElement('canvas');

      setBusy(false);

      const isPixErr = (e) => /pix|ImageData|scale/i.test(String(e && (e.message || e)));

      const recognizeBest = async () => {
        // 1) frame
        const fctx = frame.getContext('2d', { willReadFrequently: true });
        fctx.imageSmoothingEnabled = false;
        fctx.drawImage(video, 0, 0, capW, capH);

        // 2) crop ROI
        const rx = Math.round(roi.x * capW);
        const ry = Math.round(roi.y * capH);
        const rw = Math.max(1, Math.round(roi.w * capW));
        const rh = Math.max(1, Math.round(roi.h * capH));
        roiCanvas.width = rw; roiCanvas.height = rh;
        const rctx = roiCanvas.getContext('2d', { willReadFrequently: true });
        rctx.imageSmoothingEnabled = false;
        rctx.clearRect(0, 0, rw, rh);
        rctx.drawImage(frame, rx, ry, rw, rh, 0, 0, rw, rh);

        // 3) scale to minimum work size
        const s = Math.max(minWorkW / rw, minWorkH / rh, 1);
        let currW = Math.max(64, Math.round(rw * s));
        let currH = Math.max(64, Math.round(rh * s));
        if (work.width !== currW || work.height !== currH) { work.width = currW; work.height = currH; }
        const wctx = work.getContext('2d', { willReadFrequently: true });
        wctx.imageSmoothingEnabled = false;
        wctx.clearRect(0, 0, currW, currH);
        wctx.drawImage(roiCanvas, 0, 0, currW, currH);

        // 4) preprocess (gray + Otsu + auto-polarity)
        toGray(work);
        otsuBinarize(work);
        ensureDarkTextOnLight(work);

        // 5) ladder: try multiple PSMs; on retries scale up + morph
        let best = { score: -Infinity, data: null, psm: null };

        const tryOnce = async (doMorph) => {
          if (doMorph) {
            toGray(work);
            otsuBinarize(work);
            ensureDarkTextOnLight(work);
            morphOpenClose(work);
          }
          for (const psm of psmCandidates) {
            try {
              await worker.setParameters({ tessedit_pageseg_mode: psm });
              const { data } = await worker.recognize(work);
              const words = Array.isArray(data?.words) ? data.words : [];
              const syms = Array.isArray(data?.symbols) ? data.symbols : [];
              const avg = words.length
                ? words.reduce((s, w) => s + (w.confidence || 0), 0) / words.length
                : (syms.length ? syms.reduce((s, c) => s + (c.confidence || 0), 0) / syms.length : 0);
              if (avg > best.score) best = { score: avg, data, psm };
            } catch (e) {
              if (!isPixErr(e)) throw e;
            }
          }
        };

        await tryOnce(false);

        for (let retry = 1; retry <= maxRetries; retry++) {
          const nW = Math.floor(work.width * 1.5);
          const nH = Math.floor(work.height * 1.5);
          const tmp = document.createElement('canvas');
          tmp.width = nW; tmp.height = nH;
          const tctx = tmp.getContext('2d', { willReadFrequently: true });
          tctx.imageSmoothingEnabled = false;
          tctx.drawImage(work, 0, 0, nW, nH);
          work.width = nW; work.height = nH;
          const wctx2 = work.getContext('2d', { willReadFrequently: true });
          wctx2.clearRect(0, 0, nW, nH);
          wctx2.drawImage(tmp, 0, 0);

          await tryOnce(true);
        }

        return best.data;
      };

      const loop = async (t) => {
        raf = requestAnimationFrame(loop);
        if (stop) return;
        if (!last || t - last >= sampleMs) {
          last = t;
          if (inFlightRef.current) return;
          inFlightRef.current = true;

          try {
            const data = await recognizeBest();

            const textRaw = (data?.text || '').trim();

            // best word
            let bestWord = '';
            let bestC = -Infinity;
            for (const w of (data?.words || [])) {
              const txt = (w.text || '').trim();
              if (txt && (w.confidence ?? -Infinity) > bestC) { bestC = w.confidence; bestWord = txt; }
            }

            // ---------- NEW smarter filtered output ----------
            const wl = numericOnly ? '0123456789-' : whitelist;
            const whitelistRe = new RegExp(`^[${wl}]$`);
            const symbols = Array.isArray(data?.symbols) ? data.symbols : [];

            // top-K per symbol
            const choiceGridRaw = topChoicesPerSymbol(symbols, whitelistRe, beamWidth);

            // apply stricter per-symbol floor; keep at least one option
            const choiceGrid = choiceGridRaw.map(list => {
              const f = list.filter(x => (x.conf || 0) >= raiseCharFloor).slice(0, beamWidth);
              return f.length ? f : (list.length ? [list[0]] : []);
            });

            // optional: collapse long low-conf repeats inside each position list
            const compactGrid = choiceGrid.map(list => collapseNoisyRuns(list));

            // beam decode with mask (if provided)
            const maskChecks = maskToChecks(expectedMask);
            const filteredSmart = decodeWithMask(compactGrid, maskChecks, beamWidth);

            // final cleanups
            const filtered = filteredSmart.replace(/^-+|-+$/g, '');

            setOutRaw(textRaw);
            setOutBest(bestWord ? bestWord.toUpperCase() : '');
            setOutFiltered(filtered);

            // callbacks
            cbRef.current.onText && textRaw && cbRef.current.onText(textRaw);
            cbRef.current.onWord && cbRef.current.onWord(bestWord || '');
            cbRef.current.onChars && cbRef.current.onChars(filtered.split(''));

            // ---------- overlay ----------
            const ctx = overlay.getContext('2d');
            const displayW2 = overlay.width, displayH2 = overlay.height;
            ctx.clearRect(0, 0, displayW2, displayH2);

            // ROI outline
            if (showRoiBox) {
              ctx.strokeStyle = 'rgba(255,255,0,0.85)';
              ctx.lineWidth = 2;
              ctx.strokeRect(roi.x * displayW2, roi.y * displayH2, roi.w * displayW2, roi.h * displayH2);
            }

            // Map word boxes using work-size approximation
            ctx.strokeStyle = 'rgba(0,200,255,0.9)';
            ctx.lineWidth = 2;

            const sx = (roi.w * displayW2) / Math.max(1, (data?.width || 1));
            const sy = (roi.h * displayH2) / Math.max(1, (data?.height || 1));
            const dx = roi.x * displayW2;
            const dy = roi.y * displayH2;

            for (const w of (data?.words || [])) {
              const b = w?.bbox || {};
              if (b.x0 == null) continue;
              const rx2 = dx + b.x0 * sx;
              const ry2 = dy + b.y0 * sy;
              const rw2 = (b.x1 - b.x0) * sx;
              const rh2 = (b.y1 - b.y0) * sy;
              ctx.strokeRect(rx2, ry2, rw2, rh2);
            }
          } catch (err) {
            // keep loop alive
            // console.warn('recognize loop error:', err);
          } finally {
            inFlightRef.current = false;
          }
        }
      };

      raf = requestAnimationFrame(loop);
    })().catch(console.error);

    return () => {
      stop = true;
      if (raf) cancelAnimationFrame(raf);
      const v = videoRef.current;
      if (v) v.srcObject = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      workerRef.current?.terminate?.();
    };
  }, [
    JSON.stringify(videoConstraints),
    lang, whitelist, numericOnly, charConfFloor, confFloor,
    expectedMask, beamWidth, raiseCharFloor,
    sampleMs, downscale, minWorkW, minWorkH, maxRetries,
    roi.x, roi.y, roi.w, roi.h, showRoiBox,
    workerPath, corePath, langPath,
    JSON.stringify(psmCandidates),
  ]);

  return (
    <div className="flex flex-row justify-between gap-40 w-6xl h-96 mx-auto">
      {/* <div className="relative w-full max-w-3xl mx-auto"> */}

      {/* <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border"> */}
      <div className="relative w-full h-full aspect-auto bg-black rounded-lg overflow-hidden border">

        <video ref={videoRef} className="absolute inset-0 w-full h-full" autoPlay muted playsInline />
        <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {busy && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
            Loading OCR…
          </div>
        )}

        {/* Live OCR output panel */}
        <div className="absolute bottom-2 left-2 right-2 md:right-auto md:max-w-xl bg-black/70 text-white rounded-lg p-3 backdrop-blur-sm space-y-1">
          <div className="text-xs uppercase tracking-wide opacity-70">OCR Output</div>
          <div className="text-[11px] opacity-75"><strong>Raw:</strong> {outRaw || '—'}</div>
          <div className="text-sm break-words whitespace-pre-wrap">
            <strong>Filtered:</strong> {outFiltered || <span className="opacity-60">—</span>}
          </div>
          <div className="text-[11px] opacity-80"><strong>Best word:</strong> {outBest || '—'}</div>
        </div>
      </div>

      <div className="text-sm break-words whitespace-pre-wrap bg-maroon text-offwhite p-8 w-full rounded-lg">
        <div className="text-2xl"><strong>Filtered:</strong> {outFiltered || <span className="opacity-60">—</span>}</div>
      </div>
    </div>
  );
}
