(function () {
  'use strict';

  var englishUi = {
    footer: { by: 'by', linkText: 'FNK' },
    sound: { muted: 'Turn background music on', playing: 'Mute background music' },
    intro: 'Supported by Muggle technology, you can now assemble your Hogwarts timetable in just a few minutes.',
    form: {
      nameLabel: 'Student name',
      namePlaceholder: 'e.g. Mina Winter',
      houseLegend: 'Choose house',
      yearLabel: 'School year',
      electivesTitle: 'Electives and additional modules',
      clubsTitle: 'Clubs and meeting points',
      tripsTitle: 'Excursions and student exchanges',
      submit: 'Open curriculum',
      allSelect: 'Select all',
      allDeselect: 'Deselect all',
      electiveCountSuffix: 'electives',
      requirementReady: 'Curriculum can be created',
      requirementMissingSuffix: 'missing',
      electiveTag: 'Elective',
      extraTag: 'Additional',
      fromYearPrefix: 'from ',
      fromSchoolYearPrefix: 'from school year ',
      noFixedLeader: 'no fixed leader',
      variableMeetingPlace: 'changing meeting place',
      quidditchHouseTimes: 'House times on the Quidditch pitch',
      houseFieldAltSuffix: ' view'
    },
    toolbar: {
      back: 'Change entries',
      print: 'Send to Muggle printer',
      pdf: 'Save as Muggle file',
      disguise: 'Disguise as Muggle timetable'
    },
    schedule: {
      personalCurriculum: 'Personal curriculum',
      title: 'Hogwarts timetable',
      unnamedCurriculum: 'Unnamed curriculum',
      unnamedPlan: 'Unnamed timetable',
      disguisedPlan: 'Disguised weekly plan',
      ownAppointments: 'custom appointments',
      aliasActive: 'alias active',
      houseTeacher: 'Head of house',
      electiveMinimumShort: 'Electives',
      timeColumn: 'Time',
      free: 'free',
      timeTurnerAlt: 'Time-Turner',
      schoolYearSuffix: 'school year',
      swipeHint: 'Swipe timetable sideways',
      filterAria: 'Filter timetable',
      filters: { all: 'All', subject: 'Classes', club: 'Clubs' },
      mobilePreviousDay: 'Previous day',
      mobileNextDay: 'Next day',
      mobileViewAria: 'Daily view'
    },
    extras: {
      schoolYearTitle: 'Your school year',
      tripsTitle: 'Registered excursions/exchanges:',
      specialTitle: 'Special dates',
      materialsTitle: 'Required school materials and equipment:',
      tripsEmpty: 'No excursions or exchanges registered.',
      hiddenInMuggleMode: 'Hidden in Muggle mode.',
      materialsHiddenInMuggleMode: 'No Hogwarts materials are issued in Muggle mode.',
      noEntries: 'No entries.',
      noExtraMaterials: 'No additional materials.'
    },
    dialog: {
      closeAria: 'Close window',
      scrollTopAria: 'Scroll to top',
      labels: {
        leader: 'Leader',
        room: 'Room',
        appointment: 'Appointment',
        exam: 'Assessment',
        professorComment: 'Professor comment',
        materials: 'Materials and literature',
        tripKind: 'Excursion / exchange',
        dateRange: 'Date / period',
        place: 'Place',
        cost: 'Cost',
        galleons: 'Galleons',
        description: 'Description',
        activities: 'Programme',
        bring: 'Bring',
        specialKind: 'Special date',
        houseKind: 'Hogwarts house',
        founder: 'Founder',
        ghost: 'House ghost',
        commonRoom: 'Common room',
        entrance: 'Entrance',
        traits: 'Commonly associated traits'
      },
      kindLabels: { club: 'Club', meal: 'Meal', custom: 'Muggle module', subject: 'Subject' },
      defaultTopicTitle: 'Topics in this school year',
      defaultSubjectName: 'Fundamentals',
      book: {
        iconText: 'B',
        eyebrow: 'Literature',
        titleLabel: 'Book title',
        authorLabel: 'Author',
        fallbackAuthor: 'Hogwarts Library',
        aboutBook: 'About the book',
        aboutAuthor: 'About the author'
      }
    },
    muggle: {
      eyebrow: 'Concealment charm for Muggle technology',
      title: 'Edit Muggle timetable',
      enable: 'Activate Muggle mode',
      disable: 'Deactivate Muggle mode',
      alias: 'Use alias',
      note: 'Create harmless Muggle modules here. Without alias you might see Maths, Mr Müller, Room 15. With alias it can become Arithmancy, Professor Septima Vector and the Rune cabinet.',
      timeTitle: 'Edit times',
      timeOpen: 'Open times',
      timeClose: 'Close times',
      newModuleTitle: 'Create new module',
      moduleColor: 'Module colour',
      timeDayBlocks: 'Time/day blocks',
      addModule: 'Add module',
      modulesTitle: 'Created modules',
      noModules: 'No Muggle modules created yet.',
      unnamedModule: 'Unnamed module',
      teacherOpen: 'teacher open',
      roomOpen: 'place open',
      appointmentSingular: 'appointment',
      appointmentPlural: 'appointments',
      edit: 'Edit',
      remove: 'Remove',
      customInfo: 'This module was created manually in the Muggle timetable and can be changed in the disguise console at any time.',
      defaults: { name: 'Maths', teacher: 'Mr Müller', room: 'Room 15', nameAlias: 'Arithmancy', teacherAlias: 'Professor Septima Vector', roomAlias: 'Rune cabinet' },
      placeholders: { name: 'Name', teacher: 'Teacher', room: 'Place', nameAlias: 'Name alias', teacherAlias: 'Teacher alias', roomAlias: 'Place alias' }
    },
    alerts: {
      printBuildError: 'The print layout could not be created right now. Please try again.',
      pdfBuildError: 'The Muggle file could not be created right now. Please try again.',
      popupBlocked: 'The print window was blocked by the browser. Please allow popups for this page.',
      printFallbackOpened: 'The PDF opened in a new tab. If the print dialog does not appear automatically, please use Print there.',
      printDialogNotOpened: 'The print dialog could not be opened automatically. If needed, use “Save as Muggle file” and print the PDF.'
    },
    status: { pdfCreating: 'Creating Muggle file...', printCreating: 'Creating print layout...' },
    pdf: {
      fileSuffix: '_Timetable.pdf',
      consolePrepared: 'Muggle file prepared: ',
      documentTitleSuffix: 'Timetable',
      printDialogWarning: 'Print dialog could not be opened automatically:',
      logoFallback: 'Hogwarts Curriculum',
      scheduleType: 'Hogwarts timetable',
      muggleScheduleType: 'Weekly overview',
      infoTitle: 'Additional curriculum overview',
      tripsTitle: 'Registered excursions and student exchanges',
      specialTitle: 'Special dates',
      materialsTitle: 'Required school materials and equipment',
      materialsLeftHeader: 'Subject / module',
      materialsRightHeader: 'Materials and literature',
      credit: 'made by FNK'
    },
    materials: {
      baseSupplies: 'Basic school equipment',
      literaturePrefix: 'Literature: ',
      authorPrefix: ' - by ',
      literature: 'Literature',
      provided: 'Provided',
      bring: 'Bring',
      baseEquipment: 'Basic equipment',
      homeBring: 'Living - bring',
      homeProvided: 'Living - provided',
      resupply: 'Restock and care'
    },
    trip: {
      flavor: 'Before departure, meeting point, return time and safety rules are posted in the common room. Registration is complete only once the head of house and escort have countersigned it.',
      defaultLeader: 'Professor McGonagall',
      exchangeLeader: 'Professor McGonagall and the International Exchange Office',
      defaultDetails: [
        'This excursion adds a supervised look beyond the castle to your lessons.',
        'You attend an introduction, complete observation tasks and report back to the escort at the end.',
        'Permission slip, note parchment and weatherproof cloak.'
      ]
    },
    language: {
      label: 'Language',
      de: 'German',
      en: 'English',
      missingWarning: 'English localisation still needs attention for these content paths:'
    }
  };

  var exact = {
    Deutsch: 'German',
    Englisch: 'English',
    Montag: 'Monday',
    Dienstag: 'Tuesday',
    Mittwoch: 'Wednesday',
    Donnerstag: 'Thursday',
    Freitag: 'Friday',
    Samstag: 'Saturday',
    Sonntag: 'Sunday',
    Frühstück: 'Breakfast',
    Mittagessen: 'Lunch',
    Abendessen: 'Dinner',
    Abend: 'Evening',
    Nacht: 'Night',
    '1. Block': '1st block',
    '2. Block': '2nd block',
    '3. Block': '3rd block',
    '4. Block': '4th block',
    '5. Block': '5th block',
    'Trainingsblock I': 'Training block I',
    'Trainingsblock II': 'Training block II',
    'Große Halle, Erdgeschoss': 'Great Hall, ground floor',
    'Hogwarts Stundenplan': 'Hogwarts timetable',
    'Persönliches Curriculum': 'Personal curriculum',
    'frei': 'free',
    'Zeit': 'Time',
    'Zauberkunst': 'Charms',
    'Fortgeschrittene Zauberkunst': 'Advanced Charms',
    'Verteidigung gegen die dunklen Künste': 'Defence Against the Dark Arts',
    'Fortgeschrittene Verteidigung gegen die dunklen Künste': 'Advanced Defence Against the Dark Arts',
    'Kräuterkunde': 'Herbology',
    'Fortgeschrittene Kräuterkunde': 'Advanced Herbology',
    'Geschichte der Zauberei': 'History of Magic',
    'Fortgeschrittene Geschichte der Zauberei': 'Advanced History of Magic',
    'Zaubertränke': 'Potions',
    'Fortgeschrittene Zaubertränke': 'Advanced Potions',
    'Verwandlung': 'Transfiguration',
    'Fortgeschrittene Verwandlung': 'Advanced Transfiguration',
    'Astronomie': 'Astronomy',
    'Besenflugstunde': 'Flying Lesson',
    'Arithmantik': 'Arithmancy',
    'Muggelkunde': 'Muggle Studies',
    'Alte Runen': 'Ancient Runes',
    'Pflege magischer Geschöpfe': 'Care of Magical Creatures',
    'Fortgeschrittene Pflege magischer Geschöpfe': 'Advanced Care of Magical Creatures',
    'Wahrsagen': 'Divination',
    'Apparieren und Disapparieren': 'Apparition and Disapparition',
    'Alchemie': 'Alchemy',
    'Zauberstab Herstellungskunde': 'Wandmaking Studies',
    'Quidditch Profitraining': 'Professional Quidditch Training',
    'Drachenkunde': 'Dragon Studies',
    'Animagus Ergründung': 'Animagus Inquiry',
    'Zauberschach Club': 'Wizard Chess Club',
    Koboldstein: 'Gobstones',
    'Duellierclub': 'Dueling Club',
    'Art Club': 'Art Club',
    'Astronomy Club': 'Astronomy Club',
    'Hausaufgaben Treff': 'Homework Meet-up',
    'Magische Geschöpfe Club': 'Magical Creatures Club',
    'Zauberkunst Club': 'Charms Club',
    'Rattenrennen Club': 'Rat Racing Club',
    Tanzclub: 'Dance Club',
    'Slug Club': 'Slug Club',
    'Ancient Runes Club': 'Ancient Runes Club',
    Trankzirkel: 'Potions Circle',
    Buchclub: 'Book Club',
    'Magisches Kochen': 'Magical Cooking',
    'Magische erste Hilfe': 'Magical First Aid',
    'Schülerhilfe Hogsmeade': 'Hogsmeade Tutoring',
    'Boots- und Angelclub': 'Boating and Fishing Club',
    'Quidditch-Orga Ehrenamt': 'Quidditch Organisation Volunteers',
    'Vertrauensschüler/Schulsprecher': 'Prefects / Head Students',
    Eventgruppe: 'Event Group',
    'Brieffreunde-Hogwarts': 'Hogwarts Pen Pals',
    Hausmeistergilde: 'Caretaker Guild',
    'Archivare und Chronisten': 'Archivists and Chroniclers',
    'Magische Mobilität': 'Magical Mobility',
    'Hogsmeade Besuch': 'Hogsmeade Visit',
    Winkelgasse: 'Diagon Alley',
    'Drachenbeobachtungs-Plateau Ashpeak': 'Ashpeak Dragon Observation Plateau',
    'Magische Gärten von Mournvale': 'Magical Gardens of Mournvale',
    'Aurum-Kesselwerke': 'Aurum Cauldronworks',
    'Observatorium Astra Noctis': 'Astra Noctis Observatory',
    'Britisches Zaubereiministerium': 'British Ministry of Magic',
    'Magischer Kongress der Vereinigten Staaten von Amerika': 'Magical Congress of the United States of America',
    'St. Mungos Krankenhaus für magische Krankheiten und Verletzungen': 'St Mungo’s Hospital for Magical Maladies and Injuries',
    'Beauxbatons Akademie für Magie': 'Beauxbatons Academy of Magic',
    'Durmstrang Institut': 'Durmstrang Institute',
    'Ilvermorny Schule für Hexerei und Zauberei': 'Ilvermorny School of Witchcraft and Wizardry',
    'Große Halle': 'Great Hall',
    'Verbotener Wald': 'Forbidden Forest',
    'Schwarzer See': 'Black Lake',
    Eulenturm: 'Owlery',
    Krankenflügel: 'Hospital Wing',
    'Drei Besen': 'Three Broomsticks',
    'Fast Kopfloser Nick': 'Nearly Headless Nick',
    'Der Fette Mönch': 'The Fat Friar',
    'Die Graue Dame': 'The Grey Lady',
    'Der Blutige Baron': 'The Bloody Baron',
    'Fette Dame': 'Fat Lady',
    'Zeitumkehrer': 'Time-Turner',
    'Unverzeihliche Flüche': 'Unforgivable Curses',
    'Imperius-Fluch': 'Imperius Curse',
    'Cruciatus-Fluch': 'Cruciatus Curse',
    Todesfluch: 'Killing Curse',
    'Avada Kedavra': 'Avada Kedavra',
    Alohomora: 'Alohomora',
    'Wingardium Leviosa': 'Wingardium Leviosa',
    Lumos: 'Lumos',
    Nox: 'Nox',
    Reparo: 'Reparo',
    Accio: 'Accio',
    Protego: 'Protego',
    'Patronuszauber': 'Patronus Charm',
    'Lichtlöschzauber': 'Wand-Extinguishing Charm',
    'Blumen-Heraufbeschwörung': 'Flower-Conjuring Spell',
    'Tür-Verschlusszauber (Colloportus)': 'Door-Sealing Spell (Colloportus)',
    'Tür-Verschlusszauber': 'Door-Sealing Spell',
    'Vergrößerungszauber': 'Engorgement Charm',
    'Wegstoßzauber': 'Knockback Jinx',
    'Kleiner Herausstoßzauber': 'Minor Ejection Spell',
    'Herausstoßzauber': 'Ejection Spell',
    'Aufwärtszauber': 'Ascending Charm',
    'Vogel-Heraufbeschwörungszauber': 'Bird-Conjuring Charm',
    'Enthüllungszauber': 'Revealing Charm',
    'Stimmverstärkungszauber': 'Amplifying Charm',
    'Schalldämpfungszauber': 'Muffling Charm',
    'Dämpfungszauber': 'Cushioning Charm',
    'Menschen-Enthüllungszauber': 'Human-presence Revealing Spell',
    'Verstärkter Schutzschild': 'Reinforced Shield Charm',
    'Portschlüssel-Zauber': 'Portkey Spell',
    'Ganzkörperklammerfluch': 'Full Body-Bind Curse',
    'Farbwechsel kleiner Gegenstände': 'Colour changes on small objects',
    'Formwechsel kleiner Gegenstände': 'Shape changes on small objects',
    'Rückführung misslungener Transfigurationen': 'Reversal of failed transfigurations',
    'Rückführung misslungener Transfigurationen': 'Reversal of failed transfigurations',
    'Sichere Zielbild-Übungen': 'Safe target-image exercises',
    'Kleine Objektverwandlung mit Bewegung': 'Small object transformation with movement',
    'Teekanne-zu-Schildkröte-Übungen': 'teapot-to-tortoise exercises',
    'Stabilitätskontrolle': 'stability control',
    'Stabile Objektverwandlung unter Timedruck': 'stable object transformation under time pressure',
    'Komplexe Objektverwandlung': 'complex object transformation',
    'Beschwörungsgrundlagen': 'conjuration fundamentals',
    'Schwere Fehlverwandlungen rückführen': 'reversing severe failed transformations',
    'Fortgeschrittene Beschwörung': 'advanced conjuration',
    'Vergrößerung und Rückführung': 'Enlargement and reversal',
    'Schrumpfung und Rückführung': 'Shrinking and reversal',
    'Teilverwandlungen erkennen': 'Recognising partial transformations',
    'Imperius Curse: innere Gegenwehr üben': 'Imperius Curse: practising inner resistance',
    'Haarsträubetrank': 'Hair-Raising Potion',
    'Aufpäppel-Trank': 'Pepperup Potion',
    'Schwell-Lösung': 'Swelling Solution',
    'Verwirrungsgebräu': 'Confusing Concoction',
    'Stärkungslösung': 'Strengthening Solution',
    'Gegengifte mittlerer Stärke': 'medium-strength antidotes',
    'Friedensgebräu': 'Draught of Peace',
    'Trank gegen Erschöpfung': 'Draught against exhaustion',
    'Giftige Dämpfe erkennen': 'recognising poisonous fumes',
    'Stärkungstrank': 'Strengthening Potion',
    'Regenerationstränke': 'regeneration potions',
    'Dickflüssiger goldener Trank': 'thick golden potion',
    'Meistertränke mit engen Temperaturfenstern': 'master-level potions with narrow temperature windows',
    'Fangzähnige Geranie': 'Fanged Geranium',
    'Einfache Heilkräuter': 'simple healing herbs',
    'Geplante Schutzzauber, Gegenflüche und Flüche in diesem Schuljahrgang (kann je nach Kursverlauf abweichen)': 'Planned protective spells, counter-curses and curses in this school year (may vary depending on course progress)',
    'Geplante Zaubersprüche in diesem Schuljahrgang (kann je nach Kursverlauf abweichen)': 'Planned spells in this school year (may vary depending on course progress)',
    'Vielsaft-Trank': 'Polyjuice Potion',
    Alraune: 'Mandrake',
    Hippogreif: 'Hippogriff',
    Knuddelmuff: 'Puffskein',
    Thestral: 'Thestral',
    Basilisk: 'Basilisk'
  };

  var phrasePairs = [
    ['Schülerinnen und Schüler', 'students'],
    ['Schülerinnen', 'students'],
    ['Schüler', 'students'],
    ['Schülerin oder des Schülers', 'student'],
    ['Schuljahrgang', 'school year'],
    ['Schuljahr', 'school year'],
    ['Wahlpflichtfächer', 'electives'],
    ['Wahlpflichtfach', 'elective'],
    ['Zusatzmodule', 'additional modules'],
    ['Exkursionen', 'excursions'],
    ['Schüleraustausche', 'student exchanges'],
    ['Ausflüge', 'excursions'],
    ['Unterrichtsfach', 'subject'],
    ['Unterricht', 'lessons'],
    ['Professoren-Kommentar', 'professor comment'],
    ['Professoren', 'professors'],
    ['Professor', 'Professor'],
    ['Lehrkraft', 'teacher'],
    ['Leitung', 'Leader'],
    ['Treffpunkt', 'meeting point'],
    ['Gemeinschaftsraum', 'common room'],
    ['Hauslehrkraft', 'head of house'],
    ['Schulleitung', 'school leadership'],
    ['Hauselfen', 'house-elves'],
    ['Hogwarts-Küche', 'Hogwarts kitchens'],
    ['Küche', 'kitchen'],
    ['Erdgeschoss', 'ground floor'],
    ['erster Stock', 'first floor'],
    ['zweiter Stock', 'second floor'],
    ['dritter Stock', 'third floor'],
    ['vierter Stock', 'fourth floor'],
    ['fünfter Stock', 'fifth floor'],
    ['sechster Stock', 'sixth floor'],
    ['siebter Stock', 'seventh floor'],
    ['Kellerflur', 'basement corridor'],
    ['Kerker', 'dungeons'],
    ['Turm', 'tower'],
    ['Westflügel', 'west wing'],
    ['Ostflügel', 'east wing'],
    ['Hauptflügel', 'main wing'],
    ['Glockenturm', 'Clock Tower'],
    ['Astronomieturm', 'Astronomy Tower'],
    ['Quidditchfeld', 'Quidditch pitch'],
    ['Zauberstab', 'wand'],
    ['Drei schwarze Arbeitsumhänge', 'Three plain black work robes'],
    ['Arbeitsumhänge', 'work robes'],
    ['Schwarzer Spitzhut', 'plain black pointed hat'],
    ['Spitzhut', 'pointed hat'],
    ['Winterumhang', 'winter cloak'],
    ['tagsüber', 'for daytime wear'],
    ['Ein Paar Schutzhandschuhe aus Drachenhaut or ähnlichem Material', 'One pair of protective gloves made of dragon hide or similar material'],
    ['Paar Schutzhandschuhe', 'pair of protective gloves'],
    ['Schutzhandschuhe', 'protective gloves'],
    ['Drachenhaut', 'dragon hide'],
    ['ähnlichem Material', 'similar material'],
    ['Namensschilder', 'name tags'],
    ['Namensetiketten', 'name labels'],
    ['Kleidungsstücke', 'clothes'],
    ['Schuluniform', 'school uniform'],
    ['Kessel aus Zinn', 'pewter cauldron'],
    ['Normgröße', 'standard size'],
    ['Glas- or Kristallphiolen', 'glass or crystal phials'],
    ['Glas- oder Kristallphiolen', 'glass or crystal phials'],
    ['Phiolen', 'phials'],
    ['Messingwaage', 'brass scales'],
    ['Teleskop', 'telescope'],
    ['Robuste Schultruhe', 'sturdy school trunk'],
    ['Schultruhe', 'school trunk'],
    ['Truhe', 'trunk'],
    ['Warme Nightwäsche', 'Warm nightclothes'],
    ['Nachtwäsche', 'nightclothes'],
    ['Unterwäsche', 'underwear'],
    ['Socken', 'socks'],
    ['Wäschebeutel', 'laundry bag'],
    ['Persönliche Pflegeartikel', 'personal toiletries'],
    ['Pflegeartikel', 'toiletries'],
    ['Kamm or Bürste', 'comb or brush'],
    ['Kamm', 'comb'],
    ['Bürste', 'brush'],
    ['Kleines Nähzeug', 'small sewing kit'],
    ['Nähzeug', 'sewing kit'],
    ['Vorhängeschlösser', 'padlocks'],
    ['Schreibmappe', 'writing folder'],
    ['Briefpapier', 'stationery'],
    ['Umschläge', 'envelopes'],
    ['Eule', 'owl'],
    ['Katze', 'cat'],
    ['Kröte', 'toad'],
    ['Bettwäsche', 'bed linen'],
    ['Decken', 'blankets'],
    ['Handtücher', 'towels'],
    ['Schlafsaalmöbel', 'dormitory furniture'],
    ['Grundbeleuchtung', 'basic lighting'],
    ['Kaminfeuer', 'fireplace'],
    ['Hausmöbel', 'house furniture'],
    ['Schulbesen', 'school brooms'],
    ['beaufsichtigtes Training', 'supervised training'],
    ['Verbrauchsgüter', 'consumables'],
    ['Pergament', 'parchment'],
    ['Tinte', 'ink'],
    ['Federkiele', 'quills'],
    ['Ersatzphiolen', 'spare phials'],
    ['Futter', 'food'],
    ['kleine Pflegeartikel', 'small care items'],
    ['Bibliothek', 'library'],
    ['Tierwesenhütte', 'Creatures hut'],
    ['wöchentlich', 'weekly'],
    ['vollständige', 'complete'],
    ['warmer Reiseumhang', 'warm travelling cloak'],
    ['Reiseumhang', 'travelling cloak'],
    ['wetterfester Reiseumhang', 'weatherproof travelling cloak'],
    ['wetterfester Umhang', 'weatherproof cloak'],
    ['warmer Umhang', 'warm cloak'],
    ['Ersatzumhang', 'spare cloak'],
    ['Schultasche', 'school bag'],
    ['robuste Tasche', 'sturdy bag'],
    ['Lernkartenbox', 'revision card box'],
    ['Karteikarten', 'index cards'],
    ['Fachregister', 'subject dividers'],
    ['Prüfungsplaner', 'exam planner'],
    ['Lernmappe', 'revision folder'],
    ['Notizmappe', 'notes folder'],
    ['Notizheft', 'notebook'],
    ['Zutatenmesser', 'ingredient knife'],
    ['Schutzbrille', 'safety goggles'],
    ['Ohrstöpsel', 'earplugs'],
    ['Gemeinschaftsräume', 'common rooms'],
    ['eigener Besen', 'own broom'],
    ['Sportumhang', 'sports cloak'],
    ['Thermoflasche', 'thermos flask'],
    ['Geldbörse', 'coin purse'],
    ['Einverständniserklärung', 'permission slip'],
    ['Zauberspruch', 'spell'],
    ['Zaubersprüche', 'spells'],
    ['Zaubertrank', 'potion'],
    ['Zaubertränke', 'potions'],
    ['Pflanzen', 'plants'],
    ['Tierwesen', 'creatures'],
    ['Flüche', 'curses'],
    ['Prüfungsform', 'assessment'],
    ['Theoretische Prüfung', 'written/theoretical exam'],
    ['Praktische Prüfung', 'practical exam'],
    ['Mündliche Prüfung', 'oral exam'],
    ['Pergamentabgaben', 'parchment submissions'],
    ['Vortrag', 'presentation'],
    ['Materialien', 'materials'],
    ['Literatur', 'literature'],
    ['Wird gestellt', 'provided'],
    ['Mitbringen', 'bring'],
    ['Grundausstattung', 'basic equipment'],
    ['Nachkauf und Versorgung', 'restock and care'],
    ['Wohnen - bitte mitbringen', 'living - bring'],
    ['Wohnen - wird gestellt', 'living - provided'],
    ['Buchtitel', 'book title'],
    ['Autor/in', 'author'],
    ['Über das Buch', 'about the book'],
    ['Über den Autor/in', 'about the author'],
    ['Hausgeist', 'house ghost'],
    ['Gründer', 'founder'],
    ['Zugang', 'entrance'],
    ['Nachgesagte Eigenschaften', 'commonly associated traits'],
    ['Beschreibung', 'description'],
    ['Ablauf', 'programme'],
    ['Datum / Zeitraum', 'date / period'],
    ['Kosten', 'cost'],
    ['Galleonen', 'Galleons'],
    ['Sondertermin', 'special date'],
    ['Sondertermine', 'special dates'],
    ['Angemeldete', 'registered'],
    ['Benötigte', 'required'],
    ['Ausrüstung', 'equipment'],
    ['Hintergrundmusik', 'background music'],
    ['stummschalten', 'mute'],
    ['einschalten', 'turn on'],
    ['Fenster schließen', 'close window'],
    ['Nach oben scrollen', 'scroll to top'],
    ['Name der', 'name of the'],
    ['Haus wählen', 'choose house'],
    ['Curriculum aufrufen', 'open curriculum'],
    ['Curriculum kann erstellt werden', 'curriculum can be created'],
    ['Eingaben ändern', 'change entries'],
    ['Als Muggeldatei speichern', 'save as Muggle file'],
    ['An Muggeldrucker senden', 'send to Muggle printer'],
    ['Als Muggelplan tarnen', 'disguise as Muggle timetable'],
    ['Tarnzauber für Muggeltechnik', 'Concealment charm for Muggle technology'],
    ['Muggelplan bearbeiten', 'edit Muggle timetable'],
    ['Muggelmodus', 'Muggle mode'],
    ['Muggeldatei', 'Muggle file'],
    ['Muggeldrucker', 'Muggle printer'],
    ['Muggel', 'Muggle'],
    ['ZAG', 'O.W.L.'],
    ['UTZ', 'N.E.W.T.'],
    ['von ', 'by '],
    [' und ', ' and '],
    [' oder ', ' or '],
    [' mit ', ' with '],
    [' ohne ', ' without '],
    [' im ', ' in the '],
    [' in der ', ' in the '],
    [' in den ', ' in the '],
    [' am ', ' on the '],
    [' auf dem ', ' on the '],
    [' auf der ', ' on the '],
    [' für ', ' for '],
    [' zu ', ' to '],
    [' der ', ' the '],
    [' die ', ' the '],
    [' das ', ' the '],
    ['des ', 'of the '],
    ['den ', 'the '],
    ['dem ', 'the '],
    ['ein ', 'a '],
    ['eine ', 'a '],
    ['einen ', 'a '],
    ['einem ', 'a '],
    ['Keine ', 'No '],
    ['kein ', 'no '],
    ['nicht ', 'not '],
    ['immer ', 'always '],
    ['wöchentlich', 'weekly'],
    ['Wöchentliches', 'Weekly'],
    ['gemeinsam', 'together'],
    ['gemeinsames', 'shared'],
    ['magisch', 'magical'],
    ['Magische', 'Magical'],
    ['Magischer', 'Magical'],
    ['Britisches', 'British'],
    ['Internationales', 'International']
    , ['Januar', 'January']
    , ['Februar', 'February']
    , ['März', 'March']
    , ['April', 'April']
    , ['Mai', 'May']
    , ['Juni', 'June']
    , ['Juli', 'July']
    , ['August', 'August']
    , ['September', 'September']
    , ['Oktober', 'October']
    , ['November', 'November']
    , ['Dezember', 'December']
  ];

  phrasePairs.sort(function (a, b) { return b[0].length - a[0].length; });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  function localize(content, language) {
    var lang = language === 'en' ? 'en' : 'de';
    var localized = clone(content);
    localized.language = lang;
    if (lang === 'de') {
      window.HOGWARTS_I18N_MISSING = [];
      return localized;
    }
    translateTree(localized, []);
    translateStudentSupplyGroupKeys(localized);
    merge(localized.ui, englishUi);
    applyEnglishOverrides(localized, content);
    sanitizeEnglishContent(localized);
    var missing = collectLikelyGerman(localized).slice(0, 80);
    window.HOGWARTS_I18N_MISSING = missing;
    if (missing.length && window.console) console.warn(englishUi.language.missingWarning, missing);
    return localized;
  }

  function translateTree(value, path) {
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = translateTree(item, path.concat(index)); });
      return value;
    }
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = translateTree(value[key], path.concat(key)); });
      return value;
    }
    if (typeof value !== 'string' || shouldSkip(path, value)) return value;
    return translateText(value);
  }

  function shouldSkip(path, value) {
    var key = String(path[path.length - 1] || '');
    if (/^(id|src|fallback|crest|icon|color|repoAssetBase|href)$/i.test(key)) return true;
    if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(value)) return true;
    if (/^(?:https?:\/\/|data:|[\w-]+\.(?:png|jpg|jpeg|gif|svg|mp3|ttf|pdf))/i.test(value)) return true;
    if (/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(value)) return true;
    return false;
  }

  function translateText(text) {
    if (exact[text]) return exact[text];
    var result = text;
    result = result.replace(/(\d+)\.\s*Schuljahrgang/g, function (_, number) { return ordinal(number) + ' school year'; });
    result = result.replace(/Ab dem (\w+) Jahr/g, function (_, word) { return 'From the ' + translateOrdinalWord(word) + ' year'; });
    phrasePairs.forEach(function (pair) {
      result = result.split(pair[0]).join(pair[1]);
    });
    Object.keys(exact).sort(function (a, b) { return b.length - a.length; }).forEach(function (key) {
      result = result.split(key).join(exact[key]);
    });
    return cleanup(result);
  }

  function cleanup(text) {
    return text
      .replace(/\s+,/g, ',')
      .replace(/\s+\./g, '.')
      .replace(/\s+:/g, ':')
      .replace(/ ,/g, ',')
      .replace(/\bthe the\b/gi, 'the')
      .replace(/\ba a\b/gi, 'a')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function ordinal(value) {
    var number = parseInt(value, 10);
    var suffix = number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th';
    return number + suffix;
  }

  function translateOrdinalWord(word) {
    var map = { ersten: 'first', zweiten: 'second', dritten: 'third', vierten: 'fourth', fünften: 'fifth', sechsten: 'sixth', siebten: 'seventh' };
    return map[word] || word;
  }

  function applyEnglishOverrides(data, source) {
    data.formTexts = {
      calm: 'The parchment remembers your selection in this browser. You can return at any time and rearrange your curriculum.',
      conflict: 'Time blocks with multiple appointments are marked red. A Time-Turner would at least be practical.'
    };
    data.studentSuppliesByYear = {
      '1': [
        'Basic equipment: three plain black work robes, a plain pointed black hat, a winter cloak, a wand, one size 2 pewter cauldron, glass or crystal phials, brass scales, a telescope, quills, ink, parchment and a trunk with name label',
        'Lessons: dragon-hide gloves for Herbology and Potions, sturdy shoes for the greenhouses, star-chart folder, homework notebook and a simple ingredient box',
        'Living at Hogwarts: warm nightclothes, spare socks, laundry bag, personal toiletries, sewing kit, alarm clock and small padlocks for the trunk',
        'Optional: owl, cat or toad, stationery, family photograph, weatherproof cloak for the lake crossing and a small sweet reserve for long study evenings'
      ],
      '2': [
        'Basic equipment: school uniform, winter cloak, wand, size 2 pewter cauldron, glass or crystal phials, brass scales, telescope, quills, ink, parchment and trunk',
        'Lessons: dragon-hide gloves, additional phials, ingredient knife, writing folder, spare quills and subject dividers for the first longer essays',
        'Living at Hogwarts: warm travelling cloak, toiletries, sewing kit, alarm clock, small lantern for permitted evening routes and name labels for books',
        'Optional: own broom, extra scarf in house colours, repair tape for school supplies and a small snack tin for revision evenings'
      ],
      '3': [
        'Basic equipment: complete school uniform, wand, cauldron, phials, brass scales, telescope, quills, ink, parchment and trunk',
        'Lessons: dragon-hide gloves, sturdy shoes for outdoor lessons, notebook for creature observation, safety goggles and plant labels',
        'Living and travel: Hogsmeade permission form, weatherproof travelling cloak, small coin purse, folding shopping bag and writing paper',
        'Optional: own broom, warm seat cushion for Quidditch stands, thermos flask, portable notebook for Hogsmeade and an additional scarf in house colours'
      ],
      '4': [
        'Basic equipment: school uniform, wand, cauldron, phials, brass scales, telescope, quills, ink, parchment and trunk',
        'Lessons: dragon-hide gloves, sturdy shoes, safety goggles, revision-card box, weatherproof bag and clearly labelled sample phials',
        'Living at Hogwarts: spare cloak, personal toiletries, laundry bag, subject dividers and a second ink bottle for longer parchment submissions',
        'Optional: own broom, extra sports cloak, earplugs for common rooms and a small repair kit for quills'
      ],
      '5': [
        'Basic equipment: school uniform, wand, cauldron, phials, brass scales, telescope, quills, ink, parchment and trunk',
        'Exam preparation: O.W.L. revision folder, index cards, subject dividers, exam planner, spare quills, second ink bottle and a clean set of laboratory phials',
        'Living and study: earplugs for revision periods, warm cloak, sturdy bag for library books and labelled folders for electives',
        'Optional: own broom, personal lap desk, quiet alarm clock, good-luck charm without magical effect and a small supply of calming tea'
      ],
      '6': [
        'Basic equipment: school uniform, wand, cauldron, phials, brass scales, telescope, quills, ink, parchment and trunk',
        'N.E.W.T. preparation: N.E.W.T. notes folder, subject dividers, Apparition notebook, expanded ingredient box, safety goggles and additional phials for longer brewing attempts',
        'Living and travel: warm travelling cloak, sturdy bag for Hogsmeade and excursions, personal document folder and coin purse',
        'Optional: own broom, compact field notebook, spare gloves, book straps and a small reserve of parchment for advanced essays'
      ],
      '7': [
        'Basic equipment: school uniform, wand, cauldron, phials, brass scales, telescope, quills, ink, parchment and trunk',
        'Final year: N.E.W.T. exam folder, subject dividers, graduation folder, spare cloak, clean laboratory phials, source folder and personal weekly planner',
        'Living and leaving Hogwarts: document folder, travel cloak, laundry bag, coin purse, neatly labelled books and spare writing supplies',
        'Optional: own broom, fine writing quill for applications, additional warm cloak and personal library notes for later training'
      ]
    };
    data.professorCommentAdditions = {};
    data.moduleProfessorCommentAdditions = {};
    data.professorComments = {
      default: 'I expect this subject to be treated seriously. You will not merely hear what magic can do, you will show that you can think before reaching for a wand. Carelessness is usually louder than ignorance, and far less forgivable.',
      astronomy: 'Professor Sinistra: The sky is not unfriendly, only exacting. I arrange Astronomy so that observation, calculation and patience take turns, because a star chart copied without understanding is merely decoration. In this year you will learn to read the heavens carefully enough that the night stops looking like a dark ceiling and begins to behave like a map.',
      charms: 'Professor Flitwick: Charms is delightful because one neat little spell can change an entire afternoon. I like to alternate clear theory with cheerful practice, so you understand pronunciation before you begin waving your wand about. In this year our focus is clean wand movement, precise incantation and the confidence to repeat a spell until it becomes elegant.',
      defence: 'Professor Snape: Defence Against the Dark Arts is not a stage for heroic grimaces. I conduct lessons with theory, controlled demonstration and exacting practical work, because the Dark Arts do not pause while you search for applause. In this year you will learn recognition, restraint and survival, which are considerably more useful than noise.',
      herbology: 'Professor Sprout: Herbology is wonderful, provided you remember that plants have tempers, habits and occasionally teeth. My lessons move between explanation, greenhouse work and a fair amount of soil under the fingernails. This year we focus on safe handling, observation and the fact that a plant can be useful and still be deeply rude.',
      history: 'Professor Binns: History of Magic, when considered at sufficient length and without the regrettable modern impatience for interruption, reveals itself as the only sensible foundation for understanding events that younger minds mistakenly describe as sudden. My lessons proceed chronologically, with necessary digressions, because dates, decrees and goblin rebellions cannot be reduced to colourful anecdotes. In this year we shall examine the causes, consequences and documentary traces of magical society, including several matters I had almost reached in 1892 before the bell rang.',
      potions: 'Professor Slughorn: Potions, my dears, is an art for steady hands, good noses and a little instinct. I teach by letting you see the theory, smell the mistake and then brew the thing properly. In this year we focus on preparation, timing and the difference between a potion that merely works and one that makes people remember your name.',
      transfiguration: 'Professor McGonagall: Transfiguration does not tolerate half a thought. I structure lessons so that theory, demonstration and disciplined practice support one another, and I expect every student to know exactly what they are attempting before they attempt it. This year the focus is control, form and responsibility, because a careless transformation is not charming, it is a problem.',
      flying: 'Madam Hooch: Flying is not for impressing your friends before you can stop properly. I teach with drills, correction and repetition until your broom obeys before your mouth starts boasting. This year we focus on mounting, hovering, turning, landing and learning that the ground is less forgiving than I am.',
      runes: 'Professor Babbling: Ancient Runes rewards no one who merely copies pretty marks. I organise lessons around signs, sound values, context and translation work, because a single careless stroke can change a meaning entirely. This year you will learn to slow down, compare variants and treat old writing as a living system rather than a decorative border.',
      'ancient-runes': 'Professor Babbling: Ancient Runes rewards no one who merely copies pretty marks. I organise lessons around signs, sound values, context and translation work, because a single careless stroke can change a meaning entirely. This year you will learn to slow down, compare variants and treat old writing as a living system rather than a decorative border.',
      arithmancy: 'Professor Vector: Arithmancy is pleasing because excuses become visible very quickly. I teach with tables, proofs and repeated checking, then ask you to explain why your result makes sense. This year we focus on numerical values, patterns and disciplined prediction, and yes, I will notice if you guess.',
      creatures: 'Hagrid: Care of Magical Creatures is special because you don’t really understand a creature until you’ve seen how it eats, moves and decides whether it likes you. I teach with close observation, careful distance and a bit of courage, but never with cruelty. This year we start with safer creatures and build towards harder ones, including visits to the magical reserve near Hogwarts where dangerous beasts can be studied properly without anyone poking them.',
      divination: 'Professor Trelawney: Divination is a misted window, my dears, and only the Inner Eye may decide when to clear it. My lessons drift between symbols, dreams, tea leaves and the tremor of fate itself, though some students insist on calling that a syllabus. This year we listen for omens in small things, and if your cup appears ordinary, perhaps it is your soul that is being discreet.',
      'muggle-studies': 'Professor Burbage: Muggle Studies is not a joke subject, although some students arrive determined to make it one. I teach through objects, habits, institutions and patient comparison, because understanding Muggles requires curiosity rather than condescension. This year we focus on everyday technology, social customs and the strange brilliance of people who live without wands.',
      apparition: 'Wilkie Twycross: Apparition is simple in principle and unforgiving in practice. I teach Destination, Determination and Deliberation until you can hear the three Ds in your sleep, because splinching is a very poor study aid. This year you practise control, calm and legal responsibility before anyone is permitted to vanish with confidence.',
      alchemy: 'Nicolas Flamel: Alchemy is the long conversation between matter, patience and desire. I teach it as a chain of symbols, substances and consequences, because transformation without wisdom is merely appetite wearing a clever hat. This year you study correspondences, vessels and the discipline of stopping before success becomes dangerous.',
      wandmaking: 'Garrick Ollivander: Wandlore is exact, old and rather more personal than most subjects admit. I teach through wood, core, balance and response, because the wand is not a tool in the crude Muggle sense. This year you will learn why a wand chooses, resists and remembers, and why careless hands rarely receive honest answers.',
      dragonology: 'Charlie Weasley: Dragon studies is brilliant, but it rewards the student who keeps both enthusiasm and eyebrows. I teach with records, observation, reserve rules and controlled distance, because courage is not the same as walking into flame. This year we focus on species, behaviour, fire, territory and the calm habits that keep dragon work possible.',
      'animagus-study': 'Professor McGonagall: Animagus study is not a parlour trick and certainly not a shortcut to attention. I teach it through law, identity, discipline and transformation theory, because the process demands more honesty than most students expect. This year the focus is understanding the bond between self and form before anyone mistakes ambition for readiness.'
    };
    data.moduleProfessorComments = {
      'charms-club': 'Professor Flitwick: In Charms Club we take the neatness of classwork and give it room to sparkle. I expect cheerful discipline, clear pronunciation and a willingness to practise the same tiny motion until it sings. Mistakes are welcome when they are honest, but explosions should remain modest.',
      dance: 'The dance leader keeps the room lively, but rhythm still requires manners. Sessions alternate steps, partner work and small performances, so no one can hide behind a cloak forever. The aim is confidence, not courtly perfection.',
      'slug-club': 'Professor Slughorn: The Slug Club is for promising people to meet other promising people. I host it with conversation, supper and a little careful matchmaking of talents. Bring charm, curiosity and enough sense not to waste an introduction.',
      'runes-club': 'Professor Babbling: In the Ancient Runes Club we look beyond the required translations. I expect patient eyes, tidy notes and respect for damaged sources. If you enjoy finding the one mark everyone else missed, you will be comfortable here.',
      'potions-circle': 'Professor Snape: The Potions Circle is not a social hour with cauldrons. I expect precision, silence when appropriate and ingredients prepared before I have to notice them. Those who cannot follow instructions may learn a great deal from cleaning benches.',
      'hogsmeade-tutoring': 'Professor McGonagall: Tutoring in Hogsmeade exists to help, not to provide an excuse for wandering. I expect punctuality, prepared questions and older students who remember that patience is part of competence. A useful explanation is worth more than showing off.',
      'event-group': 'Professor Flitwick: The Event Group turns school ideas into actual evenings with lights, lists and surprisingly many chairs. I guide planning, charm work and safety checks so celebrations feel effortless to everyone else. Creativity is encouraged, but so is finishing the setup before guests arrive.',
      'frog-choir': 'Professor Flitwick: Choir work demands listening as much as singing. We rehearse pitch, timing and stage presence, with occasional amphibian unpredictability. If everyone breathes together, the music usually forgives quite a lot.',
      'creatures-club': 'Hagrid: The Magical Creatures Club is for students who want to understand creatures properly, not just point at the impressive ones. We talk feeding, tracks, mood and safe distance. If you’re kind, careful and not too squeamish, you’ll do fine.',
      'house-evening-gryffindor': 'Professor McGonagall: The Gryffindor house meeting is a place for announcements, concerns and the occasional reminder that courage is not the same as rule-breaking. I expect honesty and attention. Celebration is welcome when it has been earned.',
      'house-evening-hufflepuff': 'Professor Sprout: The Hufflepuff house meeting keeps everyone rooted. We talk through news, shared duties and the small kindnesses that keep a common room warm. Bring patience, and preferably do not bring mud from the greenhouses.',
      'house-evening-ravenclaw': 'Professor Flitwick: The Ravenclaw house meeting is for notices, questions and ideas that may become much larger than expected. I encourage curiosity, but I also appreciate conclusions. A brilliant thought is even better when someone writes it down.',
      'house-evening-slytherin': 'Professor Snape: The Slytherin house meeting is for matters that concern the house and its reputation. I expect attention, restraint and the ability to understand consequences before they become public. Ambition is useful only when properly directed.',
      prefects: 'Professor Dumbledore: The Hogwarts meeting gives prefects and Head Students a regular voice in the school’s present and future. I expect candour, kindness and the courage to raise problems before they become traditions. Student representatives have voting rights, and their concerns are heard by the school board.',
      'hogsmeade-visit': 'Professor McGonagall: Hogsmeade visits are privileges with paperwork attached. I expect students to know the meeting point, respect the permitted areas and return on time. Enjoy yourselves, but do not confuse freedom with invisibility.',
      'diagon-alley': 'Professor McGonagall: The Diagon Alley excursion helps new students begin school prepared rather than bewildered. Teachers may offer buying recommendations, and students can meet one another before the first feast. I expect lists, sensible purchases and no experimental sweets before travel.',
      mournvale: 'Professor Sprout: Mournvale is a marvellous place to see plants too delicate or too troublesome for ordinary school benches. We observe, sketch and ask before touching anything. A respectful student leaves with knowledge, not stolen cuttings.',
      'aurum-kettleworks': 'Professor Slughorn: The Cauldronworks show that fine brewing begins before the first ingredient enters the pot. We look at metal, heat and craftsmanship, all of which matter more than impatient students realise. A good cauldron can save a potion and sometimes a reputation.',
      'astra-noctis': 'Professor Sinistra: The observatory rewards quiet students. We compare instruments, record sky conditions and learn why accuracy improves after everyone stops whispering. The stars have waited centuries, so they will not be rushed for your notes.',
      'ministry-uk': 'Professor McGonagall: The Ministry visit is meant to make careers real. Students should observe departments, ask prepared questions and notice how much work keeps magical society functioning. Politeness is not optional in government buildings.',
      macusa: 'Professor McGonagall: International exchange requires attention to law, custom and courtesy. At MACUSA, students compare systems rather than declaring one superior after ten minutes. A good visitor listens first.',
      beauxbatons: 'Professor McGonagall: Beauxbatons offers a valuable comparison in discipline, presentation and school culture. I expect Hogwarts students to be respectful guests and careful observers. You represent the school before you represent your house.',
      durmstrang: 'Professor McGonagall: Durmstrang is not an invitation to imitate everything you see. Students observe curriculum, history and defensive discipline under supervision. Curiosity is welcome, recklessness is not.',
      ilvermorny: 'Professor McGonagall: Ilvermorny gives students a wider view of magical education. I expect thoughtful comparison, not tourist chatter. The best exchange notes often reveal as much about Hogwarts as about the school visited.'
    };
    data.subjectFocusTexts = {
      default: ['core vocabulary, safety rules and reliable homework habits', 'practical application, written reasoning and careful revision', 'exam-ready technique, independent judgement and controlled magical work'],
      astronomy: ['star charts, moon phases and disciplined telescope notes', 'planetary movement, comet observation and calculation errors', 'exam-ready observation logs and complex celestial events'],
      charms: ['clean pronunciation, basic wand movement and everyday charms', 'precise movement sequences, combination charms and practical use', 'non-verbal beginnings, wand agility and exam-ready demonstrations'],
      defence: ['recognition, defensive posture and safe countermeasures', 'Shield Charms, counter-curses and controlled duel situations', 'advanced recognition, tactical restraint and secure practical defence'],
      herbology: ['safe care of magical plants', 'Mandrake varieties, biting vines and protective greenhouse clothing', 'rare healing plants, poison effects and exam-ready care logs'],
      history: ['important wizarding laws and early goblin conflicts', 'international conflicts, source work and historical essays', 'complex causes, long-term consequences and precise historical argument'],
      potions: ['basic recipes, cutting technique and reading colour changes', 'antidotes, elixirs and more dangerous ingredient sequences', 'complex brewing processes, analysis errors and exam-ready laboratory records'],
      transfiguration: ['simple object transformations and stable target images', 'animal transformation, reversal and theoretical limits', 'advanced form stability, ethics and cleanly argued Transfiguration'],
      flying: ['mounting, hovering, landing and basic broom safety', 'turning, acceleration, team signals and controlled recovery', 'performance analysis, endurance and professional match overview'],
      runes: ['basic rune forms, sound values and tidy copying', 'translation patterns, inscription context and comparison work', 'complex translation, historical inscriptions and magical effect'],
      'ancient-runes': ['basic rune forms, sound values and tidy copying', 'translation patterns, inscription context and comparison work', 'complex translation, historical inscriptions and magical effect'],
      arithmancy: ['number values, basic tables and checking routines', 'probabilities, name values and careful interpretation', 'complex calculations, probabilities and justified predictions'],
      creatures: ['Puffskeins and other safer creatures, Hippogriff rules, feeding and safe approach', 'habitat, handling, signs of stress and observation visits to the reserve', 'dangerous creatures, field protocols and respectful magizoological study'],
      divination: ['tea leaves, dreams and symbolic vocabulary', 'crystal work, palmistry and patterns in repeated signs', 'complex readings, uncertainty and responsible interpretation'],
      'muggle-studies': ['Muggle household objects, electricity and everyday habits', 'institutions, transport and social rules', 'comparative essays, technology and respectful observation'],
      apparition: ['Destination, Determination, Deliberation and safety rules', 'target circles, concentration and splinching prevention', 'legal responsibility, test routines and controlled travel'],
      alchemy: ['symbols, vessels and basic correspondences', 'substance chains, reagent logic and controlled reactions', 'transmutation theory, limits and long-form laboratory notes'],
      wandmaking: ['wand woods, cores and first resonance tests', 'balance, flexibility and recorded reactions', 'matching theory, repair ethics and advanced wandlore'],
      dragonology: ['dragon species, reserve rules and observation distance', 'fire behaviour, territory and protective clothing', 'field records, emergency signals and advanced dragon behaviour'],
      'animagus-study': ['Animagus law, identity theory and registration duties', 'form symbolism, transformation limits and ethical questions', 'self-discipline, readiness and advanced transformation theory'],
      'pro-quidditch': ['fitness, position drills and match awareness', 'tactical boards, foul analysis and endurance', 'professional preparation, pressure control and team leadership']
    };
    applyEnglishSubjectOverrides(data);
    applyEnglishActivityOverrides(data);
    applyEnglishCurriculumTopics(data, source);
    data.studentSupplyGroupsByYear = {};
    [1, 2, 3, 4, 5, 6, 7].forEach(function (year) {
      data.studentSupplyGroupsByYear[String(year)] = {
        'Basic equipment': [
          year === 1 ? 'Three plain black work robes' : 'Complete school uniform, pointed hat and winter cloak',
          'Wand',
          'Pewter cauldron, standard size 2',
          'Glass or crystal phials',
          'Telescope',
          'Brass scales',
          'Dragon-hide protective gloves',
          'Quills, ink and parchment',
          'Sturdy school trunk',
          'Name labels for clothes and books'
        ],
        'Living - bring': [
          'Nightclothes, underwear, socks and laundry bag',
          'Personal toiletries, comb or brush and small sewing kit',
          'Weatherproof cloak and sturdy shoes for outdoor lessons',
          year >= 3 ? 'Hogsmeade permission slip and small coin purse' : 'Stationery and envelopes',
          year >= 5 ? 'Revision folder, index cards and exam planner' : 'Notebook and writing folder',
          'Optional: owl, cat or toad',
          year >= 2 ? 'Optional: own broom for approved private practice' : 'Optional: family photograph or small keepsake'
        ],
        'Living - provided': [
          'Bed, mattress, bed linen and blankets',
          'Dormitory furniture and common-room seating',
          'House common-room lighting and fireplace',
          'School brooms for lessons and supervised training',
          'Basic protective equipment when announced by the teacher'
        ],
        'Restock and care': [
          'Consumables such as parchment, ink, quills and spare phials can be bought through the library, school shop or Hogsmeade depending on permission.',
          'Food and small care items for owls, cats or toads can be collected weekly from the Owlery, the Creatures hut or the responsible house staff.',
          'Broom-care sets, replacement straps and simple repair kits are issued by Madam Hooch or ordered through approved channels.'
        ]
      };
    });
    data.bookDetails = {};
    data.authorDetails = {};
    data.literatureAuthors = {
      astronomy: 'Professor Aurora Sinistra',
      charms: 'Miranda Goshawk',
      defence: 'Quentin Trimble',
      herbology: 'Phyllida Spore',
      history: 'Bathilda Bagshot',
      potions: { 6: 'Libatius Borage', 7: 'Libatius Borage', default: 'Arsenius Jigger' },
      transfiguration: 'Emeric Switch',
      flying: 'Kennilworthy Whisp',
      'ancient-runes': 'Eadric Thorne',
      arithmancy: 'Bridget Wenlock',
      'care-creatures': { 3: 'Edwardus Lima', default: 'Newt Scamander' },
      divination: 'Cassandra Vablatsky',
      'muggle-studies': 'Wilhelm Wigworthy',
      apparition: 'Wilkie Twycross',
      alchemy: 'Nicolas Flamel',
      'advanced-potions': 'Libatius Borage',
      'advanced-charms': 'Miranda Goshawk',
      'advanced-transfiguration': 'Emeric Switch',
      'advanced-creatures': 'Newt Scamander',
      'advanced-defence': 'Quentin Trimble',
      'advanced-herbology': 'Phyllida Spore',
      'advanced-history': 'Bathilda Bagshot',
      wandmaking: 'Garrick Ollivander',
      'pro-quidditch': 'Kennilworthy Whisp',
      dragonology: 'Charlie Weasley',
      'animagus-study': 'Minerva McGonagall'
    };
    sanitizeCurriculumTopics(data);
    data.mealInfo = {
      breakfast: { name: 'Breakfast', teacher: '', room: 'Great Hall, ground floor', color: '#F2C580', info: 'Breakfast in the Great Hall is fixed in the timetable. The house-elves prepare it in the Hogwarts kitchens. It is the right moment to gather energy, read the morning post and check the noticeboard before lessons begin.', materials: [] },
      lunch: { name: 'Lunch', teacher: '', room: 'Great Hall, ground floor', color: '#F2C580', info: 'At lunch, the houses gather between morning lessons and the afternoon blocks. Food remains available a little longer for students whose classes run late. Staff and professors ask that only urgent matters be raised during the lunch break.', materials: [] },
      dinner: { name: 'Dinner', teacher: '', room: 'Great Hall, ground floor', color: '#F2C580', info: 'Dinner closes the regular lesson day. There are light dishes as well as a warm meal, but the Great Hall should not become a homework room whenever that can be avoided. Clubs, training, tutoring and occasional night-time Astronomy begin afterwards.', materials: [] }
    };
    if (data.ui && data.ui.trip) {
      data.ui.trip.details = {
        'hogsmeade-visit': ['This visit is the classic first step beyond the castle while supervision remains manageable. Hogsmeade is close enough for a day trip and still full of things worth noticing.', 'You report to the meeting point, visit the permitted shops, keep a short observation note on magical trade and return together to the check-in point at the Three Broomsticks.', 'Permission slip, weatherproof cloak and a small bag of Galleons.'],
        'diagon-alley': ['Diagon Alley is shopping, wonder and a careful first step into the magical world. New Hogwarts students can tick the excursion on their enrolment form before term begins.', 'You visit bookshops, buy ingredients and compare supplies for your school year. It is also a good chance to meet other students and ask accompanying teachers for buying recommendations.', 'Shopping list and Galleon pouch.'],
        ashpeak: ['The Ashpeak Dragon Observation Plateau is not an adventure holiday, but a strictly secured observation excursion. Its value lies in being close enough to learn and far enough to keep every limb.', 'You work with binoculars and strict safety distances, record behaviour, flight direction and territory boundaries, and discuss why dragon studies require more patience than heroics.', 'Dragon-hide gloves, binoculars and fireproof cloak.'],
        mournvale: ['The Magical Gardens of Mournvale show plants that can rarely be kept in an ordinary greenhouse.', 'You keep a plant log, sketch two specimens, listen to the gardeners’ safety briefing and only collect samples where it is expressly permitted.', 'Plant guide, gloves and sketchbook.'],
        'aurum-kettleworks': ['Aurum Cauldronworks is ideal for anyone who wants to know why a good cauldron is more than a round pot. You see how magical metal, heat control and inspection seals work together.', 'You observe casting, polishing and safety testing, compare different cauldron types and prepare a short recommendation for school use.', 'Safety goggles, note parchment and closed shoes.'],
        'astra-noctis': ['The Astra Noctis Observatory is a quiet excursion for patient eyes. The facility allows observations that would only be possible from the Astronomy Tower in perfect weather.', 'You align telescopes, keep a shared observation log and discuss which constellations truly matter for spells, potions or omens.', 'Star chart, telescope attachment and warm cloak.'],
        'ministry-uk': ['The visit to the British Ministry of Magic is aimed at older school years who are beginning to think about careers. It shows how laws, secrecy and everyday magic are administered.', 'You visit selected departments, ask prepared questions and write a short report on which profession surprised you most.', 'Identification form, dress robes and question sheet.'],
        macusa: ['The exchange with the Magical Congress of the United States of America looks beyond British habits. Differences in law, secrecy and magical schooling become especially clear here.', 'You attend an introduction, compare case studies of international wizarding law and speak with exchange officers.', 'Passport for magical travel, exchange form and notebook.'],
        'st-mungos': ['St Mungo’s shows what serious healing magic looks like when it is more than a clean bandage. The visit is quiet, respectful and expressly not a chance to experiment.', 'You visit approved wards, observe emergency routines and discuss with staff which school subjects are especially important for healing professions.', 'Healing folder, clean gloves and prepared questions.'],
        beauxbatons: ['The exchange with Beauxbatons is more polite than many Hogwarts lessons, but not necessarily easier. Teaching style, etiquette and the public display of magical talent are especially interesting.', 'You attend lessons, join a cultural evening and keep a comparison log on house culture, exams and everyday school life.', 'Exchange parchment, dress robes and French dictionary.'],
        durmstrang: ['The visit to Durmstrang Institute is intended for older students with steady conduct. The school places great value on discipline, history and controlled defensive magic.', 'You follow a supervised tour, discuss lesson priorities and compare defensive exercises without unauthorised demonstrations.', 'Winter cloak, exchange parchment and defensive-magic notes.'],
        ilvermorny: ['The exchange with Ilvermorny broadens the view of house traditions and magical identity. Comparing it with Hogwarts makes familiar school customs visible in a new way.', 'You attend classes, speak with American student partners and write a report on differences in rituals, subjects and school organisation.', 'Exchange parchment, travel talisman and notebook.']
      };
    }
    data.tripLeaders = merge(data.tripLeaders || {}, {
      beauxbatons: 'Professor McGonagall and the International Exchange Office',
      durmstrang: 'Professor McGonagall and the International Exchange Office',
      ilvermorny: 'Professor McGonagall and the International Exchange Office',
      macusa: 'Professor McGonagall and the International Exchange Office'
    });
    var specialByDate = {
      '1. September': 'First day of school and Sorting Feast',
      '12. September': 'Quidditch try-outs',
      '18. September': 'Election of Head Students',
      '18. October': 'Third-year Hogsmeade excursion',
      '31. October': 'Halloween Feast',
      '5. November': 'Career advice with Professor McGonagall',
      '20. December': 'Beginning of the Winter Feast',
      '21. December - 5. January': 'Christmas holidays',
      '12. December': 'O.W.L. mid-year assessment',
      '13. December': 'N.E.W.T. mid-year assessment',
      '28. March - 12. April': 'Easter holidays',
      '21. April': 'Apparition test',
      '30. May': 'Quidditch final',
      '8. June - 19. June': 'O.W.L. examinations',
      '15. June - 26. June': 'N.E.W.T. examinations',
      '27. June': 'Hogwarts leaving feast',
      '28. June': 'Closing ceremony and House Cup',
      '29. June - 31. August': 'Summer holidays'
    };
    (data.specialDates || []).forEach(function (item) {
      if (specialByDate[item.date]) item.name = specialByDate[item.date];
    });
    data.specialDetails = {
      default: { leader: 'Hogwarts school leadership', place: 'Noticeboards and central areas of Hogwarts', info: 'This special date is coordinated by the school office and additionally announced by the heads of house. Watch the noticeboards, deadlines and instructions from your escorts.' },
      'First day of school and Sorting Feast': { leader: 'Hogwarts school leadership', place: 'Great Hall, ground floor', info: 'The school year begins with arrival, house rules, the feast and the first official announcements from the Headmaster. New students follow the prefects after leaving the boats or carriages, while older years go straight to the Great Hall. Keep your luggage tags until the house-elves have taken trunks to the dormitories.' },
      'Quidditch try-outs': { leader: 'Madam Rolanda Hooch', place: 'Quidditch pitch', info: 'Try-outs decide who trains and plays for each house this season. Madam Hooch looks not only at speed, but also at safe flying, teamwork and reactions under pressure. Candidates arrive punctually in sports clothing and accept the captains’ decisions without drama.' },
      'Election of Head Students': { leader: 'Hogwarts school leadership', place: 'Noticeboard and Great Hall', info: 'The election of Head Students is prepared by the heads of house and confirmed by the school leadership. Candidates should be reliable, discreet and able to balance house interests with the good of the school. Results are announced after the votes have been checked.' },
      'Third-year Hogsmeade excursion': { leader: 'Professor McGonagall', place: 'Hogsmeade and the Three Broomsticks', info: 'Third years receive their first supervised Hogsmeade excursion after permission slips have been checked. The visit is meant for orientation, small purchases and learning how village rules differ from castle rules. The Three Broomsticks is the fixed return point.' },
      'Halloween Feast': { leader: 'Hogwarts school leadership and the ghosts of Hogwarts', place: 'Great Hall, ground floor', info: 'The Halloween Feast offers excellent pumpkin soup and pumpkin juice, decorations everywhere and eerie entertainment from the ghosts. The evening also remembers the Deathday of Nearly Headless Nick, Gryffindor’s house ghost. Students are expected to enjoy the spectacle without testing whether decorations are edible or cursed.' },
      'Career advice with Professor McGonagall': { leader: 'Professor Minerva McGonagall', place: 'Transfiguration classroom, first floor, main wing', info: 'Professor McGonagall discusses subject choices, examination goals and realistic career paths. Students should bring marks, questions and a clear idea of what they are prepared to work for. Vague dreams are tolerated, vague preparation is not.' },
      'Beginning of the Winter Feast': { leader: 'Hogwarts school leadership', place: 'Great Hall, ground floor', info: 'The Winter Feast marks the final gathering before the holidays. Announcements cover travel arrangements, castle rules during the break and return dates. The feast is warm, bright and usually a little louder than Professor McGonagall would prefer.' },
      'Christmas holidays': { leader: 'Heads of house', place: 'Common rooms, station platform and Hogwarts Express', info: 'Students either travel home on the Hogwarts Express or remain at the castle with permission. Dormitories are checked, travel lists are confirmed and remaining students receive separate holiday instructions. Owls should not be overloaded with last-minute parcels.' },
      'O.W.L. mid-year assessment': { leader: 'Examination committee', place: 'Classrooms and Great Hall', info: 'O.W.L. means Ordinary Wizarding Level. The mid-year assessment is a structured rehearsal for fifth-year examinations and checks whether students are on course before the final exam period. It combines theory, practical tasks and feedback from subject teachers.' },
      'N.E.W.T. mid-year assessment': { leader: 'Examination committee', place: 'Classrooms and Great Hall', info: 'N.E.W.T. means Nastily Exhausting Wizarding Test. The mid-year assessment prepares sixth and seventh years for advanced examination standards and shows where further revision is urgent. Results influence tutoring recommendations and advanced course planning.' },
      'Easter holidays': { leader: 'Heads of house', place: 'Common rooms, station platform and Hogwarts Express', info: 'The Easter holidays are the last longer pause before the examination period. Students travelling home confirm their train places, while those remaining at Hogwarts receive quiet study times and library rules. Revision plans are strongly recommended.' },
      'Apparition test': { leader: 'Wilkie Twycross', place: 'Great Hall and approved practice area', info: 'The Apparition test checks whether eligible students can Apparate safely, deliberately and without splinching. The three Ds remain central: Destination, Determination and Deliberation. Anyone who treats the test as a party trick will be removed from the queue.' },
      'Quidditch final': { leader: 'Madam Rolanda Hooch', place: 'Quidditch pitch', info: 'The Quidditch final decides the season’s sporting glory and carries serious house-point energy even when the points themselves are counted elsewhere. Spectators follow house seating rules, commentators report clearly and Madam Hooch has the final word on fouls.' },
      'O.W.L. examinations': { leader: 'Wizarding Examinations Authority', place: 'Great Hall and subject rooms', info: 'O.W.L. examinations are the fifth-year Ordinary Wizarding Levels. They assess the foundation of magical education through written papers, practical demonstrations and subject-specific tasks. Results shape which advanced courses remain open.' },
      'N.E.W.T. examinations': { leader: 'Wizarding Examinations Authority', place: 'Great Hall and subject rooms', info: 'N.E.W.T. examinations are the advanced Nastily Exhausting Wizarding Tests. They are demanding final assessments for older students and are taken seriously by employers, training programmes and specialist magical institutions. Preparation begins long before June.' },
      'Hogwarts leaving feast': { leader: 'Hogwarts school leadership', place: 'Great Hall, ground floor', info: 'The leaving feast gives the school a final evening together before departures and results dominate every conversation. Seventh years are acknowledged, younger students cheer too loudly, and the tables usually contain more desserts than strictly necessary.' },
      'Closing ceremony and House Cup': { leader: 'Professor Dumbledore', place: 'Great Hall, ground floor', info: 'The closing ceremony brings announcements, thanks and the final House Cup result. House points are counted openly and the winning house receives its colours in the Great Hall. The Headmaster usually finds a way to make the evening feel larger than arithmetic.' },
      'Summer holidays': { leader: 'Heads of house', place: 'Hogwarts Express and home addresses', info: 'Summer holidays begin after trunks are packed, forms are checked and students leave by train or approved magical travel. Booklists and letters for the next year follow by owl. The castle quiets down, although Filch would insist it never rests properly.' }
    };
    data.yearLevels = [
      { value: 1, label: '1st school year' },
      { value: 2, label: '2nd school year' },
      { value: 3, label: '3rd school year' },
      { value: 4, label: '4th school year' },
      { value: 5, label: '5th school year (O.W.L.)' },
      { value: 6, label: '6th school year (N.E.W.T. preparation)' },
      { value: 7, label: '7th school year (N.E.W.T.)' }
    ];
    data.electiveRules = {
      1: { minimum: 0, text: 'In the first two school years, the core magical education comes first.' },
      2: { minimum: 0, text: 'In the first two school years, the core magical education comes first.' },
      3: { minimum: 2, text: 'From the third year onward, at least two electives must be taken.' },
      4: { minimum: 2, text: 'At least two electives remain part of your curriculum. The school leadership recommends continuing your existing electives.' },
      5: { minimum: 3, text: 'From the fifth year onward, at least three electives must be taken.' },
      6: { minimum: 3, text: 'For the N.E.W.T. stage, advanced courses and Apparition lessons are recommended.' },
      7: { minimum: 3, text: 'In the final year, at least three specialised electives count especially strongly.' }
    };
    data.houses.forEach(function (house) {
      if (house.id === 'gryffindor') merge(house, { description: 'Gryffindor stands for courage, action and the willingness to stand up for others.', history: 'The house was founded by Godric Gryffindor and is known for determined students who keep their nerve in difficult moments.', ghost: 'Nearly Headless Nick', commonRoom: 'Gryffindor common room, Gryffindor Tower', entrance: 'The entrance is behind the portrait of the Fat Lady and opens with the current password.', traits: 'Brave, loyal, direct, sometimes reckless' });
      if (house.id === 'hufflepuff') merge(house, { description: 'Hufflepuff stands for patience, fairness and dependable friendship.', history: 'Helga Hufflepuff welcomed students with many different talents and valued hard work, community and helpfulness.', ghost: 'The Fat Friar', commonRoom: 'Hufflepuff common room, basement corridor near the kitchens', entrance: 'The entrance is hidden by the barrels near the kitchens and opens with the correct tapping rhythm.', traits: 'Fair, friendly, persistent, down-to-earth' });
      if (house.id === 'ravenclaw') merge(house, { description: 'Ravenclaw stands for intelligence, creativity and delight in unusual solutions.', history: 'Rowena Ravenclaw founded the house for sharp minds who value knowledge, curiosity and independence.', ghost: 'The Grey Lady', commonRoom: 'Ravenclaw common room, Ravenclaw Tower', entrance: 'The entrance opens not with a password but with the correct answer to a question or riddle.', traits: 'Clever, curious, individual, inventive' });
      if (house.id === 'slytherin') merge(house, { description: 'Slytherin stands for ambition, determination and strategic thinking.', history: 'Salazar Slytherin founded the house for students with strong will, clear goals and a sense for influence.', ghost: 'The Bloody Baron', commonRoom: 'Slytherin common room, dungeons below the lake', entrance: 'The entrance lies in the dungeons and opens with the current password before a hidden stone wall.', traits: 'Ambitious, loyal to their own circle, clever, goal-driven' });
    });
  }

  function addTranslatedBookKeys(localized, original) {
    if (localized.bookDetails && original.bookDetails) {
      Object.keys(original.bookDetails).forEach(function (key) {
        var translatedKey = translateText(key);
        if (translatedKey !== key && !localized.bookDetails[translatedKey]) {
          localized.bookDetails[translatedKey] = translateTree(clone(original.bookDetails[key]), ['bookDetails', translatedKey]);
        }
      });
    }
    if (localized.literatureAuthors && original.literatureAuthors) {
      Object.keys(original.literatureAuthors).forEach(function (key) {
        var translatedKey = translateText(key);
        if (translatedKey !== key && !localized.literatureAuthors[translatedKey]) localized.literatureAuthors[translatedKey] = original.literatureAuthors[key];
      });
    }
  }

  function addTranslatedSpecialKeys(localized, original) {
    if (!localized.specialDetails || !original.specialDetails) return;
    Object.keys(original.specialDetails).forEach(function (key) {
      if (key === 'default') return;
      var translatedKey = translateText(key);
      if (translatedKey !== key && !localized.specialDetails[translatedKey]) {
        localized.specialDetails[translatedKey] = translateTree(clone(original.specialDetails[key]), ['specialDetails', translatedKey]);
      }
    });
  }

  function translateStudentSupplyGroupKeys(data) {
    if (!data.studentSupplyGroupsByYear) return;
    Object.keys(data.studentSupplyGroupsByYear).forEach(function (year) {
      var groups = data.studentSupplyGroupsByYear[year];
      var translated = {};
      Object.keys(groups || {}).forEach(function (label) {
        translated[translateText(label)] = groups[label];
      });
      data.studentSupplyGroupsByYear[year] = translated;
    });
  }

  function applyEnglishSubjectOverrides(data) {
    var subjectOverrides = {
      astronomy: {
        room: 'Astronomy Tower, upper platform',
        examForm: 'Star-chart submission, practical telescope assessment and written mid-year exam.',
        materials: ['Star chart', 'Telescope provided in the Astronomy Tower', 'Warm cloak for night lessons'],
        literatureByYear: { 1: 'Stars over Hogwarts - An Introduction to Astronomy', 2: 'Moon Phases and Magical Nights', 3: 'Star Charts for Advanced Students', 4: 'Comets, Conjunctions and Omens', 5: 'O.W.L. Astronomy: Exam Atlas', 6: 'N.E.W.T. Celestial Studies I', 7: 'N.E.W.T. Celestial Studies II' },
        info: 'Astronomy combines star charts, moon phases and the observation of magical celestial events. Assessment uses telescope work, constellation recognition and a written evaluation of night observations.'
      },
      charms: {
        room: 'Classroom 2E, second floor, east wing of Hogwarts',
        examForm: 'Practical spell demonstration, several parchment assignments and a short theory test.',
        materials: ['Practice objects', 'Quill and parchment'],
        literatureByYear: { 1: 'The Standard Book of Spells, Grade 1', 2: 'The Standard Book of Spells, Grade 2', 3: 'The Standard Book of Spells, Grade 3', 4: 'Extraordinary Charms, Grade 4', 5: 'Extraordinary Charms, Grade 5', 6: 'Extraordinary Charms, Grade 6', 7: 'Extraordinary Charms, Grade 7' },
        info: 'Charms trains precise wand movement, pronunciation and useful everyday magic. Exams combine a short theory question with a supervised practical demonstration of several spells.'
      },
      defence: {
        room: 'Defence classroom, third floor, north wing of Hogwarts',
        examForm: 'Practical defensive assessment, oral case analysis and written final test.',
        materials: ['Protective cloak', 'Safety goggles', 'Protective gloves', 'Note parchment and writing kit'],
        literatureByYear: { 1: 'Dark Forces: A Guide to Self-Protection', 2: 'Recognising Hexes II', 3: 'Counter-Curses and Protective Charms III', 4: 'Dark Creatures and Defence IV', 5: 'O.W.L. Defence V', 6: 'N.E.W.T. Defence VI', 7: 'Master Course in Defensive Magic VII' },
        info: 'Defence Against the Dark Arts covers protective spells, curses, counter-curses and judging magical danger. The Unforgivable Curses are not practised. The Imperius Curse is the exception only for recognition and inner resistance training, while Cruciatus and Avada Kedavra are not treated in practical lessons.'
      },
      herbology: {
        room: 'Greenhouse teaching garden',
        examForm: 'Practical plant care, plant profile and oral safety check.',
        materials: ['Dragon-hide gloves', 'Earmuffs', 'Plant shears'],
        literatureByYear: { 1: 'One Thousand Magical Herbs and Fungi I', 2: 'Greenhouse Studies II', 3: 'Dangerous Seedlings III', 4: 'Healing Plants IV', 5: 'O.W.L. Herbology V', 6: 'N.E.W.T. Botanical Magic VI', 7: 'Rare Magical Plants VII' },
        info: 'Herbology explains care, harvesting and the dangers of magical plants, from Mandrakes to biting vines. Assessment focuses on practical pot work and a short plant profile.'
      },
      history: {
        room: 'Classroom 4F, fourth floor, west side of the Grand Staircase',
        examForm: 'Written mid-year exam and essay on a historical conflict.',
        materials: ['Timeline parchment', 'Quill'],
        literatureByYear: { 1: 'A History of Magic I', 2: 'Goblin Rebellions II', 3: 'Magical Legislation III', 4: 'International Wizarding Conflicts IV', 5: 'O.W.L. Chronicles V' },
        info: 'History of Magic covers goblin rebellions, wizarding law and turning points in magical society. The exam is usually written: dates, causes, consequences and a short essay on a historical conflict.'
      },
      potions: {
        room: 'Dungeons, Potions classroom B, Slytherin dungeon wing',
        examForm: 'Practical brewing exam, laboratory record and ingredients test.',
        materials: ['Pewter cauldron', 'Scales', 'Glass phials', 'Ingredient knife'],
        literatureByYear: { 1: 'Magical Drafts and Potions', 2: 'Cauldrons, Herbs and Clean Cuts II', 3: 'Potent Potions and Their Dangers III', 4: 'Antidotes and Elixirs IV', 5: 'O.W.L. Potions V', 6: 'N.E.W.T. Potions VI', 7: 'Master Potions VII' },
        info: 'Potions trains recipe discipline, ingredient knowledge and recognising subtle changes in colour and smell. In the exam you brew under time pressure and then explain effect, risks and alternative ingredients.'
      },
      transfiguration: {
        room: 'Transfiguration classroom, first floor, east side of the Grand Staircase',
        examForm: 'Practical transformation, oral formula check and written theory exam.',
        materials: ['Practice objects', 'Note parchment'],
        literatureByYear: { 1: 'A Beginner’s Guide to Transfiguration', 2: 'Form and Function II', 3: 'Animal Transfiguration III', 4: 'Stable Object Transfiguration IV', 5: 'O.W.L. Transfiguration V', 6: 'N.E.W.T. Transfiguration VI', 7: 'Advanced Transfiguration VII' },
        info: 'Transfiguration requires concentration, clear imagination and clean changes of form in objects or animals. Exams combine theory on exceptions with a practical transformation graded for accuracy.'
      },
      flying: {
        examForm: 'Practical flying course with take-off, braking and landing.',
        materials: ['Flying equipment provided', 'Weatherproof cloak'],
        literatureByYear: { 1: 'Quidditch Through the Ages I' },
        info: 'Flying lessons teach mounting, hovering, braking and safe turns on school brooms. The assessment is practical: controlled take-off, a short course, landing and correct safety rules.'
      }
    };
    (data.subjects || []).forEach(function (subject) {
      var override = subjectOverrides[subject.id] || subjectOverrides[subject.replaces];
      if (override) merge(subject, clone(override));
      if (subject.id === 'wandmaking') subject.name = 'Wandmaking Studies';
      if (subject.id === 'advanced-potions') merge(subject, { literatureByYear: { 5: 'N.E.W.T. Potions: Slughorn’s Selection V', 6: 'Complex Potion Chains VI', 7: 'Master Potions VII' }, materials: ['Silver knife', 'Brass scales', 'Safety goggles', 'Clean phials'] });
      if (subject.id === 'advanced-charms') merge(subject, { literatureByYear: { 5: 'Advanced Standard Spells V', 6: 'Non-Verbal Charms VI', 7: 'Masterful Spellcasting VII' }, materials: ['Spell catalogue', 'Optional wand-care kit'] });
      if (subject.id === 'advanced-creatures') merge(subject, { room: 'Outdoor enclosure by the Forbidden Forest, gamekeeper’s path', examForm: 'Supervised care project, danger analysis and oral assessment.', materials: ['Dragon-hide gloves', 'Sturdy boots', 'Feed pouch', 'Creature-healing kit'], literatureByYear: { 5: 'Danger Classes and Care Projects V', 6: 'N.E.W.T. Creature Care VI', 7: 'High-Risk Magizoology VII' }, info: 'Advanced Care of Magical Creatures works with demanding species, emergency routines and behaviour observation. For rare high-risk species, the course uses the Glenfey Magizoological Wildlife Park near Hogwarts, where enchanted habitats allow humane care and scientific observation.' });
      if (subject.id === 'care-creatures') merge(subject, { room: 'Gamekeeper’s hut and outdoor enclosure by the Forbidden Forest', examForm: 'Practical creature care, care protocol and oral species test.', materials: ['Dragon-hide gloves', 'Sturdy boots', 'Feed pouch'], literatureByYear: { 3: 'The Monster Book of Monsters III', 4: 'Protection of Magical Creatures IV', 5: 'O.W.L. Creatures V', 6: 'N.E.W.T. Creature Care VI', 7: 'Magical Wilderness VII' }, info: 'Care of Magical Creatures covers feeding, behaviour, danger ratings and respectful handling of magical animals. For larger or more dangerous species, Hogwarts works with the Glenfey Magizoological Wildlife Park north of Hogsmeade, where creatures live humanely and can be studied from safe observation paths.' });
      if (subject.id === 'dragonology') merge(subject, { materials: ['Fireproof cloak provided', 'Binoculars'], literatureByYear: { 5: 'Dragon Species of Europe V', 6: 'Dragon Care and Reserves VI', 7: 'Advanced Dragon Studies VII' } });
      if (subject.id === 'apparition') merge(subject, { examForm: 'Practical Apparition test with target circle and safety grading.', materials: ['Permission form', 'Comfortable shoes'], literatureByYear: { 6: 'Apparition: Destination, Determination, Deliberation VI', 7: 'Apparition: Exam and Precision VII' }, info: 'The Apparition course prepares older students for controlled vanishing and reappearing. The practical exam grades accuracy, determination and avoiding splinching.' });
      if (subject.id === 'ancient-runes') subject.room = 'Rune cabinet, fifth floor, library wing';
      if (subject.id === 'muggle-studies') subject.room = 'Muggle Studies room, third floor, west wing of Hogwarts';
      if (subject.id === 'alchemy') subject.room = 'Alchemy laboratory, dungeon wing';
      if (subject.id === 'advanced-herbology') subject.room = 'Greenhouse Four, castle gardens behind the main building';
      if (subject.id === 'wandmaking') subject.room = 'Wandlore workshop, fifth floor, east wing of Hogwarts';
      if (subject.id === 'dragonology') subject.room = 'Outdoor enclosure by the Forbidden Forest, gamekeeper’s path';
      if (subject.id === 'animagus-study') subject.room = 'Transfiguration classroom, first floor, east side of the Grand Staircase';
    });
  }

  function applyEnglishActivityOverrides(data) {
    var moreSubjects = {
      'ancient-runes': { examForm: 'Translation test, rune portfolio and short presentation.', materials: ['Rune dictionary', 'Translation board'], literatureByYear: { 3: 'Ancient Runes Made Easy III', 4: 'Rune Families IV', 5: 'O.W.L. Rune Translation V', 6: 'N.E.W.T. Rune Magic VI', 7: 'Rune Archives VII' }, info: 'Ancient Runes introduces translation, grammar and interpretation of magical writing. The exam requires deciphering a rune text, translating it briefly and explaining possible protective effects.' },
      arithmancy: { examForm: 'Calculation test, parchment assignments and prediction presentation.', materials: ['Number tables', 'Calculation parchment'], literatureByYear: { 3: 'Basic Arithmancy Formulae III', 4: 'Number and Fate IV', 5: 'O.W.L. Arithmancy V', 6: 'N.E.W.T. Probability Magic VI', 7: 'Arithmantic Forecasts VII' }, info: 'Arithmancy studies magical number patterns, probabilities and character calculations. Assessment uses calculations, number squares and a reasoned forecast from given data.' },
      divination: { examForm: 'Interpretation presentation, dream diary and oral symbol test.', materials: ['Crystal ball when announced', 'Teacup', 'Dream diary'], literatureByYear: { 3: 'Unfogging the Future III', 4: 'Dream Signs and Tea Leaves IV', 5: 'O.W.L. Divination V', 6: 'N.E.W.T. Interpretation Arts VI', 7: 'Prophetic Methods VII' }, info: 'Divination works with tea leaves, dream interpretation, crystal balls and symbolic reading. Assessment combines an interpretation presentation, symbol knowledge and a written reflection on method.' },
      'muggle-studies': { examForm: 'Object report, written theory test and short comparison presentation.', materials: ['Object report sheet', 'Pencil', 'Non-magical example object when announced'], literatureByYear: { 3: 'Muggle Studies Primer III', 4: 'Electricity and Other Riddles IV', 5: 'O.W.L. Muggle Studies V', 6: 'N.E.W.T. Magical-Muggle Relations VI', 7: 'Muggle Society VII' }, info: 'Muggle Studies explains technology, society and everyday objects used by non-magical people. The exam includes definitions, an object report and a short analysis of magical-Muggle misunderstandings.' },
      alchemy: { examForm: 'Laboratory record, controlled transmutation and oral symbol test.', materials: ['Copper cauldron', 'Safety goggles', 'Reagent kit'], literatureByYear: { 6: 'Alchemical Symbols VI', 7: 'Transmutation and Substance VII' }, info: 'Alchemy combines advanced material transformation, symbolism and rare reaction chains. Assessment requires a laboratory record, controlled transmutation and an explanation of alchemical principles.' },
      'advanced-transfiguration': { examForm: 'Practical precision transformation, theory essay and oral defence.', materials: ['Measuring instruments', 'Practice figures'], literatureByYear: { 5: 'Intermediate Transfiguration V', 6: 'Complex Transfiguration VI', 7: 'Limits of Transfiguration VII' }, info: 'Advanced Transfiguration demands precise, stable transformations and knowledge of legal limits. Assessment grades accuracy, stability and explanation of the formula used.' },
      'advanced-defence': { examForm: 'Practical defensive duel, oral danger analysis and written theory test.', materials: ['Protective cloak', 'Dueling log', 'Safety goggles'], literatureByYear: { 5: 'Advanced Defence V', 6: 'Non-Verbal Defence VI', 7: 'Tactical Defensive Magic VII' }, info: 'Advanced Defence focuses on tactical shielding, non-verbal reactions and recognising dangerous magic. The Unforgivable Curses remain theory only except for recognising and resisting Imperius.' },
      'advanced-herbology': { examForm: 'Advanced plant-care task, safety protocol and oral plant profile.', materials: ['Dragon-hide gloves', 'Plant shears', 'Protective apron'], literatureByYear: { 5: 'Poisonous Plant Protocols V', 6: 'N.E.W.T. Greenhouse Magic VI', 7: 'Rare Magical Biotopes VII' }, info: 'Advanced Herbology works with rarer, more dangerous and more useful plants. Assessment focuses on safe care routines, harvest decisions and a clear safety protocol.' },
      'advanced-history': { examForm: 'Source analysis, long essay and oral historical defence.', materials: ['Source folder', 'Quill', 'Timeline parchment'], literatureByYear: { 6: 'International Wizarding Politics VI', 7: 'Archive Work and Historical Judgement VII' }, info: 'Advanced History of Magic studies sources, conflicts and long-term political effects in greater depth. Assessment rewards precise evidence and a structured argument.' },
      wandmaking: { examForm: 'Material report, wood and core analysis and oral presentation.', materials: ['Wood samples provided', 'Core catalogue', 'Protective gloves'], literatureByYear: { 5: 'Wand Woods and Cores V', 6: 'Resonance and Balance VI', 7: 'Master Questions of Wandlore VII' }, info: 'Wandmaking Studies explains woods, magical cores, balance and the bond between wand and witch or wizard. The course analyses and documents under supervision rather than experimenting freely with dangerous cores.' },
      'pro-quidditch': { examForm: 'Tactical analysis, fitness assessment and supervised flying course.', materials: ['Professional equipment provided', 'Sports cloak recommended', 'Water bottle'], literatureByYear: { 5: 'Professional Quidditch Tactics V', 6: 'Team Play and Endurance VI', 7: 'League Preparation VII' }, info: 'Professional Quidditch Training is for older students with serious interest in team play, tactics and professional match preparation. Madam Hooch assesses awareness, fairness and controlled flying.' },
      dragonology: { examForm: 'Danger analysis, observation log and oral species test.', materials: ['Fireproof cloak provided', 'Binoculars'], literatureByYear: { 5: 'Dragon Species of Europe V', 6: 'Dragon Care and Reserves VI', 7: 'Advanced Dragon Studies VII' }, info: 'Dragon Studies covers species knowledge, safety distances, behaviour and work in reserves. Lessons remain observational and safety-focused, even when the topics have plenty of fire.' },
      'animagus-study': { name: 'Animagus Inquiry', examForm: 'Theory test, ethics essay and oral safety check.', materials: ['Transformation journal', 'Sample registration form'], literatureByYear: { 5: 'Animagus Law and Self-Image V', 6: 'Body, Will and Form VI', 7: 'Limits of Voluntary Transformation VII' }, info: 'Animagus Inquiry is not a secret self-experiment, but a strict theoretical and safety-conscious course on requirements, risks, registration and the history of Animagi.' }
    };
    (data.subjects || []).forEach(function (subject) { if (moreSubjects[subject.id]) merge(subject, clone(moreSubjects[subject.id])); });

    var clubOverrides = {
      'wizard-chess': { name: 'Wizard Chess Club', materials: ['Own chess set or school set', 'Note parchment'], info: 'The Wizard Chess Club plays supervised matches, tactics exercises and small house tournaments. Ewan MacLeod makes sure everyone plays fairly and follows the magical special rules.' },
      gobstones: { name: 'Gobstones Club', materials: ['Gobstones set', 'Cleaning cloth', 'Sturdy cloak'], info: 'The Gobstones Club practises target throws, tournament rules and house duels. Niamh O’Connell keeps a ranking list and does not tolerate enchanted replacement stones.' },
      quidditch: { materials: ['Team equipment and training brooms provided', 'Recommended: sports cloak', 'Water bottle'], info: 'Quidditch training takes place twice a week for each house. Pitch times are separated to prevent double booking.' },
      duelling: { name: 'Dueling Club', room: 'Great Hall, ground floor, main building', materials: ['Wand', 'Protective cloak', 'Dueling log'], info: 'The Dueling Club practises bowing, Shield Charms, disarming and controlled counter-spells. Harry Potter values safe execution and no showing off.' },
      art: { name: 'Art Club', materials: ['Sketchbook', 'Paint box', 'Self-mixing ink'], info: 'The Art Club creates magical sketches, moving portrait studies, magical photography and posters for house events. Maisie Campbell organises a small corridor gallery at the end of each month.' },
      'astronomy-club': { name: 'Astronomy Club', room: 'Astronomy Tower, upper platform', materials: ['Telescope', 'Warm cloak', 'Star journal'], info: 'The Astronomy Club observes meteor showers, planetary paths and rare constellations. Seamus Byrne keeps a shared star journal for all houses.' },
      homework: { name: 'Homework Meet-up', leader: 'Prefects', materials: ['Open assignments', 'Textbooks', 'Quill'], info: 'The Homework Meet-up offers quiet work time, questions and literature tips. Teachers occasionally support the sessions and give useful advice.' },
      'creatures-club': { name: 'Magical Creatures Club', room: 'Gamekeeper’s hut by the Forbidden Forest', materials: ['Dragon-hide gloves', 'Sturdy boots', 'Feed pouch'], info: 'The club visits safer creatures, builds feeding plans and learns to read tracks. Participation requires sturdy shoes and respect for magical creatures.' },
      'charms-club': { name: 'Charms Club', room: 'Classroom 2E, second floor, east wing of Hogwarts', materials: ['Wand', 'Practice objects', 'Wand polish'], info: 'Charms Club trains special spells, mini competitions and precise movement technique. Small demonstrations are shown from time to time.' },
      'rat-racing': { name: 'Rat Racing Club', materials: ['Pet permission', 'Mini obstacles', 'Treats'], info: 'The Rat Racing Club is a harmless obstacle race for small pets. Callum Fraser watches care, breaks and fair racing.' },
      dance: { name: 'Dance Club', room: 'Unused classroom, first floor', materials: ['Comfortable shoes', 'Dress robes optional'], info: 'The Dance Club practises social dances for balls and festive evenings. It is not graded, but rhythm saves more dignity than most students expect.' },
      'slug-club': { name: 'Slug Club', room: 'Professor Slughorn’s office, dungeon wing', materials: ['Well-kept cloak', 'Conversation notes', 'Optional host gift'], info: 'The Slug Club gathers gifted, well-connected or especially interesting students. Professor Slughorn invites members for conversation, small receptions and occasional tastings.' },
      'runes-club': { name: 'Ancient Runes Club', materials: ['Rune dictionary', 'Carbon paper', 'Translation board'], info: 'The Ancient Runes Club translates inscriptions, designs protective signs and compares rune families. Results go into the shared rune notebook or are displayed in cases.' },
      'frog-choir': { name: 'Frog Choir', materials: ['Sheet music', 'Voice tea', 'Patience with frogs'], info: 'The Frog Choir rehearses magical harmony with amphibian accompaniment. Taking part in performances is optional.' },
      'potions-circle': { name: 'Potions Circle', room: 'Dungeons, Potions classroom A, Slytherin dungeon wing', materials: ['Cauldron', 'Safety goggles', 'Clean phials', 'Ingredient knife'], info: 'The Potions Circle deepens ingredient knowledge, cutting technique and rare recipe variants. Professor Snape expects clean workspaces, creativity and exact protocols.' },
      'book-club': { name: 'Book Club', room: 'Library, fourth floor, library wing', materials: ['Current book', 'Bookmark', 'Note parchment'], info: 'The Book Club meets for weekly book discussions, recommendations and quiet reading sessions. Students from school year 5 onward may also enter the Restricted Section under supervision.' },
      'magical-cooking': { name: 'Magical Cooking', room: 'Hogwarts kitchens, cellar vault near the Hufflepuff barrels', materials: ['Apron', 'Wooden spoon', 'Recipe parchment'], info: 'Magical Cooking teaches simple spells for safe kitchen work, floating bowls and festive house recipes. Dobby makes quite sure nobody leaves hungry.' },
      'first-aid': { name: 'Magical First Aid', room: 'Hospital Wing, first floor', materials: ['Bandage roll', 'Healing folder', 'Clean gloves'], info: 'Magical First Aid covers bandages, shock spells, curse injuries and when Madam Pomfrey must be called immediately. Practical exercises remain safe.' },
      'hogsmeade-tutoring': { name: 'Hogsmeade Tutoring', materials: ['Practice assignments', 'Textbook', 'Butterbeer money'], info: 'Hogsmeade Tutoring is a club for social engagement in Hogsmeade. Professor McGonagall insists on clear goals and punctual return, because it is not an extra visit to Honeydukes.' },
      'boats-fishing': { name: 'Boating and Fishing Club', materials: ['Waterproof cloak', 'Fishing rod', 'Life vest'], info: 'The Boating and Fishing Club learns safe knots, weather rules and patient fishing on the Black Lake. Finlay MacNair knows every creaking plank in the boathouse.' },
      'quidditch-org': { name: 'Quidditch Organisation', room: 'Quidditch pitch and equipment shed', materials: ['Clipboard', 'Match schedule', 'Optional whistle'], info: 'Quidditch Organisation helps on match days: commentating matches, assisting referees or acquiring and checking new Quidditch equipment.' },
      'magical-mobility': { name: 'Magical Mobility', room: 'Hogwarts school-board room beside the staff room, ground floor, main wing', materials: ['Travel schedule', 'Permission parchment', 'Note quill'], info: 'Magical Mobility organises journeys and special runs of the Hogwarts Express, self-propelled boats across the Black Lake and carriage flights. The club also prepares requests for special Portkeys and Floo powder travel permits.' },
      prefects: { name: 'Prefects / Head Students', materials: ['Badge', 'Meeting parchment', 'Quill'], info: 'Weekly meeting with prefects and Head Students to discuss the current situation and future of Hogwarts. Prefects and Head Students have voting rights in the student representation, whose concerns are heard by the school board.', scheduleName: 'Hogwarts Meeting', scheduleRoom: 'Headmaster’s office, seventh floor, Gargoyle corridor' },
      'event-group': { name: 'Event Group', materials: ['Planning parchment', 'Decoration list', 'Wand'], info: 'The Event Group organises parties, masquerade balls and other school events, even with Muggle technology. Professor Flitwick helps with charms, music and safe floating decorations.' },
      'pen-pals': { name: 'Hogwarts Pen Pals', materials: ['Stationery', 'Owl treats', 'Address list'], info: 'Hogwarts Pen Pals means not only writing and sending letters, but also owl care. Aoife Gallagher shows how to care for owls safely and plan routes.' },
      'caretaker-guild': { name: 'Caretaker Guild', room: 'Filch’s office, ground floor', materials: ['Checklist', 'Hand lantern', 'Work gloves'], info: 'The Caretaker Guild patrols Hogwarts, checks order and repairs, and helps with maintenance such as the Clock Tower. Argus Filch takes every loose hinge personally.' },
      archivists: { name: 'Archivists and Chroniclers', materials: ['Cotton gloves', 'Inventory list', 'Polishing cloth provided'], info: 'Archivists and Chroniclers clean display cases and trophies, document awards, sort old lists and help prepare new honours.' }
    };
    (data.clubs || []).forEach(function (club) {
      if (club.houseAuto) merge(club, { info: 'Weekly gathering in the common room to discuss current matters, celebrate achievements and settle house business.' });
      if (clubOverrides[club.id]) merge(club, clone(clubOverrides[club.id]));
    });

    var tripOverrides = {
      'hogsmeade-visit': { materials: ['Permission slip', 'Weatherproof cloak', 'Pocket money'], info: 'Supervised visit to Hogsmeade with check-in at the Three Broomsticks.' },
      'diagon-alley': { info: 'A shared shopping excursion for school supplies, books and spare quills seven days before the first day of school. New Hogwarts students can tick participation on the enrolment form and meet students and teachers early.' },
      ashpeak: { materials: ['Dragon-hide gloves', 'Binoculars', 'Fireproof cloak'], info: 'Observation of protected dragons from a safe distance with field notes and emergency Portkey.' },
      mournvale: { location: 'Mournvale Gardens', materials: ['Plant guide', 'Gloves', 'Sketchbook'], info: 'Botanical excursion to rare magical plants.' },
      'aurum-kettleworks': { materials: ['Safety goggles', 'Note parchment', 'Closed shoes'], info: 'Factory visit on the production of tested cauldrons and laboratory equipment.' },
      'astra-noctis': { materials: ['Star chart', 'Telescope attachment', 'Warm cloak'], info: 'Night-time observation of special constellations with an Astronomy log.' },
      'ministry-uk': { location: 'London, Ministry of Magic', info: 'Career-oriented visit to several Ministry departments.' },
      macusa: { materials: ['Passport for magical travel', 'Exchange form', 'Notebook'] },
      'st-mungos': { materials: ['Healing folder', 'Clean gloves', 'Question list'], info: 'Insight into magical healing, hospital wards and emergency routines.' },
      beauxbatons: { location: 'Pyrenees, France', info: 'Student exchange with lesson visits.' },
      durmstrang: { info: 'Student exchange with lesson visits.' },
      ilvermorny: { info: 'Transatlantic student exchange with lesson visits.' }
    };
    (data.trips || []).forEach(function (trip) { if (tripOverrides[trip.id]) merge(trip, clone(tripOverrides[trip.id])); });
  }

  function applyEnglishCurriculumTopics(data, source) {
    if (!source || !source.curriculumTopicsBySubject) return;
    var titleMap = {
      charms: 'Planned spells in this school year (may vary depending on course progress)',
      defence: 'Planned protective spells, counter-curses and curses in this school year (may vary depending on course progress)',
      transfiguration: 'Planned Transfiguration spells in this school year (may vary depending on course progress)',
      potions: 'Planned potions in this school year (may vary depending on course progress)',
      herbology: 'Planned plants in this school year (may vary depending on course progress)',
      'care-creatures': 'Planned creatures in this school year (may vary depending on course progress)',
      'advanced-charms': 'Planned advanced spells in this school year (may vary depending on course progress)',
      'advanced-defence': 'Planned advanced defence, curses and counter-curses (may vary depending on course progress)',
      'advanced-potions': 'Planned advanced potions in this school year (may vary depending on course progress)',
      'advanced-herbology': 'Planned advanced plants in this school year (may vary depending on course progress)',
      'advanced-creatures': 'Planned advanced creatures in this school year (may vary depending on course progress)',
      dragonology: 'Planned dragons and high-risk creatures in this school year (may vary depending on course progress)',
      'advanced-transfiguration': 'Planned advanced Transfiguration spells in this school year (may vary depending on course progress)',
      'animagus-study': 'Animagus theory in this school year',
      apparition: 'Apparition formulas and safety topics',
      alchemy: 'Alchemical substances and methods',
      wandmaking: 'Wandlore in this school year',
      'pro-quidditch': 'Quidditch techniques and match studies'
    };
    var topicMap = {
      'Entsperrungs-Zauber (Alohomora)': 'Unlocking Charm (Alohomora)',
      'Schwebezauber (Wingardium Leviosa)': 'Levitation Charm (Wingardium Leviosa)',
      'Lichtzauber (Lumos)': 'Wand-Lighting Charm (Lumos)',
      'Lichtzauber zur Orientierung': 'Wand-Lighting Charm for orientation',
      'Lichtlöschzauber (Nox)': 'Wand-Extinguishing Charm (Nox)',
      Lichtlöschzauber: 'Wand-Extinguishing Charm',
      'Reparierzauber (Reparo)': 'Mending Charm (Reparo)',
      Reinigungszauber: 'Cleaning Charm',
      'Sanfter Bewegungszauber': 'gentle movement charm',
      'Blumen-Heraufbeschwörung': 'Flower-Conjuring Spell',
      'Sichtbarkeitszauber (Aparecium)': 'Revealing Charm (Aparecium)',
      'Tür-Verschlusszauber (Colloportus)': 'Door-Sealing Spell (Colloportus)',
      Schrumpfzauber: 'Shrinking Charm',
      Vergrößerungszauber: 'Engorgement Charm',
      Schneidezauber: 'Severing Charm',
      Erstarrungszauber: 'Freezing Charm',
      Kitzelzauber: 'Tickling Charm',
      'Gegenzauber einfacher Art': 'simple counter-spells',
      'Aufrufezauber (Accio)': 'Summoning Charm (Accio)',
      Wegstoßzauber: 'Knockback Jinx',
      'Wasserabweisender Zauber': 'Water-Repelling Charm',
      Baumbewegungszauber: 'Tree-Moving Charm',
      Beinklammerfluch: 'Leg-Locker Curse',
      'Kleiner Herausstoßzauber': 'Minor Ejection Spell',
      'Wasser-Aufrufzauber': 'Water-Making Spell',
      Aufwärtszauber: 'Ascending Charm',
      'Vogel-Heraufbeschwörungszauber': 'Bird-Conjuring Charm',
      Vogelangriffszauber: 'Bird-Attack Spell',
      Enthüllungszauber: 'Revealing Charm',
      Stimmverstärkungszauber: 'Amplifying Charm',
      Schalldämpfungszauber: 'Muffling Charm',
      Dämpfungszauber: 'Cushioning Charm',
      Proteuszauber: 'Protean Charm',
      Verdopplungszauber: 'Doubling Charm',
      Markierungszauber: 'Marking Charm',
      Schweigezauber: 'Silencing Charm',
      Verschwindezauber: 'Vanishing Spell',
      'Menschen-Enthüllungszauber': 'Human-presence Revealing Spell',
      'Nonverbale Anwendung von Aufrufe-, Reparier- und Schweigezaubern': 'non-verbal use of Summoning, Mending and Silencing Charms',
      Muggelabwehrzauber: 'Muggle-Repelling Charm',
      Gefahrenwarnzauber: 'Danger-Warning Charm',
      Augenbindezauber: 'Blindfolding Spell',
      Verwirrungszauber: 'Confundus Charm',
      'Heilzauber für kleine Verletzungen': 'healing charms for minor injuries',
      'Atemwegs-Heilzauber': 'airway-healing charm',
      'Anhaltender Schutzzauber für Orte': 'lasting protective charm for places',
      'Schutzzauber gegen Verhexungen': 'protective charm against hexes',
      'Verstärkter Schutzschild': 'reinforced Shield Charm',
      'Statuen-Belebungszauber': 'statue-animation spell',
      Verbindungszauber: 'Linking Charm',
      'Fluchumkehr-Effekt': 'curse-reversal effect',
      'Portschlüssel-Zauber': 'Portkey Spell',
      Verfolgungszauber: 'Tracking Spell',
      Entwaffnungszauber: 'Disarming Charm',
      'Einfacher Gegenzauber': 'simple counter-spell',
      Ganzkörperklammerfluch: 'Full Body-Bind Curse',
      Wackelbeinfluch: 'Jelly-Legs Jinx',
      Spinnenabwehrzauber: 'Spider-Repelling Spell',
      'Entwaffnungszauber vertiefen': 'advanced Disarming Charm practice',
      'Tanzbein-Fluch erkennen': 'recognising the dancing-feet curse',
      'Zahnwachstums-Fluch erkennen': 'recognising the tooth-growing curse',
      'Einfache Schutzstellung': 'basic defensive stance',
      'Schildzauber (Protego)': 'Shield Charm (Protego)',
      Patronuszauber: 'Patronus Charm',
      'Irrwicht-Abwehrzauber': 'Boggart-Banishing Spell',
      Grifflockerungszauber: 'Grip-Loosening Charm',
      Schockzauber: 'Stunning Spell',
      Wiederbelebungszauber: 'Reviving Spell',
      'Hinkepank-Abwehr': 'Hinkypunk defence',
      Hinderniszauber: 'Impediment Jinx',
      Reduktionszauber: 'Reductor Curse',
      Explosionszauber: 'Blasting Curse',
      Schildzauber: 'Shield Charm',
      'Grindeloh-Abwehr': 'Grindylow defence',
      'Imperius-Fluch erkennen': 'recognising the Imperius Curse',
      'Schildzauber gegen mehrere Angriffe': 'Shield Charm against multiple attacks',
      Schnittfluch: 'cutting curse',
      'Imperius-Fluch: innere Gegenwehr üben': 'Imperius Curse: practising inner resistance',
      Dementorenschutz: 'Dementor protection',
      'Nonverbaler Schildzauber': 'non-verbal Shield Charm',
      'Nonverbaler Entwaffnungszauber': 'non-verbal Disarming Charm',
      'Schutzzauber vor dunkler Magie': 'protection against dark magic',
      Gegenfluchanalyse: 'counter-curse analysis',
      'Fluchspuren lesen': 'reading curse traces',
      'Imperius-Fluch: Theorie, Erkennung und Opferhilfe': 'Imperius Curse: theory, recognition and victim support',
      Feindabwehrzauber: 'enemy-repelling spell',
      'Komplexe Duellsimulation': 'complex duel simulation',
      'Streichholz zu Nadel': 'matchstick to needle',
      'Farbwechsel kleiner Gegenstände': 'colour changes on small objects',
      'Formwechsel kleiner Gegenstände': 'shape changes on small objects',
      'Rückführung misslungener Verwandlungen': 'reversal of failed transformations',
      'Sichere Zielbild-Übungen': 'safe target-image exercises',
      'Tier-zu-Kelch-Verwandlung': 'animal-to-goblet transformation',
      'Kleine Objektverwandlung mit Bewegung': 'small object transformation with movement',
      'Vergrößerung und Rückführung': 'enlargement and reversal',
      'Schrumpfung und Rückführung': 'shrinking and reversal',
      'Teilverwandlungen erkennen': 'recognising partial transformations',
      'Kleintier-Verwandlung': 'small-animal transformation',
      'Objekt zu Kleintier': 'object to small animal',
      'Teekanne-zu-Schildkröte-Übungen': 'teapot-to-tortoise exercises',
      'Unvollständige Verwandlungen korrigieren': 'correcting incomplete transformations',
      Stabilitätskontrolle: 'stability control',
      'Vogel-Verwandlung': 'bird transformation',
      'Hasen-Verwandlung': 'rabbit transformation',
      'Drachenfigur-Verwandlung': 'dragon-figurine transformation',
      'Erscheinungsbild-Verwandlung': 'appearance transformation',
      'Partielle Verwandlung': 'partial transformation',
      'Stabile Objektverwandlung unter Zeitdruck': 'stable object transformation under time pressure',
      'Komplexe Objektverwandlung': 'complex object transformation',
      Beschwörungsgrundlagen: 'conjuration fundamentals',
      'Grenzen menschlicher Verwandlung': 'limits of human transformation',
      'Fehleranalyse bei Zwischenformen': 'error analysis in intermediate forms',
      'Nonverbale Verwandlung': 'non-verbal Transfiguration',
      'Mehrstufige Verwandlungsfolgen': 'multi-stage transformation sequences',
      'Animagus-Theorie': 'Animagus theory',
      'Schwere Fehlverwandlungen rückführen': 'reversing severe failed transformations',
      'Transspezies-Verwandlung': 'cross-species transformation',
      'Fortgeschrittene Beschwörung': 'advanced conjuration',
      'Hochstabile Verwandlungsfelder': 'high-stability transformation fields',
      'Menschliche Verwandlung': 'human transformation',
      'Rechtliche Grenzen der Transfiguration': 'legal limits of Transfiguration',
      'Heiltrank gegen Furunkel': 'Cure for Boils',
      'Einfacher Schlaftrunk': 'simple Sleeping Draught',
      Vergesslichkeitstrank: 'Forgetfulness Potion',
      Hustenelixier: 'Cough Elixir',
      'Mildes Aufmunterungselixier': 'mild cheering elixir',
      'Einfache Gegengifte nach Zutatenfamilie': 'simple antidotes by ingredient family',
      'Schrumpf-Trank': 'Shrinking Solution',
      Abschwelltrank: 'Deflating Draught',
      Haarsträubetrank: 'Hair-Raising Potion',
      'Aufpäppel-Trank': 'Pepperup Potion',
      'Schwell-Lösung': 'Swelling Solution',
      'Erkennung verdorbener Zutaten': 'recognising spoiled ingredients',
      Verwirrungsgebräu: 'Confusing Concoction',
      Stärkungslösung: 'Strengthening Solution',
      'Wundreinigender Trank': 'Wound-Cleaning Potion',
      'Flubberwurmschleim-Bindungen': 'Flobberworm mucus bindings',
      'Gegengifte mittlerer Stärke': 'medium-strength antidotes',
      'Wolfsbann-Trank': 'Wolfsbane Potion',
      Alterungstrank: 'Ageing Potion',
      Friedensgebräu: 'Draught of Peace',
      'Kiemenkraut-Zubereitung': 'Gillyweed preparation',
      'Vielsaft-Trank': 'Polyjuice Potion',
      'Trank gegen Erschöpfung': 'draught against exhaustion',
      'Giftige Dämpfe erkennen': 'recognising poisonous fumes',
      'Trank der lebenden Toten': 'Draught of Living Death',
      Stärkungstrank: 'Strengthening Potion',
      'Erweiterte Gegengifte': 'advanced antidotes',
      'Zaubertrank Nr. 440': 'Potion No. 440',
      'Euphorie-Elixier': 'Elixir to Induce Euphoria',
      'Komplexe Trankketten': 'complex potion chains',
      'Alraune-Wiederbelebungstrank': 'Mandrake Restorative Draught',
      'Giftanalyse und Gegengifte': 'poison analysis and antidotes',
      Regenerationstränke: 'regeneration potions',
      'Drachenblut-Elixiere': 'dragon-blood elixirs',
      'Dickflüssiger goldener Zaubertrank': 'thick golden potion',
      'Meistertränke mit engen Temperaturfenstern': 'master-level potions with narrow temperature windows',
      Flitterblume: 'Flutterby Bush',
      Lenkpflaumen: 'Dirigible Plums',
      'Fangzähnige Geranie': 'Fanged Geranium',
      'Einfache Heilkräuter': 'simple healing herbs',
      'Drachenmist als Dünger': 'dragon dung as fertiliser',
      Teufelsschlinge: 'Devil’s Snare',
      'Alraune-Jungpflanzen': 'young Mandrakes',
      'Abessinische Schrumpelfeige': 'Abyssinian Shrivelfig',
      Flussgras: 'Fluxweed',
      'Chinesischer Kaukohl': 'Chinese Chomping Cabbage',
      Kartoffelbauchpilz: 'Puffapod',
      'Giftige Tentakeln erkennen': 'recognising poisonous tendrils',
      Pflanzenschutzkleidung: 'plant-protection clothing',
      'Pflanzensekrete sicher sammeln': 'safely collecting plant secretions',
      'Springende Knollen': 'bouncing bulbs',
      'Zitternder Ginsterbusch': 'shaking broom shrub',
      Kiemenkraut: 'Gillyweed',
      Spulenwurzel: 'spindle root',
      Plangentinie: 'Plangentine',
      Kreischbeißer: 'Fanged Geranium',
      Blutblasenschote: 'Blood Blisterpod',
      'Venemosa Tentacula Pflegeprotokoll': 'Venomous Tentacula care protocol',
      'Reife Alraunen': 'mature Mandrakes',
      'Seltene Heilpflanzen': 'rare healing plants',
      'Pflanzengifte und Gegengifte': 'plant poisons and antidotes',
      'Schlafbohne für Trank der lebenden Toten': 'Sopophorous bean for Draught of Living Death',
      'Mimbulus-Mimbeltonia-Schutzsekret': 'Mimbulus mimbletonia protective secretion',
      Mondscheinernte: 'moonlight harvest',
      'Gefährliche Gewächshausroutinen': 'dangerous greenhouse routines',
      Pflanzenkreuzungen: 'plant crossbreeding',
      'Teufelsschlinge-Abwehr vertieft': 'advanced Devil’s Snare defence',
      'Venemosa Tentacula fortgeschritten': 'advanced Venomous Tentacula',
      'Seltene magische Gewächse': 'rare magical plants',
      'Pflanzen in Fluchheilung': 'plants in curse healing',
      'Komplette Gewächshaus-Sicherheitsprüfung': 'complete greenhouse safety assessment',
      Flubberwurm: 'Flobberworm',
      Knarle: 'Knarl',
      Feen: 'Fairies',
      Baumwächter: 'Bowtruckle',
      Einhorn: 'Unicorn',
      Grindeloh: 'Grindylow',
      Feuerkrabbe: 'Fire Crab',
      'Knallrümpfiger Kröter': 'Blast-Ended Skrewt',
      Mondkalb: 'Mooncalf',
      Drachenarten: 'dragon species',
      Mantikor: 'Manticore',
      Chimära: 'Chimaera',
      Werwolf: 'Werewolf',
      Phönix: 'Phoenix',
      'Komplette Gefahrenklassifikation': 'complete danger classification',
      'Spezial-Enthüllungszauber': 'specialised Revealing Charm',
      'Gegenzauber zu leichteren Verhexungen': 'counter-spells against minor hexes',
      'Kontrollierte Zauberserien': 'controlled spell sequences',
      'Nonverbale Zauberketten': 'non-verbal spell chains',
      'Spuren-Enthüllungszauber': 'trace-revealing spell',
      'Komplexer Verbindungszauber': 'complex Linking Charm',
      'Schildzauber gegen Mehrfachangriff': 'Shield Charm against multiple attacks',
      'Fluchrecht und Verantwortlichkeit': 'curse law and responsibility',
      'Dunkle Artefakte erkennen': 'recognising dark artefacts',
      'Komplexe Duelle': 'complex duels',
      'Notfall-Gegenflüche': 'emergency counter-curses',
      'Schrumpf- und Anschwelltränke': 'shrinking and swelling potions',
      'Komplexe Temperaturführung': 'complex temperature control',
      'Gifte und Gegengifte': 'poisons and antidotes',
      Meistertränke: 'master-level potions',
      'Freies Forschungsgebräu': 'independent research brew',
      Giftpflanzenprotokolle: 'poisonous plant protocols',
      'Heilpflanzen für ZAG-Gegengifte': 'healing plants for O.W.L. antidotes',
      'Mondscheinernte der Plangentinie': 'moonlight harvest of Plangentine',
      'Heilpflanzen für UTZ-Tränke': 'healing plants for N.E.W.T. potions',
      'Teufelsschlinge vertieft': 'advanced Devil’s Snare',
      'Gewächshaus-Notfallroutinen': 'greenhouse emergency routines',
      'Prüfungsprojekt Pflegezyklus': 'exam project: care cycle',
      'Schutz magischer Biotope': 'protection of magical biotopes',
      'Internationale Gefahrenklassifikation': 'international danger classification',
      'Schutzgebiet-Protokolle': 'reserve protocols',
      'Walisischer Grünling': 'Common Welsh Green',
      'Schwedischer Kurzschnäuzler': 'Swedish Short-Snout',
      'Chinesischer Feuerball': 'Chinese Fireball',
      'Ungarischer Hornschwanz': 'Hungarian Horntail',
      'Drachenei-Schutzrecht': 'dragon-egg protection law',
      'Hitzeschutz und Beobachtungsabstand': 'heat protection and observation distance',
      'Norwegischer Stachelbuckel': 'Norwegian Ridgeback',
      'Peruanischer Viperzahn': 'Peruvian Vipertooth',
      'Rumänischer Langhorn': 'Romanian Longhorn',
      Hebridenschwarzdrache: 'Hebridean Black',
      'Reservatsarbeit und Schutzabstände': 'reserve work and safety distances',
      'Erste Hilfe bei Feuerverletzungen': 'first aid for fire injuries',
      Drachenkrankheiten: 'dragon diseases',
      'Drachenblut-Anwendungen': 'dragon-blood applications',
      Drachenberuhigung: 'dragon calming',
      'Internationale Drachenabkommen': 'international dragon agreements',
      'Notfall-Portschlüssel-Protokolle': 'emergency Portkey protocols',
      'Hochrisiko-Arten': 'high-risk species',
      'Heraufbeschwörungs-Grundlagen': 'conjuration fundamentals',
      Rückverwandlungszauber: 'reversal spell',
      Stabilitätsmessung: 'stability measurement',
      Fehlverwandlungsanalyse: 'failed-transformation analysis',
      'Grenzen lebender Verwandlung': 'limits of living transformation',
      'Fortgeschrittene Heraufbeschwörung': 'advanced conjuration',
      Verwandlungsrecht: 'Transfiguration law',
      'Rückverwandlung nach Fehlzaubern': 'reversal after failed spells',
      'Animagus-Grundformel': 'basic Animagus formula',
      Registrierungspflicht: 'registration duty',
      'Selbstbild und Tiergestalt': 'self-image and animal form',
      'Risiken unvollständiger Verwandlung': 'risks of incomplete transformation',
      'Historische Beispiele aus Hogwarts': 'historical examples from Hogwarts',
      'Alraunenblatt-Ritual': 'Mandrake-leaf ritual',
      'Animagus-Trankbestandteile': 'Animagus potion ingredients',
      Gewitterbedingung: 'thunderstorm condition',
      'Historische Animagi und Rechtsfälle': 'historical Animagi and legal cases',
      'Abgrenzung zu Verwandlungszaubern': 'distinction from Transfiguration spells',
      'Langzeitfolgen freiwilliger Verwandlung': 'long-term effects of voluntary transformation',
      'Geheimhaltung und Ministeriumsrecht': 'secrecy and Ministry law',
      'Ethik der Tarnung': 'ethics of concealment',
      'Fortgeschrittene Fallstudien': 'advanced case studies',
      'Warum heimliche Selbstversuche verboten sind': 'why secret self-experiments are forbidden',
      'Ziel, Wille und Ruhe': 'Destination, Determination and Deliberation',
      'Zersplintern vermeiden': 'avoiding splinching',
      'Zielkreis-Prüfung': 'target-circle test',
      'Notfall-Rückkehr': 'emergency return',
      'Rechtliche Mindestanforderungen': 'legal minimum requirements',
      Präzisionsapparieren: 'precision Apparition',
      'Seit-an-Seit-Apparieren': 'Side-Along Apparition',
      'Anti-Apparier-Schutz erkennen': 'recognising anti-Apparition protection',
      'Rechtliche Grenzen des Apparierens': 'legal limits of Apparition',
      Reiseprotokoll: 'travel protocol',
      'Sicheres Ankommen in unbekannten Orten': 'safe arrival in unfamiliar places',
      'Alchemistische Symbole': 'alchemical symbols',
      Metallentsprechungen: 'metal correspondences',
      Reagenzienketten: 'reagent chains',
      'Einfache Transmutation': 'simple transmutation',
      'Stein der Weisen': 'Philosopher’s Stone',
      'Sicherheitskreise für Laborarbeit': 'safety circles for laboratory work',
      Substanzwandel: 'substance transformation',
      Lebenselixier: 'Elixir of Life',
      'Gold-Transmutation': 'gold transmutation',
      'Seltene Katalysatoren': 'rare catalysts',
      'Alchemistische Sicherheitskreise': 'alchemical safety circles',
      'Grenzen verantwortlicher Stoffwandlung': 'limits of responsible substance transformation',
      'Stechpalme, Eibe, Weide und Esche': 'holly, yew, willow and ash',
      Phönixfeder: 'phoenix feather',
      Einhornhaar: 'unicorn hair',
      Drachenherzfaser: 'dragon heartstring',
      'Zauberstab-Bindung': 'wand bonding',
      'Grundlagen der Holztemperamente': 'fundamentals of wood temperaments',
      Resonanzprüfung: 'resonance test',
      Bruderstäbe: 'brother wands',
      Kernkonflikte: 'core conflicts',
      Holztemperament: 'wood temperament',
      Reparaturgrenzen: 'repair limits',
      'Sichere Arbeit mit Kernmustern': 'safe work with core samples',
      'Meisterfragen der Zauberstabkunde': 'master questions of wandlore',
      'Fluchumkehr-Effekt durch Bruderstäbe': 'curse-reversal effect through brother wands',
      Zauberstabloyalität: 'wand loyalty',
      'Gefährliche Kerne': 'dangerous cores',
      Dokumentationsprotokoll: 'documentation protocol',
      'Ethik der Zauberstabwahl': 'ethics of wand choice',
      Sucherdrills: 'Seeker drills',
      'Jäger-Passfolgen': 'Chaser passing sequences',
      'Treiber-Sicherheitswinkel': 'Beater safety angles',
      'Hüter-Reaktionsübungen': 'Keeper reaction exercises',
      Foulkunde: 'foul studies',
      'Fairplay und Mannschaftsrolle': 'fair play and team role',
      Positionsspiel: 'positional play',
      Spielanalyse: 'match analysis',
      'Klatscher-Laufwege': 'Bludger paths',
      Wettertaktik: 'weather tactics',
      Mannschaftskommunikation: 'team communication',
      Belastungssteuerung: 'load management',
      'Profi-Scouting': 'professional scouting',
      Finaltaktiken: 'final tactics',
      Schiedsrichterzeichen: 'referee signals',
      Turniervorbereitung: 'tournament preparation',
      Konditionsprüfung: 'fitness assessment',
      'Bewerbungsmappe für Vereine': 'application portfolio for clubs'
    };
    var translated = {};
    Object.keys(source.curriculumTopicsBySubject).forEach(function (key) {
      var original = source.curriculumTopicsBySubject[key];
      translated[key] = { title: titleMap[key] || translateText(original.title || ''), years: {} };
      Object.keys(original.years || {}).forEach(function (year) {
        translated[key].years[year] = original.years[year].map(function (entry) { return topicMap[entry] || translateText(entry); });
      });
    });
    data.curriculumTopicsBySubject = translated;
  }



  function sanitizeCurriculumTopics(data) {
    var replacements = {
      'Imperius Curse: innere Gegenwehr üben': 'Imperius Curse: practising inner resistance',
      'Rückführung misslungener Transfigurationen': 'Reversal of failed transfigurations',
      'Stabile Objektverwandlung unter Timedruck': 'Stable object transformation under time pressure',
      'Dickflüssiger goldener potion': 'Thick golden potion',
      'Drachenmist als Dünger': 'dragon dung as fertiliser',
      Kreischbeißer: 'Fanged Geranium',
      'Gefährliche Gewächshausroutinen': 'dangerous greenhouse routines',
      'Seltene magicale Gewächse': 'rare magical plants',
      'Komplette Gewächshaus-Sicherheitsprüfung': 'complete greenhouse safety assessment',
      Baumwächter: 'Bowtruckle',
      'Knallrümpfiger toadr': 'Blast-Ended Skrewt',
      Chimära: 'Chimaera',
      Phönix: 'Phoenix',
      'Notfall-Gegenflüche': 'emergency counter-curses',
      'Schrumpf- and Anschwelltränke': 'shrinking and swelling potions',
      'Komplexe Temperaturführung': 'complex temperature control',
      Meistertränke: 'master-level potions',
      'Freies Forschungsgebräu': 'independent research brew',
      'Heilpflanzen for N.E.W.T.-Tränke': 'healing plants for N.E.W.T. potions',
      'Geplante fortgeschrittene Abwehr, curses and Gegenflüche (kann je nach Kursverlauf abweichen)': 'Planned advanced defence, curses and counter-curses (may vary depending on course progress)'
    };
    Object.keys((data.curriculumTopicsBySubject || {})).forEach(function (key) {
      var topic = data.curriculumTopicsBySubject[key];
      if (topic.title && replacements[topic.title]) topic.title = replacements[topic.title];
      Object.keys((topic.years || {})).forEach(function (year) {
        topic.years[year] = topic.years[year].map(function (entry) { return replacements[entry] || entry; });
      });
    });
  }

  function sanitizeEnglishContent(data) {
    var replacements = [
      ['Zauberstab-Herstellungskunde', 'Wandmaking Studies'],
      ['wand-Herstellungskunde', 'Wandmaking Studies'],
      ['Zauberschach-Club', 'Wizard Chess Club'],
      ['Zauberschach Club', 'Wizard Chess Club'],
      ['Koboldstein-Club', 'Gobstones Club'],
      ['Hausaufgaben-Treff', 'Homework Meet-up'],
      ['Froschchor', 'Frog Choir'],
      ['Magische-Geschöpfe-Club', 'Magical Creatures Club'],
      ['Zauberkunst-Club', 'Charms Club'],
      ['Rattenrennen-Club', 'Rat Racing Club'],
      ['Alte-Runen-Club', 'Ancient Runes Club'],
      ['Boots- und Angelclub', 'Boating and Fishing Club'],
      ['Brieffreunde-Hogwarts', 'Hogwarts Pen Pals'],
      ['Haustreff Gryffindor', 'Gryffindor House Meeting'],
      ['Haustreff Hufflepuff', 'Hufflepuff House Meeting'],
      ['Haustreff Ravenclaw', 'Ravenclaw House Meeting'],
      ['Haustreff Slytherin', 'Slytherin House Meeting'],
      ['Außergewöhnliche Charms', 'Extraordinary Charms'],
      ['Außergewöhnliche Zauberkunst', 'Extraordinary Charms'],
      ['Standardzauber', 'The Standard Book of Spells'],
      ['Einführung in potions', 'Introduction to Potions'],
      ['Einführung in Zaubertränke', 'Introduction to Potions'],
      ['Kessel, Kräuter and klare Schnitte', 'Cauldrons, Herbs and Clean Cuts'],
      ['Kessel, Kräuter und klare Schnitte', 'Cauldrons, Herbs and Clean Cuts'],
      ['Potente Zaubertränke and ihre Gefahren', 'Potent Potions and Their Dangers'],
      ['Potente Zaubertränke und ihre Gefahren', 'Potent Potions and Their Dangers'],
      ['Gegenmittel and Elixiere', 'Antidotes and Elixirs'],
      ['Gegenmittel und Elixiere', 'Antidotes and Elixirs'],
      ['Meistertränke', 'Master Potions'],
      ['Komplexe Trankketten', 'Complex Potion Chains'],
      ['Tausend magicale Kräuter and Pilze', 'One Thousand Magical Herbs and Fungi'],
      ['Tausend magische Kräuter und Pilze', 'One Thousand Magical Herbs and Fungi'],
      ['Gewächshauskunde', 'Greenhouse Studies'],
      ['Gefährliche Sprösslinge', 'Dangerous Seedlings'],
      ['Heilpflanzen', 'Healing Plants'],
      ['Seltene magicale Gewächse', 'Rare Magical Plants'],
      ['Seltene magische Gewächse', 'Rare Magical Plants'],
      ['Dunkle Kräfte: Ein Leitfathe zum Selbstschutz', 'Dark Forces: A Guide to Self-Protection'],
      ['Dunkle Kräfte: Ein Leitfaden zum Selbstschutz', 'Dark Forces: A Guide to Self-Protection'],
      ['Gegenflüche and Schutzzauber', 'Counter-Curses and Protective Charms'],
      ['Dunkle Kreaturen and Abwehr', 'Dark Creatures and Defence'],
      ['Meisterkurs Defensive Magie', 'Master Course in Defensive Magic'],
      ['Geschichte the Zauberei', 'A History of Magic'],
      ['Geschichte der Zauberei', 'A History of Magic'],
      ['Koboldaufstände', 'Goblin Rebellions'],
      ['Magische Gesetzgebung', 'Magical Legislation'],
      ['Internationale Zaubererkonflikte', 'International Wizarding Conflicts'],
      ['ZAG-Chroniken', 'O.W.L. Chronicles'],
      ['Leitfathe für Verwandlungsanfänger', 'Guide for Beginner Transfiguration'],
      ['Leitfaden für Verwandlungsanfänger', 'Guide for Beginner Transfiguration'],
      ['Form and Funktion', 'Form and Function'],
      ['Tierverwandlung', 'Animal Transfiguration'],
      ['Stabile Objektverwandlung', 'Stable Object Transfiguration'],
      ['Fortgeschrittene Transfiguration', 'Advanced Transfiguration'],
      ['Quidditch in the Wandel the Timeen', 'Quidditch Through the Ages'],
      ['Quidditch im Wandel der Zeiten', 'Quidditch Through the Ages'],
      ['Sterne über Hogwarts - a Einführungsband in the Astronomy', 'Stars over Hogwarts - An Introduction to Astronomy'],
      ['Sterne über Hogwarts - ein Einführungsband in die Astronomie', 'Stars over Hogwarts - An Introduction to Astronomy'],
      ['Mondphasen and magicale Nächte', 'Moon Phases and Magical Nights'],
      ['Sternkarten for Fortgeschrittene', 'Star Charts for Advanced Students'],
      ['Kometen, Konjunktionen and Omen', 'Comets, Conjunctions and Omens'],
      ['O.W.L.-Astronomy: Prüfungsatlas', 'O.W.L. Astronomy: Exam Atlas'],
      ['N.E.W.T.-Himmelskunde', 'N.E.W.T. Celestial Studies'],
      ['Glasphiolen', 'glass phials'],
      ['Glashphiolen', 'glass phials'],
      ['Saubere Phiolen', 'clean phials'],
      ['Laborphiolen', 'laboratory phials'],
      ['zusätzliche phials', 'additional phials'],
      ['dragon hidehandschuhe', 'dragon-hide gloves'],
      ['Drachenhauthandschuhe', 'dragon-hide gloves'],
      ['Drachenhaut-Schutzhandschuhe', 'dragon-hide protective gloves'],
      ['Schutzhandschuhe', 'protective gloves'],
      ['Ohrenschützer', 'earmuffs'],
      ['Übungsobjekte', 'practice objects'],
      ['Federkiel and Pergament', 'quill and parchment'],
      ['Federkiel und Pergament', 'quill and parchment'],
      ['Notizpergament', 'note parchment'],
      ['Notizbuch', 'notebook'],
      ['Schutzbrille', 'safety goggles'],
      ['Sicherheitsbrille', 'safety goggles'],
      ['Zutatenmesser', 'ingredient knife'],
      ['Waage', 'scales'],
      ['Kessel aus Zinn', 'pewter cauldron'],
      ['Kessel', 'cauldron'],
      ['Pflanzenschere', 'plant shears'],
      ['Robuste Stiefel', 'sturdy boots'],
      ['robuste Schuhe', 'sturdy shoes'],
      ['Außenunterricht', 'outdoor lessons'],
      ['creaturesbeobachtung', 'creature observation'],
      ['plantsetiketten', 'plant labels'],
      ['warmes Sitzkissen', 'warm seat cushion'],
      ['Quidditchtribünen', 'Quidditch stands'],
      ['tragbares Notizbuch', 'portable notebook'],
      ['zusätzlicher Schal', 'additional scarf'],
      ['Hausfarben', 'house colours'],
      ['Futterbeutel', 'feed pouch'],
      ['Sternkarte', 'star chart'],
      ['Teleskop wird im Astronomieturm gestellt', 'telescope provided in the Astronomy Tower'],
      ['Warmer Umhang for Nightstunden', 'warm cloak for night lessons'],
      ['Warmer Umhang', 'warm cloak'],
      ['Wetterfester Umhang', 'weatherproof cloak'],
      ['Feuerfester Umhang wird gestellt', 'fireproof cloak provided'],
      ['Fernglas', 'binoculars'],
      ['Bequeme Schuhe', 'comfortable shoes'],
      ['Genehmigungsformular', 'permission form'],
      ['Reagenzienkasten', 'reagent kit'],
      ['Kupferkessel', 'copper cauldron'],
      ['Silbermesser', 'silver knife'],
      ['Messingwaage', 'brass scales'],
      ['Zauberkatalog', 'spell catalogue'],
      ['wandpflegeset optional', 'optional wand-care kit'],
      ['Zauberstabpflegeset optional', 'optional wand-care kit'],
      ['Messinstrumente', 'measuring instruments'],
      ['Übungsfiguren', 'practice figures'],
      ['Klemmblatt', 'clipboard'],
      ['Klemmbrett', 'clipboard'],
      ['Spielplan', 'match schedule'],
      ['Pfeife optional', 'optional whistle'],
      ['Einkaufsliste', 'shopping list'],
      ['Galeonenbeutel', 'Galleon pouch'],
      ['Pflanzenführer', 'plant guide'],
      ['Handschuhe', 'gloves'],
      ['Skizzenbuch', 'sketchbook'],
      ['Ausweisformular', 'identification form'],
      ['Festumhang', 'dress robes'],
      ['Fragenkatalog', 'question catalogue'],
      ['Fragenliste', 'question list'],
      ['Austauschpergament', 'exchange parchment'],
      ['Ausreisepapiere', 'travel papers'],
      ['Französisches Wörterbuch', 'French dictionary'],
      ['Reisepass für magische Reisen', 'passport for magical travel'],
      ['Reisepass for magicale Reisen', 'passport for magical travel'],
      ['Geplante plants in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned plants in this school year (may vary depending on course progress)'],
      ['Geplante potions in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned potions in this school year (may vary depending on course progress)'],
      ['Geplante creatures in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned creatures in this school year (may vary depending on course progress)'],
      ['Geplante Transfigurationszauber in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned Transfiguration spells in this school year (may vary depending on course progress)'],
      ['Geplante fortgeschrittene spells in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned advanced spells in this school year (may vary depending on course progress)'],
      ['Geplante fortgeschrittene potions in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned advanced potions in this school year (may vary depending on course progress)'],
      ['Geplante fortgeschrittene plants in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned advanced plants in this school year (may vary depending on course progress)'],
      ['Geplante fortgeschrittene creatures in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned advanced creatures in this school year (may vary depending on course progress)'],
      ['Geplante Drachen and Hochrisiko-creatures in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned dragons and high-risk creatures in this school year (may vary depending on course progress)'],
      ['Geplante fortgeschrittene Transfigurationszauber in diesem school year (kann je nach Kursverlauf abweichen)', 'Planned advanced Transfiguration spells in this school year (may vary depending on course progress)'],
      ['Zauberstabkunde in diesem school year', 'Wandlore in this school year'],
      ['wandkunde in diesem school year', 'Wandlore in this school year'],
      ['Animagus-Theorie in diesem school year', 'Animagus theory in this school year'],
      ['Venemosa Tentacula Pflegeprotokoll', 'Venomous Tentacula care protocol'],
      ['Venemosa Tentacula fortgeschritten', 'advanced Venomous Tentacula'],
      ['Seltene Heilpflanzen', 'rare healing plants'],
      ['Heilpflanzen richtig ernten', 'harvesting healing plants correctly'],
      ['Pflanzen in Fluchheilung', 'plants in curse healing'],
      ['Pflanzenkreuzungen', 'plant crossbreeding'],
      ['Pflanzengifte and Gegengifte', 'plant poisons and antidotes'],
      ['Pflanzengifte und Gegengifte', 'plant poisons and antidotes'],
      ['Giftpflanzenprotokolle', 'poisonous plant protocols'],
      ['Gewächshaus-Notfallroutinen', 'greenhouse emergency routines'],
      ['Prüfungsprojekt Pflegezyklus', 'exam project: care cycle'],
      ['Schutz magicaler Biotope', 'protection of magical biotopes'],
      ['Schutz magischer Biotope', 'protection of magical biotopes'],
      ['Verteidigungsklassenzimmer', 'Defence classroom'],
      ['Nordflügel', 'north wing'],
      ['Gewächshaus Unterrichtsgarten', 'Greenhouse teaching garden'],
      ['Gewächshaus lessonssgarten', 'Greenhouse teaching garden'],
      ['Gewächshaus Vier', 'Greenhouse Four'],
      ['Schlossgärten hinter the Hauptgebäude', 'castle gardens behind the main building'],
      ['Tränkeklassenzimmer', 'Potions classroom'],
      ['Tränkeklassenzalways', 'Potions classroom'],
      ['Slytherin-Kerkerflügel', 'Slytherin dungeon wing'],
      ['Slytherin-dungeonsflügel', 'Slytherin dungeon wing'],
      ['Runenkabinett', 'Rune cabinet'],
      ['Arithmancyraum', 'Arithmancy room'],
      ['Ravenclaw-towerzugang', 'Ravenclaw tower access'],
      ['Nordturm', 'North Tower'],
      ['Wahrsagezimmer', 'Divination classroom'],
      ['Taktikraum', 'tactics room'],
      ['Kunstraum', 'art room'],
      ['Pokalzimmer', 'trophy room'],
      ['librarysflügel', 'library wing'],
      ['Wildhüterhütte and Außengehege on the Verbotenen Wald', 'gamekeeper’s hut and outdoor enclosure by the Forbidden Forest'],
      ['Wildhüterhütte on the Verbotenen Wald', 'gamekeeper’s hut by the Forbidden Forest'],
      ['Außengehege on the Verbotenen Wald, Wildhüterpfad', 'outdoor enclosure by the Forbidden Forest, gamekeeper’s path'],
      ['Verbotenen Wald', 'Forbidden Forest'],
      ['Mugglekunderaum', 'Muggle Studies room'],
      ['Alchemylabor', 'Alchemy laboratory'],
      ['dungeonsflügel', 'dungeon wing'],
      ['Werkraum for wandkunde', 'Wandlore workshop'],
      ['Hauptgebäude', 'main building'],
      ['Professor Slughorns Büro', 'Professor Slughorn’s office'],
      ['Büro by Filch', 'Filch’s office'],
      ['Kellergewölbe nahe the Hufflepuff-Fässern', 'cellar vault near the Hufflepuff barrels'],
      ['Hospitalflügel', 'hospital wing'],
      ['Geräteschuppen', 'equipment shed'],
      ['Hogwarts-Schulbeiratszalways neben the Lehrerzimmer', 'Hogwarts school-board room beside the staff room']
    ];

    function polish(value) {
      if (typeof value !== 'string') return value;
      var result = value;
      replacements.forEach(function (pair) { result = result.split(pair[0]).join(pair[1]); });
      result = result
        .replace(/ZAG-/g, 'O.W.L. ')
        .replace(/UTZ-/g, 'N.E.W.T. ')
        .replace(/\bZAG\b/g, 'O.W.L.')
        .replace(/\bUTZ\b/g, 'N.E.W.T.')
        .replace(/dragon hide([\w-]+)/gi, 'dragon-hide $1')
        .replace(/magicale/g, 'magical')
        .replace(/the lebenthe Toten/g, 'the Living Dead')
        .replace(/lebenthe/g, 'living')
        .replace(/kla /g, 'small ')
        .replace(/ for /g, ' for ')
        .replace(/\s{2,}/g, ' ')
        .trim();
      return result;
    }

    (function walk(value, path, parent, key) {
      if (typeof value === 'string') {
        if (!shouldSkip(path, value)) parent[key] = polish(value);
        return;
      }
      if (Array.isArray(value)) return value.forEach(function (item, index) { walk(item, path.concat(index), value, index); });
      if (value && typeof value === 'object') Object.keys(value).forEach(function (itemKey) { walk(value[itemKey], path.concat(itemKey), value, itemKey); });
    })(data, [], { root: data }, 'root');
  }

  function collectLikelyGerman(data) {
    var missing = [];
    var germanNeedle = /(Schüler|Schul|Unterricht|Wahlpflicht|Ausflug|Zaubertränke|Zauberkunst|Kräuterkunde|Verwandlung|Geschöpfe|Muggel|Prüfung|Jahrgang|Große Halle|Gemeinschaftsraum|Frühstück|Mittagessen|Abendessen|ä|ö|ü|ß)/i;
    (function walk(value, path) {
      if (typeof value === 'string') {
        if (path.indexOf('studentSuppliesByYear') > -1) return;
        if (path[path.length - 1] === 'category') return;
        if (/Müller/.test(value)) return;
        if (!shouldSkip(path, value) && germanNeedle.test(value)) missing.push(path.join('.') + ': ' + value.slice(0, 90));
        return;
      }
      if (Array.isArray(value)) return value.forEach(function (item, index) { walk(item, path.concat(index)); });
      if (value && typeof value === 'object') Object.keys(value).forEach(function (key) { walk(value[key], path.concat(key)); });
    })(data, []);
    return missing;
  }

  window.HOGWARTS_I18N = {
    defaultLanguage: 'de',
    languages: {
      de: { label: 'Deutsch', flag: '🇩🇪' },
      en: { label: 'English', flag: '🇬🇧' }
    },
    sourceLanguage: 'de',
    localize: localize,
    translate: translateText
  };
})();
