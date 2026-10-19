// Buscador de parques con filtros por tipo y país, y ficha en ventana modal.
// Listado tomado de las páginas oficiales de Aspro Parks (oct. 2026). Revisar antes de usar.
(function () {
  var CATS = {
    agua: { label: 'Agua', color: '#1478B8', type: 'Parque acuático' },
    animales: { label: 'Animales', color: '#24733E', type: 'Parque de animales' },
    acuarios: { label: 'Acuarios', color: '#0E5E7A', type: 'Acuario' },
    aventura: { label: 'Atracciones', color: '#C2410C', type: 'Parque de atracciones' }
  };
  var ORDER = ['agua', 'animales', 'acuarios', 'aventura'];
  var AQ = 'Toboganes, piscinas y zonas infantiles para pasar el día entero en remojo.';
  var PARKS = [
    { n: 'Aqualand Maspalomas', p: 'Maspalomas, Gran Canaria', k: 'es', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.es/maspalomas/' },
    { n: 'Aqualand Costa Adeje', p: 'Costa Adeje, Tenerife', k: 'es', c: 'agua', d: 'Parque acuático con delfinario: toboganes y piscinas en el mismo día que el espectáculo de delfines.', i: 'Familias con niños', u: 'https://www.aqualand.es/costa-adeje/' },
    { n: 'Aqualand Bahía de Cádiz', p: 'El Puerto de Santa María, Cádiz', k: 'es', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.es/bahiadecadiz/' },
    { n: 'Aqualand Torremolinos', p: 'Torremolinos, Málaga', k: 'es', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.es/torremolinos/' },
    { n: 'Aqualand El Arenal', p: 'El Arenal, Mallorca', k: 'es', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.es/elarenal/' },
    { n: 'Western Park', p: 'Magaluf, Mallorca', k: 'es', c: 'agua', d: 'Parque acuático con ambientación del Lejano Oeste.', i: 'Familias con niños', u: 'https://www.westernpark.com/' },
    { n: 'Aqualeon', p: 'Albinyana, Tarragona', k: 'es', c: 'agua', d: 'Parque acuático que además participa en programas de conservación de tigre siberiano y oso pardo.', i: 'Familias con niños', u: 'https://www.aqualeon.es/' },
    { n: 'Marineland Cataluña', p: 'Palafolls, Barcelona', k: 'es', c: 'animales', d: 'Zoo marino y parque acuático en uno: delfines y pingüinos de Humboldt, y luego toboganes.', i: 'Familias con niños', u: 'https://www.marineland.es' },
    { n: 'Marineland Mallorca', p: 'Mallorca', k: 'es', c: 'animales', d: 'Zoo marino con delfines, leones marinos, pingüinos de Humboldt y aves tropicales.', i: 'Familias con niños' },
    { n: 'Palmitos Park', p: 'Gran Canaria', k: 'es', c: 'animales', d: 'Parque zoológico y botánico con aves exóticas y delfines, y centro de acogida de animales decomisados.', i: 'Familias y amantes de la naturaleza' },
    { n: 'Jungle Park', p: 'Tenerife', k: 'es', c: 'animales', d: 'Parque de animales entre vegetación de selva, con programas de cría de especies amenazadas.', i: 'Familias con niños' },
    { n: 'Boudewijn Seapark', p: 'Brujas', k: 'be', c: 'animales', d: 'Parque de atracciones familiar con delfinario.', i: 'Familias con niños', u: 'https://www.boudewijnseapark.be/' },
    { n: 'L’Aquàrium de Barcelona', p: 'Barcelona', k: 'es', c: 'acuarios', d: 'Acuario en pleno Port Vell de Barcelona, ideal para combinar con un paseo por la ciudad.', i: 'Todos los públicos' },
    { n: 'Planet Ocean', p: 'Montpellier', k: 'fr', c: 'acuarios', d: 'Acuario en Montpellier.', i: 'Todos los públicos' },
    { n: 'Aquarium de Lyon', p: 'Lyon', k: 'fr', c: 'acuarios', d: 'Acuario urbano en Lyon.', i: 'Todos los públicos' },
    { n: 'Deep Sea World', p: 'North Queensferry, Escocia', k: 'uk', c: 'acuarios', d: 'Acuario junto al estuario del Forth, con túnel submarino.', i: 'Todos los públicos' },
    { n: 'Blue Planet Aquarium', p: 'Ellesmere Port, Cheshire', k: 'uk', c: 'acuarios', d: 'Acuario en el noroeste de Inglaterra.', i: 'Todos los públicos' },
    { n: 'Bristol Aquarium', p: 'Bristol', k: 'uk', c: 'acuarios', d: 'Acuario en el puerto de Bristol.', i: 'Todos los públicos' },
    { n: 'Blue Reef Aquarium Newquay', p: 'Newquay, Cornualles', k: 'uk', c: 'acuarios', d: 'Acuario junto a la playa de Newquay.', i: 'Todos los públicos' },
    { n: 'Blue Reef Aquarium Portsmouth', p: 'Portsmouth', k: 'uk', c: 'acuarios', d: 'Acuario en el paseo marítimo de Portsmouth.', i: 'Todos los públicos' },
    { n: 'Blue Reef Aquarium Hastings', p: 'Hastings', k: 'uk', c: 'acuarios', d: 'Acuario en el frente marítimo de Hastings.', i: 'Todos los públicos' },
    { n: 'Tynemouth Aquarium', p: 'Tynemouth', k: 'uk', c: 'acuarios', d: 'Acuario en la costa de Tynemouth.', i: 'Todos los públicos' },
    { n: 'Aqualand Fréjus', p: 'Fréjus', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/frejus/' },
    { n: 'Aqualand Cap d’Agde', p: 'Cap d’Agde', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/cap-d-agde/' },
    { n: 'Captain Jako', p: 'Cap d’Agde', k: 'fr', c: 'agua', d: 'Parque acuático en Cap d’Agde.', i: 'Familias con niños', u: 'https://www.aqualand.fr/cap-d-agde/captain-jako/' },
    { n: 'Aqualand Port Leucate', p: 'Port Leucate', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/port-leucate/' },
    { n: 'Aqualand Sainte-Maxime', p: 'Sainte-Maxime', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/sainte-maxime/' },
    { n: 'Aqualand Bassin d’Arcachon', p: 'Gujan-Mestras', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/bassin-d-arcachon/' },
    { n: 'Aqualand Saint-Cyprien', p: 'Saint-Cyprien', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/saint-cyprien/' },
    { n: 'Aqualand Saint-Cyr-sur-Mer', p: 'Saint-Cyr-sur-Mer', k: 'fr', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.fr/saint-cyr-sur-mer/' },
    { n: 'Aqualand Algarve', p: 'Alcantarilha, Algarve', k: 'pt', c: 'agua', d: AQ, i: 'Familias y grupos', u: 'https://www.aqualand.pt/' },
    { n: 'Serena', p: 'Espoo', k: 'fi', c: 'agua', d: 'Parque acuático que en invierno funciona también como estación de esquí.', i: 'Familias y grupos', u: 'http://www.serena.fi/' },
    { n: 'Tropiclandia', p: 'Vaasa', k: 'fi', c: 'agua', d: 'Parque acuático en Vaasa.', i: 'Familias y grupos', u: 'http://www.tropiclandia.fi/' },
    { n: 'Visulahti', p: 'Mikkeli', k: 'fi', c: 'agua', d: 'Parque acuático en Mikkeli.', i: 'Familias y grupos', u: 'http://www.visulahti.fi/' },
    { n: 'Alpamare', p: 'Pfäffikon, Zúrich', k: 'ch', c: 'agua', d: 'Parque acuático cubierto, abierto todo el año.', i: 'Familias y grupos', u: 'http://www.alpamare.ch/' },
    { n: 'Nemo', p: 'Magdeburgo', k: 'de', c: 'agua', d: 'Parque acuático en Magdeburgo.', i: 'Familias y grupos', u: 'https://www.nemo-magdeburg.de/' },
    { n: 'Walygator Grand Est', p: 'Maizières-lès-Metz', k: 'fr', c: 'aventura', d: 'Parque de atracciones familiar en el este de Francia.', i: 'Familias y adolescentes', u: 'https://www.walygatorparc.com/' },
    { n: 'Walygator Sud Ouest', p: 'Agen', k: 'fr', c: 'aventura', d: 'Parque de atracciones con zona acuática en el suroeste de Francia.', i: 'Familias y adolescentes', u: 'https://www.walygatorparc.com/sudouest/' },
    { n: 'Smugglers Adventure', p: 'Hastings', k: 'uk', c: 'aventura', d: 'Recorrido por las cuevas de los contrabandistas de Hastings.', i: 'Familias con niños', u: 'https://www.smugglersadventure.co.uk/' },
    { n: 'Hastings Castle', p: 'Hastings', k: 'uk', c: 'aventura', d: 'Visita a las ruinas del castillo de Hastings.', i: 'Todos los públicos' },
    { n: 'Puuhamaa', p: 'Tervakoski', k: 'fi', c: 'aventura', d: 'Parque de atracciones familiar en Finlandia.', i: 'Familias con niños', u: 'http://www.puuhamaa.fi/' },
    { n: 'Deltapark Neeltje Jans', p: 'Vrouwenpolder', k: 'nl', c: 'aventura', d: 'Parque familiar en plena obra de defensa contra el mar del Delta neerlandés.', i: 'Familias con niños', u: 'https://www.neeltjejans.nl/' },
    { n: 'Linnaeushof', p: 'Bennebroek, cerca de Ámsterdam', k: 'nl', c: 'aventura', d: 'Parque de juegos al aire libre para los más pequeños.', i: 'Familias con niños', u: 'http://www.linnaeushof.nl/' }
  ];
  var COUNTRIES = [
    ['todos', 'Todos'], ['es', 'España'], ['fr', 'Francia'], ['pt', 'Portugal'],
    ['uk', 'Reino Unido'], ['be', 'Bélgica'], ['nl', 'Países Bajos'], ['fi', 'Finlandia'],
    ['ch', 'Suiza'], ['de', 'Alemania']
  ];
  var CNAME = {};
  COUNTRIES.forEach(function (k) { CNAME[k[0]] = k[1]; });

  var state = { filter: 'todos', country: 'todos' };
  var $ = function (id) { return document.getElementById(id); };
  var lastFocus = null;

  // Filtros
  var tabsEl = $('tabs'), countriesEl = $('countries');
  [['todos', 'Todos']].concat(ORDER.map(function (id) { return [id, CATS[id].label]; })).forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.id = t[0]; b.textContent = t[1];
    b.addEventListener('click', function () { state.filter = t[0]; render(); });
    tabsEl.appendChild(b);
  });
  COUNTRIES.forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'country'; b.dataset.id = k[0]; b.textContent = k[1];
    b.addEventListener('click', function () { state.country = k[0]; render(); });
    countriesEl.appendChild(b);
  });
  $('reset').addEventListener('click', function () { state.filter = 'todos'; state.country = 'todos'; render(); });

  function render() {
    Array.prototype.forEach.call(tabsEl.children, function (b) {
      var on = b.dataset.id === state.filter;
      b.setAttribute('aria-pressed', on);
      b.style.background = on ? '#10233F' : '#fff';
      b.style.color = on ? '#FFF6E9' : '#10233F';
    });
    Array.prototype.forEach.call(countriesEl.children, function (b) {
      b.setAttribute('aria-pressed', b.dataset.id === state.country);
    });
    var list = PARKS.filter(function (x) {
      return (state.filter === 'todos' || x.c === state.filter) && (state.country === 'todos' || x.k === state.country);
    });
    $('result-label').textContent = list.length === 1 ? '1 parque' : list.length + ' parques';
    var grid = $('grid');
    grid.innerHTML = '';
    list.forEach(function (x) {
      var cat = CATS[x.c];
      var art = document.createElement('article');
      art.className = 'park ap-card';
      art.innerHTML =
        '<div class="park-top" style="background:' + cat.color + '"><span class="pill"></span><span class="park-photo">[FOTO]</span></div>' +
        '<div class="park-body"><h2 class="park-name"></h2><p class="park-place"></p>' +
        '<button type="button" class="park-open">Ver ficha →</button></div>';
      art.querySelector('.pill').textContent = cat.type;
      art.querySelector('.park-name').textContent = x.n;
      art.querySelector('.park-place').textContent = x.p + ' · ' + CNAME[x.k];
      art.querySelector('.park-open').addEventListener('click', function (e) { openModal(x, e.currentTarget); });
      grid.appendChild(art);
    });
    grid.hidden = list.length === 0;
    $('empty').hidden = list.length !== 0;
  }

  // Ficha
  var modal = $('modal');
  function openModal(x, trigger) {
    lastFocus = trigger;
    var cat = CATS[x.c];
    $('m-top').style.background = cat.color;
    $('m-type').textContent = cat.type;
    $('m-name').textContent = x.n;
    $('m-place').textContent = x.p + ' · ' + CNAME[x.k];
    $('m-desc').textContent = x.d;
    $('m-ideal').textContent = x.i;
    var url = $('m-url');
    if (x.u) { url.href = x.u; url.hidden = false; } else { url.hidden = true; }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('[data-close][aria-label="Cerrar"]').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  Array.prototype.forEach.call(modal.querySelectorAll('[data-close]'), function (b) { b.addEventListener('click', closeModal); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  render();
})();
