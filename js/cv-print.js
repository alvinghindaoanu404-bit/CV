/* ==========================================================================
   Printable CV renderer (cv.html). Same data as the website: js/content.js.
   ========================================================================== */
(function () {
  'use strict';

  var CV = window.CV || {};
  var person = CV.person || {};
  var doc = document;

  function has(list) { return Array.isArray(list) && list.length > 0; }

  function append(node, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
    node.appendChild(typeof child === 'string' ? doc.createTextNode(child) : child);
  }
  function el(tag, attrs) {
    var node = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (attrs[key] == null || attrs[key] === false) return;
        if (key === 'class') node.className = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function safeUrl(url) {
    if (typeof url !== 'string') return null;
    var u = url.trim();
    return /^(https?:|mailto:|tel:)/i.test(u) ? u : null;
  }
  function bare(url) { return String(url).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''); }
  function period(item) {
    var start = item.start || '';
    var end = item.end || (item.current ? 'Present' : '');
    if (start && end && start !== end) return start + ' – ' + end;
    return start || end;
  }
  function section(title, content) {
    return el('section', { class: 'sec' }, el('h2', { class: 'sec__title' }, title), content);
  }

  var sheet = doc.getElementById('cv');
  var name = String(person.name || '').trim();
  doc.title = name + ' — CV';

  /* Header */
  var contact = el('p', { class: 'head__contact' });
  if (person.location) contact.appendChild(el('span', null, person.location));
  if (person.email) contact.appendChild(el('a', { href: 'mailto:' + person.email }, person.email));
  if (person.phone) contact.appendChild(el('a', { href: 'tel:' + String(person.phone).replace(/[^\d+]/g, '') }, person.phone));
  (person.links || []).forEach(function (l) {
    var href = safeUrl(l.url);
    // A bare domain with no profile path is still a placeholder; leave it out.
    if (href && bare(href).indexOf('/') > -1) contact.appendChild(el('a', { href: href }, bare(href)));
  });

  sheet.appendChild(el('header', { class: 'head' },
    el('h1', { class: 'head__name' }, name, el('i')),
    person.role ? el('p', { class: 'head__role' }, person.role) : null,
    contact));

  /* Profile */
  var about = CV.about || {};
  var profile = person.tagline || about.lead || '';
  if (profile) sheet.appendChild(section('Profile', el('p', { class: 'profile' }, profile)));

  function bulletText(b) {
    if (typeof b === 'string') return b;
    return (b.label ? b.label + ' — ' : '') + (b.text || '');
  }

  function timeline(title, items) {
    if (!has(items)) return;
    sheet.appendChild(section(title, items.map(function (job) {
      return el('div', { class: 'item' },
        el('div', { class: 'item__top' },
          el('h3', { class: 'item__title' }, job.role, job.company ? el('span', null, ' · ' + job.company) : null),
          el('span', { class: 'item__when' }, [job.location, period(job)].filter(Boolean).join(' ').trim())),
        job.summary ? el('p', { class: 'item__text' }, job.summary) : null,
        has(job.bullets) ? el('ul', null, job.bullets.map(function (b) { return el('li', null, bulletText(b)); })) : null);
    })));
  }

  /* Education (first: this is a student CV) */
  if (has(CV.education)) {
    sheet.appendChild(section('Education', CV.education.map(function (e) {
      return el('div', { class: 'item' },
        el('div', { class: 'item__top' },
          el('h3', { class: 'item__title' }, e.degree),
          el('span', { class: 'item__when' }, period(e))),
        // A very short note rides on the school line; a longer one gets its own.
        el('p', { class: 'item__sub' }, [e.school, e.location, e.details && e.details.length <= 24 ? e.details.replace(/\.$/, '') : '']
          .filter(Boolean).join(' · ')),
        e.details && e.details.length > 24 ? el('p', { class: 'item__text' }, e.details) : null);
    })));
  }

  /* Experience */
  timeline('Experience', CV.experience);

  /* Projects */
  var projects = (CV.projects || []).filter(function (p) { return p.pdf !== false; });
  if (projects.length) {
    sheet.appendChild(section('Projects', projects.map(function (p) {
      var nums = (p.highlights || []).map(function (h) { return h.value + ' ' + h.label; }).join(' · ');
      return el('div', { class: 'item' },
        el('div', { class: 'item__top' },
          el('h3', { class: 'item__title' }, p.title),
          el('span', { class: 'item__when' }, p.year || '')),
        p.meta ? el('p', { class: 'item__sub' }, p.meta + (has(p.tags) ? ' · ' + p.tags.join(', ') : '')) : null,
        p.short || p.description ? el('p', { class: 'item__text' }, p.short || p.description) : null,
        p.role ? el('p', { class: 'item__text' }, el('strong', null, 'My part: '), p.role) : null,
        nums ? el('p', { class: 'item__tech' }, nums) : null);
    })));
  }

  /* Skills */
  var groups = (CV.skills || []).filter(function (g) { return g && has(g.items); });
  if (groups.length) {
    var dl = el('dl', { class: 'kv' });
    groups.forEach(function (g) {
      dl.appendChild(el('dt', null, g.group));
      dl.appendChild(el('dd', null, g.items.join(', ')));
    });
    sheet.appendChild(section('Skills', dl));
  }

  /* Everything else, as one compact list */
  var more = el('dl', { class: 'kv' });
  function row(label, text) {
    if (!text) return;
    more.appendChild(el('dt', null, label));
    more.appendChild(el('dd', null, text));
  }
  row('Languages', (CV.languages || []).map(function (l) {
    return l.name + (l.level ? ' (' + l.level + ')' : '');
  }).join(' · '));
  row('Beyond engineering', (CV.beyond || []).map(function (b) {
    return b.title + (b.year ? ', ' + b.year : '') + (b.note ? '. ' + b.note : '.');
  }).join(' '));
  row('Courses', (CV.certifications || []).map(function (c) {
    return c.title + (c.issuer ? ', ' + c.issuer : '') + (c.year ? ' (' + c.year + ')' : '');
  }).join(' · '));
  var licences = (about.facts || []).filter(function (f) { return /licen/i.test(f.label); })
    .map(function (f) { return f.value; }).join(' · ');
  row('Licences', licences);
  row('Interests', (CV.interests || []).join(', '));
  if (more.childNodes.length) sheet.appendChild(section('Additional', more));
})();
