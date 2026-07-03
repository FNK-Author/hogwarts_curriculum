(function () {
  'use strict';

  var data = window.HOGWARTS_CONTENT;
  var storageKey = 'hogwarts-curriculum-state';
  var state = loadState();
  var pdfLogoImage = null;
  var pdfHouseImages = {};
  var dialogScrollPosition = { x: 0, y: 0 };
  var els = {
    titleLogo: document.getElementById('titleLogo'), printLogo: document.getElementById('printLogo'), formView: document.getElementById('formView'), scheduleView: document.getElementById('scheduleView'), form: document.getElementById('studentForm'),
    studentName: document.getElementById('studentName'), houseChoices: document.getElementById('houseChoices'), yearLevel: document.getElementById('yearLevel'), electiveChoices: document.getElementById('electiveChoices'), clubChoices: document.getElementById('clubChoices'), tripChoices: document.getElementById('tripChoices'),
    electiveCount: document.getElementById('electiveCount'), requirementCard: document.getElementById('requirementCard'), formNote: document.getElementById('formNote'), scheduleTitle: document.getElementById('scheduleTitle'), scheduleMeta: document.getElementById('scheduleMeta'),
    scheduleGrid: document.getElementById('scheduleGrid'), mobileDaySchedule: document.getElementById('mobileDaySchedule'), scheduleFilterControls: document.getElementById('scheduleFilterControls'), scheduleHouseCrest: document.getElementById('scheduleHouseCrest'), tripSummary: document.getElementById('tripSummary'), materialsTable: document.getElementById('materialsTable'), specialDates: document.getElementById('specialDates'),
    backButton: document.getElementById('backButton'), printButton: document.getElementById('printButton'), pdfButton: document.getElementById('pdfButton'), dialog: document.getElementById('infoDialog'), dialogBody: document.getElementById('dialogBody'), dialogClose: document.getElementById('dialogClose'), scrollTopButton: document.getElementById('scrollTopButton'),
    soundToggle: document.getElementById('soundToggle'), bgAudio: document.getElementById('bgAudio'),
    toggleElectives: document.getElementById('toggleElectives'), toggleClubs: document.getElementById('toggleClubs'), toggleTrips: document.getElementById('toggleTrips')
  };

  init();

  function init() {
    applyImage(els.titleLogo, data.assets.titleLogo, 'Hogwarts Curriculum');
    applyImage(els.printLogo, data.assets.titleLogo, 'Hogwarts Curriculum');
    preloadPrintLogo();
    preloadHouseCrests();
    applyStars(); renderYearOptions(); renderHouseChoices(); renderChoices(); bindEvents(); syncForm(); updateRequirement(); updateAudioButton(); updateScrollTopButton(); tryPlayAudio();
  }

  function bindEvents() {
    els.form.addEventListener('submit', function (event) { event.preventDefault(); if (!validateMinimum()) return; saveFromForm(); state.mobileDay = 'monday'; renderSchedule(); showSchedule(); tryPlayAudio(); });
    els.studentName.addEventListener('input', function () { state.name = els.studentName.value.trim(); persist(); });
    els.yearLevel.addEventListener('change', function () { state.year = Number(els.yearLevel.value); pruneUnavailableChoices(); renderChoices(); updateRequirement(); persist(); });
    els.backButton.addEventListener('click', function () { els.scheduleView.hidden = true; els.formView.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    els.printButton.addEventListener('click', function () {
      printGeneratedPdf().catch(function (error) {
        console.error('PDF-Drucklayout konnte nicht erstellt werden:', error);
        window.alert('Das Drucklayout konnte gerade nicht erstellt werden. Bitte versuche es noch einmal.');
      });
    });
    if (els.pdfButton) els.pdfButton.addEventListener('click', function () {
      downloadPdf().catch(function (error) {
        console.error('PDF konnte nicht erstellt werden:', error);
        window.alert('Die Muggeldatei konnte gerade nicht erstellt werden. Bitte versuche es noch einmal.');
      });
    });
    els.bgAudio.addEventListener('error', function () { if (!els.bgAudio.dataset.fallbackTried) { els.bgAudio.dataset.fallbackTried = '1'; els.bgAudio.src = assetUrl('bg_loop.mp3'); els.bgAudio.load(); tryPlayAudio(); } });
    window.addEventListener('pointermove', createSpark, { passive: true });
    els.dialogClose.addEventListener('click', closeDialogWithoutScrollJump);
    els.dialog.addEventListener('click', function (event) { if (event.target === els.dialog) closeDialogWithoutScrollJump(); });
    els.dialog.addEventListener('close', function () { restoreScrollPosition(dialogScrollPosition.x, dialogScrollPosition.y); });
    els.scrollTopButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', updateScrollTopButton, { passive: true });
    els.soundToggle.addEventListener('click', function () { state.muted = !state.muted; els.bgAudio.muted = state.muted; updateAudioButton(); persist(); if (!state.muted) tryPlayAudio(); });
    window.addEventListener('pointerdown', tryPlayAudio, { once: true });
    els.toggleElectives.addEventListener('click', function () { toggleBucket('electives'); });
    els.toggleClubs.addEventListener('click', function () { toggleBucket('clubs'); });
    els.toggleTrips.addEventListener('click', function () { toggleBucket('trips'); });
    els.scheduleFilterControls.addEventListener('click', function (event) {
      var button = event.target.closest('[data-schedule-filter]');
      if (!button) return;
      state.scheduleFilter = button.dataset.scheduleFilter;
      renderSchedule();
      persist();
    });
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
    var tag = subject.countsForMinimum ? 'Wahlpflichtfach' : 'Zusatz'; var note = available ? subject.teacher + ' · ' + sessionPreview(subject.sessions) : 'ab Schuljahrgang ' + subject.yearLevels.join(', ');
    return choiceCard(subject.id, 'electives', subject.name, note, subject.color, iconImage(subject), tag, checked, disabled, !available);
  }

  function clubTemplate(club) {
    var available = state.year >= (club.minYear || 1); var checked = state.clubs.indexOf(club.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var leader = club.leader ? club.leader : 'ohne feste Leitung'; var room = club.room ? club.room : 'wechselnder Treffpunkt';
    var note = available ? leader + ' · ' + clubTimePreview(club) : 'ab Schuljahrgang ' + club.minYear;
    return choiceCard(club.id, 'clubs', club.name, note + ' · ' + room, club.color, clubIcon(club), 'ab ' + (club.minYear || 1), checked, disabled, !available);
  }

  function tripTemplate(trip) {
    var available = state.year >= trip.minYear; var checked = state.trips.indexOf(trip.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var note = available ? trip.location + ' · ' + trip.date : 'ab Schuljahrgang ' + trip.minYear;
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

  function toggleBucket(bucket) {
    var items = bucket === 'electives' ? data.subjects.filter(function (s) { return s.elective && isYearAllowed(s, state.year); }) : bucket === 'clubs' ? data.clubs.filter(function (c) { return !c.houseAuto && state.year >= (c.minYear || 1); }) : data.trips.filter(function (t) { return state.year >= t.minYear; });
    var ids = items.map(function (item) { return item.id; });
    var current = new Set(state[bucket]);
    var allSelected = ids.length > 0 && ids.every(function (id) { return current.has(id); });
    ids.forEach(function (id) { allSelected ? current.delete(id) : current.add(id); });
    state[bucket] = Array.from(current);
    renderChoices(); updateRequirement(); persist();
  }

  function updateRequirement() {
    var rule = data.electiveRules[state.year]; var selectedCount = countMinimumElectives(); var missing = Math.max(rule.minimum - selectedCount, 0);
    els.electiveCount.textContent = selectedCount + '/' + rule.minimum + ' Wahlpflicht';
    els.requirementCard.innerHTML = '<strong>' + (missing === 0 ? 'Curriculum kann erstellt werden' : missing + ' fehlt') + '</strong><span>' + rule.text + '</span>';
    els.requirementCard.classList.toggle('needs-attention', missing > 0); els.formNote.textContent = missing > 0 ? data.formTexts.calm : data.formTexts.conflict;
    updateToggleLabels();
  }

  function updateToggleLabels() {
    updateToggleLabel(els.toggleElectives, 'electives', data.subjects.filter(function (s) { return s.elective && isYearAllowed(s, state.year); }).map(function (s) { return s.id; }));
    updateToggleLabel(els.toggleClubs, 'clubs', data.clubs.filter(function (c) { return !c.houseAuto && state.year >= (c.minYear || 1); }).map(function (c) { return c.id; }));
    updateToggleLabel(els.toggleTrips, 'trips', data.trips.filter(function (t) { return state.year >= t.minYear; }).map(function (t) { return t.id; }));
  }

  function updateToggleLabel(button, bucket, ids) {
    if (!button) return;
    var current = new Set(state[bucket]);
    button.textContent = ids.length && ids.every(function (id) { return current.has(id); }) ? 'Alle Abwählen' : 'Alle Auswählen';
  }

  function validateMinimum() {
    var rule = data.electiveRules[state.year]; var missing = Math.max(rule.minimum - countMinimumElectives(), 0); if (missing === 0) return true;
    els.requirementCard.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 220 }); els.requirementCard.focus(); return false;
  }

  function countMinimumElectives() { return state.electives.filter(function (id) { var subject = findSubject(id); return subject && subject.countsForMinimum && isYearAllowed(subject, state.year); }).length; }

  function renderSchedule() {
    var house = data.houses.find(function (item) { return item.id === state.house; }) || data.houses[0]; var events = buildEvents(); var visibleEvents = filterEvents(events); var grouped = groupEvents(visibleEvents);
    els.scheduleTitle.textContent = (state.name || 'Unbenanntes Curriculum') + ' · ' + house.name;
    els.scheduleMeta.textContent = state.year + '. Schuljahrgang · Hauslehrkraft: ' + house.head + ' · Wahlpflicht: ' + countMinimumElectives() + '/' + data.electiveRules[state.year].minimum;
    els.scheduleHouseCrest.src = house.crest; els.scheduleHouseCrest.dataset.fallback = assetUrl(house.fallback); els.scheduleHouseCrest.alt = house.name; els.scheduleHouseCrest.title = house.name + ' ansehen'; els.scheduleHouseCrest.tabIndex = 0; els.scheduleHouseCrest.style.setProperty('--img-scale', house.imageScale); els.scheduleHouseCrest.onclick = function () { openHouseInfo(house.id); }; els.scheduleHouseCrest.onkeydown = function (event) { if (event.key === 'Enter' || event.key === ' ') openHouseInfo(house.id); }; addImageFallbacks(document);
    renderScheduleFilters(events);
    var cells = ['<div class="grid-cell grid-head time-head" role="columnheader">Zeit</div>'];
    data.days.forEach(function (day) { cells.push('<div class="grid-cell grid-head ' + (day.id === 'saturday' ? 'weekend-start' : '') + '" role="columnheader">' + day.label + '</div>'); });
    data.timeSlots.forEach(function (slot) { cells.push('<div class="grid-cell time-cell ' + (slot.type === 'meal' ? 'meal-time' : '') + '" role="rowheader"><strong>' + slot.label + '</strong><span>' + slot.time + '</span></div>'); data.days.forEach(function (day) { cells.push(renderScheduleCell(day, slot, grouped.get(cellKey(day.id, slot.id)) || [])); }); });
    els.scheduleGrid.innerHTML = cells.join('');
    addImageFallbacks(els.scheduleGrid);
    els.scheduleGrid.querySelectorAll('[data-event-id]').forEach(function (button) { button.addEventListener('click', function () { openInfo(button.dataset.eventId); }); });
    renderMobileDaySchedule(visibleEvents);
    renderTrips(); renderMaterials(); renderSpecialDates(); restartWritingAnimations();
  }

  function renderScheduleFilters(events) {
    var current = state.scheduleFilter || 'all';
    var filters = [
      { id: 'all', label: 'Alles', count: events.length },
      { id: 'subject', label: 'Unterricht', count: events.filter(function (event) { return event.kind === 'subject'; }).length },
      { id: 'club', label: 'Clubs', count: events.filter(function (event) { return event.kind === 'club'; }).length }
    ];
    if (!filters.some(function (filter) { return filter.id === current; })) current = 'all';
    els.scheduleFilterControls.innerHTML = filters.map(function (filter) {
      return '<button class="filter-pill ' + (filter.id === current ? 'is-active' : '') + '" type="button" data-schedule-filter="' + filter.id + '" aria-pressed="' + (filter.id === current ? 'true' : 'false') + '">' + filter.label + '<span>' + filter.count + '</span></button>';
    }).join('');
  }

  function filterEvents(events) {
    var filter = state.scheduleFilter || 'all';
    if (filter === 'meal') filter = 'all';
    return filter === 'all' ? events : events.filter(function (event) { return event.kind === filter; });
  }

  function renderMobileDaySchedule(events) {
    var grouped = groupEvents(events);
    var dayIndex = Math.max(0, data.days.findIndex(function (day) { return day.id === state.mobileDay; }));
    var day = data.days[dayIndex] || data.days[0];
    state.mobileDay = day.id;
    var rows = data.timeSlots.map(function (slot) {
      var list = grouped.get(cellKey(day.id, slot.id)) || [];
      var eventHtml = list.length ? list.map(function (event) { return mobileEventButton(event); }).join('') : '<span class="mobile-empty">frei</span>';
      return '<div class="mobile-day-row ' + (slot.type === 'meal' ? 'mobile-meal-row' : '') + '"><div class="mobile-time"><strong>' + slot.label + '</strong><span>' + slot.time + '</span></div><div class="mobile-events">' + eventHtml + '</div></div>';
    }).join('');
    els.mobileDaySchedule.innerHTML = '<section class="mobile-day-card"><div class="mobile-day-nav"><button class="mobile-day-arrow" type="button" data-day-step="-1" aria-label="Vorheriger Tag">‹</button><h3>' + day.label + '</h3><button class="mobile-day-arrow" type="button" data-day-step="1" aria-label="Nächster Tag">›</button></div>' + rows + '</section>';
    addImageFallbacks(els.mobileDaySchedule);
    els.mobileDaySchedule.querySelectorAll('[data-day-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var currentIndex = Math.max(0, data.days.findIndex(function (item) { return item.id === state.mobileDay; }));
        var nextIndex = (currentIndex + Number(button.dataset.dayStep) + data.days.length) % data.days.length;
        state.mobileDay = data.days[nextIndex].id;
        renderMobileDaySchedule(filterEvents(buildEvents()));
      });
    });
    els.mobileDaySchedule.querySelectorAll('[data-event-id]').forEach(function (button) { button.addEventListener('click', function () { openInfo(button.dataset.eventId); }); });
  }

  function mobileEventButton(event) {
    var details = [event.teacher, event.room].filter(Boolean).join(' · ');
    return '<button class="mobile-event ' + (event.kind === 'meal' ? 'mobile-meal' : '') + '" type="button" data-event-id="' + event.id + '" style="--accent:' + event.color + '"><span class="mini-icon">' + event.icon + '</span><span><strong>' + event.name + '</strong><small>' + details + '</small></span></button>';
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

  function eventFromItem(item, id, kind, day, slot, name, teacher, room) { return { id: id, sourceId: item.id || id, kind: kind, name: name || item.name, teacher: kind === 'meal' ? '' : (teacher || 'ohne feste Leitung'), room: room || 'wechselnder Treffpunkt', color: item.color || '#80BFAD', icon: kind === 'subject' ? iconImage(item) : clubIcon(item), info: item.info, examForm: item.examForm, professorComment: kind === 'subject' ? professorComment(item) : '', materials: item.materials || [], day: day, slot: slot }; }

  function renderScheduleCell(day, slot, events) {
    var eventButtons = events.map(function (event) { var details = [event.teacher, event.room].filter(Boolean).join('<br>'); return '<button class="lesson-card revelio-card ' + (event.kind === 'meal' ? 'meal-card' : '') + '" type="button" data-event-id="' + event.id + '" style="--accent:' + event.color + ';--reveal-delay:' + revealDelay(day, slot) + 's"><span class="mini-icon">' + event.icon + '</span><span><strong>' + event.name + '</strong><small>' + details + '</small></span></button>'; }).join('');
    var turner = events.length > 1 ? '<img class="time-turner" src="' + data.assets.timeTurner.src + '" data-fallback="' + assetUrl(data.assets.timeTurner.fallback) + '" alt="Zeitumkehrer" style="--img-scale:' + data.assets.timeTurner.scale + '">' : '';
    var empty = events.length === 0 ? '<span class="empty-slot">frei</span>' : '';
    return '<div class="grid-cell schedule-cell ' + (slot.type === 'meal' ? 'meal-slot' : '') + ' ' + (day.id === 'saturday' ? 'weekend-start' : '') + (events.length > 1 ? ' has-conflict' : '') + '" role="cell" aria-label="' + day.label + ', ' + slot.time + '">' + turner + empty + eventButtons + '</div>';
  }

  function openInfo(eventId) {
    var event = buildEvents().find(function (item) { return item.id === eventId; }); if (!event) return;
    var exam = event.examForm ? '<div><dt>Prüfungsform</dt><dd>' + event.examForm + '</dd></div>' : '';
    var leader = event.teacher ? '<div><dt>Leitung</dt><dd>' + event.teacher + '</dd></div>' : '';
    var professor = event.professorComment ? '<h4>Professoren-Kommentar</h4><p>' + event.professorComment + '</p>' : '';
    var curriculumTopics = curriculumTopicsHtml(event);
    var materialList = getMaterialList(event);
    var materials = materialList.length ? '<h4>Materialien und Literatur</h4><ul>' + materialList.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' : '';
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:' + event.color + '"><span class="dialog-icon">' + event.icon + '</span><div><p class="eyebrow">' + labelForKind(event.kind) + '</p><h3>' + event.name + '</h3></div></div><dl class="detail-list">' + leader + '<div><dt>Raum</dt><dd>' + event.room + '</dd></div><div><dt>Termin</dt><dd>' + dayLabel(event.day) + ', ' + slotTime(event.slot) + '</dd></div>' + exam + '</dl><p>' + event.info + '</p>' + professor + curriculumTopics + materials;
    showDialogWithoutScrollJump();
  }

  function renderTrips() {
    var trips = selectedTrips();
    els.tripSummary.innerHTML = trips.length ? trips.map(function (trip) { return '<button class="summary-item clickable-summary" type="button" data-trip-id="' + trip.id + '"><strong>' + trip.name + '</strong><span>' + trip.date + ' · ' + trip.location + '</span><p>' + trip.info + '</p></button>'; }).join('') : '<p class="empty-note">Keine Ausflüge oder Austausche angemeldet.</p>';
    els.tripSummary.querySelectorAll('[data-trip-id]').forEach(function (button) { button.addEventListener('click', function () { openTripInfo(button.dataset.tripId); }); });
  }

  function renderMaterials() {
    var rows = materialSources().map(function (item) { return '<tr><th>' + item.name + '</th><td><ul>' + getMaterialList(item).map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></td></tr>'; }).join('');
    els.materialsTable.innerHTML = '<table class="materials"><tbody>' + rows + '</tbody></table>';
  }

  function renderSpecialDates() {
    els.specialDates.innerHTML = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; }).map(function (item, index) { return '<button class="date-item clickable-summary" type="button" data-date-index="' + index + '"><strong>' + item.date + '</strong><span>' + item.name + '</span></button>'; }).join('');
    els.specialDates.querySelectorAll('[data-date-index]').forEach(function (button) { button.addEventListener('click', function () { openSpecialInfo(Number(button.dataset.dateIndex)); }); });
  }

  function openTripInfo(tripId) {
    var trip = findTrip(tripId); if (!trip) return;
    var leader = trip.leader || tripLeader(trip);
    var cost = trip.cost || tripCost(trip);
    var details = tripDetails(trip);
    var bring = getMaterialList(trip);
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:' + trip.color + '"><span class="dialog-icon">' + clubIcon(trip) + '</span><div><p class="eyebrow">Exkursion / Austausch</p><h3>' + trip.name + '</h3></div></div><dl class="detail-list"><div><dt>Leitung</dt><dd>' + leader + '</dd></div><div><dt>Datum / Zeitraum</dt><dd>' + trip.date + '</dd></div><div><dt>Ort</dt><dd>' + trip.location + '</dd></div><div><dt>Kosten</dt><dd>' + cost + ' Galleonen</dd></div></dl><h4>Beschreibung</h4><p>' + details.description + '</p><h4>Ablauf</h4><p>' + details.activities + '</p><h4>Mitbringen</h4><p>' + (bring.length ? bring.join(', ') : details.bring) + '</p><p>' + tripFlavor(trip) + '</p>';
    showDialogWithoutScrollJump();
  }

  function openSpecialInfo(index) {
    var dates = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; });
    var item = dates[index]; if (!item) return;
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:#F2C580"><span class="dialog-icon">' + clubIcon({ name: item.name, color: '#F2C580' }) + '</span><div><p class="eyebrow">Sondertermin</p><h3>' + item.name + '</h3></div></div><dl class="detail-list"><div><dt>Datum / Zeitraum</dt><dd>' + item.date + '</dd></div><div><dt>Leitung</dt><dd>' + specialLeader(item) + '</dd></div><div><dt>Ort</dt><dd>' + specialPlace(item) + '</dd></div></dl><p>' + specialInfo(item) + '</p>';
    showDialogWithoutScrollJump();
  }

  function tripLeader(trip) {
    if (trip.id.indexOf('beauxbatons') > -1 || trip.id.indexOf('durmstrang') > -1 || trip.id.indexOf('ilvermorny') > -1 || trip.id.indexOf('macusa') > -1) return 'Professor McGonagall und Internationales Austauschbüro';
    if (trip.id.indexOf('st-mungos') > -1) return 'Poppy Pomfrey';
    if (trip.id.indexOf('ashpeak') > -1) return 'Charlie Weasley';
    if (trip.id.indexOf('astra') > -1) return 'Professor Sinistra';
    return 'Professor McGonagall';
  }

  function tripCost(trip) {
    var costs = { 'hogsmeade-visit': 1, 'diagon-alley': 4, ashpeak: 8, mournvale: 5, 'aurum-kettleworks': 3, 'astra-noctis': 4, 'ministry-uk': 2, macusa: 35, 'st-mungos': 2, beauxbatons: 18, durmstrang: 24, ilvermorny: 38 };
    return costs[trip.id] || 3;
  }

  function tripFlavor(trip) {
    return 'Vor der Abreise werden Treffpunkt, Rückkehrzeit und Sicherheitsregeln im Gemeinschaftsraum ausgehängt. Die Anmeldung gilt erst als vollständig, wenn Hauslehrkraft und Begleitperson sie gegengezeichnet haben.';
  }

  function tripDetails(trip) {
    var map = {
      'hogsmeade-visit': ['Dieser Besuch ist der klassische erste Schritt hinaus aus dem Schloss, ohne dass die Aufsicht den Überblick verliert. Hogsmeade ist nah genug für einen Tagesausflug.', 'Ihr meldet euch am Treffpunkt, besucht die erlaubten Läden, haltet eine kurze Beobachtungsnotiz zu magischem Handel fest und kehrt geschlossen zum Rückmeldepunkt an den Drei Besen zurück.', 'Einverständniserklärung, wetterfester Umhang und ein kleiner Galeonenbeutel.'],
      'diagon-alley': ['Die Winkelgasse ist Einkauf und Staunen in einem einzigen Pflasterweg.', 'Ihr besucht Buchhandlungen, kauf Reagenzien und schaut in Fachgeschäfte, vergleicht Preise für Schulmaterial und notiert, welche Gegenstände für euren Schuljahrgang wirklich notwendig sind.', 'Einkaufsliste und Galeonenbeutel.'],
      ashpeak: ['Das Drachenbeobachtungs-Plateau Ashpeak ist kein Abenteuerurlaub, sondern eine streng gesicherte Beobachtungsexkursion. Der Reiz liegt gerade darin, nahe genug für Erkenntnisse und weit genug für vollständige Gliedmaßen zu sein.', 'Ihr arbeitet mit Fernglas und Schutzabstand, zeichnet Verhalten, Flugrichtung und Reviergrenzen auf und besprecht danach, warum Drachenkunde mehr Geduld als Heldentum verlangt.', 'Drachenhauthandschuhe, Fernglas und feuerfester Umhang.'],
      mournvale: ['Die Magischen Gärten von Mournvale zeigen Pflanzen, die im normalen Gewächshaus nur selten gehalten werden können.', 'Ihr führt ein Pflanzenprotokoll, skizziert zwei Gewächse, hört eine Sicherheitsunterweisung der Gärtnerinnen und sammelt nur dort Proben, wo es ausdrücklich erlaubt ist.', 'Pflanzenführer, Handschuhe und Skizzenbuch.'],
      'aurum-kettleworks': ['Die Aurum-Kesselwerke sind für alle interessant, die wissen wollen, warum ein guter Kessel mehr ist als ein runder Topf. Hier sieht man, wie magisches Metall, Hitzeführung und Prüfsiegel zusammenarbeiten.', 'Ihr beobachtet Guss, Politur und Sicherheitsprüfung, vergleicht verschiedene Kesseltypen und erstellt am Ende eine kurze Empfehlung für den Schulgebrauch.', 'Schutzbrille, Notizpergament und geschlossene Schuhe.'],
      'astra-noctis': ['Das Observatorium Astra Noctis ist eine stille Exkursion für geduldige Augen. Die Anlage erlaubt Beobachtungen, die vom Astronomieturm aus nur bei perfektem Wetter möglich wären.', 'Ihr richtet Teleskope aus, führt ein gemeinsames Beobachtungsprotokoll und besprecht, welche Konstellationen für Zauber, Tränke oder Omen wirklich relevant sind.', 'Sternkarte, Teleskopaufsatz und warmer Umhang.'],
      'ministry-uk': ['Der Besuch im Britischen Zaubereiministerium ist besonders für ältere Schuljahrgänge gedacht, die beruflich vorausdenken. Hier wird sichtbar, wie Gesetze, Geheimhaltung und Alltagsmagie verwaltet werden.', 'Ihr besucht ausgewählte Abteilungen, stellt vorbereitete Fragen und schreibt anschließend einen kurzen Bericht darüber, welcher Beruf euch überrascht hat.', 'Ausweisformular, Festumhang und Fragenkatalog.'],
      macusa: ['Der Austausch zum Magischen Kongress der Vereinigten Staaten von Amerika richtet den Blick über britische Gewohnheiten hinaus. Unterschiede in Recht, Geheimhaltung und Schulausbildung werden hier sehr deutlich.', 'Ihr nehmt an einer Einführung teil, vergleicht Fallbeispiele internationaler Zauberergesetze und führt ein Gespräch mit Austauschbeauftragten.', 'Reisepass für magische Reisen, Austauschformular und Notizbuch.'],
      'st-mungos': ['St. Mungos zeigt, wie ernsthafte Heilmagie aussieht, wenn sie nicht nur aus einem sauberen Verband besteht. Die Exkursion ist ruhig, respektvoll und ausdrücklich nicht zum Herumprobieren gedacht.', 'Ihr besucht freigegebene Stationen, beobachtet Notfallabläufe und besprecht mit dem Personal, welche Schulfächer für Heilberufe besonders wichtig sind.', 'Heilkundemappe, saubere Handschuhe und Fragenliste.'],
      beauxbatons: ['Der Austausch mit Beauxbatons ist höflicher als manche Hogwarts-Stunde, aber keineswegs leichter. Besonders spannend sind Unterrichtsstil, Etikette und die andere Art, magische Begabung öffentlich zu zeigen.', 'Ihr besucht Unterrichtseinheiten, nehmt an einem kulturellen Abend teil und führt ein Vergleichsprotokoll zu Hauskultur, Prüfungen und Schulalltag.', 'Austauschpergament, Festumhang und französisches Wörterbuch.'],
      durmstrang: ['Der Besuch am Durmstrang Institut ist für ältere Schülerinnen und Schüler mit sicherem Auftreten gedacht. Die Schule legt großen Wert auf Disziplin, Geschichte und kontrollierte Verteidigungsmagie.', 'Ihr folgt einem betreuten Rundgang, besprecht Unterrichtsschwerpunkte und vergleicht Verteidigungsübungen ohne eigenmächtige Demonstrationen.', 'Winterumhang, Austauschpergament und Schutzzauber-Notizen.'],
      ilvermorny: ['Der Austausch mit Ilvermorny erweitert den Blick auf Häusertraditionen und magische Identität. Gerade der Vergleich mit Hogwarts macht sichtbar, was an der eigenen Schule selbstverständlich wirkt.', 'Ihr besucht Unterricht, führt Partnergespräche mit amerikanischen Schülerinnen und Schülern und erstellt einen Bericht über Unterschiede in Ritualen, Fächern und Schulorganisation.', 'Austauschpergament, Reisetalisman und Notizbuch.']
    };
    var entry = map[trip.id] || [trip.longInfo || trip.info || 'Diese Exkursion ergänzt den Unterricht durch einen begleiteten Blick außerhalb des Schlosses.', 'Ihr nehmt an einer Einführung teil, bearbeitet Beobachtungsaufgaben und meldet euch am Ende bei der Begleitperson zurück.', 'Genehmigung, Notizpergament und wetterfester Umhang.'];
    return { description: entry[0], activities: entry[1], bring: entry[2] };
  }

  function specialLeader(item) {
    if (item.name.indexOf('Quidditch') > -1) return 'Madam Rolanda Hooch';
    if (item.name.indexOf('ZAG') > -1 || item.name.indexOf('UTZ') > -1) return 'Prüfungskommission Hogwarts';
    if (item.name.indexOf('Berufsberatung') > -1) return 'Professor McGonagall';
    if (item.name.indexOf('Apparier') > -1) return 'Wilkie Twycross';
    return 'Schulleitung Hogwarts';
  }

  function specialPlace(item) {
    if (item.name.indexOf('Quidditch') > -1) return 'Quidditchfeld';
    if (item.name.indexOf('Bankett') > -1 || item.name.indexOf('Hauspunkte') > -1) return 'Große Halle, Erdgeschoss';
    if (item.name.indexOf('Berufsberatung') > -1) return 'Büro von Professor McGonagall';
    if (item.name.indexOf('Apparier') > -1) return 'Große Halle, Erdgeschoss';
    return 'Aushangbrett und zentrale Bereiche von Hogwarts';
  }

  function specialInfo(item) {
    var text = {
      '1. Schultag und Willkommensbankett': 'Das Schuljahr beginnt mit Ankunft, Hausordnung, Bankett und den ersten offiziellen Ansagen der Schulleitung. Neue Schülerinnen und Schüler folgen nach dem Aussteigen den Anweisungen der Vertrauensschüler; ältere Jahrgänge begeben sich direkt in die Große Halle. Bitte behaltet eure Gepäckmarken, bis die Hauselfen die Koffer in die Schlafsäle gebracht haben.',
      'Quidditch-Auswahlspiele': 'Die Auswahlspiele bestimmen, wer in dieser Saison für das jeweilige Haus trainiert und spielt. Madam Hooch prüft nicht nur Schnelligkeit, sondern auch sichere Flugführung, Teamverhalten und Reaktion unter Druck. Wer sich bewirbt, erscheint pünktlich in Sportkleidung und akzeptiert die Entscheidung der Kapitäninnen und Kapitäne ohne Theater.',
      'Wahl der Schulsprecher': 'Die Wahl der Schulsprecher wird durch die Hauslehrkräfte vorbereitet und von der Schulleitung bestätigt. Kandidatinnen und Kandidaten sollen zuverlässig, verschwiegen und in der Lage sein, zwischen Hausinteressen und Schulwohl zu unterscheiden. Das Ergebnis wird nach Prüfung der Stimmen am schwarzen Brett und in der Großen Halle bekanntgegeben.',
      'Hogsmeade-Exkursion dritter Schuljahrgang': 'Diese Exkursion ist für den dritten Schuljahrgang der erste größere Ausgang nach Hogsmeade. Die Hauslehrkräfte prüfen vorher die Genehmigungen, Treffpunkte und Rückkehrzeiten. Wer die Regeln einhält, bekommt einen freien, aber betreuten Eindruck von Läden, Dorfleben und den wichtigsten Rückmeldepunkten.',
      'Berufsberatung': 'Euer Hauslehrer führt im 5. Schuljahrgang diese Gespräche ernsthaft und ohne Beschönigung. Sie betrachten Noten, Interessen, Arbeitshaltung und die Fächerwahl für die kommenden Jahre. Wer einen Berufswunsch nennt, bekommt erklärt, welche Prüfungen, Kurse und Gewohnheiten dafür notwendig sind.',
      'Beginn Winterfest': 'Mit dem Winterfest und dem Kutschenrennen über dem gefrorenen schwarzen See beginnt die ruhigere, festliche Phase vor den Ferien. Die Große Halle wird geschmückt, Clubs haben Sonderveranstaltungen und die Hauslehrkräfte achten besonders darauf, dass niemand seine letzten Abgaben unter Girlanden machen muss. Beiträge für Musik, Tanz oder Dekoration werden über die Eventgruppe koordiniert.',
      'Weihnachtsferien': 'Während der Weihnachtsferien ruht der reguläre Unterricht. Schülerinnen und Schüler melden beim Hauslehrer, ob sie heimreisen oder in Hogwarts bleiben. Wer im Schloss bleibt, erhält geänderte Essenszeiten, eine reduzierte Bibliotheksaufsicht und weitere großzügige Freiheiten.',
      'ZAG-Zwischenprüfung': 'Die ZAG-Zwischenprüfung dient als ehrlicher Zwischenstand vor der eigentlichen Prüfungsphase. Es geht nicht darum, jemanden zu erschrecken, sondern Lücken sichtbar zu machen, solange noch Zeit bleibt. Bringt Schreibmaterial, Ruhe und die Bereitschaft mit, nach der Rückgabe wirklich nachzuarbeiten.',
      'UTZ-Zwischenprüfung': 'Die UTZ-Zwischenprüfung ist deutlich anspruchsvoller und prüft, ob ihr mit fortgeschrittenem Stoff unter Zeitdruck arbeiten könnt. Die Lehrkräfte werten besonders Begründungen, saubere Methode und eigenständige Anwendung. Wer hier schwächelt, bekommt Beratung, aber keine Ausrede für Nachlässigkeit.',
      'Osterferien': 'Die Osterferien unterbrechen den Unterricht vor der letzten langen Arbeitsphase des Schuljahres. Rückreise, Heimaufenthalt oder Schlossverbleib werden rechtzeitig über die Hauslehrer festgehalten. Für Prüfungsjahrgänge bleiben empfohlene Lernpläne in Bibliothek und Gemeinschaftsräumen ausgehängt.',
      'Apparierprüfung': 'Die Apparierprüfung wird nur für zugelassene Schülerinnen und Schüler durchgeführt. Wilkie Twycross prüft genau die Ausführung und möchte keine dramatischen Auftritte. Wer die Sicherheitsanweisung missachtet, wird sofort zurückgestellt.',
      'Quidditch-Finale': 'Das Quidditch-Finale entscheidet die sportliche Saison und füllt die Tribünen zuverlässig bis auf den letzten Platz. Madam Hooch und das Quidditch-Orga Team achtet auf klare Regeln, einen reibungslosen Ablauf, faire Schiedsrichterentscheidungen und sichere Besenführung. Möge das beste Team gewinnen.',
      'ZAG-Prüfungen': 'Die ZAG-Prüfungen schließen den fünften Schuljahrgang ab und entscheiden über viele weiterführende Kursmöglichkeiten. Schriftliche und praktische Teile werden getrennt beaufsichtigt. Erscheint ausgeschlafen, bringt zugelassenes Material mit und verlasst euch nicht auf Glücksbringer, die lauter klappern als sie helfen.',
      'UTZ-Prüfungen': 'Die UTZ-Prüfungen sind der offizielle Abschluss der fortgeschrittenen Ausbildung an der Hogwarts Schule. Erwartet werden Fachsicherheit, ruhige Ausführung und begründete Entscheidungen unter Beobachtung. Die Prüfungskommission bewertet nicht nur Ergebnis, sondern auch Haltung, Methode und Verantwortung.',
      'Hogwarts-Abschlussfest': 'Das Abschlussfest gehört den Siebtklässlern und allen, die sie bis hierher begleitet haben. Es gibt Reden, Musik, letzte Hausrunden und jede Menge Feuerwhiskey. Festumhang ist erwünscht.',
      'Abschlusszeremonie und Hauspunktevergabe': 'Bei der Abschlusszeremonie werden Leistungen, besondere Beiträge und die Hauspunkte des Jahres offiziell bekanntgegeben. Die Schulleitung blickt auf Erfolge, Zwischenfälle und bemerkenswerte Entwicklungen zurück. Danach endet das Schuljahr formell mit Bankett und Abreisehinweisen.',
      'Sommerferien': 'Mit den Sommerferien endet der Schulbetrieb bis zum 31. August. Schulmaterial, Briefe und Bücherlisten werden über Eulenpost an die Hausanschrift verschickt. Wer ausgeliehene Bücher, Umhänge oder Clubausrüstung nicht zurückgibt, hört sehr wahrscheinlich von Madam Pince, Madam Hooch oder beiden.'
    };
    return text[item.name] || 'Dieser Sondertermin wird vom Schulsekretariat koordiniert und von den Hauslehrkräften zusätzlich angekündigt. Achtet auf Aushänge, Rückmeldefristen und die Anweisungen eurer Begleitpersonen.';
  }

  function professorComment(item) {
    var teacher = item.teacher || '';
    var year = state.year || 1;
    var focus = subjectFocus(item, year);
    if (item.id === 'astronomy') return 'Ich halte Astronomie für eines der stillsten, aber ehrlichsten Fächer in Hogwarts: Der Himmel lässt sich nicht beeindrucken, bestechen oder überreden. Ich gestalte den Unterricht so, dass Beobachtung, Sternkartenarbeit und kurze Auswertungen einander abwechseln; wer nachts friert, lernt wenigstens, warum Genauigkeit Vorbereitung braucht. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte, dass jede Eintragung so sauber ist, dass man sie auch bei schwachem Kerzenlicht prüfen kann.';
    if (item.id === 'charms' || item.id === 'advanced-charms') return 'Ich liebe Zauberkunst, weil ein kleiner sauberer Zauber den Alltag mehr verändern kann als eine große dramatische Geste. Ich gestalte den Unterricht im Wechsel aus Vormachen, rhythmischem Üben und Anwendung: Erst hören wir den Zauber, dann zerlegen wir Bewegung und Betonung, dann darf er in einer Aufgabe wirklich arbeiten. In eurem ' + year + '. Schuljahrgang konzentrieren wir uns auf ' + focus + '; kleine Fehlversuche verzeihe ich gern, absichtliches Herumfuchteln mit dem Zauberstab dagegen nicht.';
    if (item.id === 'defence' || item.id === 'advanced-defence' || teacher.indexOf('Snape') > -1) return 'Ich halte Verteidigung nur dann für nützlich, wenn sie ohne Lärm, ohne Prahlerei und ohne törichte Selbstüberschätzung funktioniert. Ich gestalte meinen Unterricht mit Analyse, kontrollierter Demonstration und präziser Wiederholung; wer glaubt, Mut ersetze Vorbereitung, wird sehr schnell eines Besseren belehrt. In eurem ' + year + '. Schuljahrgang liegt der Schwerpunkt auf ' + focus + ', und ich erwarte, dass ihr den Unterschied zwischen einem Schutzzauber und einer Ausrede kennt.';
    if (item.id === 'herbology' || item.id === 'advanced-herbology') return 'Ich mag Kräuterkunde, weil sie Geduld belohnt und Hochmut ziemlich zuverlässig beißt, kratzt oder kreischt. Ich gestalte den Unterricht mit kurzen Sicherheitshinweisen, gemeinsamer Demonstration und viel praktischer Arbeit an Erde, Topf und Pflanze. In eurem ' + year + '. Schuljahrgang beginnen wir mit ' + focus + '; ein bisschen Schmutz am Umhang ist völlig in Ordnung, aber vergessene Handschuhe sind keine Kleinigkeit.';
    if (item.id === 'history' || item.id === 'advanced-history') return 'Ich betrachte Geschichte der Zauberei als Gedächtnis der magischen Gesellschaft, auch wenn viele Schülerinnen und Schüler sie zunächst für eine lange Liste schläfriger Jahreszahlen halten. Ich gestalte den Unterricht durch Vorlesung, Quellenstellen und schriftliche Einordnung; wer zuhört, erkennt, dass jeder Aufstand und jedes Gesetz eine Ursache hatte. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte Zusammenhänge statt bloßer Namen in schöner Tinte.';
    if (item.id === 'potions' || item.id === 'advanced-potions') return 'Ich schätze Zaubertränke, weil ein guter Trank nicht laut sein muss, um mächtig zu wirken. Ich gestalte den Unterricht mit Rezeptanalyse, sauberer Vorbereitung und streng beobachteter Praxis am Kessel; wer Zutaten ohne Nachdenken hineinwirft, braut keine Magie, sondern Zufall. In eurem ' + year + '. Schuljahrgang arbeiten wir besonders an ' + focus + ', und ich achte mehr auf ruhige Genauigkeit als auf glänzende Selbstdarstellung.';
    if (item.id === 'transfiguration' || item.id === 'advanced-transfiguration' || item.id === 'animagus-study') return 'Ich halte Verwandlung für eines der anspruchsvollsten Fächer, weil sie Vorstellungskraft und Disziplin gleichzeitig verlangt. Ich gestalte den Unterricht klar gestuft: Zuerst Theorie und Zielbild, dann kontrollierte Übung, dann eine praktische Anwendung, die zeigt, ob Sie wirklich verstanden haben, was Sie tun. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + '; ich verzeihe ehrliches Üben, aber keine schlampige Konzentration.';
    if (item.id === 'flying' || item.id === 'pro-quidditch') return 'Ich halte Fliegen für wunderbar, solange niemand vergisst, dass Höhe und Geschwindigkeit keine Entschuldigung für Leichtsinn sind. Ich gestalte den Unterricht mit Sicherheitscheck, Technikübung und kurzen Parcours, damit ihr nicht nur schnell, sondern kontrolliert fliegt. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich sehe lieber eine langsame Landung als drei Meter Angeberei vor der Tribüne.';
    if (item.id === 'ancient-runes') return 'Ich halte Alte Runen für ein Fach, in dem Geduld plötzlich Türen öffnet, die ein lauter Zauber nie finden würde. Ich gestalte den Unterricht mit Zeichenkunde, Übersetzungsübungen und kurzen Deutungen, damit ihr nicht nur Symbole abmalt, sondern ihren Zweck versteht. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte, dass jede Übersetzung begründet wird.';
    if (item.id === 'arithmancy') return 'Ich schätze Arithmantik, weil sie zeigt, dass Magie nicht immer Gefühl, sondern manchmal sehr nüchterne Ordnung ist. Ich gestalte den Unterricht mit Rechenwegen, Vergleichsbeispielen und Prognoseaufgaben; ein Ergebnis ohne Begründung ist bei mir nur eine Vermutung in hübscher Handschrift. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und kleine Rechenfehler sind leichter zu retten als unbelegte Behauptungen.';
    if (item.id === 'care-creatures' || item.id === 'advanced-creatures' || item.id === 'dragonology') return 'Ich finde Pflege magischer Geschöpfe großartig, weil man hier lernt, dass Respekt wichtiger ist als Angst und Neugier wichtiger als Angeberei. Ich gestalte den Unterricht draußen, mit Abstand, Beobachtung und praktischen Handgriffen; Professor Raue-Pritsche erinnert zusätzlich daran, dass ein Protokoll manchmal klüger ist als eine Umarmung. In eurem ' + year + '. Schuljahrgang schauen wir besonders auf ' + focus + ', und hektische Bewegungen sind fast nie eine gute Idee.';
    if (item.id === 'divination') return 'Ich halte Wahrsagen für ein Fach, das viele unterschätzen, weil sie nur eindeutige Antworten akzeptieren möchten. Ich gestalte den Unterricht mit Symboldeutung, Traumjournalen und mündlichen Beobachtungen; manchmal spricht die Zukunft leise, manchmal spricht sie in Teeblättern, und manchmal spricht sie gar nicht mit Erstklässlern. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte offene Wahrnehmung statt erfundener Dramatik.';
    if (item.id === 'muggle-studies') return 'Ich halte Muggelkunde für wichtig, weil Unwissen über Muggel schnell zu Arroganz und noch schneller zu sehr peinlichen Missverständnissen führt. Ich gestalte den Unterricht mit Objektanalysen, Vergleichsaufgaben und Gesprächen über Alltag, Technik und Gesellschaft. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte, dass ihr beobachtet, bevor ihr urteilt.';
    if (item.id === 'apparition') return 'Ich halte Apparieren für nützlich, aber nur für Schülerinnen und Schüler, die Ruhe wichtiger nehmen als Geschwindigkeit. Ich gestalte den Kurs mit Zielkreis, Wiederholung der drei Grundsätze und sehr kontrollierten Versuchen; niemand gewinnt Punkte dafür, besonders dramatisch zu verschwinden. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich drücke bei Nervosität eher ein Auge zu als bei Übermut.';
    if (item.id === 'alchemy') return 'Ich betrachte Alchemie als ein Fach für Menschen, die bereit sind, langsam zu denken und sehr genau hinzusehen. Ich gestalte den Unterricht mit Symbollehre, Laborprotokollen und kontrollierten Versuchsschritten, weil jede Abkürzung später eine Rechnung stellt. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte mehr Demut vor dem Material als glänzende Versprechen.';
    if (item.id === 'wandmaking') return 'Ich halte Zauberstabkunde für ein Fach, das zeigt, wie persönlich Magie wirklich ist. Ich gestalte den Unterricht mit Materialkunde, Fallbeispielen und vorsichtigen Werkstattübungen; ihr werdet nichts hastig zusammenleimen, nur weil es beeindruckend klingt. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte Respekt vor Holz, Kern und der Hexe oder dem Zauberer, der den Stab führt.';
    return 'Ich halte dieses Fach für wichtig, weil es euch zwingt, Magie nicht nur zu benutzen, sondern zu verstehen. Ich gestalte den Unterricht mit Theorie, Übung und einer Anwendung, bei der Vorbereitung sichtbar wird. In eurem ' + year + '. Schuljahrgang liegt der Fokus auf ' + focus + ', und ich erwarte Aufmerksamkeit, saubere Notizen und ehrliche Korrektur eigener Fehler.';
  }

  function subjectFocus(item, year) {
    var name = item.name || 'Grundlagen';
    var lower = (item.id || '').toLowerCase();
    if (lower.indexOf('astronomy') > -1) return year <= 2 ? 'Mondphasen, Sternbildern und sicheren Beobachtungsroutinen' : year <= 4 ? 'Sternkarten, Kometen und der Deutung besonderer Konjunktionen' : 'prüfungsreifen Beobachtungsprotokollen und komplexen Himmelsereignissen';
    if (lower.indexOf('charms') > -1 || item.name === 'Zauberkunst') return year <= 2 ? 'sauberer Aussprache, Schwebezaubern und kleinen Alltagszaubern' : year <= 4 ? 'präzisen Bewegungsfolgen, Kombinationszaubern und praktischer Anwendung' : 'nonverbalen Ansätzen, Zauberstabilität und prüfungsfesten Vorführungen';
    if (lower.indexOf('defence') > -1) return year <= 2 ? 'Grundschutz, Entwaffnung und dem Erkennen einfacher Flüche' : year <= 4 ? 'Schildzaubern, Gegenflüchen und kontrollierten Duellsituationen' : 'fortgeschrittener Abwehr, Fallanalyse und ruhiger Reaktion unter Druck';
    if (lower.indexOf('herbology') > -1) return year <= 2 ? 'ungefährlicher Pflege magischer Pflanzen' : year <= 4 ? 'Alraunen-Arten, bissigen Ranken und Schutzkleidung im Gewächshaus' : 'seltenen Heilpflanzen, Giftwirkung und prüfungsreifen Pflegeprotokollen';
    if (lower.indexOf('history') > -1) return year <= 2 ? 'wichtigen Zaubereigesetzen und frühen Koboldkonflikten' : year <= 4 ? 'internationalen Konflikten, Ministeriumsentscheidungen und Ursachenketten' : 'ZAG- und UTZ-tauglicher Einordnung historischer Wendepunkte';
    if (lower.indexOf('potions') > -1 || item.name === 'Zaubertränke') return year <= 2 ? 'Grundrezepten, Schnitttechnik und dem Lesen von Farbveränderungen' : year <= 4 ? 'Gegenmitteln, Elixieren und gefährlicheren Zutatenfolgen' : 'komplexen Brauabläufen, Analysefehlern und prüfungsreifen Laborprotokollen';
    if (lower.indexOf('transfiguration') > -1 || lower.indexOf('animagus') > -1 || item.name === 'Verwandlung') return year <= 2 ? 'einfachen Objektverwandlungen und stabilen Zielbildern' : year <= 4 ? 'Tierverwandlung, Rückverwandlung und theoretischen Grenzen' : 'fortgeschrittener Formstabilität, Ethik und sauber begründeter Transfiguration';
    if (lower.indexOf('flying') > -1 || lower.indexOf('quidditch') > -1) return year <= 2 ? 'Start, Bremsung, Balance und sicherem Landen' : year <= 4 ? 'Positionsspiel, Reaktion und kontrolliertem Mannschaftstraining' : 'Leistungsanalyse, Ausdauer und professioneller Spielübersicht';
    if (lower.indexOf('runes') > -1) return year <= 4 ? 'Runenfamilien, Lautwerten und ersten Schutzzeichen' : 'komplexer Übersetzung, historischen Inschriften und magischer Wirkung';
    if (lower.indexOf('arithmancy') > -1) return year <= 4 ? 'Zahlengrundlagen, Namenswerten und einfachen Prognosemustern' : 'komplexen Rechenwegen, Wahrscheinlichkeiten und begründeten Vorhersagen';
    if (lower.indexOf('care') > -1 || lower.indexOf('creatures') > -1 || lower.indexOf('dragonology') > -1) return year <= 4 ? 'Knuddelmuffs und diverse andere Tierarten, Hippogreifen-Regeln, Fütterung und sicherer Annäherung' : 'Gefahrenklassen, Reservatsarbeit und verantwortungsvoller Beobachtung größerer Geschöpfe';
    if (lower.indexOf('divination') > -1) return year <= 4 ? 'Teeblättern, Traumzeichen und einfachen Symbolketten' : 'komplexerer Deutung, Methodenvergleich und mündlicher Begründung';
    if (lower.indexOf('muggle') > -1) return year <= 4 ? 'Muggelalltag, Elektrizität, Sexualkunde und typischen Missverständnissen' : 'magisch-muggeligen Beziehungen, Geheimhaltung und gesellschaftlicher Analyse';
    if (lower.indexOf('apparition') > -1) return 'Ziel, Wille, Ruhe und dem sicheren Vermeiden von Zersplintern';
    if (lower.indexOf('alchemy') > -1) return 'Symbolketten, kontrollierter Transmutation und sauberer Substanzbeobachtung';
    if (lower.indexOf('wandlore') > -1 || lower.indexOf('wandmaking') > -1) return 'Holzarten, Kernen, Bindungsverhalten und sicherer Werkstattkunde';
    return name + ' und der sicheren Anwendung im passenden Schuljahrgang';
  }

  function materialSources() {
    var baseSupplies = { name: 'Schulgrundausstattung (' + state.year + '. Schuljahrgang)', materials: (data.studentSuppliesByYear && data.studentSuppliesByYear[String(state.year)]) || [] };
    var selectedSubjectIds = new Set(data.subjects.filter(function (s) { return s.required && isYearAllowed(s, state.year); }).map(function (s) { return s.id; }).concat(state.electives));
    var subjects = data.subjects.filter(function (s) { return selectedSubjectIds.has(s.id) && isYearAllowed(s, state.year); });
    var clubs = data.clubs.filter(function (c) { return state.clubs.indexOf(c.id) > -1 && state.year >= (c.minYear || 1); });
    return [baseSupplies].concat(subjects, clubs, selectedTrips()).filter(function (item) { return getMaterialList(item).length; });
  }


  function getMaterialList(item) {
    var list = [];
    if (item.literatureByYear && item.literatureByYear[String(state.year)]) {
      var title = item.literatureByYear[String(state.year)];
      var author = literatureAuthorFor(item);
      list.push('Literatur: ' + title + (author ? ' - von ' + author : ''));
    }
    (item.materials || []).forEach(function (entry) { if (entry && !/^Literatur:/i.test(entry) && list.indexOf(entry) === -1) list.push(entry); });
    return list;
  }

  function literatureAuthorFor(item) {
    var authors = data.literatureAuthors && data.literatureAuthors[item.id];
    if (!authors) return '';
    if (typeof authors === 'string') return authors;
    return authors[String(state.year)] || authors.default || '';
  }

  function curriculumTopicsHtml(event) {
    if (event.kind !== 'subject' || !data.curriculumTopicsBySubject) return '';
    var topic = data.curriculumTopicsBySubject[event.sourceId];
    if (!topic || !topic.years) return '';
    var list = topic.years[String(state.year)] || [];
    if (!list.length) return '';
    return '<h4>' + (topic.title || 'Inhalte in diesem Schuljahrgang') + '</h4><ul class="topic-list">' + list.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>';
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
    showDialogWithoutScrollJump();
  }

  function restartWritingAnimations() {
    document.querySelectorAll('#materialsTable, #specialDates, .quill-type').forEach(function (node) {
      node.classList.remove('quill-writing');
      void node.offsetWidth;
      node.classList.add('quill-writing');
    });
  }

  async function createPdfBlob() {
    saveFromForm();
    var events = buildEvents();
    var trips = selectedTrips();
    var materials = materialSources();
    var dates = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; });
    var house = data.houses.find(function (item) { return item.id === state.house; }) || data.houses[0];
    await ensurePdfImagesLoaded(house);
    var pages = [drawPdfSchedulePage(events, house), drawPdfInfoPage(trips, dates), drawPdfMaterialsPage(materials)];
    return new Blob([buildImagePdf(pages)], { type: 'application/pdf' });
  }

  async function downloadPdf() {
    var oldText = els.pdfButton.textContent;
    els.pdfButton.disabled = true;
    els.pdfButton.textContent = 'Muggeldatei wird erstellt...';
    try {
      var blob = await createPdfBlob();
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

  async function printGeneratedPdf() {
    var oldText = els.printButton.textContent;
    els.printButton.disabled = true;
    els.printButton.textContent = 'Drucklayout wird erstellt...';
    try {
      var blob = await createPdfBlob();
      var url = URL.createObjectURL(blob);
      var win = window.open(url, '_blank');
      if (!win) {
        URL.revokeObjectURL(url);
        window.alert('Das Druckfenster wurde vom Browser blockiert. Bitte Popups für diese Seite erlauben.');
        els.printButton.disabled = false;
        els.printButton.textContent = oldText;
        return;
      }
      setTimeout(function () {
        try { win.focus(); win.print(); } catch (error) { console.warn('Druckdialog konnte nicht automatisch geöffnet werden:', error); }
      }, 900);
      setTimeout(function () { URL.revokeObjectURL(url); els.printButton.disabled = false; els.printButton.textContent = oldText; }, 30000);
    } catch (error) {
      els.printButton.disabled = false;
      els.printButton.textContent = oldText;
      throw error;
    }
  }

  function canvasBase(width, height) {
    var canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    var ctx = canvas.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#d8d8d8'; ctx.lineWidth = 3; ctx.strokeRect(28, 28, width - 56, height - 56);
    return { canvas: canvas, ctx: ctx };
  }

  function preloadPrintLogo() {
    pdfLogoImage = new Image();
    pdfLogoImage.crossOrigin = 'anonymous';
    pdfLogoImage.src = assetUrl((data.assets.printLogo || data.assets.titleLogo).fallback || 'logo_black.png');
  }

  function preloadHouseCrests() {
    data.houses.forEach(function (house) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = assetUrl(house.fallback || house.crest);
      pdfHouseImages[house.id] = img;
    });
  }

  function waitForImage(img) {
    return new Promise(function (resolve) {
      if (!img) return resolve(false);
      if (img.complete) return resolve(Boolean(img.naturalWidth));
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      setTimeout(function () { resolve(Boolean(img.complete && img.naturalWidth)); }, 2200);
    });
  }

  async function ensurePdfImagesLoaded(house) {
    await Promise.all([waitForImage(pdfLogoImage), waitForImage(house && pdfHouseImages[house.id])]);
  }

  function drawLogo(ctx, x, y, w, h) {
    if (pdfLogoImage && pdfLogoImage.complete && pdfLogoImage.naturalWidth) {
      drawImageContain(ctx, pdfLogoImage, x, y, w, h);
      return;
    }
    ctx.fillStyle = '#111'; ctx.font = 'bold 34px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Hogwarts Curriculum', x + w / 2, y + h / 2);
  }

  function drawHouseCrest(ctx, house, x, y, w, h) {
    var img = house && pdfHouseImages[house.id];
    if (img && img.complete && img.naturalWidth) {
      drawImageContain(ctx, img, x, y, w, h);
      return;
    }
    ctx.fillStyle = (house && house.colors && house.colors[0]) || '#333';
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2 - 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText((house && house.name ? house.name[0] : 'H'), x + w / 2, y + h / 2);
  }

  function isSameOriginAsset(src) {
    try { return new URL(src, window.location.href).origin === window.location.origin; }
    catch (error) { return false; }
  }

  function drawImageContain(ctx, img, x, y, w, h) {
    var ratio = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    var dw = img.naturalWidth * ratio, dh = img.naturalHeight * ratio;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }

  function drawPdfSchedulePage(events, house) {
    var page = canvasBase(1754, 1240), ctx = page.ctx;
    drawLogo(ctx, 58, 38, 270, 96);
    drawHouseCrest(ctx, house, 1580, 34, 112, 112);
    ctx.textAlign = 'center'; ctx.fillStyle = '#111'; ctx.font = 'bold 28px Georgia'; ctx.fillText(state.name || 'Unbenanntes Curriculum', 877, 70);
    ctx.font = '22px Georgia'; ctx.fillText(house.name + ' - ' + state.year + '. Schuljahrgang', 877, 106);
    ctx.font = '18px Georgia'; ctx.fillText('Hogwarts Stundenplan', 877, 136);
    var x0 = 50, y0 = 166, tableW = 1654, tableH = 1010, colW = tableW / 8, rowH = tableH / (data.timeSlots.length + 1);
    function colX(i) { return x0 + colW * i; }
    function colWidth() { return colW; }
    ctx.font = 'bold 22px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f1f1f1'; ctx.fillRect(x0, y0, tableW, rowH); ctx.strokeStyle = '#777'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, tableW, rowH);
    ['Zeit'].concat(data.days.map(function (d) { return d.label; })).forEach(function (label, i) { ctx.fillStyle = '#111'; ctx.fillText(label, colX(i) + colWidth(i) / 2, y0 + rowH / 2); });
    var grouped = groupEvents(events);
    data.timeSlots.forEach(function (slot, r) {
      var y = y0 + rowH * (r + 1); ctx.fillStyle = slot.type === 'meal' ? '#e5f2ee' : '#ffffff'; ctx.fillRect(x0, y, tableW, rowH); ctx.strokeStyle = '#777'; ctx.lineWidth = 1;
      for (var c = 0; c < 8; c++) ctx.strokeRect(colX(c), y, colWidth(c), rowH);
      ctx.fillStyle = '#111'; ctx.font = 'bold 15px Georgia'; ctx.textAlign = 'left'; wrapText(ctx, slot.label, x0 + 8, y + 24, colW - 16, 16, 2); ctx.font = '12px Georgia'; wrapText(ctx, slot.time, x0 + 8, y + 56, colW - 16, 12, 2);
      data.days.forEach(function (day, cidx) { var list = grouped.get(cellKey(day.id, slot.id)) || []; var cx = colX(cidx + 1) + 5, cy = y + 5, cw = colW - 10, ch = Math.max(18, (rowH - 10) / Math.max(1, list.length));
        list.slice(0, 3).forEach(function (event, idx) {
          var cardY = cy + idx * ch, cardH = ch - 3;
          ctx.fillStyle = mixWithWhite(event.color || '#4465A6', .68); ctx.fillRect(cx, cardY, cw, cardH);
          ctx.strokeStyle = event.color || '#4465A6'; ctx.lineWidth = 4; ctx.strokeRect(cx, cardY, cw, cardH);
          ctx.fillStyle = '#111'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
          ctx.font = 'bold 14px Georgia'; wrapText(ctx, event.name, cx + 7, cardY + 16, cw - 14, 14, 2);
          ctx.font = '10px Georgia'; clippedText(ctx, event.room || '', cx + 7, cardY + Math.min(cardH - 6, 47), cw - 14);
        });
      });
    });
    drawPdfCredit(ctx);
    return page.canvas.toDataURL('image/jpeg', .92);
  }

  function drawPdfInfoPage(trips, dates) {
    var page = canvasBase(1754, 1240), ctx = page.ctx; drawLogo(ctx, 58, 38, 270, 96); ctx.fillStyle = '#111'; ctx.font = 'bold 28px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Curriculum Zusatzübersicht', 877, 108);
    var y = 176;
    y = drawSection(ctx, 'Angemeldete Exkursionen und Schüleraustausche', trips.map(function (t) { return t.date + ' - ' + t.name + ' - ' + t.location; }), 80, y, 1594, 18);
    drawSection(ctx, 'Sondertermine', dates.map(function (d) { return d.date + ' - ' + d.name; }), 80, y + 26, 1594, 18);
    drawPdfCredit(ctx); return page.canvas.toDataURL('image/jpeg', .9);
  }

  function drawPdfMaterialsPage(materials) {
    var page = canvasBase(1754, 1240), ctx = page.ctx; drawLogo(ctx, 58, 38, 270, 96); ctx.fillStyle = '#111'; ctx.font = 'bold 28px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Benötigte Unterrichtsmaterialien und Ausrüstung', 877, 108);
    drawMaterialsTable(ctx, materials, 80, 176, 1594, 980);
    drawPdfCredit(ctx); return page.canvas.toDataURL('image/jpeg', .9);
  }

  function drawSection(ctx, title, lines, x, y, w, gapAfterTitle) { ctx.fillStyle = '#f1f1f1'; ctx.fillRect(x, y, w, 40); ctx.strokeStyle = '#999'; ctx.strokeRect(x, y, w, 40); ctx.fillStyle = '#111'; ctx.font = 'bold 24px Georgia'; ctx.textAlign = 'left'; ctx.fillText(title, x + 12, y + 27); y += 50 + (gapAfterTitle || 0); ctx.font = '21px Georgia'; (lines.length ? lines : ['Keine Einträge.']).slice(0, 18).forEach(function (line) { y = wrapText(ctx, '- ' + line, x + 12, y, w - 24, 25, 3) + 8; }); return y; }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) { var words = String(text).split(' '), line = '', lines = 0; for (var n = 0; n < words.length; n++) { var testLine = line + words[n] + ' '; if (ctx.measureText(testLine).width > maxWidth && n > 0) { ctx.fillText(line.trim(), x, y); y += lineHeight; lines++; line = words[n] + ' '; if (maxLines && lines >= maxLines) return y; } else line = testLine; } if (!maxLines || lines < maxLines) ctx.fillText(line.trim(), x, y); return y + lineHeight; }
  function clippedText(ctx, text, x, y, maxWidth) { var value = String(text || ''); while (value && ctx.measureText(value + '...').width > maxWidth) value = value.slice(0, -1); ctx.fillText(value.length < String(text || '').length ? value.trim() + '...' : value, x, y); }
  function drawPdfCredit(ctx) { ctx.fillStyle = '#111'; ctx.font = 'bold 20px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('made by FNK', 877, 1204); }
  function drawMaterialsTable(ctx, materials, x, y, w, maxH) {
    var rows = (materials.length ? materials : [{ name: 'Keine Einträge', materials: ['Keine zusätzlichen Materialien.'] }]).slice(0, 20);
    var leftW = 420, rightW = w - leftW, rowH = Math.max(36, maxH / (rows.length + 1));
    ctx.fillStyle = '#f1f1f1'; ctx.fillRect(x, y, w, rowH); ctx.strokeStyle = '#999'; ctx.strokeRect(x, y, w, rowH); ctx.beginPath(); ctx.moveTo(x + leftW, y); ctx.lineTo(x + leftW, y + rowH); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.font = 'bold 22px Georgia'; ctx.textAlign = 'left'; ctx.fillText('Fach / Modul', x + 12, y + 27); ctx.fillText('Materialien und Literatur', x + leftW + 12, y + 27);
    y += rowH; ctx.font = '17px Georgia';
    rows.forEach(function (item) {
      var materialText = getMaterialList(item).join('; ');
      ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, rowH); ctx.strokeStyle = '#bbb'; ctx.strokeRect(x, y, w, rowH); ctx.beginPath(); ctx.moveTo(x + leftW, y); ctx.lineTo(x + leftW, y + rowH); ctx.stroke();
      ctx.fillStyle = '#111'; ctx.font = 'bold 17px Georgia'; wrapText(ctx, item.name, x + 12, y + 23, leftW - 24, 19, 2);
      ctx.font = '15px Georgia'; wrapText(ctx, materialText, x + leftW + 12, y + 21, rightW - 24, 17, 3);
      y += rowH;
    });
  }
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
      var pageId = i * 4 + 1, imageId = pageId + 1, contentId = pageId + 2, linkId = pageId + 3;
      var raw = atob(url.split(',')[1]), img = new Uint8Array(raw.length);
      for (var b = 0; b < raw.length; b++) img[b] = raw.charCodeAt(b) & 255;
      addObject(pageId, ['<< /Type /Page /Parent 99 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im' + i + ' ' + imageId + ' 0 R >> >> /Contents ' + contentId + ' 0 R /Annots [' + linkId + ' 0 R] >>']);
      addObject(imageId, ['<< /Type /XObject /Subtype /Image /Width 1754 /Height 1240 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + img.length + ' >>\nstream\n', img, '\nendstream']);
      var content = 'q 842 0 0 595 0 0 cm /Im' + i + ' Do Q';
      addObject(contentId, ['<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream']);
      addObject(linkId, ['<< /Type /Annot /Subtype /Link /Rect [376 8 466 26] /Border [0 0 0] /A << /S /URI /URI (https://linktr.ee/fnk_fanfics) >> >>']);
    });
    var kids = dataUrls.map(function (_, i) { return (i * 4 + 1) + ' 0 R'; }).join(' ');
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
  function showDialogWithoutScrollJump() { dialogScrollPosition = { x: window.scrollX, y: window.scrollY }; els.dialog.showModal(); restoreScrollPosition(dialogScrollPosition.x, dialogScrollPosition.y); }
  function closeDialogWithoutScrollJump() { dialogScrollPosition = { x: window.scrollX || dialogScrollPosition.x, y: window.scrollY || dialogScrollPosition.y }; els.dialog.close(); restoreScrollPosition(dialogScrollPosition.x, dialogScrollPosition.y); }
  function restoreScrollPosition(x, y) { window.scrollTo(x, y); requestAnimationFrame(function () { window.scrollTo(x, y); }); }
  function updateScrollTopButton() { els.scrollTopButton.classList.toggle('is-visible', window.scrollY > 320); }
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
  function loadState() { var fallback = { name: '', house: 'gryffindor', year: 1, electives: [], clubs: [], trips: [], muted: false, scheduleFilter: 'all', mobileDay: 'monday' }; try { var loaded = Object.assign(fallback, JSON.parse(localStorage.getItem(storageKey) || '{}')); loaded.mobileDay = 'monday'; return loaded; } catch (error) { return fallback; } }
  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]; }); }
  function escapeSvg(value) { return String(value).replace(/[&<>]/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]; }); }
  function soundSvg() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="M16 8.5c1.2 1.9 1.2 5.1 0 7"></path><path d="M18.5 6c2.2 3.4 2.2 8.6 0 12"></path></svg>'; }
  function mutedSvg() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="m18 9-5 5"></path><path d="m13 9 5 5"></path></svg>'; }
})();
