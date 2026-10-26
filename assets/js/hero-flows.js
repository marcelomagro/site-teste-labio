(() => {
  const hero = document.querySelector('.hero');
  const svg = hero?.querySelector('.hero-flows');
  const gear = hero?.querySelector('#hero-labio-art');
  if (!svg || !gear) return;

  const tracks = svg.querySelector('.hero-flow-tracks');
  const streams = svg.querySelector('.hero-flow-streams');
  const areaMask = svg.querySelector('.hero-flow-mask-area');
  const gearMask = svg.querySelector('.hero-flow-gear-mask');
  const namespace = 'http://www.w3.org/2000/svg';
  const wireCount = 84;
  let drawFrame = null;
  let lastGeometry = '';

  // A mesma distribuição em todo resize evita saltos aleatórios nos fios.
  const noise = (index, salt) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const number = (value) => value.toFixed(2);

  const draw = () => {
    drawFrame = null;
    const bounds = hero.getBoundingClientRect();
    const gearBounds = gear.getBoundingClientRect();
    if (!bounds.width || !bounds.height || !gearBounds.width) return;

    // O centro acompanha a engrenagem real, inclusive no layout empilhado.
    const centerX = gearBounds.left + gearBounds.width / 2 - bounds.left;
    const centerY = gearBounds.top + gearBounds.height / 2 - bounds.top;
    const geometry = [bounds.width, bounds.height, centerX, centerY, gearBounds.width].map(number).join('|');
    if (geometry === lastGeometry) return;
    lastGeometry = geometry;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    svg.querySelector('#hero-flow-mask').setAttribute('width', bounds.width);
    svg.querySelector('#hero-flow-mask').setAttribute('height', bounds.height);
    areaMask.setAttribute('width', bounds.width);
    areaMask.setAttribute('height', bounds.height);

    // Os fios percorrem todo o fundo; só o centro do pulso fica protegido.
    gearMask.setAttribute('cx', centerX);
    gearMask.setAttribute('cy', centerY);
    gearMask.setAttribute('r', gearBounds.width * 0.205);

    const trackFragment = document.createDocumentFragment();
    const streamFragment = document.createDocumentFragment();
    for (let index = 0; index < wireCount; index += 1) {
      const angle = (index / wireCount) * Math.PI * 2;
      const radiusX = bounds.width * (0.68 + noise(index, 1) * 0.38);
      const radiusY = bounds.height * (0.55 + noise(index, 2) * 0.45);
      const twist = Math.PI * (0.35 + noise(index, 3) * 0.2);
      const startX = centerX + Math.cos(angle) * radiusX;
      const startY = centerY + Math.sin(angle) * radiusY;
      const control1X = centerX + Math.cos(angle - twist) * radiusX * 0.64;
      const control1Y = centerY + Math.sin(angle - twist) * radiusY * 0.7;
      const control2X = centerX + Math.cos(angle - twist / 2) * radiusX * 0.18;
      const control2Y = centerY + Math.sin(angle - twist / 2) * radiusY * 0.22;
      const pathData = `M ${number(startX)} ${number(startY)} C ${number(control1X)} ${number(control1Y)}, ${number(control2X)} ${number(control2Y)}, ${number(centerX)} ${number(centerY)}`;
      const colorClass = index % 2 ? 'hero-flow-red' : 'hero-flow-blue';
      const track = document.createElementNS(namespace, 'path');
      track.setAttribute('d', pathData);
      track.setAttribute('class', `hero-flow-track ${colorClass}`);
      trackFragment.appendChild(track);

      const duration = (7 + noise(index, 4) * 7) * 0.92;
      const stream = document.createElementNS(namespace, 'path');
      stream.setAttribute('d', pathData);
      stream.setAttribute('pathLength', '1');
      stream.setAttribute('class', `hero-flow-stream ${colorClass}`);
      stream.style.setProperty('--flow-duration', `${duration.toFixed(2)}s`);
      stream.style.setProperty('--flow-delay', `${(-noise(index, 5) * duration).toFixed(2)}s`);
      streamFragment.appendChild(stream);
    }

    tracks.replaceChildren(trackFragment);
    streams.replaceChildren(streamFragment);
    svg.classList.add('is-ready');
  };

  const scheduleDraw = () => {
    if (drawFrame === null) drawFrame = requestAnimationFrame(draw);
  };
  const resizeObserver = new ResizeObserver(scheduleDraw);
  [hero, gear].forEach((element) => resizeObserver.observe(element));
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    hero.classList.toggle('is-outside-viewport', !entry.isIntersecting);
  });
  visibilityObserver.observe(hero);
  document.fonts.ready.then(scheduleDraw);
  scheduleDraw();
})();
