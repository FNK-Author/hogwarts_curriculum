(function () {
  'use strict';

  var data = window.HOGWARTS_CONTENT;
  var storageKey = 'hogwarts-curriculum-state';
  var state = loadState();
  var pdfLogoImage = null;
  var els = {
    titleLogo: document.getElementById('titleLogo'), printLogo: document.getElementById('printLogo'), formView: document.getElementById('formView'), scheduleView: document.getElementById('scheduleView'), form: document.getElementById('studentForm'),
    studentName: document.getElementById('studentName'), houseChoices: document.getElementById('houseChoices'), yearLevel: document.getElementById('yearLevel'), electiveChoices: document.getElementById('electiveChoices'), clubChoices: document.getElementById('clubChoices'), tripChoices: document.getElementById('tripChoices'),
    electiveCount: document.getElementById('electiveCount'), requirementCard: document.getElementById('requirementCard'), formNote: document.getElementById('formNote'), scheduleTitle: document.getElementById('scheduleTitle'), scheduleMeta: document.getElementById('scheduleMeta'),
    scheduleGrid: document.getElementById('scheduleGrid'), scheduleHouseCrest: document.getElementById('scheduleHouseCrest'), tripSummary: document.getElementById('tripSummary'), materialsTable: document.getElementById('materialsTable'), specialDates: document.getElementById('specialDates'),
    backButton: document.getElementById('backButton'), printButton: document.getElementById('printButton'), pdfButton: document.getElementById('pdfButton'), dialog: document.getElementById('infoDialog'), dialogBody: document.getElementById('dialogBody'), dialogClose: document.getElementById('dialogClose'),
    soundToggle: document.getElementById('soundToggle'), bgAudio: document.getElementById('bgAudio')
  };

  init();

  function init() {
    applyImage(els.titleLogo, data.assets.titleLogo, 'Hogwarts Curriculum');
    applyImage(els.printLogo, data.assets.titleLogo, 'Hogwarts Curriculum');
    preloadPrintLogo();
    applyStars(); renderYearOptions(); renderHouseChoices(); renderChoices(); bindEvents(); syncForm(); updateRequirement(); updateAudioButton(); tryPlayAudio();
  }

  function bindEvents() {
    els.form.addEventListener('submit', function (event) { event.preventDefault(); if (!validateMinimum()) return; saveFromForm(); renderSchedule(); showSchedule(); tryPlayAudio(); });
    els.studentName.addEventListener('input', function () { state.name = els.studentName.value.trim(); persist(); });
    els.yearLevel.addEventListener('change', function () { state.year = Number(els.yearLevel.value); pruneUnavailableChoices(); renderChoices(); updateRequirement(); persist(); });
    els.backButton.addEventListener('click', function () { els.scheduleView.hidden = true; els.formView.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    els.printButton.addEventListener('click', function () { printWithMode('print'); });
    if (els.pdfButton) els.pdfButton.addEventListener('click', function () {
      try { downloadPdf(); }
      catch (error) {
        console.error('PDF konnte nicht erstellt werden:', error);
        window.alert('Die Muggeldatei konnte gerade nicht erstellt werden. Bitte versuche es noch einmal.');
      }
    });
    els.bgAudio.addEventListener('error', function () { if (!els.bgAudio.dataset.fallbackTried) { els.bgAudio.dataset.fallbackTried = '1'; els.bgAudio.src = assetUrl('bg_loop.mp3'); els.bgAudio.load(); tryPlayAudio(); } });
    window.addEventListener('pointermove', createSpark, { passive: true });
    els.dialogClose.addEventListener('click', function () { els.dialog.close(); });
    els.dialog.addEventListener('click', function (event) { if (event.target === els.dialog) els.dialog.close(); });
    els.soundToggle.addEventListener('click', function () { state.muted = !state.muted; els.bgAudio.muted = state.muted; updateAudioButton(); persist(); if (!state.muted) tryPlayAudio(); });
    window.addEventListener('pointerdown', tryPlayAudio, { once: true });
  }

  function renderYearOptions() { els.yearLevel.innerHTML = data.yearLevels.map(function (year) { return '<option value="' + year.value + '">' + escapeHtml(year.label) + '</option>'; }).join(''); }

  function renderHouseChoices() {
    els.houseChoices.innerHTML = data.houses.map(function (house) {
      var checked = house.id === state.house ? 'checked' : '';
      return '<label class="house-card" style="--house-a:' + house.colors[0] + ';--house-b:' + house.colors[1] + '"><input type="radio" name="house" value="' + house.id + '" ' + checked + '><span class="crest-frame"><img src="' + house.crest + '" data-fallback="' + assetUrl(house.fallback) + '" alt="' + house.name + '" style="--img-scale:' + house.imageScale + '"></span><span class="house-name">' + house.name + '</span><span class="house-head">' + house.head + '</span></label>';
    }).join('');
    addImageFallbacks(els.houseChoices);
    els.houseChoices.querySelectorAll('input[name="house"]').forEach(function (input) { input.addEventListener('change', function () { state.house = input.value; persist(); renderChoices(); }); });
  }

  function renderChoices() {
    els.electiveChoices.innerHTML = data.subjects.filter(function (subject) { return subject.elective; }).sort(sortByMinimumYear).map(function (subject) { return subjectTemplate(subject); }).join('');
    els.clubChoices.innerHTML = data.clubs.filter(function (club) { return !club.houseAuto; }).sort(sortByMinimumYear).map(function (club) { return clubTemplate(club); }).join('');
    els.tripChoices.innerHTML = data.trips.slice().sort(sortByMinimumYear).map(function (trip) { return tripTemplate(trip); }).join('');
    bindChoiceInputs(els.electiveChoices, 'electives'); bindChoiceInputs(els.clubChoices, 'clubs'); bindChoiceInputs(els.tripChoices, 'trips'); updateRequirement();
  }

  function subjectTemplate(subject) {
    var available = isYearAllowed(subject, state.year); var checked = state.electives.indexOf(subject.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var tag = subject.countsForMinimum ? 'Wahlpflichtfach' : 'Zusatz'; var note = available ? subject.teacher + ' · ' + sessionPreview(subject.sessions) : 'ab Jahrgang ' + subject.yearLevels.join(', ');
    return choiceCard(subject.id, 'electives', subject.name, note, subject.color, iconImage(subject), tag, checked, disabled, !available);
  }

  function clubTemplate(club) {
    var available = state.year >= (club.minYear || 1); var checked = state.clubs.indexOf(club.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var leader = club.leader ? club.leader : 'ohne feste Leitung'; var room = club.room ? club.room : 'wechselnder Treffpunkt';
    var note = available ? leader + ' · ' + clubTimePreview(club) : 'ab Jahrgang ' + club.minYear;
    return choiceCard(club.id, 'clubs', club.name, note + ' · ' + room, club.color, clubIcon(club), 'ab ' + (club.minYear || 1), checked, disabled, !available);
  }

  function tripTemplate(trip) {
    var available = state.year >= trip.minYear; var checked = state.trips.indexOf(trip.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var note = available ? trip.location + ' · ' + trip.date : 'ab Jahrgang ' + trip.minYear;
    return choiceCard(trip.id, 'trips', trip.name, note, trip.color, clubIcon(trip), 'ab ' + trip.minYear, checked, disabled, !available);
  }

  function choiceCard(id, bucket, name, note, color, icon, tag, checked, disabled, unavailable) {
    return '<label class="choice-card form-reveal-card ' + (unavailable ? 'is-disabled' : '') + '" style="--accent:' + color + '"><input type="checkbox" value="' + id + '" data-bucket="' + bucket + '" ' + checked + ' ' + disabled + '><span class="choice-icon">' + icon + '</span><span class="choice-main"><span class="choice-name">' + name + '</span><span class="choice-meta">' + note + '</span></span><span class="choice-tag">' + tag + '</span></label>';
  }

  function bindChoiceInputs(root, bucket) {
    root.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
      input.addEventListener('change', function () { var values = new Set(state[bucket]); input.checked ? values.add(input.value) : values.delete(input.value); state[bucket] = Array.from(values); updateRequirement(); persist(); });
    });
  }

  function updateRequirement() {
    var rule = data.electiveRules[state.year]; var selectedCount = countMinimumElectives(); var missing = Math.max(rule.minimum - selectedCount, 0);
    els.electiveCount.textContent = selectedCount + '/' + rule.minimum + ' Wahlpflicht';
    els.requirementCard.innerHTML = '<strong>' + (missing === 0 ? 'Curriculum kann erstellt werden' : missing + ' fehlt') + '</strong><span>' + rule.text + '</span>';
    els.requirementCard.classList.toggle('needs-attention', missing > 0); els.formNote.textContent = missing > 0 ? data.formTexts.calm : data.formTexts.conflict;
  }

  function validateMinimum() {
    var rule = data.electiveRules[state.year]; var missing = Math.max(rule.minimum - countMinimumElectives(), 0); if (missing === 0) return true;
    els.requirementCard.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 220 }); els.requirementCard.focus(); return false;
  }

  function countMinimumElectives() { return state.electives.filter(function (id) { var subject = findSubject(id); return subject && subject.countsForMinimum && isYearAllowed(subject, state.year); }).length; }

  function renderSchedule() {
    var house = data.houses.find(function (item) { return item.id === state.house; }) || data.houses[0]; var events = buildEvents(); var grouped = groupEvents(events);
    els.scheduleTitle.textContent = (state.name || 'Unbenanntes Curriculum') + ' · ' + house.name;
    els.scheduleMeta.textContent = state.year + '. Jahrgang · Hauslehrkraft: ' + house.head + ' · Wahlpflicht: ' + countMinimumElectives() + '/' + data.electiveRules[state.year].minimum;
    els.scheduleHouseCrest.src = house.crest; els.scheduleHouseCrest.dataset.fallback = assetUrl(house.fallback); els.scheduleHouseCrest.alt = house.name; els.scheduleHouseCrest.title = house.name + ' ansehen'; els.scheduleHouseCrest.tabIndex = 0; els.scheduleHouseCrest.style.setProperty('--img-scale', house.imageScale); els.scheduleHouseCrest.onclick = function () { openHouseInfo(house.id); }; els.scheduleHouseCrest.onkeydown = function (event) { if (event.key === 'Enter' || event.key === ' ') openHouseInfo(house.id); }; addImageFallbacks(document);
    var cells = ['<div class="grid-cell grid-head time-head" role="columnheader">Zeit</div>'];
    data.days.forEach(function (day) { cells.push('<div class="grid-cell grid-head ' + (day.id === 'saturday' ? 'weekend-start' : '') + '" role="columnheader">' + day.label + '</div>'); });
    data.timeSlots.forEach(function (slot) { cells.push('<div class="grid-cell time-cell ' + (slot.type === 'meal' ? 'meal-time' : '') + '" role="rowheader"><strong>' + slot.label + '</strong><span>' + slot.time + '</span></div>'); data.days.forEach(function (day) { cells.push(renderScheduleCell(day, slot, grouped.get(cellKey(day.id, slot.id)) || [])); }); });
    els.scheduleGrid.innerHTML = cells.join('');
    addImageFallbacks(els.scheduleGrid);
    els.scheduleGrid.querySelectorAll('[data-event-id]').forEach(function (button) { button.addEventListener('click', function () { openInfo(button.dataset.eventId); }); });
    renderTrips(); renderMaterials(); renderSpecialDates(); restartWritingAnimations();
  }

  function buildEvents() {
    var selected = new Set(data.subjects.filter(function (subject) { return subject.required && isYearAllowed(subject, state.year); }).map(function (subject) { return subject.id; }).concat(state.electives));
    state.electives.forEach(function (id) { var advanced = findSubject(id); if (advanced && advanced.replaces) selected.delete(advanced.replaces); });
    var subjectEvents = data.subjects.filter(function (subject) { return selected.has(subject.id) && isYearAllowed(subject, state.year); }).flatMap(function (subject) {
      var sessionSource = subject.replaces && findSubject(subject.replaces) ? findSubject(subject.replaces).sessions : subject.sessions;
      return sessionSource.filter(function (session) { return isYearAllowed(session, state.year); }).map(function (session, index) { return eventFromItem(subject, 'subject:' + subject.id + ':' + index, 'subject', session.day, session.slot, subject.name, subject.teacher, subject.room); });
    });
    var clubEvents = data.clubs.filter(function (club) { return ((state.clubs.indexOf(club.id) > -1) || (club.houseAuto && club.house === state.house)) && state.year >= (club.minYear || 1); }).flatMap(function (club) {
      if (club.houseSessions) {
        return (club.houseSessions[state.house] || []).flatMap(function (session, sessionIndex) { return session.slots.map(function (slot, slotIndex) { return eventFromItem(club, 'club:' + club.id + ':' + sessionIndex + ':' + slotIndex, 'club', session.day, slot, club.name, club.leader, club.room); }); });
      }
      return [eventFromItem(club, 'club:' + club.id, 'club', club.day, club.slot, club.scheduleName || club.name, club.scheduleLeader || club.leader, club.scheduleRoom || club.room)];
    });
    var mealEvents = data.timeSlots.filter(function (slot) { return slot.type === 'meal'; }).flatMap(function (slot) { return data.days.map(function (day) { var meal = data.mealInfo[slot.id]; return eventFromItem(meal, 'meal:' + day.id + ':' + slot.id, 'meal', day.id, slot.id, meal.name, meal.teacher, meal.room); }); });
    return subjectEvents.concat(clubEvents, mealEvents);
  }

  function eventFromItem(item, id, kind, day, slot, name, teacher, room) { return { id: id, sourceId: item.id || id, kind: kind, name: name || item.name, teacher: teacher || 'ohne feste Leitung', room: room || 'wechselnder Treffpunkt', color: item.color || '#80BFAD', icon: kind === 'subject' ? iconImage(item) : clubIcon(item), info: item.info, examForm: item.examForm, materials: item.materials || [], day: day, slot: slot }; }

  function renderScheduleCell(day, slot, events) {
    var eventButtons = events.map(function (event) { return '<button class="lesson-card revelio-card ' + (event.kind === 'meal' ? 'meal-card' : '') + '" type="button" data-event-id="' + event.id + '" style="--accent:' + event.color + ';--reveal-delay:' + revealDelay(day, slot) + 's"><span class="mini-icon">' + event.icon + '</span><span><strong>' + event.name + '</strong><small>' + event.teacher + '<br>' + event.room + '</small></span></button>'; }).join('');
    var turner = events.length > 1 ? '<img class="time-turner" src="' + data.assets.timeTurner.src + '" data-fallback="' + assetUrl(data.assets.timeTurner.fallback) + '" alt="Zeitumkehrer" style="--img-scale:' + data.assets.timeTurner.scale + '">' : '';
    var empty = events.length === 0 ? '<span class="empty-slot">frei</span>' : '';
    return '<div class="grid-cell schedule-cell ' + (slot.type === 'meal' ? 'meal-slot' : '') + ' ' + (day.id === 'saturday' ? 'weekend-start' : '') + (events.length > 1 ? ' has-conflict' : '') + '" role="cell" aria-label="' + day.label + ', ' + slot.time + '">' + turner + empty + eventButtons + '</div>';
  }

  function openInfo(eventId) {
    var event = buildEvents().find(function (item) { return item.id === eventId; }); if (!event) return;
    var exam = event.examForm ? '<div><dt>Prüfungsform</dt><dd>' + event.examForm + '</dd></div>' : '';
    var materialList = getMaterialList(event);
    var materials = materialList.length ? '<h4>Materialien und Literatur</h4><ul>' + materialList.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' : '';
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:' + event.color + '"><span class="dialog-icon">' + event.icon + '</span><div><p class="eyebrow">' + labelForKind(event.kind) + '</p><h3>' + event.name + '</h3></div></div><dl class="detail-list"><div><dt>Leitung</dt><dd>' + event.teacher + '</dd></div><div><dt>Raum</dt><dd>' + event.room + '</dd></div><div><dt>Termin</dt><dd>' + dayLabel(event.day) + ', ' + slotTime(event.slot) + '</dd></div>' + exam + '</dl><p>' + event.info + '</p>' + materials;
    els.dialog.showModal();
  }

  function renderTrips() {
    var trips = selectedTrips();
    els.tripSummary.innerHTML = trips.length ? trips.map(function (trip) { return '<article class="summary-item"><strong>' + trip.name + '</strong><span>' + trip.date + ' · ' + trip.location + '</span><p>' + trip.info + '</p></article>'; }).join('') : '<p class="empty-note">Keine Ausflüge oder Austausche angemeldet.</p>';
  }

  function renderMaterials() {
    var rows = materialSources().map(function (item) { return '<tr><th>' + item.name + '</th><td><ul>' + getMaterialList(item).map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></td></tr>'; }).join('');
    els.materialsTable.innerHTML = '<table class="materials"><tbody>' + rows + '</tbody></table>';
  }

  function renderSpecialDates() {
    els.specialDates.innerHTML = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; }).map(function (item) { return '<article class="date-item"><strong>' + item.date + '</strong><span>' + item.name + '</span></article>'; }).join('');
  }

  function materialSources() {
    var selectedSubjectIds = new Set(data.subjects.filter(function (s) { return s.required && isYearAllowed(s, state.year); }).map(function (s) { return s.id; }).concat(state.electives));
    var subjects = data.subjects.filter(function (s) { return selectedSubjectIds.has(s.id) && isYearAllowed(s, state.year); });
    var clubs = data.clubs.filter(function (c) { return state.clubs.indexOf(c.id) > -1 && state.year >= (c.minYear || 1); });
    return subjects.concat(clubs, selectedTrips()).filter(function (item) { return getMaterialList(item).length; });
  }


  function getMaterialList(item) {
    var list = [];
    if (item.literatureByYear && item.literatureByYear[String(state.year)]) list.push('Literatur: ' + item.literatureByYear[String(state.year)]);
    (item.materials || []).forEach(function (entry) { if (entry && list.indexOf(entry) === -1) list.push(entry); });
    return list;
  }

  function sortByMinimumYear(a, b) {
    var ay = a.minYear || (a.yearLevels ? Math.min.apply(null, a.yearLevels) : 1);
    var by = b.minYear || (b.yearLevels ? Math.min.apply(null, b.yearLevels) : 1);
    return ay - by || a.name.localeCompare(b.name, 'de');
  }

  function revealDelay(day, slot) {
    var dayIndex = data.days.findIndex(function (item) { return item.id === day.id; });
    var slotIndex = data.timeSlots.findIndex(function (item) { return item.id === slot.id; });
    return Math.max(0, dayIndex) * 0.9 + Math.max(0, slotIndex) * 0.045;
  }


  function openHouseInfo(houseId) {
    var house = data.houses.find(function (item) { return item.id === houseId; });
    if (!house) return;
    els.dialogBody.innerHTML = '<div class="dialog-title house-dialog" style="--accent:' + house.colors[0] + '"><span class="dialog-icon"><img src="' + house.crest + '" data-fallback="' + assetUrl(house.fallback) + '" alt="' + house.name + '"></span><div><p class="eyebrow">Hogwarts Haus</p><h3>' + house.name + '</h3></div></div><dl class="detail-list"><div><dt>Gründer</dt><dd>' + house.founder + '</dd></div><div><dt>Hausgeist</dt><dd>' + house.ghost + '</dd></div><div><dt>Gemeinschaftsraum</dt><dd>' + house.commonRoom + '</dd></div><div><dt>Zugang</dt><dd>' + house.entrance + '</dd></div></dl><p>' + house.description + '</p><p>' + house.history + '</p><h4>Nachgesagte Eigenschaften</h4><p>' + house.traits + '</p>';
    addImageFallbacks(els.dialogBody);
    els.dialog.showModal();
  }

  function restartWritingAnimations() {
    document.querySelectorAll('#materialsTable, #specialDates, .quill-type').forEach(function (node) {
      node.classList.remove('quill-writing');
      void node.offsetWidth;
      node.classList.add('quill-writing');
    });
  }

  function downloadPdf() {
    var oldText = els.pdfButton.textContent;
    els.pdfButton.disabled = true;
    els.pdfButton.textContent = 'Muggeldatei wird erstellt...';
    saveFromForm();
    var events = buildEvents();
    var trips = selectedTrips();
    var materials = materialSources();
    var dates = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; });
    var house = data.houses.find(function (item) { return item.id === state.house; }) || data.houses[0];
    try {
      var pages = [drawPdfSchedulePage(events, house), drawPdfInfoPage(trips, materials, dates)];
      var pdf = buildImagePdf(pages);
      var blob = new Blob([pdf], { type: 'application/pdf' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = (state.name || 'Hogwarts') + '_Stundenplan.pdf';
      document.body.appendChild(link);
      link.click();
      console.info('Muggeldatei vorbereitet: ' + link.download);
      setTimeout(function () { URL.revokeObjectURL(link.href); link.remove(); }, 1600);
    } finally {
      els.pdfButton.disabled = false;
      els.pdfButton.textContent = oldText;
    }
  }

  function canvasBase(width, height) {
    var canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    var ctx = canvas.getContext('2d'); ctx.fillStyle = '#f8efd8'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#b78b47'; ctx.lineWidth = 6; ctx.strokeRect(24, 24, width - 48, height - 48);
    return { canvas: canvas, ctx: ctx };
  }

  function preloadPrintLogo() {
    pdfLogoImage = new Image();
    pdfLogoImage.src = (data.assets.printLogo || data.assets.titleLogo).src;
  }

  function drawLogo(ctx, x, y, w, h) {
    if (pdfLogoImage && pdfLogoImage.complete && pdfLogoImage.naturalWidth && isSameOriginAsset(pdfLogoImage.src)) {
      ctx.drawImage(pdfLogoImage, x, y, w, h);
      return;
    }
    ctx.fillStyle = '#1e130b'; ctx.font = 'bold 34px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Hogwarts Curriculum', x + w / 2, y + h / 2);
  }

  function isSameOriginAsset(src) {
    try { return new URL(src, window.location.href).origin === window.location.origin; }
    catch (error) { return false; }
  }

  function drawPdfSchedulePage(events, house) {
    var page = canvasBase(1754, 1240), ctx = page.ctx; drawLogo(ctx, 720, 28, 314, 112);
    ctx.textAlign = 'center'; ctx.fillStyle = '#2a1b10'; ctx.font = 'bold 26px Georgia'; ctx.fillText((state.name || 'Unbenanntes Curriculum') + ' - ' + house.name + ' - ' + state.year + '. Jahrgang', 877, 154);
    var x0 = 50, y0 = 180, tableW = 1654, tableH = 990, colW = tableW / 8, rowH = tableH / (data.timeSlots.length + 1);
    ctx.font = 'bold 24px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#e8d6a6'; ctx.fillRect(x0, y0, tableW, rowH); ctx.strokeStyle = '#8c6c36'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, tableW, rowH);
    ['Zeit'].concat(data.days.map(function (d) { return d.label; })).forEach(function (label, i) { ctx.fillStyle = '#25170f'; ctx.fillText(label, x0 + colW * i + colW / 2, y0 + rowH / 2); });
    var grouped = groupEvents(events);
    data.timeSlots.forEach(function (slot, r) {
      var y = y0 + rowH * (r + 1); ctx.fillStyle = slot.type === 'meal' ? '#d7eadf' : '#fff8df'; ctx.fillRect(x0, y, tableW, rowH); ctx.strokeStyle = '#9b7438'; ctx.lineWidth = 1;
      for (var c = 0; c < 8; c++) ctx.strokeRect(x0 + colW * c, y, colW, rowH);
      ctx.fillStyle = '#25170f'; ctx.font = 'bold 18px Georgia'; ctx.textAlign = 'left'; ctx.fillText(slot.label, x0 + 8, y + 24); ctx.font = '15px Georgia'; ctx.fillText(slot.time, x0 + 8, y + 48);
      data.days.forEach(function (day, cidx) { var list = grouped.get(cellKey(day.id, slot.id)) || []; var cx = x0 + colW * (cidx + 1) + 5, cy = y + 5, cw = colW - 10, ch = Math.max(18, (rowH - 10) / Math.max(1, list.length));
        list.slice(0, 3).forEach(function (event, idx) { ctx.fillStyle = mixWithWhite(event.color || '#4465A6', .72); ctx.fillRect(cx, cy + idx * ch, cw, ch - 3); ctx.strokeStyle = event.color || '#4465A6'; ctx.lineWidth = 4; ctx.strokeRect(cx, cy + idx * ch, cw, ch - 3); ctx.fillStyle = '#111'; ctx.font = 'bold 17px Georgia'; ctx.textAlign = 'left'; wrapText(ctx, event.name, cx + 7, cy + idx * ch + 18, cw - 14, 17, 2); ctx.font = '13px Georgia'; wrapText(ctx, event.room, cx + 7, cy + idx * ch + 56, cw - 14, 14, 2); });
      });
    });
    ctx.fillStyle = '#2a1b10'; ctx.font = 'bold 20px Georgia'; ctx.textAlign = 'right'; ctx.fillText('made by FNK', 1695, 1202);
    return page.canvas.toDataURL('image/jpeg', .92);
  }

  function drawPdfInfoPage(trips, materials, dates) {
    var page = canvasBase(1754, 1240), ctx = page.ctx; drawLogo(ctx, 720, 28, 314, 112); ctx.fillStyle = '#2a1b10'; ctx.font = 'bold 26px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Curriculum Zusatzübersicht', 877, 160);
    var y = 210; y = drawSection(ctx, 'Angemeldete Exkursionen und Schüleraustausche', trips.map(function (t) { return t.date + ' - ' + t.name + ' - ' + t.location; }), 60, y, 790); y = drawSection(ctx, 'Sondertermine', dates.map(function (d) { return d.date + ' - ' + d.name; }), 60, y + 18, 790); drawSection(ctx, 'Benötigte Unterrichtsmaterialien und Ausrüstung', materials.map(function (m) { return m.name + ': ' + getMaterialList(m).join(', '); }), 900, 210, 790); ctx.fillStyle = '#2a1b10'; ctx.font = 'bold 20px Georgia'; ctx.textAlign = 'right'; ctx.fillText('made by FNK', 1695, 1202); return page.canvas.toDataURL('image/jpeg', .9);
  }

  function drawSection(ctx, title, lines, x, y, w) { ctx.fillStyle = '#ead8a8'; ctx.fillRect(x, y, w, 40); ctx.strokeStyle = '#b78b47'; ctx.strokeRect(x, y, w, 40); ctx.fillStyle = '#25170f'; ctx.font = 'bold 24px Georgia'; ctx.textAlign = 'left'; ctx.fillText(title, x + 12, y + 27); y += 56; ctx.font = '22px Georgia'; (lines.length ? lines : ['Keine Einträge.']).slice(0, 18).forEach(function (line) { y = wrapText(ctx, '- ' + line, x + 12, y, w - 24, 25, 3) + 8; }); return y; }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) { var words = String(text).split(' '), line = '', lines = 0; for (var n = 0; n < words.length; n++) { var testLine = line + words[n] + ' '; if (ctx.measureText(testLine).width > maxWidth && n > 0) { ctx.fillText(line.trim(), x, y); y += lineHeight; lines++; line = words[n] + ' '; if (maxLines && lines >= maxLines) return y; } else line = testLine; } if (!maxLines || lines < maxLines) ctx.fillText(line.trim(), x, y); return y + lineHeight; }
  function mixWithWhite(hex, amount) { var c = String(hex || '#4465A6').replace('#',''); if (c.length !== 6) return '#dde5f0'; var r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16); r = Math.round(r + (255-r)*amount); g = Math.round(g + (255-g)*amount); b = Math.round(b + (255-b)*amount); return 'rgb(' + r + ',' + g + ',' + b + ')'; }
  function buildImagePdf(dataUrls) {
    var encoder = new TextEncoder(), chunks = [], offsets = {}, position = 0;
    function bytesFromText(text) { return encoder.encode(text); }
    function addBytes(bytes) { chunks.push(bytes); position += bytes.length; }
    function addText(text) { addBytes(bytesFromText(text)); }
    function addObject(id, bodyChunks) {
      offsets[id] = position; addText(id + ' 0 obj\n');
      bodyChunks.forEach(function (chunk) { typeof chunk === 'string' ? addText(chunk) : addBytes(chunk); });
      addText('\nendobj\n');
    }
    addText('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    dataUrls.forEach(function (url, i) {
      var pageId = i * 3 + 1, imageId = pageId + 1, contentId = pageId + 2;
      var raw = atob(url.split(',')[1]), img = new Uint8Array(raw.length);
      for (var b = 0; b < raw.length; b++) img[b] = raw.charCodeAt(b) & 255;
      addObject(pageId, ['<< /Type /Page /Parent 99 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im' + i + ' ' + imageId + ' 0 R >> >> /Contents ' + contentId + ' 0 R >>']);
      addObject(imageId, ['<< /Type /XObject /Subtype /Image /Width 1754 /Height 1240 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + img.length + ' >>\nstream\n', img, '\nendstream']);
      var content = 'q 842 0 0 595 0 0 cm /Im' + i + ' Do Q';
      addObject(contentId, ['<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream']);
    });
    var kids = dataUrls.map(function (_, i) { return (i * 3 + 1) + ' 0 R'; }).join(' ');
    addObject(99, ['<< /Type /Pages /Kids [' + kids + '] /Count ' + dataUrls.length + ' >>']);
    addObject(100, ['<< /Type /Catalog /Pages 99 0 R >>']);
    var xref = position, max = 100;
    addText('xref\n0 ' + (max + 1) + '\n0000000000 65535 f \n');
    for (var id = 1; id <= max; id++) addText(offsets[id] ? String(offsets[id]).padStart(10, '0') + ' 00000 n \n' : '0000000000 65535 f \n');
    addText('trailer\n<< /Size ' + (max + 1) + ' /Root 100 0 R >>\nstartxref\n' + xref + '\n%%EOF');
    var total = chunks.reduce(function (sum, chunk) { return sum + chunk.length; }, 0), out = new Uint8Array(total), at = 0;
    chunks.forEach(function (chunk) { out.set(chunk, at); at += chunk.length; });
    return out;
  }

  function printWithMode(mode) {
    document.body.classList.toggle('pdf-mode', mode === 'pdf');
    var oldTitle = document.title;
    if (mode === 'pdf') document.title = (state.name || 'Hogwarts') + ' Stundenplan';
    window.print();
    setTimeout(function () { document.body.classList.remove('pdf-mode'); document.title = oldTitle; }, 800);
  }

  var lastSpark = 0;
  function createSpark(event) {
    var now = Date.now();
    if (now - lastSpark < 70) return;
    lastSpark = now;
    var spark = document.createElement('span');
    spark.className = 'cursor-spark';
    spark.style.left = event.clientX + 'px';
    spark.style.top = event.clientY + 'px';
    document.body.appendChild(spark);
    setTimeout(function () { spark.remove(); }, 900);
  }

  function selectedTrips() { return data.trips.filter(function (trip) { return state.trips.indexOf(trip.id) > -1 && state.year >= trip.minYear; }).sort(sortByMinimumYear); }
  function showSchedule() { els.formView.hidden = true; els.scheduleView.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function syncForm() { els.studentName.value = state.name; els.yearLevel.value = String(state.year); els.bgAudio.muted = state.muted; }
  function saveFromForm() { state.name = els.studentName.value.trim(); var house = document.querySelector('input[name="house"]:checked'); state.house = house ? house.value : state.house; state.year = Number(els.yearLevel.value); persist(); }
  function pruneUnavailableChoices() { state.electives = state.electives.filter(function (id) { var subject = findSubject(id); return subject && isYearAllowed(subject, state.year); }); state.clubs = state.clubs.filter(function (id) { var club = findClub(id); return club && state.year >= (club.minYear || 1); }); state.trips = state.trips.filter(function (id) { var trip = findTrip(id); return trip && state.year >= trip.minYear; }); }
  function isYearAllowed(item, year) { return !item.yearLevels || item.yearLevels.indexOf(Number(year)) > -1; }
  function groupEvents(events) { var map = new Map(); events.forEach(function (event) { var key = cellKey(event.day, event.slot); var list = map.get(key) || []; list.push(event); map.set(key, list); }); return map; }
  function cellKey(day, slot) { return day + ':' + slot; }
  function dayLabel(dayId) { var day = data.days.find(function (item) { return item.id === dayId; }); return day ? day.label : dayId; }
  function slotTime(slotId) { var slot = data.timeSlots.find(function (item) { return item.id === slotId; }); return slot ? slot.label + ' ' + slot.time : slotId; }
  function sessionPreview(sessions) { return sessions.map(function (session) { return dayLabel(session.day).slice(0, 2) + ' ' + slotTime(session.slot).split(' ')[0]; }).join(', '); }
  function clubTimePreview(club) { if (club.houseSessions) return 'Hauszeiten auf dem Quidditchfeld'; return dayLabel(club.day) + ', ' + slotTime(club.slot); }
  function findSubject(id) { return data.subjects.find(function (item) { return item.id === id; }); }
  function findClub(id) { return data.clubs.find(function (item) { return item.id === id; }); }
  function findTrip(id) { return data.trips.find(function (item) { return item.id === id; }); }
  function labelForKind(kind) { return kind === 'club' ? 'Club' : kind === 'meal' ? 'Mahlzeit' : 'Unterrichtsfach'; }
  function iconImage(item) { var src = item.icon || makeIconDataUri(item.name, item.color); return '<img src="' + src + '" alt="" style="--img-scale:' + (item.iconScale || 0.9) + '">'; }
  function clubIcon(item) { return '<img src="' + makeIconDataUri(item.name, item.color || '#80BFAD') + '" alt="" style="--img-scale:0.88">'; }
  function makeIconDataUri(name, color) { var initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join(''); var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#020126"/><rect x="8" y="8" width="104" height="104" rx="14" fill="' + color + '"/><circle cx="60" cy="60" r="38" fill="#F2C580" opacity=".18"/><text x="60" y="72" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#fff8df">' + escapeSvg(initials) + '</text></svg>'; return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg); }
  function applyImage(img, asset, alt) { img.src = asset.src; img.dataset.fallback = assetUrl(asset.fallback); img.alt = alt; img.style.setProperty('--img-scale', asset.scale || 1); addImageFallbacks(img.parentElement || document); }
  function addImageFallbacks(root) { root.querySelectorAll ? root.querySelectorAll('img[data-fallback]').forEach(function (img) { img.onerror = function () { if (img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback; }; }) : null; }
  function assetUrl(file) { return file ? data.repoAssetBase + file : ''; }
  function localAsset(file) { return file || ''; }
  function applyStars() { document.documentElement.style.setProperty('--stars-url', 'url("' + data.assets.stars.src + '")'); var probe = new Image(); probe.onerror = function () { document.documentElement.style.setProperty('--stars-url', 'url("' + assetUrl(data.assets.stars.fallback) + '")'); }; probe.src = data.assets.stars.src; }
  function tryPlayAudio() { if (state.muted) return; els.bgAudio.volume = 0.28; els.bgAudio.play().catch(function () {}); }
  function updateAudioButton() { els.soundToggle.classList.toggle('is-muted', state.muted); els.soundToggle.setAttribute('aria-label', state.muted ? 'Hintergrundmusik einschalten' : 'Hintergrundmusik stummschalten'); els.soundToggle.innerHTML = state.muted ? mutedSvg() : soundSvg(); }
  function loadState() { var fallback = { name: '', house: 'gryffindor', year: 1, electives: [], clubs: [], trips: [], muted: false }; try { return Object.assign(fallback, JSON.parse(localStorage.getItem(storageKey) || '{}')); } catch (error) { return fallback; } }
  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]; }); }
  function escapeSvg(value) { return String(value).replace(/[&<>]/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]; }); }
  function soundSvg() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="M16 8.5c1.2 1.9 1.2 5.1 0 7"></path><path d="M18.5 6c2.2 3.4 2.2 8.6 0 12"></path></svg>'; }
  function mutedSvg() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="m18 9-5 5"></path><path d="m13 9 5 5"></path></svg>'; }
})();


