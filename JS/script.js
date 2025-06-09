const places = {
  skola: {
    title: 'Baťova škola práce',
    description: 'Vzdělávací instituce založená Tomášem Baťou v roce 1925, která kombinovala výuku s praktickou prací.',
    beforeImg: '../images/skola-then.jpg',
    afterImg: '../images/skola-now.jpg'
  },
  domky: {
    title: 'Baťovy domky',
    description: 'Typické cihlové domky pro zaměstnance Baťových závodů, postavené jako součást sociálního programu firmy.',
    beforeImg: '../images/domky-then.jpg',
    afterImg: '../images/domky-now.jpg'
  }
};

let currentActiveHotspot = null;

function showPlace(key) {
  const place = places[key];
  document.getElementById('place-title').textContent = place.title;
  document.getElementById('place-description').textContent = place.description;
  document.getElementById('before-img').src = place.beforeImg;
  document.getElementById('after-img').src = place.afterImg;
  document.getElementById('slider').style.display = 'block';
  adjustSlider(50);

  if (currentActiveHotspot) {
    currentActiveHotspot.classList.remove('active');
  }

  const hotspots = document.querySelectorAll('.hotspot');
  hotspots.forEach(hotspot => {
    if (hotspot.getAttribute('data-key') === key) {
      hotspot.classList.add('active');
      currentActiveHotspot = hotspot;
    }
  });
}

function adjustSlider(value) {
  const before = document.querySelector('.before');
  const sliderHandle = document.querySelector('.slider-handle');
  before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  if (sliderHandle) {
    sliderHandle.style.left = `${value}%`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.before-after');
  const range = document.querySelector('input[type=range]');

  container.addEventListener('mousedown', startDrag);
  container.addEventListener('touchstart', startDrag);

  function startDrag(e) {
    e.preventDefault();
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
  }

  function stopDrag() {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchend', stopDrag);
  }

  function onDrag(e) {
    const rect = container.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const value = Math.max(0, Math.min(100, (x / rect.width) * 100));
    range.value = value;
    adjustSlider(value);
  }
});
