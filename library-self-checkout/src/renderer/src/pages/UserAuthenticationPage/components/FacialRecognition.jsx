// // src/components/FaceRecognition.jsx
// import React, { useRef, useEffect } from 'react';
// import { loadModels, buildFaceMatcher, startDetection } from '../../../ai-models/face-api'

// export const FacialRecognition = () => {
//   const videoRef  = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     async function init() {
//       // 1. load all the models
//       await loadModels();

//       // 2. build the matcher from your known faces
//       const matcher = await buildFaceMatcher();

//       // 3. start the webcam
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;

//       // 4. kick off the detection loop as soon as video plays
//       startDetection(videoRef.current, canvasRef.current, matcher);
//     }

//     init().catch(console.error);
//   }, []);

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center' }}>
//       {/* <div style={{ position: 'relative', width: 720, height: 560 }}> */}
//       <div style={{ position: 'relative', width: "100%", height: "100%"}}>
//         <video
//           ref={videoRef}
//           width="720"
//         //   width="30%"
//           height="560"
//         //   height="100%"
//           autoPlay
//           muted
//           style={{ display: 'block' }}
//         />
//         <canvas
//           ref={canvasRef}
//           style={{ position: 'absolute', top: 0, left: 0 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FacialRecognition



// src/components/FaceRecognition.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import * as faceapi from 'face-api.js';
// // import { loadModels, buildFaceMatcher } from '../scripts';
// import { loadModels, buildFaceMatcher } from '../../../ai-models/face-api'
// // src/components/FaceRecognition.jsx
// // import React, { useRef, useEffect, useState } from 'react';
// // import * as faceapi from 'face-api.js';
// // import { loadModels, buildFaceMatcher } from '../scripts';

// export const FacialRecognition = ({
//   // original 720×560 scaled by 0.6 → 432×336
//   baseWidth       = 750,
// //   baseWidth       = "100%",
//   baseHeight      = 1100,
// //   baseHeight      = "100%",
//   scale           = 0.4,
//   videoConstraints = { video: true, audio: false }
// }) => {
//   const videoRef  = useRef(null);
//   const canvasRef = useRef(null);
//   const [ready, setReady] = useState(false);

//   // compute the displayed dimensions in px
//   const width  = Math.round(baseWidth  * scale); // 432
//   const height = Math.round(baseHeight * scale); // 336

// //   const width = "30%"
// //   const height= "100%"

//   useEffect(() => {
//     async function init() {
//       // 1️⃣ load models + build matcher
//       await loadModels();
//       const matcher = await buildFaceMatcher();

//       // 2️⃣ start webcam
//       const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
//       videoRef.current.srcObject = stream;

//       // 3️⃣ once metadata is ready, size canvas & kick off detection
//       videoRef.current.addEventListener('loadedmetadata', () => {
//         const canvas = canvasRef.current;

//         // set canvas resolution to match display
//         canvas.width  = width;
//         canvas.height = height;

//         // tell face-api the drawing/display size
//         faceapi.matchDimensions(canvas, { width, height });

//         // detection + drawing loop
//         const loop = async () => {
//           const detections = await faceapi
//             .detectAllFaces(videoRef.current)
//             .withFaceLandmarks()
//             .withFaceDescriptors()
//             .withAgeAndGender()
//             .withFaceExpressions();

//           const resized = faceapi.resizeResults(detections, { width, height });
//           const ctx     = canvas.getContext('2d');
//           ctx.clearRect(0, 0, width, height);

//           faceapi.draw.drawDetections(canvas, resized);
//           faceapi.draw.drawFaceLandmarks(canvas, resized);
//           faceapi.draw.drawFaceExpressions(canvas, resized);

//           resized.forEach(f => {
//             const { age, gender, genderProbability, detection, descriptor } = f;

//             // age & gender text
//             new faceapi.draw.DrawTextField(
//               [`${gender} ${(genderProbability*100).toFixed(1)}%`, `${Math.round(age)} yrs`],
//               detection.box.topRight
//             ).draw(canvas);

//             // face recognition box & label
//             const best = matcher.findBestMatch(descriptor);
//             new faceapi.draw.DrawBox(detection.box, {
//               label: best.label === 'unknown' ? 'Unknown' : best.label
//             }).draw(canvas);
//           });

//           requestAnimationFrame(loop);
//         };

//         loop();
//       });

//       setReady(true);
//     }

//     init().catch(console.error);
//   }, [videoConstraints, width, height]);

//   return (
//     <div className="flex justify-center items-center w-full">
//       {/* wrapper sized to 60% of 720×560 in px */}
//       <div
//         className="relative overflow-hidden rounded-lg bg-gray-800"
//         style={{ width: `${width}px`, height: `${height}px` }}
//       >
//         <video
//           ref={videoRef}
//           width={width}
//           height={height}
//           autoPlay
//           muted
//           playsInline
//           className="object-cover w-full h-full"
//         />
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0 w-full h-full"
//         />
//         {!ready && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
//             Loading…
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default FacialRecognition


// src/components/FacialRecognition.jsx
// // src/components/FacialRecognition.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import * as faceapi from 'face-api.js';
// import { loadModels, buildFaceMatcher } from '../../../ai-models/face-api';

// export default function FacialRecognition({
//   baseWidth       = 700,
//   baseHeight      = 1100,
//   scale           = 0.4,
//   videoConstraints = { video: true, audio: false }
// }) {
//   const videoRef  = useRef(null);
//   const canvasRef = useRef(null);
//   const [ready, setReady] = useState(false);
//   let matcher;

//   // Compute display size in px
//   const width  = Math.round(baseWidth  * scale);
//   const height = Math.round(baseHeight * scale);

//   // Draw continuous contours from landmark regions
//   function drawContours(ctx, regions) {
//     ctx.save();
//     ctx.strokeStyle = 'aqua';
//     ctx.lineWidth   = 2;
//     regions.forEach(points => {
//       if (!points || points.length === 0) return;
//       ctx.beginPath();
//       points.forEach((pt, i) => {
//         if (i === 0) ctx.moveTo(pt.x, pt.y);
//         else         ctx.lineTo(pt.x, pt.y);
//       });
//       ctx.closePath();
//       ctx.stroke();
//     });
//     ctx.restore();
//   }

//   useEffect(() => {
//     async function init() {
//       await loadModels();
//       matcher = await buildFaceMatcher();

//       const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
//       const videoEl = videoRef.current;
//       videoEl.srcObject = stream;
//       await videoEl.play();

//       const canvasEl = canvasRef.current;
//       const ctx      = canvasEl.getContext('2d');

//       // Size canvas to match video
//       canvasEl.width  = width;
//       canvasEl.height = height;
//       faceapi.matchDimensions(canvasEl, { width, height });

//       // Main loop
//       const loop = async () => {
//         const results = await faceapi
//           .detectAllFaces(videoEl)
//           .withFaceLandmarks()
//           .withFaceDescriptors()
//           .withAgeAndGender()
//           .withFaceExpressions();

//         const resized = faceapi.resizeResults(results, { width, height });
//         ctx.clearRect(0, 0, width, height);

//         // Draw boxes & expressions
//         faceapi.draw.drawDetections(canvasEl, resized);
//         faceapi.draw.drawFaceExpressions(canvasEl, resized);

//         resized.forEach(f => {
//           const { detection, descriptor, age, gender, genderProbability } = f;

//           // Draw smooth 2D contours
//           const regions = [
//             f.landmarks.getJawOutline(),
//             f.landmarks.getLeftEye(),
//             f.landmarks.getRightEye(),
//             f.landmarks.getLeftEyeBrow(),
//             f.landmarks.getRightEyeBrow(),
//             f.landmarks.getNose(),
//             f.landmarks.getMouth()
//           ];
//           drawContours(ctx, regions);

//           // Age/Gender text
//           new faceapi.draw.DrawTextField(
//             [`${gender} ${(genderProbability * 100).toFixed(1)}%`, `${Math.round(age)} yrs`],
//             detection.box.topRight
//           ).draw(canvasEl);

//           // Recognition label
//           const best = matcher.findBestMatch(descriptor);
//           new faceapi.draw.DrawBox(detection.box, {
//             label: best.label === 'unknown' ? 'Unknown' : best.label
//           }).draw(canvasEl);
//         });

//         requestAnimationFrame(loop);
//       };

//       loop();
//       setReady(true);
//     }

//     init().catch(console.error);
//   }, [videoConstraints, width, height]);

//   return (
//     <div className="flex justify-center items-center w-full">
//       <div
//         className="relative overflow-hidden rounded-lg bg-gray-800"
//         style={{ width: `${width}px`, height: `${height}px` }}
//       >
//         <video
//           ref={videoRef}
//           width={width}
//           height={height}
//           autoPlay
//           muted
//           playsInline
//           className="w-full h-full"
//           style={{ objectFit: 'fill' }}
//         />
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0"
//           style={{ width: `${width}px`, height: `${height}px` }}
//         />
//         {!ready && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
//             Loading…
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/FacialRecognition.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { loadModels, buildFaceMatcher } from '../../../ai-models/face-api';

export const FacialRecognition = ({ onRecognized}) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName]   = useState('Searching…');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      // 1️⃣ Load models
      await loadModels();

      // 2️⃣ Build matcher
      const matcher = await buildFaceMatcher();

      // 3️⃣ Start webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = videoRef.current;
      videoEl.srcObject = stream;
      await videoEl.play();

      // 4️⃣ Size canvas to video
      const canvasEl = canvasRef.current;
      const ctx      = canvasEl.getContext('2d');
      canvasEl.width  = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
      faceapi.matchDimensions(canvasEl, {
        width:  videoEl.videoWidth,
        height: videoEl.videoHeight
      });

      setReady(true);

      // 5️⃣ Detection + drawing loop
      const loop = async () => {
        if (!isMounted) return;

        // detect faces + landmarks + descriptors + extras
        const detections = await faceapi
          .detectAllFaces(videoEl)
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withAgeAndGender()
          .withFaceExpressions();

        // resize to canvas dims
        const resized = faceapi.resizeResults(detections, {
          width:  videoEl.videoWidth,
          height: videoEl.videoHeight
        });

        // clear & redraw everything
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        faceapi.draw.drawDetections(canvasEl, resized);
        faceapi.draw.drawFaceLandmarks(canvasEl, resized);
        faceapi.draw.drawFaceExpressions(canvasEl, resized);

        // for each face, draw text/box AND update React state
        resized.forEach(f => {
          const { detection, descriptor, age, gender, genderProbability } = f;

          // recognition
          const best = matcher.findBestMatch(descriptor);
          const label = best.label === 'unknown' ? 'Unknown' : best.label;

          // update React state once per frame (will debounce naturally)
          setName(label);
          onRecognized(label);

          // draw box + label
          new faceapi.draw.DrawBox(detection.box, { label }).draw(canvasEl);

          // draw age/gender
          new faceapi.draw.DrawTextField(
            [`${gender} ${(genderProbability*100).toFixed(1)}%`, `${Math.round(age)} yrs`],
            detection.box.topRight
          ).draw(canvasEl);
        });

        requestAnimationFrame(loop);
      };

      loop();
    }

    init().catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [onRecognized]);

  return (
    <div className="flex flex-col items-center">
      {/* <div className="mb-2 font-bold">Recognized: {name}</div> */}
      <div className="relative" style={{ width: '720px', height: '560px' }}>
        <video
          ref={videoRef}
          width="720"
          height="560"
          autoPlay
          muted
          className="object-fill w-full h-full rounded-lg"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: '720px', height: '560px' }}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            Loading…
          </div>
        )}
      </div>
    </div>
  );
};

export default FacialRecognition;

