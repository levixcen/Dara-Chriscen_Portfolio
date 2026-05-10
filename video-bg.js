(function () {
  const video = document.getElementById('bgVideo');
  if (!video) return;

  /*
    Strategy:
    - Keep video element full-size and playing (never hide it — browsers suspend hidden videos)
    - Draw downscaled frames (640x360) to a canvas at 24fps
    - CSS filter on the canvas for the tint
    - A gradient div on top for the red-to-purple effect
  */

  // Video: keep it rendered but invisible behind the canvas
  video.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    object-fit: cover;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
  `;

  // Canvas: the actual visible background
  const canvas = document.createElement('canvas');
  canvas.width  = 640;
  canvas.height = 360;
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 2;
    pointer-events: none;
    filter: brightness(0.5) saturate(2.2) hue-rotate(250deg) contrast(1.0);
    transform: translateZ(0);
  `;
  document.body.prepend(canvas);

  // Gradient overlay: red at top, purple at bottom — same as original duotone
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(120, 0, 20, 0.30) 0%,
      rgba(60, 0, 120, 0.35) 100%
    );
    mix-blend-mode: multiply;
  `;
  document.body.prepend(overlay);

  // Remove any old overlay from previous versions
  document.querySelectorAll('.duotone-overlay').forEach(el => el.remove());

  const ctx = canvas.getContext('2d', { alpha: false });

  let animId;
  let lastTime = 0;
  const FRAME_INTERVAL = 1000 / 24; // 24fps cap

  function drawFrame(timestamp) {
    animId = requestAnimationFrame(drawFrame);
    if (timestamp - lastTime < FRAME_INTERVAL) return;
    lastTime = timestamp;
    if (video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, 640, 360);
    }
  }

  function start() {
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(drawFrame);
  }

  video.addEventListener('playing', start);
  video.addEventListener('play', start);

  if (!video.paused && video.readyState >= 2) start();
})();