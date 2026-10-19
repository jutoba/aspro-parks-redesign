// Cabecera y pie compartidos por todas las páginas.
(function () {
  var page = document.body.getAttribute('data-page') || 'home';
  var accent = document.body.getAttribute('data-accent') || '#1478B8';

  var util = [
    ['eventos', 'Eventos corporativos', 'eventos.html'],
    ['noticias', 'Noticias', 'noticias.html'],
    ['partners', 'Partners', 'partners.html'],
    ['fundacion', 'Fundación', 'fundacion.html']
  ];
  var main = [
    ['parques', 'Parques', 'parques.html', false],
    ['vivelo', 'Vívelo', 'vivelo.html', false],
    ['club', 'Club', 'club.html', true]
  ];
  function cur(id) { return id === page ? ' aria-current="page"' : ''; }

  var header = document.getElementById('site-header');
  if (header) {
    header.innerHTML =
      '<div class="util-bar"><nav aria-label="Corporativo">' +
      util.map(function (l) { return '<a href="' + l[2] + '"' + cur(l[0]) + '>' + l[1] + '</a>'; }).join('') +
      '</nav></div>' +
      '<header class="site-header"><nav aria-label="Principal">' +
      '<a class="logo" href="index.html">aspro<span class="logo-dot" style="color:' + accent + '">·</span>parks</a>' +
      '<div class="nav-links">' +
      main.map(function (l) {
        return '<a class="nav-item" href="' + l[2] + '"' + cur(l[0]) + '>' + l[1] +
          (l[3] ? '<span class="badge-new">Nuevo</span>' : '') + '</a>';
      }).join('') +
      '<a class="nav-cta" href="parques.html">Elige tu parque</a>' +
      '</div></nav></header>';
  }

  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML =
      '<footer class="site-footer"><div class="inner">' +
      '<div><a href="index.html" class="logo" style="color:#FFF6E9;font-size:24px">aspro·parks</a>' +
      '<p style="margin:10px 0 0;font-size:14px;max-width:280px;line-height:1.5">Parques acuáticos, zoológicos, acuarios y de atracciones en 10 países de Europa.</p></div>' +
      '<nav aria-label="Pie de página" style="display:flex;flex-wrap:wrap;gap:40px">' +
      '<div class="col"><p class="col-title">Visitar</p><a href="parques.html">Parques</a><a href="vivelo.html">Vívelo</a><a href="club.html">Club</a></div>' +
      '<div class="col"><p class="col-title">Empresa</p><a href="eventos.html">Eventos corporativos</a><a href="partners.html">Partners</a><a href="noticias.html">Noticias</a><a href="fundacion.html">Fundación</a></div>' +
      '<div class="col"><p class="col-title">Legal</p><a href="#">Trabaja con nosotros</a><a href="#">Contacto</a><a href="#">Aviso legal</a></div>' +
      '</nav></div>' +
      '<p class="concept-note">Concepto de rediseño no oficial, sin relación con Aspro Parks. Contenido a modo de ejemplo.</p>' +
      '</footer>';
  }

  window.setAccent = function (c) {
    var d = document.querySelector('.logo-dot');
    if (d) d.style.color = c;
  };
})();
