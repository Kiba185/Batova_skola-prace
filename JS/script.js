const places = {
  skola: {
    title: 'Baťova škola práce',
    description: 'Vzdělávací instituce založená Tomášem Baťou v roce 1925, která kombinovala výuku s praktickou prací.',
    beforeImg: 'skola-then.jpg',
    afterImg: 'skola-now.jpg'
  },
  domky: {
    title: 'Baťovy domky',
    description: 'Typické cihlové domky pro zaměstnance Baťových závodů, postavené jako součást sociálního programu firmy.',
    beforeImg: '../images/domky-then.jpg',
    afterImg: '../images/domky-now.jpg'
  }
};

function showPlace(key) {
  const place = places[key];
  document.getElementById('place-title').textContent = place.title;
  document.getElementById('place-description').textContent = place.description;
  document.getElementById('before-img').src = place.beforeImg;
  document.getElementById('after-img').src = place.afterImg;
  document.getElementById('slider').style.display = 'block';
  adjustSlider(50);
}

function adjustSlider(value) {
  document.querySelector('.before').style.clipPath = `inset(0 ${100 - value}% 0 0)`;
}
