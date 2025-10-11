const viewer = document.getElementById("viewer");

if (viewer) {
  let targetOrbitY = 180, targetOrbitX = 75;
  let currentOrbitY = 180, currentOrbitX = 75;
  let targetLightX = 0, targetLightY = 0;
  let currentLightX = 0, currentLightY = 0;

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    targetOrbitY = 180 + x * 30;
    targetOrbitX = 75 + y * 15;
    targetLightX = x * 60;
    targetLightY = y * 40;
  });

  document.addEventListener("mouseleave", () => {
    targetOrbitY = 180;
    targetOrbitX = 75;
    targetLightX = 0;
    targetLightY = 0;
  });

  function animateModel() {
    currentOrbitY += (targetOrbitY - currentOrbitY) * 0.1;
    currentOrbitX += (targetOrbitX - currentOrbitX) * 0.1;
    currentLightX += (targetLightX - currentLightX) * 0.1;
    currentLightY += (targetLightY - currentLightY) * 0.1;

    viewer.cameraOrbit = `${currentOrbitY}deg ${currentOrbitX}deg auto`;
    viewer.style.filter = `drop-shadow(${currentLightX * 0.3}px ${currentLightY * 0.3}px 25px rgba(162,107,255,0.4))`;
    requestAnimationFrame(animateModel);
  }

  viewer.environmentImage = "neutral";
  viewer.shadowIntensity = 1;
  viewer.exposure = 1.1;
  animateModel();
}
