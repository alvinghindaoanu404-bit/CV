/* ==========================================================================
   CV site — rendering + motion
   Reads window.CV (js/content.js), builds every section, then wires up the
   opening scene, scroll reveals and scroll-linked effects. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var CV = window.CV || {};
  var person = CV.person || {};
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function has(list) { return Array.isArray(list) && list.length > 0; }
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function append(node, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
    node.appendChild(typeof child === 'string' ? doc.createTextNode(child) : child);
  }

  // el('a', { class: 'x', href: '#' }, child, child...) — text is always inserted as text, never HTML.
  function el(tag, attrs) {
    var node = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value == null || value === false) return;
        if (key === 'class') node.className = value;
        else if (key === 'style') node.style.cssText = value;
        else node.setAttribute(key, value === true ? '' : value);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }

  // Only allow web, mail, phone and relative links.
  function safeUrl(url) {
    if (typeof url !== 'string') return null;
    var u = url.trim();
    if (!u) return null;
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null;
    return u;
  }
  function isExternal(url) { return /^https?:/i.test(url); }

  var ICONS = {
    download: '<path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14"/>',
    arrow: '<path d="M7 17L17 7M9 7h8v8"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 10-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'
  };
  function icon(name) {
    var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'icon');
    svg.innerHTML = ICONS[name] || '';
    return svg;
  }

  function link(label, url, cls) {
    var href = safeUrl(url);
    if (!href) return null;
    var ext = isExternal(href);
    return el('a', { class: cls || 'textlink', href: href, target: ext ? '_blank' : null, rel: ext ? 'noopener' : null },
      label, ext ? icon('arrow') : null);
  }

  function period(item) {
    var start = item.start || '';
    var end = item.end || (item.current ? 'Present' : '');
    if (start && end && start !== end) return start + ' — ' + end;
    return start || end;
  }

  function initials(name) {
    return String(name || '').split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0); })
      .join('').slice(0, 3).toUpperCase();
  }

  function pdfName() {
    // Plain ASCII file name: "Ghindăoanu" becomes "Ghindaoanu".
    var plain = String(person.name || 'CV').trim();
    if (plain.normalize) plain = plain.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return plain.replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-CV.pdf';
  }

  function pdfButton(cls, label) {
    var href = safeUrl(person.pdf);
    if (!href) return null;
    return el('a', { class: cls, href: href, download: pdfName() }, label, icon('download'));
  }

  /* ------------------------------------------------------------------ */
  /* Render: hero                                                        */
  /* ------------------------------------------------------------------ */
  function renderHero() {
    var name = String(person.name || '').trim();
    var words = name.split(/\s+/).filter(Boolean);
    var lines = words.length > 2 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : words;

    var h1 = $('#heroName');
    h1.setAttribute('aria-label', name);
    lines.forEach(function (text, i) {
      var inner = el('span', { class: 'line__inner', 'aria-hidden': 'true' }, text);
      if (i === lines.length - 1) inner.appendChild(el('span', { class: 'dot' }, '.'));
      h1.appendChild(el('span', { class: 'line', style: '--i:' + (i + 1) }, inner));
    });

    var eyebrow = $('#heroEyebrow');
    if (person.availability) eyebrow.appendChild(el('span', { class: 'badge' }, el('i'), person.availability));
    if (person.location) eyebrow.appendChild(el('span', { class: 'hero__where' }, icon('pin'), person.location));
    if (!eyebrow.childNodes.length) eyebrow.hidden = true;

    $('#heroRole').textContent = person.role || '';
    $('#heroTagline').textContent = person.tagline || '';

    var actions = $('#heroActions');
    append(actions, pdfButton('btn btn--primary', 'Download CV'));
    actions.appendChild(el('a', { class: 'btn btn--ghost', href: '#contact' }, 'Get in touch', icon('arrow')));

    var links = $('#heroLinks');
    (person.links || []).forEach(function (l) {
      var a = link(l.label, l.url, null);
      if (a) { a.className = ''; links.appendChild(el('li', null, a)); }
    });
    if (!links.childNodes.length) links.hidden = true;

    var img = $('#heroPhoto');
    var src = safeUrl(person.photo);
    if (src) {
      img.src = src;
      img.alt = person.photoAlt || ('Portrait of ' + name);
    } else {
      $('#portrait').hidden = true;
    }
    append($('#heroCaption'), [el('span', null, name), el('span', null, person.location || '')]);

    // Brand marks
    var mark = initials(name);
    append($('#navBrand'), [mark, el('i', null, '.')]);
    append($('#introMark'), [mark, el('i', null, '.')]);

    var navCv = $('#navCv');
    var pdf = safeUrl(person.pdf);
    if (pdf) {
      navCv.href = pdf;
      navCv.setAttribute('download', pdfName());
      navCv.setAttribute('aria-label', 'Download CV as PDF');
      navCv.appendChild(icon('download'));
      navCv.hidden = false;
    }

    doc.title = name + (person.role ? ' — ' + person.role : '');
    $('#footerCopy').textContent = '© ' + new Date().getFullYear() + ' ' + name;
  }

  /* ------------------------------------------------------------------ */
  /* Render: about                                                       */
  /* ------------------------------------------------------------------ */
  function renderAbout() {
    var about = CV.about || {};
    var body = $('#aboutBody');
    if (!about.lead && !has(about.paragraphs)) return false;

    var text = el('div', { class: 'about__text' });
    if (about.lead) {
      var lead = el('p', { class: 'about__lead', id: 'aboutLead', 'aria-label': about.lead });
      about.lead.split(/\s+/).forEach(function (word, i) {
        if (i) lead.appendChild(doc.createTextNode(' '));
        lead.appendChild(el('span', { class: 'w', 'aria-hidden': 'true' }, word));
      });
      text.appendChild(lead);
    }
    (about.paragraphs || []).forEach(function (p, i) {
      text.appendChild(el('p', { 'data-reveal': 'up', style: '--d:' + i * 90 + 'ms' }, p));
    });
    body.appendChild(text);

    if (has(about.facts)) {
      var facts = el('dl', { class: 'facts', 'data-reveal': 'up' });
      about.facts.forEach(function (f) {
        facts.appendChild(el('div', null, el('dt', { class: 'mono' }, f.label), el('dd', null, f.value)));
      });
      body.appendChild(facts);
    }

    if (has(about.stats)) {
      var stats = el('div', { class: 'stats', 'data-reveal': 'up' });
      about.stats.forEach(function (s) {
        var num = el('span', { 'data-count': String(s.value) }, String(s.value));
        stats.appendChild(el('div', { class: 'stat' },
          el('p', { class: 'stat__value' }, s.prefix ? el('em', null, s.prefix) : null, num, s.suffix ? el('em', null, s.suffix) : null),
          el('p', { class: 'stat__label mono' }, s.label)));
      });
      body.appendChild(stats);
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Render: experience                                                  */
  /* ------------------------------------------------------------------ */
  function tagList(items) {
    if (!has(items)) return null;
    return el('ul', { class: 'tags' }, items.map(function (t) { return el('li', null, t); }));
  }

  // A bullet is either plain text or { label: "Gold", text: "..." }.
  function bullet(b) {
    if (typeof b === 'string') return el('li', null, b);
    var label = b.label ? el('span', { class: 'tl__label mono' + (/^(gold|1st)/i.test(b.label) ? ' is-hi' : '') }, b.label) : null;
    return el('li', { class: label ? 'has-label' : null }, label, b.text || '');
  }

  // Work experience timeline.
  function renderTimeline(id, items) {
    if (!has(items)) return false;
    var wrap = $('#' + id);
    wrap.appendChild(el('span', { class: 'tl__progress', 'aria-hidden': 'true' }));
    var list = el('ol', { class: 'tl__list' });

    items.forEach(function (job) {
      var company = safeUrl(job.url)
        ? el('a', { href: safeUrl(job.url), target: '_blank', rel: 'noopener' }, job.company)
        : job.company;
      list.appendChild(el('li', { class: 'tl__item' + (job.current ? ' is-current' : ''), 'data-reveal': 'up' },
        el('p', { class: 'tl__when' }, period(job), job.location ? el('small', null, job.location) : null),
        el('span', { class: 'tl__dot', 'aria-hidden': 'true' }),
        el('div', { class: 'tl__body' },
          el('h3', { class: 'tl__role' }, job.role, job.current ? el('span', { class: 'tl__now mono' }, 'Now') : null),
          job.company ? el('p', { class: 'tl__company' }, company) : null,
          job.summary ? el('p', { class: 'tl__summary' }, job.summary) : null,
          has(job.bullets) ? el('ul', { class: 'tl__bullets' }, job.bullets.map(bullet)) : null,
          tagList(job.tech))));
    });
    wrap.appendChild(list);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Render: projects                                                    */
  /* ------------------------------------------------------------------ */
  function renderProjects() {
    var projects = CV.projects;
    if (!has(projects)) return false;
    var grid = $('#projectGrid');

    projects.forEach(function (p, i) {
      var visual;
      var src = safeUrl(p.image);
      var model = safeUrl(p.model);
      if (src) {
        visual = el('div', { class: 'project__visual' },
          el('img', { src: src, alt: p.imageAlt || '', loading: 'lazy' }));
      } else {
        // Drawn placeholder: also what shows if a 3D model cannot load.
        visual = el('div', { class: 'project__visual project__visual--gen' },
          el('span', { class: 'project__tick mono', 'aria-hidden': 'true' }, 'PRJ / ' + pad(i + 1)),
          el('span', { class: 'project__idx', 'aria-hidden': 'true' }, pad(i + 1)));
        if (model && window.STLViewer) {
          visual.classList.add('project__visual--model');
          var canvas = el('canvas', { class: 'project__model', role: 'img',
            'aria-label': '3D model of ' + p.title + '. Drag to rotate.' });
          visual.appendChild(canvas);
          if (p.modelLabel) visual.appendChild(el('span', { class: 'project__dims mono', 'aria-hidden': 'true' }, p.modelLabel));
          visual.appendChild(el('span', { class: 'project__hint mono', 'aria-hidden': 'true' }, 'Drag to rotate'));
          window.STLViewer.mount(canvas, model,
            function () { visual.classList.add('has-model'); },
            function () {
              visual.classList.remove('project__visual--model');
              if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            });
        }
      }

      var links = (p.links || []).map(function (l) { return link(l.label, l.url); }).filter(Boolean);
      var kicker = (p.featured ? 'Featured project' : 'Project ' + pad(i + 1)) + (p.year ? ' · ' + p.year : '');

      var nums = has(p.highlights) ? el('ul', { class: 'project__nums' }, p.highlights.map(function (h) {
        return el('li', null, el('strong', null, h.value), el('span', null, h.label));
      })) : null;
      // The featured card shows its key numbers as a strip under the picture.
      var side = p.featured ? el('div', { class: 'project__side' }, visual, nums) : visual;

      grid.appendChild(el('article', {
        class: 'project' + (p.featured ? ' project--featured' : ''),
        'data-reveal': 'up',
        style: '--d:' + (p.featured ? 0 : ((i + 1) % 2) * 110) + 'ms'
      },
        side,
        el('div', { class: 'project__body' },
          el('p', { class: 'project__kicker mono' }, kicker),
          el('h3', { class: 'project__title' }, p.title),
          p.meta ? el('p', { class: 'project__meta' }, p.meta) : null,
          p.description ? el('p', { class: 'project__desc' }, p.description) : null,
          p.role ? el('p', { class: 'project__role' }, el('span', { class: 'mono' }, 'My part'), p.role) : null,
          p.featured ? null : nums,
          tagList(p.tags),
          links.length ? el('div', { class: 'project__links' }, links) : null)));
    });
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Render: skills + moving band                                        */
  /* ------------------------------------------------------------------ */
  function renderSkills() {
    var groups = (CV.skills || []).filter(function (g) { return g && has(g.items); });
    var band = $('#band');
    if (!groups.length) { band.hidden = true; return false; }

    var grid = $('#skillGrid');
    groups.forEach(function (g, i) {
      grid.appendChild(el('article', { class: 'skill', 'data-reveal': 'up', style: '--d:' + (i % 4) * 90 + 'ms' },
        el('h3', { class: 'skill__title mono' }, g.group),
        el('ul', { class: 'chips' }, g.items.map(function (item, k) {
          return el('li', { style: '--k:' + k }, item);
        }))));
    });

    // Band: chosen words (or the first skill groups), repeated twice so the loop is seamless.
    var words = has(CV.band) ? CV.band.slice() : [];
    if (!words.length) groups.slice(0, 3).forEach(function (g) { words = words.concat(g.items); });
    words = words.slice(0, 14);
    if (words.length < 3) { band.hidden = true; return true; }
    var track = $('#bandTrack');
    for (var copy = 0; copy < 2; copy++) {
      var group = el('div', { class: 'band__group' });
      words.forEach(function (w) {
        group.appendChild(el('span', { class: 'band__item' }, w));
        group.appendChild(el('span', { class: 'band__sep' }));
      });
      track.appendChild(group);
    }
    track.style.setProperty('--band-speed', Math.max(26, words.join('').length * 0.55) + 's');
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Render: education & credentials                                     */
  /* ------------------------------------------------------------------ */
  function block(title, content) {
    return el('div', { class: 'creds__block' }, el('h3', { class: 'sub mono' }, title), content);
  }

  function renderCredentials() {
    var left = [];
    var right = [];

    if (has(CV.education)) {
      left.push(block('Education', el('ul', { class: 'rows' }, CV.education.map(function (e, i) {
        var meta = [e.school, e.location].filter(Boolean).join(' · ');
        return el('li', { class: 'row', 'data-reveal': 'up', style: '--d:' + i * 90 + 'ms' },
          el('span', { class: 'row__when' }, period(e)),
          el('div', null,
            el('h4', { class: 'row__title' }, e.degree),
            meta ? el('p', { class: 'row__meta' }, meta) : null,
            e.details ? el('p', { class: 'row__note' }, e.details) : null));
      }))));
    }

    if (has(CV.languages)) {
      right.push(block('Languages', el('ul', { class: 'rows' }, CV.languages.map(function (l, i) {
        return el('li', { class: 'row row--lang', 'data-reveal': 'up', style: '--d:' + i * 90 + 'ms' },
          el('h4', { class: 'row__title' }, l.name),
          el('span', { class: 'row__when' }, l.level || ''));
      }))));
    }

    if (has(CV.beyond)) {
      right.push(block('Beyond engineering', el('ul', { class: 'rows' }, CV.beyond.map(function (b, i) {
        return el('li', { class: 'row row--plain', 'data-reveal': 'up', style: '--d:' + i * 90 + 'ms' },
          el('h4', { class: 'row__title' }, b.title),
          b.note || b.year ? el('p', { class: 'row__note' }, [b.year, b.note].filter(Boolean).join(' · ')) : null);
      }))));
    }

    if (has(CV.certifications)) {
      right.push(block('Certificates & courses', el('ul', { class: 'rows' }, CV.certifications.map(function (c, i) {
        var title = safeUrl(c.url)
          ? el('a', { href: safeUrl(c.url), target: '_blank', rel: 'noopener' }, c.title)
          : c.title;
        return el('li', { class: 'row', 'data-reveal': 'up', style: '--d:' + i * 90 + 'ms' },
          el('span', { class: 'row__when' }, c.year || ''),
          el('div', null,
            el('h4', { class: 'row__title' }, title),
            c.issuer ? el('p', { class: 'row__meta' }, c.issuer) : null));
      }))));
    }

    if (has(CV.interests)) {
      right.push(block('Interests', el('ul', { class: 'chips', 'data-reveal': 'up' },
        CV.interests.map(function (t) { return el('li', null, t); }))));
    }

    if (!left.length && !right.length) return false;
    var grid = $('#credGrid');
    if (left.length && right.length) {
      grid.appendChild(el('div', { class: 'creds__col' }, left));
      grid.appendChild(el('div', { class: 'creds__col' }, right));
    } else {
      grid.classList.add('creds--single');
      grid.appendChild(el('div', { class: 'creds__col' }, left.concat(right)));
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Render: contact                                                     */
  /* ------------------------------------------------------------------ */
  function renderContact() {
    var contact = CV.contact || {};
    var body = $('#contactBody');
    var email = String(person.email || '').trim();
    var links = (person.links || []).map(function (l) { return link(l.label, l.url); }).filter(Boolean);
    if (!email && !links.length) return false;

    if (contact.headline) body.appendChild(el('p', { class: 'contact__headline', 'data-reveal': 'up' }, contact.headline));
    if (contact.note) body.appendChild(el('p', { class: 'contact__note', 'data-reveal': 'up', style: '--d:80ms' }, contact.note));

    if (email) {
      var copyLabel = el('span', null, 'Copy');
      var copyBtn = el('button', { class: 'copy mono', type: 'button', 'aria-label': 'Copy email address' }, icon('copy'), copyLabel);
      copyBtn.addEventListener('click', function () {
        copyText(email).then(function () {
          copyBtn.classList.add('is-done');
          copyLabel.textContent = 'Copied';
          setTimeout(function () { copyBtn.classList.remove('is-done'); copyLabel.textContent = 'Copy'; }, 1800);
        }, function () { copyLabel.textContent = 'Press Ctrl+C'; });
      });
      body.appendChild(el('div', { class: 'contact__row', 'data-reveal': 'up', style: '--d:160ms' },
        el('a', { class: 'contact__mail', href: 'mailto:' + email }, email, icon('arrow')),
        copyBtn));
    }

    body.appendChild(el('div', { class: 'contact__actions', 'data-reveal': 'up', style: '--d:240ms' },
      pdfButton('btn btn--primary', 'Download CV'),
      links.length ? el('div', { class: 'contact__links mono' }, links) : null));
    return true;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = el('textarea', { style: 'position:fixed;opacity:0;top:0;left:0' });
      ta.value = text;
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      doc.body.removeChild(ta);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation built from whichever sections have content               */
  /* ------------------------------------------------------------------ */
  var sections = [];

  function buildNav(visible) {
    var navLinks = $('#navLinks');
    var menuLinks = $('#menuLinks');
    $all('main .section').forEach(function (section) {
      if (!visible[section.id]) { section.hidden = true; return; }
      var index = sections.length + 1;
      var label = section.getAttribute('data-nav') || section.id;
      $('.section__num', section).textContent = pad(index);
      sections.push({ node: section, label: label });
      navLinks.appendChild(el('a', { href: '#' + section.id }, label));
      menuLinks.appendChild(el('a', { href: '#' + section.id, style: '--i:' + (index - 1) }, el('small', null, pad(index)), label));
    });
    if (sections.length) $('#heroScroll').setAttribute('href', '#' + sections[0].node.id);
    else $('#heroScroll').hidden = true;
  }

  function wireMenu() {
    var toggle = $('#navToggle');
    var menu = $('#menu');
    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setOpen(false); });
  }

  /* ------------------------------------------------------------------ */
  /* Motion: opening scene                                               */
  /* ------------------------------------------------------------------ */
  function runIntro() {
    var intro = $('#intro');
    function finish() {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
      root.classList.remove('intro-active');
      root.classList.add('intro-done');
    }
    if (!intro || reduceMotion || location.hash.length > 1) {
      root.classList.add('hero-in');
      finish();
      return;
    }

    var opened = false;
    var timer;
    var skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

    function open(fast) {
      if (opened) return;
      opened = true;
      clearTimeout(timer);
      skipEvents.forEach(function (name) { window.removeEventListener(name, skip); });
      if (fast) intro.classList.add('is-fast');
      intro.classList.add('is-opening');
      root.classList.remove('intro-active');
      root.classList.add('hero-in');
      setTimeout(finish, fast ? 500 : 1000);
    }
    function skip() { open(true); }

    root.classList.add('intro-active');
    skipEvents.forEach(function (name) { window.addEventListener(name, skip, { passive: true }); });
    // Two frames so the starting state is painted before the transition begins.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { intro.classList.add('is-playing'); });
    });
    timer = setTimeout(function () { open(false); }, 1500);
  }

  /* ------------------------------------------------------------------ */
  /* Motion: reveal on scroll                                            */
  /* ------------------------------------------------------------------ */
  function countUp(node) {
    var target = parseFloat(node.getAttribute('data-count'));
    if (!isFinite(target)) return;
    var decimals = (String(node.getAttribute('data-count')).split('.')[1] || '').length;
    var start = null;
    var duration = 1400;
    function frame(now) {
      if (start === null) start = now;
      var t = clamp((now - start) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      node.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(frame);
    }
    node.textContent = (0).toFixed(decimals);
    requestAnimationFrame(frame);
  }

  function wireReveals() {
    var targets = $all('[data-reveal]');
    function show(node) {
      node.classList.add('in');
      if (!reduceMotion) $all('[data-count]', node).forEach(countUp);
    }
    if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
    targets.forEach(function (node) { io.observe(node); });
  }

  /* ------------------------------------------------------------------ */
  /* Motion: scroll-linked effects                                       */
  /* ------------------------------------------------------------------ */
  // Where the two ambient lights sit for each scene (vw, vh).
  var LIGHTS = [
    { blue: [78, 22], red: [6, 96] },
    { blue: [14, 34], red: [94, 82] },
    { blue: [86, 62], red: [12, 12] },
    { blue: [18, 78], red: [84, 18] },
    { blue: [74, 24], red: [22, 88] },
    { blue: [12, 20], red: [90, 72] },
    { blue: [50, 88], red: [50, 0] },
    { blue: [82, 40], red: [10, 60] }
  ];

  function wireScroll() {
    var bar = $('#progressBar');
    var nav = $('#nav');
    var hero = $('.hero__inner');
    var lead = $('#aboutLead');
    var words = lead ? $all('.w', lead) : [];
    var timelines = $all('.tl').map(function (node) {
      return { node: node, bar: $('.tl__progress', node), items: $all('.tl__item', node) };
    }).filter(function (t) { return t.bar; });
    var navAnchors = $all('#navLinks a');
    var scene = $('#scene');
    var sceneNum = $('#sceneNum');
    var sceneName = $('#sceneName');
    var glowBlue = $('#glowBlue');
    var glowRed = $('#glowRed');
    var active = -2;
    var litWords = -1;
    var ticking = false;

    if (reduceMotion) words.forEach(function (w) { w.classList.add('on'); });

    function setActive(index) {
      active = index;
      navAnchors.forEach(function (a, i) {
        if (i === index) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      sceneNum.textContent = pad(index + 1);
      sceneName.textContent = index < 0 ? 'Intro' : sections[index].label;
      scene.classList.remove('is-flip');
      void scene.offsetWidth;
      scene.classList.add('is-flip');

      var light = LIGHTS[(index + 1) % LIGHTS.length];
      glowBlue.style.setProperty('--x', light.blue[0]);
      glowBlue.style.setProperty('--y', light.blue[1]);
      glowRed.style.setProperty('--x', light.red[0]);
      glowRed.style.setProperty('--y', light.red[1]);
    }

    function update() {
      ticking = false;
      var y = window.pageYOffset || root.scrollTop;
      var vh = window.innerHeight;
      var max = root.scrollHeight - vh;

      bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ')';
      nav.classList.toggle('is-scrolled', y > 24);

      // Hero recedes as the first scene scrolls away.
      if (!reduceMotion && hero) hero.style.setProperty('--p', clamp(y / (vh * 0.95), 0, 1).toFixed(3));

      // About statement lights up word by word.
      if (words.length && !reduceMotion) {
        var lr = lead.getBoundingClientRect();
        var from = vh * 0.86;
        var to = vh * 0.4;
        var lp = clamp((from - lr.top) / (from - to + lr.height * 0.6), 0, 1);
        var n = Math.round(lp * words.length);
        if (n !== litWords) {
          litWords = n;
          for (var w = 0; w < words.length; w++) words[w].classList.toggle('on', w < n);
        }
      }

      // Timeline line fills, dots switch on as it passes them.
      var mark = vh * 0.62;
      timelines.forEach(function (tl) {
        var tr = tl.node.getBoundingClientRect();
        var tp = reduceMotion ? 1 : clamp((mark - tr.top) / Math.max(tr.height, 1), 0, 1);
        tl.bar.style.transform = 'scaleY(' + tp.toFixed(4) + ')';
        for (var t = 0; t < tl.items.length; t++) {
          var passed = reduceMotion || tl.items[t].getBoundingClientRect().top < mark - 8;
          tl.items[t].classList.toggle('is-passed', passed);
        }
      });

      // Which scene is on screen.
      var index = -1;
      for (var s = 0; s < sections.length; s++) {
        if (sections[s].node.getBoundingClientRect().top <= vh * 0.45) index = s;
      }
      if (max > 0 && y >= max - 2 && sections.length) index = sections.length - 1;
      if (index !== active) setActive(index);
    }

    function request() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* Motion: pointer effects (mouse only)                                */
  /* ------------------------------------------------------------------ */
  function wirePointer() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var hero = $('.hero');
    var frame = $('.portrait__frame');
    if (hero && frame) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        frame.style.setProperty('--rx', (px * 7).toFixed(2));
        frame.style.setProperty('--ry', (py * -5).toFixed(2));
      });
      hero.addEventListener('pointerleave', function () {
        frame.style.setProperty('--rx', 0);
        frame.style.setProperty('--ry', 0);
      });
    }

    $all('.project').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Keep a long name on one line per word by shrinking it to fit        */
  /* ------------------------------------------------------------------ */
  function fitName() {
    var h1 = $('#heroName');
    if (!h1) return;
    var inners = $all('.line__inner', h1);
    function fit() {
      h1.style.fontSize = '';
      var available = h1.clientWidth;
      var widest = 0;
      inners.forEach(function (node) { widest = Math.max(widest, node.offsetWidth); });
      if (widest > available && available > 0) {
        var size = parseFloat(getComputedStyle(h1).fontSize);
        h1.style.fontSize = Math.max(22, Math.floor(size * (available / widest) * 0.985)) + 'px';
      }
    }
    fit();
    window.addEventListener('resize', fit);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fit);
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  renderHero();
  buildNav({
    about: renderAbout(),
    experience: renderTimeline('timeline', CV.experience),
    projects: renderProjects(),
    education: renderCredentials(),
    skills: renderSkills(),
    contact: renderContact()
  });
  wireMenu();
  fitName();
  wireReveals();
  wireScroll();
  wirePointer();
  runIntro();
})();
