// scripts.js
import * as faceapi from 'face-api.js';

import jett from "../model-images/placeholderFaceId.jpeg"
import menace from "../model-images/menacePhoto.jpeg"
import alec from "../model-images/Berenbaum_Alec.png"

// const MODEL_PATH = './models';
const MODEL_URL = 'http://localhost:3001/models';
// const MODEL_URL = './models'

// const KNOWN_FACES = [
//   { label: 'Jett',   url: '../model-images/placeholderFaceId.jpeg' },
//   { label: 'Menace', url: '../model-images/menacePhoto.jpeg' },
//   { label: 'Alec',   url: '../model-images/Berenbaum_Alec.png' }
// ];
const KNOWN_FACES = [
  { label: 'Jett Kopalek',   url: jett},
  { label: 'Menace Antonio', url: menace },
  { label: 'Alec Berenbaum',   url: alec }
];



/**
 * Load all Face–API models
 */
export async function loadModels() {
  // await Promise.all([
    
  //   faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_PATH),
  //   faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
  //   faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH),
  //   faceapi.nets.ageGenderNet.loadFromUri(MODEL_PATH),
  //   faceapi.nets.faceExpressionNet.loadFromUri(MODEL_PATH)
  // ]);
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    // faceapi.nets.ssdMobilenetv1.loadFromUri(`${MODEL_URL}/ssd_mobilenetv1`),
    // faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68_model`),
    // faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition_model`),
    // faceapi.nets.ageGenderNet.loadFromUri(`${MODEL_URL}/age_gender_model`),
    // faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression_model`),
  ]);
}

/**
 * Build and return a FaceMatcher from KNOWN_FACES
 */
export async function buildFaceMatcher() {
  const labeled = [];
  for (const { label, url } of KNOWN_FACES) {
    const img = await faceapi.fetchImage(url);
    const result = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (result) {
      labeled.push(
        new faceapi.LabeledFaceDescriptors(label, [result.descriptor])
      );
    }
  }
  if (!labeled.length) throw new Error('No reference faces found');
  return new faceapi.FaceMatcher(labeled, 0.55);
}

/**
 * Kick off the detection loop:
 *   – runs on each RAF
 *   – draws detections / landmarks / expressions / age&gender
 *   – labels each face
 */
export function startDetection(videoEl, canvasEl, faceMatcher) {
  const ctx = canvasEl.getContext('2d');
  canvasEl.width  = videoEl.width;
  canvasEl.height = videoEl.height;

  async function loop() {
    const results = await faceapi
      .detectAllFaces(videoEl)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withAgeAndGender()
      .withFaceExpressions();

    const resized = faceapi.resizeResults(results, {
      width: videoEl.width,
      height: videoEl.height
    });

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    faceapi.draw.drawDetections(canvasEl, resized);
    faceapi.draw.drawFaceLandmarks(canvasEl, resized);
    faceapi.draw.drawFaceExpressions(canvasEl, resized);

    resized.forEach(f => {
      const { age, gender, genderProbability, detection, descriptor } = f;
      new faceapi.draw.DrawTextField(
        [`${gender} ${(genderProbability*100).toFixed(1)}%`, `${Math.round(age)} yrs`],
        detection.box.topRight
      ).draw(canvasEl);

      const best = faceMatcher.findBestMatch(descriptor);
      new faceapi.draw.DrawBox(detection.box, {
        label: best.label === 'unknown' ? 'Unknown' : best.label
      }).draw(canvasEl);
    });

    requestAnimationFrame(loop);
  }

  videoEl.addEventListener('play', loop);
}
