(function () {
  'use strict';

  var data = window.HOGWARTS_CONTENT;
  var ui = data.ui;
  var storageKey = 'hogwarts-curriculum-state';
  var state = loadState();
  var pdfLogoImage = null;
  var pdfHouseImages = {};
  var dialogScrollPosition = { x: 0, y: 0 };
  var schoolYearWheelFrame = 0;
  var schoolYearWheelLocked = false;
  var els = {
    titleLogo: document.getElementById('titleLogo'), printLogo: document.getElementById('printLogo'), formView: document.getElementById('formView'), scheduleView: document.getElementById('scheduleView'), form: document.getElementById('studentForm'),
    studentName: document.getElementById('studentName'), houseChoices: document.getElementById('houseChoices'), yearLevel: document.getElementById('yearLevel'), electiveChoices: document.getElementById('electiveChoices'), clubChoices: document.getElementById('clubChoices'), tripChoices: document.getElementById('tripChoices'),
    electiveCount: document.getElementById('electiveCount'), requirementCard: document.getElementById('requirementCard'), formNote: document.getElementById('formNote'), scheduleTitle: document.getElementById('scheduleTitle'), scheduleMeta: document.getElementById('scheduleMeta'),
    scheduleGrid: document.getElementById('scheduleGrid'), mobileDaySchedule: document.getElementById('mobileDaySchedule'), scheduleFilterControls: document.getElementById('scheduleFilterControls'), scheduleHouseCrest: document.getElementById('scheduleHouseCrest'), schoolYearTimeline: document.getElementById('schoolYearTimeline'), tripSummary: document.getElementById('tripSummary'), materialsTable: document.getElementById('materialsTable'), specialDates: document.getElementById('specialDates'),
    backButton: document.getElementById('backButton'), printButton: document.getElementById('printButton'), pdfButton: document.getElementById('pdfButton'), disguiseButton: document.getElementById('disguiseButton'), disguisePanel: document.getElementById('disguisePanel'), dialog: document.getElementById('infoDialog'), dialogBody: document.getElementById('dialogBody'), dialogClose: document.getElementById('dialogClose'), scrollTopButton: document.getElementById('scrollTopButton'),
    soundToggle: document.getElementById('soundToggle'), bgAudio: document.getElementById('bgAudio'),
    toggleElectives: document.getElementById('toggleElectives'), toggleClubs: document.getElementById('toggleClubs'), toggleTrips: document.getElementById('toggleTrips')
  };

  init();

  function init() {
    applyStaticText();
    applyImage(els.titleLogo, data.assets.titleLogo, ui.logoAlt);
    applyImage(els.printLogo, data.assets.titleLogo, ui.logoAlt);
    preloadPrintLogo();
    preloadHouseCrests();
    applyStars(); renderYearOptions(); renderHouseChoices(); renderChoices(); renderDisguisePanel(); bindEvents(); syncForm(); updateRequirement(); updateAudioButton(); updateScrollTopButton(); tryPlayAudio();
  }

  function applyStaticText() {
    document.title = ui.documentTitle;
    setText('.title-lockup .lede', ui.intro);
    setText('label[for="studentName"]', ui.form.nameLabel);
    if (els.studentName) els.studentName.placeholder = ui.form.namePlaceholder;
    setText('.field-group legend', ui.form.houseLegend);
    setText('label[for="yearLevel"]', ui.form.yearLabel);
    setText('#toggleElectives', ui.form.allSelect);
    setText('#toggleClubs', ui.form.allSelect);
    setText('#toggleTrips', ui.form.allSelect);
    setText('#studentForm .choice-section:nth-of-type(1) h2', ui.form.electivesTitle);
    setText('#studentForm .choice-section:nth-of-type(2) h2', ui.form.clubsTitle);
    setText('#studentForm .choice-section:nth-of-type(3) h2', ui.form.tripsTitle);
    setText('#studentForm .action-row button', ui.form.submit);
    setText('#backButton', ui.toolbar.back);
    setText('#printButton', ui.toolbar.print);
    setText('#pdfButton', ui.toolbar.pdf);
    setText('#disguiseButton', ui.toolbar.disguise);
    setText('.schedule-header .eyebrow', ui.schedule.personalCurriculum);
    setText('#scheduleTitle', ui.schedule.title);
    setText('#schoolYearTitle', ui.extras.schoolYearTitle);
    setText('#scheduleExtras .print-only-extra:nth-of-type(2) h2', ui.extras.tripsTitle);
    setText('#scheduleExtras .print-only-extra:nth-of-type(3) h2', ui.extras.specialTitle);
    setText('#scheduleExtras .materials-panel h2', ui.extras.materialsTitle);
    setText('.print-credit', ui.pdf.credit);
    var footerBy = document.getElementById('footerBy');
    if (footerBy) footerBy.textContent = ui.footer.by;
    var footer = document.querySelector('.fnk-footer');
    if (!footerBy && footer && footer.firstChild) footer.firstChild.nodeValue = ui.footer.by + ' ';
    var fnk = document.querySelector('.fnk-footer a'); if (fnk) fnk.textContent = ui.footer.linkText;
    if (els.soundToggle) els.soundToggle.setAttribute('aria-label', ui.sound.playing);
    if (els.scheduleFilterControls) els.scheduleFilterControls.setAttribute('aria-label', ui.schedule.filterAria);
    if (els.scheduleGrid) els.scheduleGrid.setAttribute('aria-label', ui.schedule.title);
    if (els.mobileDaySchedule) els.mobileDaySchedule.setAttribute('aria-label', ui.schedule.mobileViewAria);
    if (els.dialogClose) els.dialogClose.setAttribute('aria-label', ui.dialog.closeAria);
    if (els.scrollTopButton) els.scrollTopButton.setAttribute('aria-label', ui.dialog.scrollTopAria);
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function bindEvents() {
    els.form.addEventListener('submit', function (event) { event.preventDefault(); if (!validateMinimum()) return; saveFromForm(); state.mobileDay = 'monday'; state.disguiseOpen = false; persist(); renderSchedule(); showSchedule(); tryPlayAudio(); });
    els.studentName.addEventListener('input', function () { state.name = els.studentName.value.trim(); persist(); });
    els.yearLevel.addEventListener('change', function () { state.year = Number(els.yearLevel.value); pruneUnavailableChoices(); renderChoices(); updateRequirement(); persist(); });
    els.backButton.addEventListener('click', function () { els.scheduleView.hidden = true; els.formView.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); });
    els.printButton.addEventListener('click', function () {
      printGeneratedPdf().catch(function (error) {
        console.error(ui.alerts.printBuildError, error);
        window.alert(ui.alerts.printBuildError);
      });
    });
    if (els.pdfButton) els.pdfButton.addEventListener('click', function () {
      downloadPdf().catch(function (error) {
        console.error(ui.alerts.pdfBuildError, error);
        window.alert(ui.alerts.pdfBuildError);
      });
    });
    if (els.disguiseButton) els.disguiseButton.addEventListener('click', function () { state.disguiseOpen = !state.disguiseOpen; renderDisguisePanel(); persist(); });
    if (els.disguisePanel) {
      els.disguisePanel.addEventListener('click', handleDisguiseClick);
      els.disguisePanel.addEventListener('input', handleDisguiseInput);
      els.disguisePanel.addEventListener('change', handleDisguiseChange);
    }
    els.bgAudio.addEventListener('error', function () { if (!els.bgAudio.dataset.fallbackTried) { els.bgAudio.dataset.fallbackTried = '1'; els.bgAudio.src = assetUrl('bg_loop.mp3'); els.bgAudio.load(); tryPlayAudio(); } });
    window.addEventListener('pointermove', createSpark, { passive: true });
    els.dialogClose.addEventListener('click', closeDialogWithoutScrollJump);
    els.dialogBody.addEventListener('click', handleBookClick);
    els.dialog.addEventListener('click', function (event) { if (event.target === els.dialog) closeDialogWithoutScrollJump(); });
    els.dialog.addEventListener('close', function () { restoreScrollPosition(dialogScrollPosition.x, dialogScrollPosition.y); });
    els.scrollTopButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    els.materialsTable.addEventListener('click', handleBookClick);
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
    var tag = subject.countsForMinimum ? ui.form.electiveTag : ui.form.extraTag; var note = available ? subject.teacher + ' · ' + sessionPreview(subject.sessions) : ui.form.fromSchoolYearPrefix + subject.yearLevels.join(', ');
    return choiceCard(subject.id, 'electives', subject.name, note, subject.color, iconImage(subject), tag, checked, disabled, !available);
  }

  function clubTemplate(club) {
    var available = state.year >= (club.minYear || 1); var checked = state.clubs.indexOf(club.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var leader = club.leader ? club.leader : ui.form.noFixedLeader; var room = club.room ? club.room : ui.form.variableMeetingPlace;
    var note = available ? leader + ' · ' + clubTimePreview(club) : ui.form.fromSchoolYearPrefix + club.minYear;
    return choiceCard(club.id, 'clubs', club.name, note + ' · ' + room, club.color, clubIcon(club), ui.form.fromYearPrefix + (club.minYear || 1), checked, disabled, !available);
  }

  function tripTemplate(trip) {
    var available = state.year >= trip.minYear; var checked = state.trips.indexOf(trip.id) > -1 && available ? 'checked' : ''; var disabled = available ? '' : 'disabled';
    var note = available ? trip.location + ' · ' + trip.date : ui.form.fromSchoolYearPrefix + trip.minYear;
    return choiceCard(trip.id, 'trips', trip.name, note, trip.color, clubIcon(trip), ui.form.fromYearPrefix + trip.minYear, checked, disabled, !available);
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
    els.electiveCount.textContent = selectedCount + '/' + rule.minimum + ' ' + ui.form.electiveCountSuffix;
    els.requirementCard.innerHTML = '<strong>' + (missing === 0 ? ui.form.requirementReady : missing + ' ' + ui.form.requirementMissingSuffix) + '</strong><span>' + rule.text + '</span>';
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
    button.textContent = ids.length && ids.every(function (id) { return current.has(id); }) ? ui.form.allDeselect : ui.form.allSelect;
  }

  function validateMinimum() {
    var rule = data.electiveRules[state.year]; var missing = Math.max(rule.minimum - countMinimumElectives(), 0); if (missing === 0) return true;
    els.requirementCard.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 220 }); els.requirementCard.focus(); return false;
  }

  function countMinimumElectives() { return state.electives.filter(function (id) { var subject = findSubject(id); return subject && subject.countsForMinimum && isYearAllowed(subject, state.year); }).length; }

  function renderSchedule() {
    var house = data.houses.find(function (item) { return item.id === state.house; }) || data.houses[0]; var events = buildEvents(); var visibleEvents = filterEvents(events); var grouped = groupEvents(visibleEvents);
    els.scheduleTitle.textContent = (state.name || ui.schedule.unnamedCurriculum) + ' · ' + house.name;
    els.scheduleMeta.textContent = state.muggleMode ? ui.schedule.disguisedPlan + ' · ' + customEvents().length + ' ' + ui.schedule.ownAppointments + (state.aliasMode ? ' · ' + ui.schedule.aliasActive : '') : state.year + '. ' + ui.schedule.schoolYearSuffix + ' · ' + ui.schedule.houseTeacher + ': ' + house.head + ' · ' + ui.schedule.electiveMinimumShort + ': ' + countMinimumElectives() + '/' + data.electiveRules[state.year].minimum;
    els.scheduleHouseCrest.src = house.crest; els.scheduleHouseCrest.dataset.fallback = assetUrl(house.fallback); els.scheduleHouseCrest.alt = house.name; els.scheduleHouseCrest.title = house.name + ' ' + ui.form.houseFieldAltSuffix; els.scheduleHouseCrest.tabIndex = 0; els.scheduleHouseCrest.style.setProperty('--img-scale', house.imageScale); els.scheduleHouseCrest.onclick = function () { openHouseInfo(house.id); }; els.scheduleHouseCrest.onkeydown = function (event) { if (event.key === 'Enter' || event.key === ' ') openHouseInfo(house.id); }; addImageFallbacks(document);
    renderScheduleFilters(events);
    var cells = ['<div class="grid-cell grid-head time-head" role="columnheader">' + ui.schedule.timeColumn + '</div>'];
    data.days.forEach(function (day) { cells.push('<div class="grid-cell grid-head ' + (day.id === 'saturday' ? 'weekend-start' : '') + '" role="columnheader">' + day.label + '</div>'); });
    data.timeSlots.forEach(function (slot) { cells.push('<div class="grid-cell time-cell ' + (slot.type === 'meal' && !state.muggleMode ? 'meal-time' : '') + '" role="rowheader"><strong>' + slotDisplayLabel(slot) + '</strong><span>' + slotDisplayTime(slot) + '</span></div>'); data.days.forEach(function (day) { cells.push(renderScheduleCell(day, slot, grouped.get(cellKey(day.id, slot.id)) || [])); }); });
    els.scheduleGrid.innerHTML = cells.join('');
    addImageFallbacks(els.scheduleGrid);
    els.scheduleGrid.querySelectorAll('[data-event-id]').forEach(function (button) { button.addEventListener('click', function () { openInfo(button.dataset.eventId); }); });
    renderMobileDaySchedule(visibleEvents);
    renderSchoolYearTimeline(); renderTrips(); renderMaterials(); renderSpecialDates(); renderDisguisePanel(); restartWritingAnimations();
  }

  function renderScheduleFilters(events) {
    if (state.muggleMode) { els.scheduleFilterControls.innerHTML = ''; return; }
    var current = state.scheduleFilter || 'all';
    var filters = [
      { id: 'all', label: ui.schedule.filters.all, count: events.length },
      { id: 'subject', label: ui.schedule.filters.subject, count: events.filter(function (event) { return event.kind === 'subject'; }).length },
      { id: 'club', label: ui.schedule.filters.club, count: events.filter(function (event) { return event.kind === 'club'; }).length }
    ];
    if (!filters.some(function (filter) { return filter.id === current; })) current = 'all';
    els.scheduleFilterControls.innerHTML = filters.map(function (filter) {
      return '<button class="filter-pill ' + (filter.id === current ? 'is-active' : '') + '" type="button" data-schedule-filter="' + filter.id + '" aria-pressed="' + (filter.id === current ? 'true' : 'false') + '">' + filter.label + '<span>' + filter.count + '</span></button>';
    }).join('');
  }

  function renderDisguisePanel() {
    if (!els.disguisePanel) return;
    els.disguisePanel.hidden = !state.disguiseOpen;
    if (els.disguiseButton) els.disguiseButton.classList.toggle('is-active', Boolean(state.disguiseOpen));
    if (!state.disguiseOpen) return;
    var modules = state.customModules || [];
    els.disguisePanel.innerHTML = '<div class="muggle-head"><div><p class="eyebrow">' + ui.muggle.eyebrow + '</p><h2>' + ui.muggle.title + '</h2></div><div class="muggle-toggle-row"><button class="toggle-button ' + (state.muggleMode ? 'is-active' : '') + '" type="button" data-muggle-toggle>' + (state.muggleMode ? ui.muggle.disable : ui.muggle.enable) + '</button><button class="toggle-button ' + (state.aliasMode ? 'is-active' : '') + '" type="button" data-alias-toggle>' + ui.muggle.alias + '</button></div></div><p class="form-note">' + ui.muggle.note + '</p>' + renderMuggleTimes() + renderMuggleCreator() + renderMuggleModules(modules);
    if (els.disguiseButton) els.disguiseButton.classList.add('is-active');
  }

  function renderMuggleTimes() {
    var open = Boolean(state.timeEditorOpen);
    return '<section class="muggle-editor-block muggle-time-editor"><div class="muggle-section-title"><h3>' + ui.muggle.timeTitle + '</h3><button class="toggle-button ' + (open ? 'is-active' : '') + '" type="button" data-time-editor-toggle>' + (open ? ui.muggle.timeClose : ui.muggle.timeOpen) + '</button></div>' + (open ? '<div class="muggle-time-grid">' + data.timeSlots.map(function (slot) {
      return '<label><span>' + escapeHtml(slot.label) + '</span><input data-custom-label="' + slot.id + '" value="' + escapeHtml((state.customLabels && state.customLabels[slot.id]) || '') + '" placeholder="' + escapeHtml(slot.label) + '"><input data-custom-time="' + slot.id + '" value="' + escapeHtml((state.customTimes && state.customTimes[slot.id]) || '') + '" placeholder="' + escapeHtml(slot.time) + '"></label>';
    }).join('') + '</div>' : '') + '</section>';
  }

  function renderMuggleCreator() {
    return '<section class="muggle-editor-block"><h3>' + ui.muggle.newModuleTitle + '</h3><div class="muggle-form-grid"><input data-new-field="name" placeholder="' + ui.muggle.defaults.name + '"><input data-new-field="teacher" placeholder="' + ui.muggle.defaults.teacher + '"><input data-new-field="room" placeholder="' + ui.muggle.defaults.room + '"><input data-new-field="nameAlias" placeholder="' + ui.muggle.defaults.nameAlias + '"><input data-new-field="teacherAlias" placeholder="' + ui.muggle.defaults.teacherAlias + '"><input data-new-field="roomAlias" placeholder="' + ui.muggle.defaults.roomAlias + '"><label class="color-field"><span>' + ui.muggle.moduleColor + '</span><input data-new-field="color" type="color" value="#4465A6"></label><div class="session-field"><span>' + ui.muggle.timeDayBlocks + '</span><div class="session-check-grid" data-new-sessions>' + sessionOptions([]) + '</div></div><button class="primary-button compact" type="button" data-add-module>' + ui.muggle.addModule + '</button></div></section>';
  }

  function renderMuggleModules(modules) {
    if (!modules.length) return '<section class="muggle-editor-block"><h3>' + ui.muggle.modulesTitle + '</h3><p class="empty-note">' + ui.muggle.noModules + '</p></section>';
    return '<section class="muggle-editor-block"><h3>' + ui.muggle.modulesTitle + '</h3><div class="muggle-module-list">' + modules.map(function (module) {
      var sessionCount = (module.sessions || []).length;
      return '<details class="muggle-module-card" data-module-id="' + module.id + '" style="--accent:' + escapeHtml(module.color || '#4465A6') + '"><summary class="muggle-module-title"><span class="muggle-module-summary"><strong>' + escapeHtml(module.name || ui.muggle.unnamedModule) + '</strong><small>' + escapeHtml((module.teacher || ui.muggle.teacherOpen) + ' · ' + (module.room || ui.muggle.roomOpen) + ' · ' + sessionCount + ' ' + (sessionCount === 1 ? ui.muggle.appointmentSingular : ui.muggle.appointmentPlural)) + '</small></span><span class="muggle-module-actions"><span class="muggle-chevron">' + ui.muggle.edit + '</span><button class="ghost-button compact" type="button" data-remove-module="' + module.id + '">' + ui.muggle.remove + '</button></span></summary><div class="muggle-module-fields"><div class="muggle-form-grid"><input data-module-field="name" value="' + escapeHtml(module.name || '') + '" placeholder="' + ui.muggle.placeholders.name + '"><input data-module-field="teacher" value="' + escapeHtml(module.teacher || '') + '" placeholder="' + ui.muggle.placeholders.teacher + '"><input data-module-field="room" value="' + escapeHtml(module.room || '') + '" placeholder="' + ui.muggle.placeholders.room + '"><input data-module-field="nameAlias" value="' + escapeHtml(module.nameAlias || '') + '" placeholder="' + ui.muggle.placeholders.nameAlias + '"><input data-module-field="teacherAlias" value="' + escapeHtml(module.teacherAlias || '') + '" placeholder="' + ui.muggle.placeholders.teacherAlias + '"><input data-module-field="roomAlias" value="' + escapeHtml(module.roomAlias || '') + '" placeholder="' + ui.muggle.placeholders.roomAlias + '"><label class="color-field"><span>' + ui.muggle.moduleColor + '</span><input data-module-field="color" type="color" value="' + escapeHtml(module.color || '#4465A6') + '"></label><div class="session-field"><span>' + ui.muggle.timeDayBlocks + '</span><div class="session-check-grid" data-module-sessions>' + sessionOptions(module.sessions || []) + '</div></div></div></div></details>';
    }).join('') + '</div></section>';
  }

  function sessionOptions(selectedSessions) {
    var selected = new Set((selectedSessions || []).map(function (session) { return session.day + '|' + session.slot; }));
    return data.days.flatMap(function (day) {
      return data.timeSlots.map(function (slot) {
        var value = day.id + '|' + slot.id;
        return '<label class="session-check"><input type="checkbox" value="' + value + '" ' + (selected.has(value) ? 'checked' : '') + '><span>' + escapeHtml(day.label + ' · ' + slotDisplayLabel(slot) + ' (' + slotDisplayTime(slot) + ')') + '</span></label>';
      });
    }).join('');
  }

  function handleDisguiseClick(event) {
    var toggle = event.target.closest('[data-muggle-toggle]');
    if (toggle) { state.muggleMode = !state.muggleMode; state.scheduleFilter = 'all'; persist(); renderSchedule(); return; }
    var alias = event.target.closest('[data-alias-toggle]');
    if (alias) { state.aliasMode = !state.aliasMode; persist(); renderSchedule(); return; }
    var timeToggle = event.target.closest('[data-time-editor-toggle]');
    if (timeToggle) { state.timeEditorOpen = !state.timeEditorOpen; persist(); renderDisguisePanel(); return; }
    var add = event.target.closest('[data-add-module]');
    if (add) { addCustomModule(); return; }
    var remove = event.target.closest('[data-remove-module]');
    if (remove) { event.preventDefault(); event.stopPropagation(); removeCustomModule(remove.dataset.removeModule); return; }
  }

  function handleDisguiseInput(event) {
    var timeInput = event.target.closest('[data-custom-time]');
    if (timeInput) {
      state.customTimes[timeInput.dataset.customTime] = timeInput.value.trim();
      persist(); return;
    }
    var labelInput = event.target.closest('[data-custom-label]');
    if (labelInput) {
      state.customLabels[labelInput.dataset.customLabel] = labelInput.value.trim();
      persist(); return;
    }
    var field = event.target.closest('[data-module-field]');
    if (field) {
      var card = field.closest('[data-module-id]');
      var module = card && findCustomModule(card.dataset.moduleId);
      if (!module) return;
      module[field.dataset.moduleField] = field.value;
      persist();
    }
  }

  function handleDisguiseChange(event) {
    var timeInput = event.target.closest('[data-custom-time]');
    if (timeInput) {
      state.customTimes[timeInput.dataset.customTime] = timeInput.value.trim();
      persist(); renderSchedule(); return;
    }
    var labelInput = event.target.closest('[data-custom-label]');
    if (labelInput) {
      state.customLabels[labelInput.dataset.customLabel] = labelInput.value.trim();
      persist(); renderSchedule(); return;
    }
    var field = event.target.closest('[data-module-field]');
    if (field) {
      var card = field.closest('[data-module-id]');
      var module = card && findCustomModule(card.dataset.moduleId);
      if (!module) return;
      module[field.dataset.moduleField] = field.value;
      persist(); renderSchedule(); return;
    }
    var sessions = event.target.closest('[data-module-sessions]');
    if (sessions) {
      var card = sessions.closest('[data-module-id]');
      var module = card && findCustomModule(card.dataset.moduleId);
      if (!module) return;
      module.sessions = selectedSessionsFromPicker(sessions);
      persist(); renderSchedule();
    }
  }

  function addCustomModule() {
    var root = els.disguisePanel;
    var field = function (name) { var input = root.querySelector('[data-new-field="' + name + '"]'); return input ? input.value.trim() : ''; };
    var picker = root.querySelector('[data-new-sessions]');
    var module = { id: 'custom-' + Date.now().toString(36), name: field('name') || ui.muggle.defaults.name, teacher: field('teacher') || ui.muggle.defaults.teacher, room: field('room') || ui.muggle.defaults.room, nameAlias: field('nameAlias') || ui.muggle.defaults.nameAlias, teacherAlias: field('teacherAlias') || ui.muggle.defaults.teacherAlias, roomAlias: field('roomAlias') || ui.muggle.defaults.roomAlias, color: field('color') || '#4465A6', sessions: selectedSessionsFromPicker(picker) };
    if (!module.sessions.length) module.sessions = [{ day: 'monday', slot: 'period1' }];
    state.customModules.push(module);
    persist(); renderSchedule();
  }

  function removeCustomModule(id) {
    state.customModules = state.customModules.filter(function (module) { return module.id !== id; });
    persist(); renderSchedule();
  }

  function selectedSessionsFromPicker(picker) {
    if (!picker) return [];
    return Array.from(picker.querySelectorAll('input[type="checkbox"]:checked')).map(function (input) {
      var parts = input.value.split('|');
      return { day: parts[0], slot: parts[1] };
    }).filter(function (session) { return session.day && session.slot; });
  }

  function customEvents() {
    return (state.customModules || []).flatMap(function (module, moduleIndex) {
      return (module.sessions || []).map(function (session, sessionIndex) {
        var useAlias = state.aliasMode;
        var name = useAlias && module.nameAlias ? module.nameAlias : module.name;
        var teacher = useAlias && module.teacherAlias ? module.teacherAlias : module.teacher;
        var room = useAlias && module.roomAlias ? module.roomAlias : module.room;
        return eventFromItem({ id: module.id, name: name, color: module.color || '#4465A6', info: ui.muggle.customInfo, materials: [] }, 'custom:' + module.id + ':' + moduleIndex + ':' + sessionIndex, 'custom', session.day, session.slot, name, teacher, room);
      });
    });
  }

  function findCustomModule(id) { return (state.customModules || []).find(function (module) { return module.id === id; }); }

  function filterEvents(events) {
    if (state.muggleMode) return events;
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
      var eventHtml = list.length ? list.map(function (event) { return mobileEventButton(event); }).join('') : '<span class="mobile-empty">' + ui.schedule.free + '</span>';
      return '<div class="mobile-day-row ' + (slot.type === 'meal' && !state.muggleMode ? 'mobile-meal-row' : '') + '"><div class="mobile-time"><strong>' + slotDisplayLabel(slot) + '</strong><span>' + slotDisplayTime(slot) + '</span></div><div class="mobile-events">' + eventHtml + '</div></div>';
    }).join('');
    els.mobileDaySchedule.innerHTML = '<section class="mobile-day-card"><div class="mobile-day-nav"><button class="mobile-day-arrow" type="button" data-day-step="-1" aria-label="' + ui.schedule.mobilePreviousDay + '">‹</button><h3>' + day.label + '</h3><button class="mobile-day-arrow" type="button" data-day-step="1" aria-label="' + ui.schedule.mobileNextDay + '">›</button></div>' + rows + '</section>';
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
    if (state.muggleMode) return customEvents();
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

  function eventFromItem(item, id, kind, day, slot, name, teacher, room) { return { id: id, sourceId: item.id || id, kind: kind, name: name || item.name, teacher: kind === 'meal' ? '' : (teacher || ui.form.noFixedLeader), room: room || ui.form.variableMeetingPlace, color: item.color || '#80BFAD', icon: kind === 'subject' ? iconImage(item) : clubIcon(item), info: item.info, examForm: item.examForm, professorComment: kind === 'subject' ? professorComment(item) : moduleProfessorComment(item), materials: item.materials || [], literatureByYear: item.literatureByYear, materialGroups: item.materialGroups, day: day, slot: slot }; }

  function renderScheduleCell(day, slot, events) {
    var eventButtons = events.map(function (event) { var details = [event.teacher, event.room].filter(Boolean).join('<br>'); return '<button class="lesson-card revelio-card ' + (event.kind === 'meal' ? 'meal-card' : '') + '" type="button" data-event-id="' + event.id + '" style="--accent:' + event.color + ';--reveal-delay:' + revealDelay(day, slot) + 's"><span class="mini-icon">' + event.icon + '</span><span><strong>' + event.name + '</strong><small>' + details + '</small></span></button>'; }).join('');
    var turner = events.length > 1 ? '<img class="time-turner" src="' + data.assets.timeTurner.src + '" data-fallback="' + assetUrl(data.assets.timeTurner.fallback) + '" alt="' + ui.schedule.timeTurnerAlt + '" style="--img-scale:' + data.assets.timeTurner.scale + '">' : '';
    var empty = events.length === 0 ? '<span class="empty-slot">' + ui.schedule.free + '</span>' : '';
    return '<div class="grid-cell schedule-cell ' + (slot.type === 'meal' && !state.muggleMode ? 'meal-slot' : '') + ' ' + (day.id === 'saturday' ? 'weekend-start' : '') + (events.length > 1 ? ' has-conflict' : '') + '" role="cell" aria-label="' + day.label + ', ' + slotDisplayTime(slot) + '">' + turner + empty + eventButtons + '</div>';
  }

  function openInfo(eventId) {
    var event = buildEvents().find(function (item) { return item.id === eventId; }); if (!event) return;
    var exam = event.examForm ? '<div><dt>' + ui.dialog.labels.exam + '</dt><dd>' + event.examForm + '</dd></div>' : '';
    var leader = event.teacher ? '<div><dt>' + ui.dialog.labels.leader + '</dt><dd>' + event.teacher + '</dd></div>' : '';
    var professor = event.professorComment ? '<h4>' + ui.dialog.labels.professorComment + '</h4><p>' + event.professorComment + '</p>' : '';
    var curriculumTopics = curriculumTopicsHtml(event);
    var materials = materialGroupsHasEntries(getMaterialGroups(event)) ? '<h4>' + ui.dialog.labels.materials + '</h4>' + materialGroupsHtml(getMaterialGroups(event)) : '';
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:' + event.color + '"><span class="dialog-icon">' + event.icon + '</span><div><p class="eyebrow">' + labelForKind(event.kind) + '</p><h3>' + event.name + '</h3></div></div><dl class="detail-list">' + leader + '<div><dt>' + ui.dialog.labels.room + '</dt><dd>' + event.room + '</dd></div><div><dt>' + ui.dialog.labels.appointment + '</dt><dd>' + dayLabel(event.day) + ', ' + slotTime(event.slot) + '</dd></div>' + exam + '</dl><p>' + event.info + '</p>' + professor + curriculumTopics + materials;
    showDialogWithoutScrollJump();
  }

  function renderTrips() {
    if (state.muggleMode) { els.tripSummary.innerHTML = '<p class="empty-note">' + ui.extras.hiddenInMuggleMode + '</p>'; return; }
    var trips = selectedTrips();
    els.tripSummary.innerHTML = trips.length ? trips.map(function (trip) { return '<button class="summary-item clickable-summary" type="button" data-trip-id="' + trip.id + '"><strong>' + trip.name + '</strong><span>' + trip.date + ' · ' + trip.location + '</span><p>' + trip.info + '</p></button>'; }).join('') : '<p class="empty-note">' + ui.extras.tripsEmpty + '</p>';
    els.tripSummary.querySelectorAll('[data-trip-id]').forEach(function (button) { button.addEventListener('click', function () { openTripInfo(button.dataset.tripId); }); });
  }

  function renderSchoolYearTimeline() {
    if (!els.schoolYearTimeline) return;
    if (state.muggleMode) { els.schoolYearTimeline.innerHTML = '<p class="empty-note">' + ui.extras.hiddenInMuggleMode + '</p>'; return; }
    var dates = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; });
    var items = selectedTrips().map(function (trip) {
      return { type: 'trip', id: trip.id, date: trip.date, title: trip.name, meta: trip.location, color: trip.color || '#80BFAD', text: trip.info };
    }).concat(dates.map(function (item, index) {
      return { type: 'special', index: index, date: item.date, title: item.name, meta: specialPlace(item), color: '#F2C580', text: specialInfo(item) };
    })).sort(function (a, b) {
      return dateSortValue(a.date) - dateSortValue(b.date) || a.title.localeCompare(b.title, 'de');
    });
    if (!items.length) { els.schoolYearTimeline.innerHTML = '<p class="empty-note">' + ui.extras.noEntries + '</p>'; return; }
    els.schoolYearTimeline.innerHTML = items.map(function (item) {
      var attrs = item.type === 'trip' ? 'data-timeline-trip="' + item.id + '"' : 'data-timeline-special="' + item.index + '"';
      var kind = item.type === 'trip' ? ui.dialog.labels.tripKind : ui.dialog.labels.specialKind;
      return '<button class="timeline-item timeline-' + item.type + ' clickable-summary" type="button" ' + attrs + ' style="--accent:' + item.color + '"><span class="timeline-date">' + item.date + '</span><span class="timeline-dot"></span><span class="timeline-content"><span class="timeline-kind">' + kind + '</span><strong>' + item.title + '</strong><span>' + item.meta + '</span></span></button>';
    }).join('');
    els.schoolYearTimeline.querySelectorAll('[data-timeline-trip]').forEach(function (button) {
      button.addEventListener('click', function () { openTripInfo(button.dataset.timelineTrip); });
    });
    els.schoolYearTimeline.querySelectorAll('[data-timeline-special]').forEach(function (button) {
      button.addEventListener('click', function () { openSpecialInfo(Number(button.dataset.timelineSpecial)); });
    });
    setupSchoolYearWheel();
  }

  function setupSchoolYearWheel() {
    var timeline = els.schoolYearTimeline;
    if (!timeline || !timeline.querySelector('.timeline-item')) return;
    function requestWheelUpdate() {
      if (schoolYearWheelFrame) return;
      schoolYearWheelFrame = requestAnimationFrame(function () {
        schoolYearWheelFrame = 0;
        updateSchoolYearWheel();
      });
    }
    if (!timeline.dataset.wheelBound) {
      timeline.dataset.wheelBound = 'true';
      timeline.addEventListener('scroll', requestWheelUpdate, { passive: true });
      timeline.addEventListener('wheel', handleSchoolYearWheel, { passive: false });
      window.addEventListener('resize', requestWheelUpdate);
    }
    syncSchoolYearWheelPadding();
    requestWheelUpdate();
  }

  function handleSchoolYearWheel(event) {
    var timeline = els.schoolYearTimeline;
    var items = timeline ? Array.from(timeline.querySelectorAll('.timeline-item')) : [];
    if (!timeline || !items.length) return;
    event.preventDefault();
    if (schoolYearWheelLocked || Math.abs(event.deltaY) < 2) return;
    var direction = event.deltaY > 0 ? 1 : -1;
    var current = centeredSchoolYearIndex(items, timeline);
    var targetIndex = Math.max(0, Math.min(items.length - 1, current + direction));
    schoolYearWheelLocked = true;
    scrollSchoolYearItemToCenter(timeline, items[targetIndex]);
    window.setTimeout(function () {
      schoolYearWheelLocked = false;
      updateSchoolYearWheel();
    }, 240);
  }

  function centeredSchoolYearIndex(items, timeline) {
    var bounds = timeline.getBoundingClientRect();
    var center = bounds.top + bounds.height / 2;
    var bestIndex = 0;
    var bestDistance = Infinity;
    items.forEach(function (item, index) {
      var itemBounds = item.getBoundingClientRect();
      var itemCenter = itemBounds.top + itemBounds.height / 2;
      var distance = Math.abs(itemCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function scrollSchoolYearItemToCenter(timeline, item) {
    if (!timeline || !item) return;
    var top = item.offsetTop - (timeline.clientHeight - item.offsetHeight) / 2;
    timeline.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function syncSchoolYearWheelPadding() {
    var timeline = els.schoolYearTimeline;
    if (!timeline) return;
    var first = timeline.querySelector('.timeline-item');
    if (!first) return;
    var pad = Math.max(24, (timeline.clientHeight - first.offsetHeight) / 2);
    timeline.style.setProperty('--wheel-pad', pad.toFixed(0) + 'px');
  }

  function updateSchoolYearWheel() {
    var timeline = els.schoolYearTimeline;
    if (!timeline) return;
    syncSchoolYearWheelPadding();
    var bounds = timeline.getBoundingClientRect();
    var center = bounds.top + bounds.height / 2;
    var range = Math.max(1, bounds.height / 2);
    timeline.querySelectorAll('.timeline-item').forEach(function (item) {
      var itemBounds = item.getBoundingClientRect();
      var itemCenter = itemBounds.top + itemBounds.height / 2;
      var distance = Math.max(-1, Math.min(1, (itemCenter - center) / range));
      var strength = Math.abs(distance);
      var rotate = distance * -12;
      var lift = strength * -4;
      var scale = 1 - Math.min(.04, strength * .03);
      var opacity = 1 - Math.min(.18, strength * .1);
      var blur = Math.min(1.7, Math.max(0, strength - .18) * 2.1);
      item.style.transform = 'perspective(900px) rotateX(' + rotate.toFixed(2) + 'deg) translateY(' + lift.toFixed(2) + 'px) scale(' + scale.toFixed(3) + ')';
      item.style.opacity = opacity.toFixed(3);
      item.style.filter = 'blur(' + blur.toFixed(2) + 'px)';
    });
  }

  function renderMaterials() {
    if (state.muggleMode) { els.materialsTable.innerHTML = '<p class="empty-note">' + ui.extras.materialsHiddenInMuggleMode + '</p>'; return; }
    var rows = materialSources().map(function (item) { return '<tr><th>' + item.name + '</th><td>' + materialGroupsHtml(getMaterialGroups(item)) + '</td></tr>'; }).join('');
    els.materialsTable.innerHTML = '<table class="materials"><tbody>' + rows + '</tbody></table>';
  }

  function renderSpecialDates() {
    if (state.muggleMode) { els.specialDates.innerHTML = '<p class="empty-note">' + ui.extras.hiddenInMuggleMode + '</p>'; return; }
    els.specialDates.innerHTML = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; }).map(function (item, index) { return '<button class="date-item clickable-summary" type="button" data-date-index="' + index + '"><strong>' + item.date + '</strong><span>' + item.name + '</span></button>'; }).join('');
    els.specialDates.querySelectorAll('[data-date-index]').forEach(function (button) { button.addEventListener('click', function () { openSpecialInfo(Number(button.dataset.dateIndex)); }); });
  }

  function openTripInfo(tripId) {
    var trip = findTrip(tripId); if (!trip) return;
    var leader = trip.leader || tripLeader(trip);
    var cost = trip.cost || tripCost(trip);
    var details = tripDetails(trip);
    var bring = getMaterialGroups(trip)[ui.materials.bring] || [];
    var professor = moduleProfessorComment(trip) ? '<h4>' + ui.dialog.labels.professorComment + '</h4><p>' + moduleProfessorComment(trip) + '</p>' : '';
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:' + trip.color + '"><span class="dialog-icon">' + clubIcon(trip) + '</span><div><p class="eyebrow">' + ui.dialog.labels.tripKind + '</p><h3>' + trip.name + '</h3></div></div><dl class="detail-list"><div><dt>' + ui.dialog.labels.leader + '</dt><dd>' + leader + '</dd></div><div><dt>' + ui.dialog.labels.dateRange + '</dt><dd>' + trip.date + '</dd></div><div><dt>' + ui.dialog.labels.place + '</dt><dd>' + trip.location + '</dd></div><div><dt>' + ui.dialog.labels.cost + '</dt><dd>' + cost + ' ' + ui.dialog.labels.galleons + '</dd></div></dl><h4>' + ui.dialog.labels.description + '</h4><p>' + details.description + '</p><h4>' + ui.dialog.labels.activities + '</h4><p>' + details.activities + '</p><h4>' + ui.dialog.labels.bring + '</h4><p>' + (bring.length ? bring.join(', ') : details.bring) + '</p>' + professor + '<p>' + tripFlavor(trip) + '</p>';
    showDialogWithoutScrollJump();
  }

  function openSpecialInfo(index) {
    var dates = data.specialDates.filter(function (item) { return item.years.indexOf(state.year) > -1; });
    var item = dates[index]; if (!item) return;
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:#F2C580"><span class="dialog-icon">' + clubIcon({ name: item.name, color: '#F2C580' }) + '</span><div><p class="eyebrow">' + ui.dialog.labels.specialKind + '</p><h3>' + item.name + '</h3></div></div><dl class="detail-list"><div><dt>' + ui.dialog.labels.dateRange + '</dt><dd>' + item.date + '</dd></div><div><dt>' + ui.dialog.labels.leader + '</dt><dd>' + specialLeader(item) + '</dd></div><div><dt>' + ui.dialog.labels.place + '</dt><dd>' + specialPlace(item) + '</dd></div></dl><p>' + specialInfo(item) + '</p>';
    showDialogWithoutScrollJump();
  }

  function tripLeader(trip) {
    return (data.tripLeaders && data.tripLeaders[trip.id]) || ui.trip.defaultLeader;
  }

  function tripCost(trip) {
    return (data.tripCosts && data.tripCosts[trip.id]) || 3;
  }

  function tripFlavor(trip) {
    return ui.trip.flavor;
  }

  function tripDetails(trip) {
    var entry = (ui.trip.details && ui.trip.details[trip.id]) || ui.trip.defaultDetails;
    return { description: entry[0], activities: entry[1], bring: entry[2] };
  }

  function moduleProfessorComment(item) {
    var base = (data.moduleProfessorComments && data.moduleProfessorComments[item.id]) || '';
    var addition = (data.moduleProfessorCommentAdditions && data.moduleProfessorCommentAdditions[item.id]) || '';
    return [base, addition].filter(Boolean).join(' ');
  }

  function specialLeader(item) {
    return ((data.specialDetails && data.specialDetails[item.name]) || data.specialDetails.default).leader;
  }

  function specialPlace(item) {
    return ((data.specialDetails && data.specialDetails[item.name]) || data.specialDetails.default).place;
  }

  function specialInfo(item) {
    return ((data.specialDetails && data.specialDetails[item.name]) || data.specialDetails.default).info;
  }

  function professorComment(item) {
    var year = state.year || 1;
    var focus = subjectFocus(item, year);
    var key = professorCommentKey(item);
    var template = data.professorComments[key] || data.professorComments.default;
    var addition = (data.professorCommentAdditions && data.professorCommentAdditions[key]) || '';
    return [formatText(template, { year: year, focus: focus }), formatText(addition, { year: year, focus: focus })].filter(Boolean).join(' ');
  }

  function subjectFocus(item, year) {
    var name = item.name || ui.dialog.defaultSubjectName;
    var focus = data.subjectFocusTexts[professorCommentKey(item)] || data.subjectFocusTexts.default;
    if (Array.isArray(focus)) return focus[year <= 2 ? 0 : year <= 4 ? 1 : 2];
    return formatText(focus, { name: name });
  }

  function professorCommentKey(item) {
    var lower = (item.id || '').toLowerCase();
    if (lower.indexOf('animagus') > -1) return 'animagus-study';
    if (lower.indexOf('astronomy') > -1) return 'astronomy';
    if (lower.indexOf('charms') > -1 || item.name === 'Zauberkunst') return 'charms';
    if (lower.indexOf('defence') > -1) return 'defence';
    if (lower.indexOf('herbology') > -1) return 'herbology';
    if (lower.indexOf('history') > -1) return 'history';
    if (lower.indexOf('potions') > -1 || item.name === 'Zaubertränke') return 'potions';
    if (lower.indexOf('transfiguration') > -1 || item.name === 'Verwandlung') return 'transfiguration';
    if (lower.indexOf('flying') > -1 || lower.indexOf('quidditch') > -1) return 'flying';
    if (lower.indexOf('runes') > -1) return 'runes';
    if (lower.indexOf('arithmancy') > -1) return 'arithmancy';
    if (lower.indexOf('dragonology') > -1) return 'dragonology';
    if (lower.indexOf('care') > -1 || lower.indexOf('creatures') > -1 || lower.indexOf('dragonology') > -1) return 'creatures';
    if (lower.indexOf('divination') > -1) return 'divination';
    if (lower.indexOf('muggle') > -1) return 'muggle-studies';
    if (lower.indexOf('apparition') > -1) return 'apparition';
    if (lower.indexOf('alchemy') > -1) return 'alchemy';
    if (lower.indexOf('wandlore') > -1 || lower.indexOf('wandmaking') > -1) return 'wandmaking';
    return item.id || 'default';
  }

  function materialSources() {
    var baseSupplies = { name: ui.materials.baseSupplies + ' (' + state.year + '. ' + ui.schedule.schoolYearSuffix + ')', materialGroups: (data.studentSupplyGroupsByYear && data.studentSupplyGroupsByYear[String(state.year)]) || legacySupplyGroups((data.studentSuppliesByYear && data.studentSuppliesByYear[String(state.year)]) || []) };
    var selectedSubjectIds = new Set(data.subjects.filter(function (s) { return s.required && isYearAllowed(s, state.year); }).map(function (s) { return s.id; }).concat(state.electives));
    var subjects = data.subjects.filter(function (s) { return selectedSubjectIds.has(s.id) && isYearAllowed(s, state.year); });
    var clubs = data.clubs.filter(function (c) { return state.clubs.indexOf(c.id) > -1 && state.year >= (c.minYear || 1); });
    return [baseSupplies].concat(subjects, clubs, selectedTrips()).filter(function (item) { return materialGroupsHasEntries(getMaterialGroups(item)); });
  }


  function getMaterialList(item) {
    return flattenMaterialGroups(getMaterialGroups(item));
  }

  function getMaterialGroups(item) {
    if (item.materialGroups) return item.materialGroups;
    var groups = {};
    if (item.literatureByYear && item.literatureByYear[String(state.year)]) {
      var title = item.literatureByYear[String(state.year)];
      var author = literatureAuthorFor(item);
      addMaterialGroupEntry(groups, ui.materials.literature, title + (author ? ui.materials.authorPrefix + author : ''));
    }
    (item.materials || []).forEach(function (entry) {
      if (!entry || /^Literatur:/i.test(entry)) return;
      addMaterialGroupEntry(groups, materialGroupForEntry(entry), entry);
    });
    return groups;
  }

  function addMaterialGroupEntry(groups, label, entry) {
    if (!groups[label]) groups[label] = [];
    if (groups[label].indexOf(entry) === -1) groups[label].push(entry);
  }

  function materialGroupForEntry(entry) {
    var lower = String(entry).toLowerCase();
    var provided = ['wird gestellt', 'werden gestellt', 'schulset', 'übungsobjekte', 'drachenhauthandschuhe', 'schutzhandschuhe', 'schutzbrille', 'ohrenschützer', 'flugausrüstung', 'mannschaftsausrüstung', 'trainingsbesen', 'holzmuster', 'profi-ausrüstung', 'poliertuch wird', 'schutzausrüstung'];
    return provided.some(function (needle) { return lower.indexOf(needle) > -1; }) ? ui.materials.provided : ui.materials.bring;
  }

  function materialGroupsHtml(groups) {
    return materialGroupOrder(groups).filter(function (label) { return groups[label] && groups[label].length; }).map(function (label) {
      if (label === ui.materials.literature) {
        return '<div class="material-group literature-group"><strong>' + label + '</strong><div class="literature-list">' + groups[label].map(function (m) { return '<div class="literature-entry">' + materialEntryHtml(label, m) + '</div>'; }).join('') + '</div></div>';
      }
      return '<div class="material-group"><strong>' + label + '</strong><ul>' + groups[label].map(function (m) { return '<li>' + materialEntryHtml(label, m) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
  }

  function materialEntryHtml(label, entry) {
    if (label !== ui.materials.literature) return escapeHtml(entry);
    var book = parseLiteratureEntry(entry);
    return '<button class="book-link" type="button" data-book-title="' + escapeHtml(book.title) + '" data-book-author="' + escapeHtml(book.author) + '">' + escapeHtml(book.title) + (book.author ? '<span>' + escapeHtml(book.author) + '</span>' : '') + '</button>';
  }

  function parseLiteratureEntry(entry) {
    var parts = String(entry || '').split(ui.materials.authorPrefix);
    return { title: (parts[0] || '').trim(), author: (parts[1] || '').trim() };
  }

  function handleBookClick(event) {
    var button = event.target.closest('[data-book-title]');
    if (!button) return;
    event.preventDefault();
    openBookInfo(button.dataset.bookTitle, button.dataset.bookAuthor);
  }

  function openBookInfo(title, author) {
    var info = bookInfoFor(title, author);
    els.dialogBody.innerHTML = '<div class="dialog-title" style="--accent:#F2C580"><span class="dialog-icon">' + clubIcon({ name: 'Buch', color: '#F2C580', iconText: 'B' }) + '</span><div><p class="eyebrow">Literatur</p><h3>' + escapeHtml(info.title) + '</h3></div></div><dl class="detail-list"><div><dt>Buchtitel</dt><dd>' + escapeHtml(info.title) + '</dd></div><div><dt>Autor/in</dt><dd>' + escapeHtml(info.author || 'Hogwarts-Bibliothek') + '</dd></div></dl><h4>Über das Buch</h4><p>' + escapeHtml(info.description) + '</p><h4>Über den Autor/in</h4><p>' + escapeHtml(info.authorDescription) + '</p>';
    if (els.dialog.open) restoreScrollPosition(dialogScrollPosition.x, dialogScrollPosition.y);
    else showDialogWithoutScrollJump();
  }

  function bookInfoFor(title, author) {
    var base = baseBookTitle(title);
    var context = literatureContextFor(title, base);
    var exactDetails = data.bookDetails && data.bookDetails[title];
    var baseDetails = data.bookDetails && data.bookDetails[base];
    var details = exactDetails || (context ? {} : baseDetails) || {};
    var authorDescription = (data.authorDetails && data.authorDetails[author]) || generatedAuthorDescription(author);
    return {
      title: title,
      author: author,
      description: details.description || generatedBookDescription(title, base, author, context),
      authorDescription: authorDescription
    };
  }

  function baseBookTitle(title) {
    return String(title || '')
      .replace(/\s*,\s*Band\s*\d+$/i, '')
      .replace(/\s+[IVX]+$/i, '')
      .replace(/^ZAG[-\s:]+/i, '')
      .replace(/^UTZ[-\s:]+/i, '')
      .trim();
  }

  function literatureContextFor(title, base) {
    var exact = null;
    var related = null;
    (data.subjects || []).forEach(function (subject) {
      Object.keys(subject.literatureByYear || {}).forEach(function (year) {
        var entry = subject.literatureByYear[year];
        var entryBase = baseBookTitle(entry);
        if (entry === title) exact = { subject: subject, year: year, entry: entry };
        else if (!related && entryBase === base) related = { subject: subject, year: year, entry: entry };
      });
    });
    return exact || related;
  }

  function generatedBookDescription(title, base, author, context) {
    var writer = author || 'der Hogwarts-Bibliothek';
    var publicationYear = publicationYearFor(writer, title, context);
    var genre = bookGenreFor(context, title);
    var subjectName = context && context.subject ? context.subject.name : 'magische Ausbildung';
    var yearText = context && context.year ? context.year + '. Schuljahrgang' : 'Hogwarts-Unterricht';
    var topics = bookTopicsForContext(context);
    return title + ' ist ein ' + genre + ' von ' + writer + ', erschienen ' + publicationYear + ' in der Hogwarts-Schulausgabe für den ' + yearText + '. Der Band gehört zum Fach ' + subjectName + ' und verbindet erklärende Kapitel mit Übungen, Kontrollfragen und Randnotizen für die praktische Anwendung. Behandelt werden vor allem ' + topics + '.';
  }

  function publicationYearFor(author, title, context) {
    var band = String(title || '').match(/Band\s*(\d+)/i);
    var year = context && context.year ? parseInt(context.year, 10) : 1;
    var starts = {
      'Miranda Habicht': 1954,
      'Bathilda Bagshot': 1947,
      'Arsenius Bunsen': 1951,
      'Libatius Borage': 1937,
      'Emeric Wendel': 1948,
      'Phyllida Spore': 1950,
      'Quirin Sumo': 1952,
      'Kassandra Wablatschki': 1965,
      'Cassandra Vablatsky': 1965,
      'Edwardus Lima': 1974,
      'Bridget Wenlock': 1238,
      'Newt Scamander': 1927,
      'Kennilworthy Whisp': 1952,
      'Professor Aurora Sinistra': 1988,
      'Wilhelm Wigworthy': 1983,
      'Wilkie Twycross': 1996,
      'Nicolas Flamel': 1398,
      'Garrick Ollivander': 1986,
      'Charlie Weasley': 1995,
      'Minerva McGonagall': 1992,
      'Eadric Thorne': 1896
    };
    var start = starts[author] || 1960;
    var calculated = band ? start + parseInt(band[1], 10) - 1 : start + Math.max(0, year - 1);
    return String(Math.min(calculated, 1996));
  }

  function bookGenreFor(context, title) {
    if (!context || !context.subject) return 'magisches Fachbuch';
    var id = context.subject.replaces || context.subject.id;
    if (id === 'history') return 'historisches Lehrbuch';
    if (id === 'potions') return 'Zaubertrank-Rezeptbuch';
    if (id === 'herbology') return 'botanisches Schulbuch';
    if (id === 'care-creatures') return 'magizoologisches Bestiarium';
    if (id === 'divination') return 'Wahrsagehandbuch';
    if (id === 'ancient-runes') return 'Runen- und Übersetzungslehrbuch';
    if (id === 'arithmancy') return 'arithmantisches Rechenbuch';
    if (id === 'flying' || id === 'pro-quidditch') return 'Quidditch-Sachbuch';
    if (id === 'defence') return 'Verteidigungslehrbuch';
    if (id === 'transfiguration') return 'Verwandlungslehrbuch';
    if (id === 'charms') return 'Zauberkunst-Lehrbuch';
    return /Atlas/i.test(title) ? 'magischer Atlas' : 'magisches Fachbuch';
  }

  function bookTopicsForContext(context) {
    if (!context || !context.subject) return 'zentrale Begriffe, typische Fehler, Übungsaufgaben und Prüfungsbeispiele aus dem jeweiligen Fach';
    var key = context.subject.replaces || context.subject.id;
    var topicBlock = data.curriculumTopicsBySubject && data.curriculumTopicsBySubject[key];
    var topics = topicBlock && topicBlock.years && topicBlock.years[context.year];
    if (topics && topics.length) return humanList(topics.slice(0, 5));
    return subjectFallbackTopics(key);
  }

  function subjectFallbackTopics(key) {
    var fallback = {
      astronomy: 'Sternkarten, Mondphasen, Teleskoparbeit, Kometenbeobachtung und nächtliche Messprotokolle',
      history: 'Koboldaufstände, magische Gesetzgebung, internationale Zaubererkonflikte, Quellenarbeit und historische Essays',
      arithmancy: 'Zahlentafeln, Namenswerte, Wahrscheinlichkeitsmagie, Prognoserechnungen und Fehlerkontrolle',
      'muggle-studies': 'Muggeltechnik, Elektrizität, Alltagsgegenstände, gesellschaftliche Regeln und magisch-muggelige Missverständnisse',
      apparition: 'Ziel, Wille, Ruhe, Zielkreise, Zersplinterungsgefahr und sichere Prüfungsvorbereitung',
      alchemy: 'alchemistische Symbole, Stoffwandlung, Reagenzienketten, Transmutation und Substanzlehre',
      wandmaking: 'Zauberstabhölzer, magische Kerne, Resonanz, Balance und die Bindung zwischen Zauberstab und Zauberndem',
      dragonology: 'Drachenarten, Feuerverhalten, Schutzabstände, Reservatsregeln und Beobachtungsprotokolle',
      'animagus-study': 'Animagusrecht, Selbstbild, Registrierungsregeln, Gestaltbindung und die Grenzen freiwilliger Verwandlung',
      'pro-quidditch': 'Positionsspiel, Sucherdrills, Taktiktafeln, Foulanalyse und professionelle Spielvorbereitung'
    };
    return fallback[key] || 'Fachbegriffe, praktische Übungen, Sicherheitsregeln, Hausaufgabenbeispiele und Prüfungsfragen';
  }

  function humanList(items) {
    if (!items.length) return '';
    if (items.length === 1) return items[0];
    return items.slice(0, -1).join(', ') + ' und ' + items[items.length - 1];
  }

  function generatedAuthorDescription(author) {
    if (!author) return 'Die Hogwarts-Bibliothek führt diesen Band als redaktionell betreutes Unterrichtswerk. Die Ausgabe wurde von Fachlehrkräften überarbeitet, in der Bibliothek geprüft und für den praktischen Schulgebrauch gebunden. Ihr Fachgebiet ist die verlässliche Sammlung von Unterrichtsstoff, ihre Errungenschaft die gut auffindbare Ordnung für Hausaufgaben, Prüfungen und Nachschlagearbeit.';
    return author + ' wird in diesem Curriculum als Fachautor oder Fachautorin geführt. Der Lebenslauf ist in der Hogwarts-Bibliothek als fachlicher Werdegang mit Unterricht, Forschung und praktischer Anwendung hinterlegt. Das Fachgebiet liegt in der magischen Ausbildung, und die wichtigste Errungenschaft besteht darin, schwierigen Unterrichtsstoff so aufzubereiten, dass er im Schulalltag zuverlässig verwendbar ist.';
  }

  function materialGroupOrder(groups) {
    var preferred = [ui.materials.literature, ui.materials.provided, ui.materials.bring, ui.materials.baseEquipment, ui.materials.homeBring, ui.materials.homeProvided, ui.materials.resupply];
    return preferred.concat(Object.keys(groups || {}).filter(function (label) { return preferred.indexOf(label) === -1; }));
  }

  function materialGroupsHasEntries(groups) {
    return Object.keys(groups || {}).some(function (label) { return groups[label] && groups[label].length; });
  }

  function flattenMaterialGroups(groups) {
    return materialGroupOrder(groups).reduce(function (list, label) {
      (groups[label] || []).forEach(function (entry) { list.push(label + ': ' + entry); });
      return list;
    }, []);
  }

  function materialGroupsText(item) {
    var groups = getMaterialGroups(item);
    return materialGroupOrder(groups).filter(function (label) { return groups[label] && groups[label].length; }).map(function (label) {
      return label + ': ' + groups[label].join(', ');
    }).join(' | ');
  }

  function legacySupplyGroups(list) {
    var groups = {};
    (list || []).forEach(function (entry) {
      var parts = String(entry).split(':');
      var label = parts.length > 1 ? parts.shift().trim() : ui.materials.baseEquipment;
      addMaterialGroupEntry(groups, label, parts.join(':').trim() || entry);
    });
    return groups;
  }

  function literatureAuthorFor(item) {
    var authors = data.literatureAuthors && data.literatureAuthors[item.sourceId || item.id];
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
    return '<h4>' + (topic.title || ui.dialog.defaultTopicTitle) + '</h4><ul class="topic-list">' + list.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>';
  }

  function sortByMinimumYear(a, b) {
    var ay = a.minYear || (a.yearLevels ? Math.min.apply(null, a.yearLevels) : 1);
    var by = b.minYear || (b.yearLevels ? Math.min.apply(null, b.yearLevels) : 1);
    return ay - by || a.name.localeCompare(b.name, 'de');
  }

  function sortByTripDate(a, b) {
    return dateSortValue(a.date) - dateSortValue(b.date) || a.name.localeCompare(b.name, 'de');
  }

  function dateSortValue(dateText) {
    var months = { januar: 1, februar: 2, märz: 3, maerz: 3, april: 4, mai: 5, juni: 6, juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12 };
    var match = String(dateText || '').toLowerCase().match(/(\d{1,2})\.\s*([a-zäöü]+)/);
    if (!match) return 9999;
    var month = months[match[2]] || 99;
    if (month === 8) return Number(match[1]);
    var schoolYearMonth = month >= 9 ? month - 8 : month + 4;
    return schoolYearMonth * 100 + Number(match[1]);
  }

  function revealDelay(day, slot) {
    var dayIndex = data.days.findIndex(function (item) { return item.id === day.id; });
    var slotIndex = data.timeSlots.findIndex(function (item) { return item.id === slot.id; });
    return Math.max(0, dayIndex) * 0.285 + Math.max(0, slotIndex) * 0.008;
  }


  function openHouseInfo(houseId) {
    var house = data.houses.find(function (item) { return item.id === houseId; });
    if (!house) return;
    els.dialogBody.innerHTML = '<div class="dialog-title house-dialog" style="--accent:' + house.colors[0] + '"><span class="dialog-icon"><img src="' + house.crest + '" data-fallback="' + assetUrl(house.fallback) + '" alt="' + house.name + '"></span><div><p class="eyebrow">' + ui.dialog.labels.houseKind + '</p><h3>' + house.name + '</h3></div></div><dl class="detail-list"><div><dt>' + ui.dialog.labels.founder + '</dt><dd>' + house.founder + '</dd></div><div><dt>' + ui.dialog.labels.ghost + '</dt><dd>' + house.ghost + '</dd></div><div><dt>' + ui.dialog.labels.commonRoom + '</dt><dd>' + house.commonRoom + '</dd></div><div><dt>' + ui.dialog.labels.entrance + '</dt><dd>' + house.entrance + '</dd></div></dl><p>' + house.description + '</p><p>' + house.history + '</p><h4>' + ui.dialog.labels.traits + '</h4><p>' + house.traits + '</p>';
    addImageFallbacks(els.dialogBody);
    showDialogWithoutScrollJump();
  }

  function restartWritingAnimations() {
    document.querySelectorAll('#materialsTable, #specialDates, #schoolYearTimeline, .quill-type').forEach(function (node) {
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
    var pages = state.muggleMode ? [drawPdfSchedulePage(events, house)] : [drawPdfSchedulePage(events, house), drawPdfInfoPage(trips, dates), drawPdfMaterialsPage(materials)];
    return new Blob([buildImagePdf(pages)], { type: 'application/pdf' });
  }

  async function downloadPdf() {
    var oldText = els.pdfButton.textContent;
    els.pdfButton.disabled = true;
    els.pdfButton.textContent = ui.status.pdfCreating;
    try {
      var blob = await createPdfBlob();
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = (state.name || ui.logoAlt) + ui.pdf.fileSuffix;
      document.body.appendChild(link);
      link.click();
      console.info(ui.pdf.consolePrepared + link.download);
      setTimeout(function () { URL.revokeObjectURL(link.href); link.remove(); }, 1600);
    } finally {
      els.pdfButton.disabled = false;
      els.pdfButton.textContent = oldText;
    }
  }

  async function printGeneratedPdf() {
    var oldText = els.printButton.textContent;
    els.printButton.disabled = true;
    els.printButton.textContent = ui.status.printCreating;
    try {
      var blob = await createPdfBlob();
      var url = URL.createObjectURL(blob);
      var win = window.open(url, '_blank');
      if (!win) {
        URL.revokeObjectURL(url);
        window.alert(ui.alerts.popupBlocked);
        els.printButton.disabled = false;
        els.printButton.textContent = oldText;
        return;
      }
      setTimeout(function () {
        try { win.focus(); win.print(); } catch (error) { console.warn(ui.pdf.printDialogWarning, error); }
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
    ctx.fillStyle = '#111'; ctx.font = 'bold 34px Georgia'; ctx.textAlign = 'center'; ctx.fillText(ui.pdf.logoFallback, x + w / 2, y + h / 2);
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
    if (!state.muggleMode) drawHouseCrest(ctx, house, 1580, 34, 112, 112);
    ctx.textAlign = 'center'; ctx.fillStyle = '#111'; ctx.font = 'bold 28px Georgia'; ctx.fillText(state.name || ui.schedule.unnamedPlan, 877, 70);
    ctx.font = '22px Georgia'; ctx.fillText(house.name + ' - ' + state.year + '. ' + ui.schedule.schoolYearSuffix, 877, 106);
    ctx.font = '18px Georgia'; ctx.fillText(state.muggleMode ? ui.pdf.muggleScheduleType : ui.pdf.scheduleType, 877, 136);
    var x0 = 50, y0 = 166, tableW = 1654, tableH = 1010, colW = tableW / 8, rowH = tableH / (data.timeSlots.length + 1);
    function colX(i) { return x0 + colW * i; }
    function colWidth() { return colW; }
    ctx.font = 'bold 22px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f1f1f1'; ctx.fillRect(x0, y0, tableW, rowH); ctx.strokeStyle = '#777'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, tableW, rowH);
    [ui.schedule.timeColumn].concat(data.days.map(function (d) { return d.label; })).forEach(function (label, i) { ctx.fillStyle = '#111'; ctx.fillText(label, colX(i) + colWidth(i) / 2, y0 + rowH / 2); });
    var grouped = groupEvents(events);
    data.timeSlots.forEach(function (slot, r) {
      var y = y0 + rowH * (r + 1); ctx.fillStyle = slot.type === 'meal' ? '#e5f2ee' : '#ffffff'; ctx.fillRect(x0, y, tableW, rowH); ctx.strokeStyle = '#777'; ctx.lineWidth = 1;
      for (var c = 0; c < 8; c++) ctx.strokeRect(colX(c), y, colWidth(c), rowH);
      ctx.fillStyle = '#111'; ctx.font = 'bold 15px Georgia'; ctx.textAlign = 'left'; wrapText(ctx, slotDisplayLabel(slot), x0 + 8, y + 24, colW - 16, 16, 2); ctx.font = '12px Georgia'; wrapText(ctx, slotDisplayTime(slot), x0 + 8, y + 56, colW - 16, 12, 2);
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
    var page = canvasBase(1754, 1240), ctx = page.ctx; drawLogo(ctx, 58, 38, 270, 96); ctx.fillStyle = '#111'; ctx.font = 'bold 28px Georgia'; ctx.textAlign = 'center'; ctx.fillText(ui.pdf.infoTitle, 877, 108);
    var y = 176;
    y = drawSection(ctx, ui.pdf.tripsTitle, trips.map(function (t) { return t.date + ' - ' + t.name + ' - ' + t.location; }), 80, y, 1594, 18);
    drawSection(ctx, ui.pdf.specialTitle, dates.map(function (d) { return d.date + ' - ' + d.name; }), 80, y + 26, 1594, 18);
    drawPdfCredit(ctx); return page.canvas.toDataURL('image/jpeg', .9);
  }

  function drawPdfMaterialsPage(materials) {
    var page = canvasBase(1754, 1240), ctx = page.ctx; drawLogo(ctx, 58, 38, 270, 96); ctx.fillStyle = '#111'; ctx.font = 'bold 28px Georgia'; ctx.textAlign = 'center'; ctx.fillText(ui.pdf.materialsTitle, 877, 108);
    drawMaterialsTable(ctx, materials, 80, 176, 1594, 980);
    drawPdfCredit(ctx); return page.canvas.toDataURL('image/jpeg', .9);
  }

  function drawSection(ctx, title, lines, x, y, w, gapAfterTitle) { ctx.fillStyle = '#f1f1f1'; ctx.fillRect(x, y, w, 40); ctx.strokeStyle = '#999'; ctx.strokeRect(x, y, w, 40); ctx.fillStyle = '#111'; ctx.font = 'bold 24px Georgia'; ctx.textAlign = 'left'; ctx.fillText(title, x + 12, y + 27); y += 50 + (gapAfterTitle || 0); ctx.font = '21px Georgia'; (lines.length ? lines : [ui.extras.noEntries]).slice(0, 18).forEach(function (line) { y = wrapText(ctx, '- ' + line, x + 12, y, w - 24, 25, 3) + 8; }); return y; }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) { var words = String(text).split(' '), line = '', lines = 0; for (var n = 0; n < words.length; n++) { var testLine = line + words[n] + ' '; if (ctx.measureText(testLine).width > maxWidth && n > 0) { ctx.fillText(line.trim(), x, y); y += lineHeight; lines++; line = words[n] + ' '; if (maxLines && lines >= maxLines) return y; } else line = testLine; } if (!maxLines || lines < maxLines) ctx.fillText(line.trim(), x, y); return y + lineHeight; }
  function clippedText(ctx, text, x, y, maxWidth) { var value = String(text || ''); while (value && ctx.measureText(value + '...').width > maxWidth) value = value.slice(0, -1); ctx.fillText(value.length < String(text || '').length ? value.trim() + '...' : value, x, y); }
  function drawPdfCredit(ctx) { ctx.fillStyle = '#111'; ctx.font = 'bold 20px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(ui.pdf.credit, 877, 1204); }
  function drawMaterialsTable(ctx, materials, x, y, w, maxH) {
    var rows = (materials.length ? materials : [{ name: ui.extras.noEntries, materials: [ui.extras.noExtraMaterials] }]).slice(0, 20);
    var leftW = 420, rightW = w - leftW, rowH = Math.max(36, maxH / (rows.length + 1));
    ctx.fillStyle = '#f1f1f1'; ctx.fillRect(x, y, w, rowH); ctx.strokeStyle = '#999'; ctx.strokeRect(x, y, w, rowH); ctx.beginPath(); ctx.moveTo(x + leftW, y); ctx.lineTo(x + leftW, y + rowH); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.font = 'bold 22px Georgia'; ctx.textAlign = 'left'; ctx.fillText(ui.pdf.materialsLeftHeader, x + 12, y + 27); ctx.fillText(ui.pdf.materialsRightHeader, x + leftW + 12, y + 27);
    y += rowH; ctx.font = '17px Georgia';
    rows.forEach(function (item) {
      var materialText = materialGroupsText(item);
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
    if (mode === 'pdf') document.title = (state.name || ui.pdf.logoFallback) + ' ' + ui.pdf.documentTitleSuffix;
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

  function selectedTrips() { return data.trips.filter(function (trip) { return state.trips.indexOf(trip.id) > -1 && state.year >= trip.minYear; }).sort(sortByTripDate); }
  function showSchedule() { state.disguiseOpen = false; persist(); renderDisguisePanel(); els.formView.hidden = true; els.scheduleView.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }
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
  function slotDisplayLabel(slot) { return (state.muggleMode && state.customLabels && state.customLabels[slot.id]) ? state.customLabels[slot.id] : slot.label; }
  function slotDisplayTime(slot) { return (state.muggleMode && state.customTimes && state.customTimes[slot.id]) ? state.customTimes[slot.id] : slot.time; }
  function slotTime(slotId) { var slot = data.timeSlots.find(function (item) { return item.id === slotId; }); return slot ? slotDisplayLabel(slot) + ' ' + slotDisplayTime(slot) : slotId; }
  function sessionPreview(sessions) { return sessions.map(function (session) { return dayLabel(session.day).slice(0, 2) + ' ' + slotTime(session.slot).split(' ')[0]; }).join(', '); }
  function clubTimePreview(club) { if (club.houseSessions) return ui.form.quidditchHouseTimes; return dayLabel(club.day) + ', ' + slotTime(club.slot); }
  function findSubject(id) { return data.subjects.find(function (item) { return item.id === id; }); }
  function findClub(id) { return data.clubs.find(function (item) { return item.id === id; }); }
  function findTrip(id) { return data.trips.find(function (item) { return item.id === id; }); }
  function labelForKind(kind) { return ui.dialog.kindLabels[kind] || ui.dialog.kindLabels.subject; }
  function iconImage(item) { var src = item.icon || makeIconDataUri(item.name, item.color); return '<img src="' + src + '" alt="" style="--img-scale:' + (item.iconScale || 0.9) + '">'; }
  function clubIcon(item) { return '<img src="' + makeIconDataUri(item.iconText || item.name, item.color || '#80BFAD') + '" alt="" style="--img-scale:0.88">'; }
  function makeIconDataUri(name, color) { var source = String(name || '').trim(); var initials = source.length <= 3 && source === source.toUpperCase() ? source : source.split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join(''); var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#020126"/><rect x="8" y="8" width="104" height="104" rx="14" fill="' + color + '"/><circle cx="60" cy="60" r="38" fill="#F2C580" opacity=".18"/><text x="60" y="72" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#fff8df">' + escapeSvg(initials) + '</text></svg>'; return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg); }
  function applyImage(img, asset, alt) { img.src = asset.src; img.dataset.fallback = assetUrl(asset.fallback); img.alt = alt; img.style.setProperty('--img-scale', asset.scale || 1); addImageFallbacks(img.parentElement || document); }
  function addImageFallbacks(root) { root.querySelectorAll ? root.querySelectorAll('img[data-fallback]').forEach(function (img) { img.onerror = function () { if (img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback; }; }) : null; }
  function assetUrl(file) { return file ? data.repoAssetBase + file : ''; }
  function localAsset(file) { return file || ''; }
  function applyStars() { document.documentElement.style.setProperty('--stars-url', 'url("' + data.assets.stars.src + '")'); var probe = new Image(); probe.onerror = function () { document.documentElement.style.setProperty('--stars-url', 'url("' + assetUrl(data.assets.stars.fallback) + '")'); }; probe.src = data.assets.stars.src; }
  function tryPlayAudio() { if (state.muted) return; els.bgAudio.volume = 0.28; els.bgAudio.play().catch(function () {}); }
  function updateAudioButton() { els.soundToggle.classList.toggle('is-muted', state.muted); els.soundToggle.setAttribute('aria-label', state.muted ? ui.sound.muted : ui.sound.playing); els.soundToggle.innerHTML = state.muted ? mutedSvg() : soundSvg(); }
  function loadState() {
    var fallback = { name: '', house: 'gryffindor', year: 1, electives: [], clubs: [], trips: [], muted: false, scheduleFilter: 'all', mobileDay: 'monday', disguiseOpen: false, muggleMode: false, aliasMode: false, timeEditorOpen: false, customTimes: {}, customLabels: {}, customModules: [] };
    try {
      var loaded = Object.assign(fallback, JSON.parse(localStorage.getItem(storageKey) || '{}'));
      loaded.mobileDay = 'monday';
      loaded.customTimes = loaded.customTimes || {};
      loaded.customLabels = loaded.customLabels || {};
      loaded.customModules = Array.isArray(loaded.customModules) ? loaded.customModules : [];
      loaded.disguiseOpen = Boolean(loaded.disguiseOpen);
      loaded.muggleMode = Boolean(loaded.muggleMode);
      loaded.aliasMode = Boolean(loaded.aliasMode);
      loaded.timeEditorOpen = Boolean(loaded.timeEditorOpen);
      return loaded;
    } catch (error) { return fallback; }
  }
  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function formatText(template, values) { return String(template || '').replace(/\{(\w+)\}/g, function (_, key) { return Object.prototype.hasOwnProperty.call(values || {}, key) ? values[key] : ''; }); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]; }); }
  function escapeSvg(value) { return String(value).replace(/[&<>]/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]; }); }
  function soundSvg() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="M16 8.5c1.2 1.9 1.2 5.1 0 7"></path><path d="M18.5 6c2.2 3.4 2.2 8.6 0 12"></path></svg>'; }
  function mutedSvg() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="m18 9-5 5"></path><path d="m13 9 5 5"></path></svg>'; }
})();
