// Portada: el "mood" elegido cambia titular, colores y mensaje.
(function () {
  var CATS = {
    agua: { label: 'Agua', color: '#1478B8', deep: '#0F5E93', count: 21,
      title: 'Elige cómo quieres refrescarte.', kicker: 'Parques acuáticos',
      claim: 'Toboganes, olas y sol hasta la hora de cierre.',
      body: 'Desde las Canarias y Mallorca hasta el sur de Francia, Suiza o Finlandia: el verano tiene más de una piscina.',
      media: 'familia bajando un tobogán gigante a cámara lenta' },
    animales: { label: 'Animales', color: '#24733E', deep: '#1A5A30', count: 5,
      title: 'Elige a quién conocer hoy.', kicker: 'Zoológicos y parques marinos',
      claim: 'Selva, aves exóticas y delfines a un paso de la playa.',
      body: 'Parques donde los peques aprenden sin darse cuenta y los mayores vuelven a ser peques.',
      media: 'niña mirando de cerca a un animal a través del cristal' },
    acuarios: { label: 'Acuarios', color: '#0E5E7A', deep: '#0A475D', count: 10,
      title: 'Elige a qué profundidad bajar.', kicker: 'Acuarios',
      claim: 'Baja al fondo del mar sin mojarte.',
      body: 'Tiburones, medusas y túneles bajo el agua en Barcelona, Francia y Reino Unido, abiertos todo el año.',
      media: 'túnel submarino con un tiburón pasando por encima' },
    aventura: { label: 'Atracciones', color: '#C2410C', deep: '#9A3412', count: 7,
      title: 'Elige cuánta adrenalina aguantas.', kicker: 'Parques de atracciones',
      claim: 'Atracciones, cuevas y días que no se olvidan.',
      body: 'Para todas las edades, del primer cacharrito a la caída más alta.',
      media: 'grito colectivo en lo alto de una atracción' }
  };
  var ORDER = ['agua', 'animales', 'acuarios', 'aventura'];
  var current = 'agua';
  var moods = document.getElementById('moods');

  ORDER.forEach(function (id, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mood';
    b.dataset.id = id;
    b.innerHTML = '<span class="mood-dot" aria-hidden="true">' + (i + 1) + '</span>' + CATS[id].label;
    b.addEventListener('click', function () { current = id; render(); });
    moods.appendChild(b);
  });

  function $(id) { return document.getElementById(id); }

  function render() {
    var c = CATS[current];
    Array.prototype.forEach.call(moods.children, function (b) {
      var cc = CATS[b.dataset.id], on = b.dataset.id === current;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.borderColor = cc.color;
      b.style.background = on ? cc.color : 'transparent';
      b.style.color = on ? '#fff' : '#10233F';
      var dot = b.querySelector('.mood-dot');
      dot.style.background = on ? '#FFF6E9' : cc.color;
      dot.style.color = on ? cc.color : '#fff';
    });
    $('hero-title').textContent = c.title;
    $('hero-panel').style.background = c.color;
    $('hero-media-wrap').style.background = c.deep;
    $('hero-kicker').textContent = c.kicker;
    $('hero-claim').textContent = c.claim;
    $('hero-body').textContent = c.body;
    $('hero-media').textContent = '[VÍDEO/FOTO EN BUCLE: ' + c.media + ']';
    $('hero-cta').textContent = 'Ver ' + c.count + ' parques';
    if (window.setAccent) window.setAccent(c.color);
  }
  render();
})();
