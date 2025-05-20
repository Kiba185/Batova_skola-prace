document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
  
    function loadPage(url, push = true) {
      // Spustíme fade-out
      content.classList.add('fade-out');
  
      // Počkejme až na konec přechodu (0.5s), pak teprve nahrajeme nový obsah
      setTimeout(() => {
        fetch(url)
          .then(res => res.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main');
  
            if (newMain) {
              content.innerHTML = newMain.innerHTML;
  
              const isHome = url.includes('index.html') || url.endsWith('/');
              if (isHome) {
                document.body.setAttribute('data-homepage', 'true');
              } else {
                document.body.removeAttribute('data-homepage');
              }
  
              if (push) history.pushState(null, '', url);
  
              // Necháme DOM překreslit, pak odstraníme fade-out pro fade-in
              requestAnimationFrame(() => {
                content.classList.remove('fade-out');
              });
            }
          });
      }, 500); // musí být stejně dlouhé jako v CSS
    }
  
    document.querySelectorAll('a[data-link]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const url = this.getAttribute('href');
        loadPage(url);
      });
    });
  
    window.addEventListener('popstate', () => {
      loadPage(location.pathname, false);
    });
  });
  