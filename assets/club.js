// Demo del pasaporte de temporada: puntos, sellos, niveles y recompensas.
(function () {
  var CATS = {
    agua: { label: 'Agua', color: '#1478B8' },
    animales: { label: 'Animales', color: '#24733E' },
    acuarios: { label: 'Acuarios', color: '#0E5E7A' },
    aventura: { label: 'Atracciones', color: '#C2410C' }
  };
  var ORDER = ['agua', 'animales', 'acuarios', 'aventura'];
  var REWARDS = [
    { p: 0, t: 'Bienvenida', d: 'Descuento en tu próxima entrada online' },
    { p: 300, t: 'Sin colas', d: 'Acceso rápido a una atracción en tu siguiente visita' },
    { p: 600, t: 'Entre bastidores', d: 'Visita guiada con los cuidadores de animales' },
    { p: 1000, t: 'Primero tú', d: 'Prueba las novedades de la temporada antes que nadie' },
    { p: 1500, t: 'Noche de socios', d: 'Parque en exclusiva y una entrada gratis para un amigo' }
  ];
  var CHECK = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10233F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var LOCK = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF6E9" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  var S = { visited: {}, points: 0, allDone: false, msg: '' };
  var $ = function (id) { return document.getElementById(id); };

  // Botones de visita + reiniciar
  var visits = $('visits');
  ORDER.forEach(function (id) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'visit'; b.style.borderColor = CATS[id].color;
    b.textContent = '+ ' + CATS[id].label;
    b.addEventListener('click', function () { visit(id); });
    visits.appendChild(b);
  });
  var reset = document.createElement('button');
  reset.type = 'button'; reset.className = 'visit';
  reset.style.cssText = 'border:0;background:transparent;color:#5A6478;font-weight:500;text-decoration:underline';
  reset.textContent = 'Reiniciar';
  reset.addEventListener('click', function () { S = { visited: {}, points: 0, allDone: false, msg: '' }; render(); });
  visits.appendChild(reset);

  function visit(id) {
    var first = !S.visited[id];
    S.visited[id] = (S.visited[id] || 0) + 1;
    var gain = 100 + (first ? 150 : 0);
    var all = ORDER.every(function (k) { return S.visited[k]; });
    var bonus = all && !S.allDone ? 300 : 0;
    var before = S.points, after = before + gain + bonus;
    var unlocked = REWARDS.filter(function (r) { return r.p > before && r.p <= after; });
    S.points = after; S.allDone = all;
    S.msg = '+' + (gain + bonus) + ' puntos' + (first ? ' · ¡sello nuevo!' : '') + (bonus ? ' · ¡pasaporte completo, +300!' : '') +
      (unlocked.length ? ' · Desbloqueado: ' + unlocked.map(function (r) { return r.t; }).join(', ') : '');
    render(unlocked);
  }

  function render(justUnlocked) {
    var pts = S.points;
    $('points').textContent = pts;
    var tier = pts >= 1500 ? 'Leyenda' : pts >= 600 ? 'Aventurero' : 'Explorador';
    var tierEl = $('tier');
    tierEl.textContent = 'Nivel ' + tier;
    tierEl.style.background = pts >= 1500 ? '#C2410C' : pts >= 600 ? '#24733E' : '#1478B8';
    $('bar').setAttribute('aria-valuenow', Math.min(pts, 1500));
    $('bar-fill').style.width = Math.min(100, pts / 1500 * 100) + '%';
    var nextR = REWARDS.filter(function (r) { return r.p > pts; })[0];
    $('next').textContent = nextR ? 'Te faltan ' + (nextR.p - pts) + ' puntos para desbloquear «' + nextR.t + '».' : '¡Lo has desbloqueado todo esta temporada!';

    var stamps = $('stamps');
    stamps.innerHTML = '';
    ORDER.forEach(function (id) {
      var n = S.visited[id] || 0, c = CATS[id];
      var d = document.createElement('div');
      d.className = 'stamp';
      d.style.borderColor = c.color;
      d.style.borderStyle = n ? 'solid' : 'dashed';
      d.style.background = n ? c.color : 'transparent';
      d.style.color = n ? '#fff' : '#5A6478';
      d.innerHTML = '<b></b><span></span>';
      d.querySelector('b').textContent = c.label;
      d.querySelector('span').textContent = n ? (n === 1 ? '1 visita' : n + ' visitas') : 'sin sello';
      stamps.appendChild(d);
    });

    var rewards = $('rewards');
    rewards.innerHTML = '';
    REWARDS.forEach(function (r) {
      var on = pts >= r.p;
      var row = document.createElement('div');
      row.className = 'reward';
      row.style.background = on ? '#FFF6E9' : 'rgba(255,246,233,.08)';
      row.style.color = on ? '#10233F' : '#FFF6E9';
      row.innerHTML = '<span class="reward-icon" style="background:' + (on ? '#F2B134' : 'rgba(255,246,233,.18)') + '">' + (on ? CHECK : LOCK) + '</span>' +
        '<div style="flex:1"><p style="margin:0;font-weight:700;font-size:16px"></p><p style="margin:2px 0 0;font-size:14px;opacity:.85"></p></div>' +
        '<span style="font-weight:700;font-size:14px;white-space:nowrap">' + r.p + ' pts</span>';
      var ps = row.querySelectorAll('p');
      ps[0].textContent = r.t + (on ? '' : ' (bloqueada)');
      ps[1].textContent = r.d;
      if (justUnlocked && justUnlocked.indexOf(r) !== -1) row.classList.add('flash');
      rewards.appendChild(row);
    });

    var msg = $('msg');
    msg.hidden = !S.msg;
    msg.textContent = S.msg;
  }
  render();
})();
