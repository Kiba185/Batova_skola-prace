const places = {
  skola: {
    title: 'Baťova škola práce',
    description: 'Vzdělávací instituce založená Tomášem Baťou v roce 1925, která kombinovala výuku s praktickou prací.',
    beforeImg: '../images/skola-old.jpg',
    afterImg: '../images/skola-new.jpg'
  },
  domky: {
    title: 'Baťovy domky',
    description: 'Typické cihlové domky pro zaměstnance Baťových závodů, postavené jako součást sociálního programu firmy.',
    beforeImg: '../images/domky-old.jpg',
    afterImg: '../images/domky-new.jpg'
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

const persons = {
  tomas_bata: {
    name: "Tomáš Baťa",
    description: "Zakladatel firmy Baťa a průkopník firemního vzdělávání mladých lidí.",
    image: "../images/tomas_bata.jpg"
  },
  gahura: {
    name: "František Lydie Gahura",
    description: "Hlavní architekt Zlína – navrhl mnoho klíčových staveb Baťovy éry.",
    image: "../images/gahura.jpg"
  },
  hanzelka: {
    name: "Jiří Hanzelka",
    description: "Cestovatel a absolvent Baťovy školy práce. Proslul cestami po světě s Miroslavem Zikmundem.",
    image: "../images/hanzelka.jpg"
  },
  zikmund: {
    name: "Miroslav Zikmund",
    description: "Slavný cestovatel a spisovatel, propagátor Baťovy školy ve světě.",
    image: "../images/zikmund.jpg"
  },
  antonin_bata: {
    name: "Jan Antonín Baťa",
    description: "Mladší bratr Tomáše Bati, pokračovatel jeho odkazu a rozšiřovatel firmy Baťa po světě.",
    image: "../images/antonin_bata.jpg"
  },
  tomasik: {
    name: "Ladislav Tomášik",
    description: "Významný pedagog Baťovy školy práce, který formoval generace studentů.",
    image: "../images/tomasik.jpg"
  },
    boruvka: {
    name: "Otakar Borůvka",
    description: "Matematik a pedagog, který se podílel na výuce a vývoji vzdělávacích programů v Baťově škole.",
    image: "images/boruvka.jpg"
  },
  tous: {
    name: "Antonín Touš",
    description: "Dlouholetý ředitel Baťovy školy práce, klíčový organizátor její struktury a rozvoje.",
    image: "images/tous.jpg"
  },
  horak: {
    name: "Karel Horák",
    description: "Odborník na výrobu a průmyslovou organizaci, jeden z vedoucích mistrů ve škole.",
    image: "images/horak.jpg"
  }
};

function showPerson(key) {
  hidePerson(); // nejprve schováme vše ostatní

  const person = persons[key];
  if (!person) return;

  document.getElementById("person-card-" + key).style.height = "500px";
  document.getElementById("person-card-" + key).style.backgroundColor = "rgb(15, 15, 15)";
  document.getElementById("person-img-" + key).style.height = "100%";
  document.getElementById("person-img-" + key).style.width = "100%";
  document.getElementById("person-img-" + key).style.opacity = "15%";
  document.getElementById("person-name-" + key).textContent = person.name;
  document.getElementById("person-name-" + key).style.top = "15%";
  document.getElementById("person-name-" + key).style.left = "50%";
  document.getElementById("person-name-" + key).style.transform = "translateX(-50%)";
  document.getElementById("person-name-" + key).style.width = "80%";
  document.getElementById("person-name-" + key).style.fontSize = "35px";
  document.getElementById("person-description-" + key).textContent = person.description;
  document.getElementById("person-description-" + key).style.display = "block";
}

function hidePerson() {
  const cards = document.querySelectorAll('[id^="person-card-"]');
  cards.forEach(card => {
    const key = card.id.replace('person-card-', '');
    document.getElementById("person-card-" + key).style.height = "";
    document.getElementById("person-card-" + key).style.backgroundColor = "";

    const img = document.getElementById("person-img-" + key);
    if (img) {
      img.style.height = "";
      img.style.width = "";
      img.style.opacity = "";
    }

    const name = document.getElementById("person-name-" + key);
    if (name) {
      name.style.top = "";
      name.style.left = "";
      name.style.transform = "";
      name.style.width = "";
      name.style.fontSize = "";
    }

    const desc = document.getElementById("person-description-" + key);
    if (desc) {
      desc.style.display = "none";
      desc.textContent = "";
    }
  });
}

function focusPresentCard(card) {
  const allCards = document.querySelectorAll('.present-card');
  allCards.forEach(c => {
    c.classList.remove('focused');
    c.style.zIndex = 1;
    c.style.transform = 'translateX(-50%) translateZ(0)';
  });

  card.classList.add('focused');
  card.style.zIndex = 10;
  card.style.transform = 'translateX(-50%) translateZ(150px)';
}

