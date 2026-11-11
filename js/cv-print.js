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
  var profile = [about.lead].concat((about.paragraphs || []).slice(0, 1)).filter(Boolean).join(' ');
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
        el('p', { class: 'item__sub' }, [e.school, e.location].filter(Boolean).join(' · ')),
        e.details ? el('p', { class: 'item__text' }, e.details) : null);
    })));
  }

  /* Experience */
  timeline('Experience', CV.experience);

  /* Projects */
  if (has(CV.projects)) {
    sheet.appendChild(section('Projects', CV.projects.map(function (p) {
      var first = (p.links || []).map(function (l) { return safeUrl(l.url); }).filter(Boolean)[0];
      return el('div', { class: 'item' },
        el('div', { class: 'item__top' },
          el('h3', { class: 'item__title' }, p.title, has(p.tags) ? el('span', null, ' · ' + p.tags.join(', ')) : null),
          first && bare(first).indexOf('/') > -1 ? el('a', { class: 'item__when', href: first }, bare(first)) : null),
        p.description ? el('p', { class: 'item__text' }, p.description) : null);
    })));
  }

  /* Achievements */
  var achievements = CV.achievements || {};
  timeline('Achievements — competitive karate', achievements.items);

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

  /* Smaller blocks, side by side */
  var cols = el('div', { class: 'cols' });
  function simpleList(title, list) {
    if (!has(list)) return;
    cols.appendChild(section(title, list.map(function (c) {
      return el('div', { class: 'item' },
        el('div', { class: 'item__top' },
          el('h3', { class: 'item__title' }, c.title),
          el('span', { class: 'item__when' }, c.year || '')),
        c.issuer ? el('p', { class: 'item__sub' }, c.issuer) : null);
    })));
  }
  simpleList('Certificates & courses', CV.certifications);
  simpleList('Volunteering', CV.volunteering);
  if (has(CV.languages)) {
    cols.appendChild(section('Languages', el('p', null, CV.languages.map(function (l) {
      return l.name + (l.level ? ' (' + l.level + ')' : '');
    }).join(' · '))));
  }
  var extras = (about.facts || []).filter(function (f) { return /licen/i.test(f.label); });
  if (has(CV.interests) || extras.length) {
    cols.appendChild(section('Other', el('p', null,
      extras.map(function (f) { return f.label + ': ' + f.value; })
        .concat(has(CV.interests) ? ['Interests: ' + CV.interests.join(', ')] : []).join(' · '))));
  }
  if (cols.childNodes.length) sheet.appendChild(cols);
})();
