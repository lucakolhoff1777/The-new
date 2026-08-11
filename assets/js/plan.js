(() => {
  "use strict";

  /* =======================================================================
     Reference data — example week, replace with the practice's own records
     ======================================================================= */

  // Fixed categorical order. Validated for the dark surface with
  // scripts/validate_palette.js: lightness band, chroma floor, CVD
  // separation, normal-vision floor and contrast all pass.
  const THERAPISTS = [
    { id: "lk", short: "LK", name: "Luca Kolhoff",    role: "Manuelle Therapie · CMD",        color: "#2E9A76" },
    { id: "mb", short: "MB", name: "Mira Bergmann",   role: "Sportphysio · Athletik-Lab",     color: "#BE8418" },
    { id: "jr", short: "JR", name: "Jonas Reither",   role: "Krankengymnastik · Elektro",     color: "#4489BE" },
    { id: "sh", short: "SH", name: "Sophie Hartmann", role: "Lymphdrainage · Massage",        color: "#BC5570" },
    { id: "hw", short: "HW", name: "Hanna Wiedemann", role: "Krankengymnastik · Manuelle Th.", color: "#7E77CE" },
  ];

  const ROOMS = [
    { id: 0, name: "Raum I",       note: "Manuelle Therapie" },
    { id: 1, name: "Raum II",      note: "Krankengymnastik" },
    { id: 2, name: "Raum III",     note: "Massage · Lymphe" },
    { id: 3, name: "Athletik-Lab", note: "Diagnostik · Training" },
  ];

  const DAYS = [
    { key: 0, short: "Mo", date: "10.08." },
    { key: 1, short: "Di", date: "11.08." },
    { key: 2, short: "Mi", date: "12.08." },
    { key: 3, short: "Do", date: "13.08." },
    { key: 4, short: "Fr", date: "14.08." },
    { key: 5, short: "Sa", date: "15.08." },
  ];

  const BILL = {
    rezept: "Heilmittelverordnung",
    privat: "Privat / Selbstzahler",
    paket:  "Return-to-Sport Paket",
    zuweis: "CMD · mit Zuweisung",
  };

  // day, room, start, minutes, therapist, patient, treatment, billing
  const A = (day, room, start, min, ther, patient, type, bill) =>
    ({ day, room, start, min, ther, patient, type, bill });

  const APPOINTMENTS = [
    /* ---- Montag ---- */
    A(0, 0, "08:00", 60, "mb", "N. Tran", "Sportphysiotherapie", "privat"),
    A(0, 1, "08:00", 45, "jr", "V. Aydin", "Manuelle Therapie", "rezept"),
    A(0, 2, "08:00", 45, "lk", "B. Frey", "Schienenbegleitung", "zuweis"),
    A(0, 1, "08:45", 60, "jr", "J. Zeller", "Krankengymnastik", "rezept"),
    A(0, 2, "08:45", 45, "lk", "U. Demir", "Schienenbegleitung", "zuweis"),
    A(0, 0, "09:00", 60, "sh", "S. Wendler", "Klassische Massage", "privat"),
    A(0, 3, "09:00", 90, "mb", "A. Okafor", "Athletik-Check", "privat"),
    A(0, 2, "09:30", 60, "lk", "F. Neuhaus", "Manuelle Therapie", "privat"),
    A(0, 1, "09:45", 45, "jr", "N. Dietrich", "Manuelle Therapie", "rezept"),
    A(0, 0, "10:00", 45, "hw", "W. Kettler", "Manuelle Therapie", "rezept"),
    A(0, 1, "10:30", 20, "jr", "W. Duarte", "Elektro & Ultraschall", "rezept"),
    A(0, 2, "10:30", 45, "sh", "T. Marchand", "Klassische Massage", "privat"),
    A(0, 3, "10:30", 60, "lk", "V. Thiel", "Sportphysiotherapie", "privat"),
    A(0, 0, "10:45", 60, "hw", "G. Möller", "Manuelle Therapie", "privat"),
    A(0, 1, "11:00", 60, "mb", "V. Yilmaz", "Sportphysiotherapie", "privat"),
    A(0, 2, "11:15", 45, "sh", "P. Mahler", "Lymphdrainage", "rezept"),
    A(0, 3, "11:30", 20, "lk", "O. Vogt", "Kinesiotaping", "privat"),
    A(0, 0, "13:00", 45, "hw", "T. Mahler", "Manuelle Therapie", "rezept"),
    A(0, 1, "13:00", 60, "sh", "H. Kessler", "Klassische Massage", "privat"),
    A(0, 2, "13:00", 45, "jr", "Z. Ludwig", "Krankengymnastik", "rezept"),
    A(0, 3, "13:00", 60, "mb", "J. Aksoy", "Return-to-Sport", "paket"),
    A(0, 0, "13:45", 45, "jr", "G. Kovac", "Manuelle Therapie", "rezept"),
    A(0, 2, "13:45", 60, "hw", "Z. Arnold", "Krankengymnastik", "rezept"),
    A(0, 1, "14:00", 45, "sh", "C. Krüger", "Klassische Massage", "privat"),
    A(0, 3, "14:00", 60, "lk", "C. Hartwig", "Sportphysiotherapie", "privat"),
    A(0, 0, "14:30", 20, "jr", "V. Engel", "Elektro & Ultraschall", "rezept"),
    A(0, 1, "14:45", 45, "hw", "Y. Kolb", "Manuelle Therapie", "rezept"),
    A(0, 2, "14:45", 45, "sh", "B. Riedel", "Lymphdrainage", "rezept"),
    A(0, 0, "15:00", 60, "mb", "M. Sperling", "Sportphysiotherapie", "privat"),
    A(0, 3, "15:00", 60, "jr", "R. Duarte", "Krankengymnastik", "rezept"),
    A(0, 1, "15:30", 60, "lk", "W. Obermann", "CMD-Ersttermin", "zuweis"),
    A(0, 2, "15:30", 60, "hw", "H. Bauer", "Manuelle Therapie", "privat"),
    A(0, 0, "16:00", 60, "sh", "C. Amrein", "Klassische Massage", "privat"),
    A(0, 3, "16:00", 45, "mb", "B. Claus", "Leistungs-Recheck", "privat"),
    A(0, 1, "16:30", 45, "jr", "L. Winkler", "Krankengymnastik", "rezept"),
    A(0, 2, "16:30", 45, "hw", "K. Roth", "Lymphdrainage", "rezept"),
    A(0, 0, "17:00", 45, "sh", "C. Ludwig", "Klassische Massage", "privat"),
    A(0, 1, "17:15", 45, "jr", "S. Marchand", "Krankengymnastik", "rezept"),
    A(0, 3, "17:15", 60, "hw", "T. Ziegler", "Krankengymnastik", "rezept"),
    A(0, 0, "18:15", 45, "hw", "N. Aydin", "Lymphdrainage", "rezept"),

    /* ---- Dienstag ---- */
    A(1, 0, "08:00", 45, "sh", "P. Mahler", "Lymphdrainage", "rezept"),
    A(1, 1, "08:00", 45, "jr", "V. Engel", "Krankengymnastik", "rezept"),
    A(1, 1, "08:45", 45, "jr", "V. Aydin", "Manuelle Therapie", "rezept"),
    A(1, 2, "08:45", 45, "sh", "T. Marchand", "Klassische Massage", "privat"),
    A(1, 0, "09:00", 60, "mb", "V. Yilmaz", "Sportphysiotherapie", "privat"),
    A(1, 3, "09:00", 20, "lk", "F. Neuhaus", "Kinesiotaping", "privat"),
    A(1, 1, "09:30", 60, "sh", "C. Amrein", "Klassische Massage", "privat"),
    A(1, 2, "09:30", 60, "lk", "W. Obermann", "CMD-Ersttermin", "zuweis"),
    A(1, 3, "09:30", 60, "jr", "J. Zeller", "Krankengymnastik", "rezept"),
    A(1, 0, "10:00", 60, "hw", "T. Ziegler", "Krankengymnastik", "rezept"),
    A(1, 1, "10:30", 45, "jr", "L. Winkler", "Krankengymnastik", "rezept"),
    A(1, 2, "10:30", 60, "mb", "N. Tran", "Sportphysiotherapie", "privat"),
    A(1, 3, "10:30", 60, "lk", "O. Vogt", "Sportphysiotherapie", "privat"),
    A(1, 0, "11:00", 45, "hw", "Y. Kolb", "Manuelle Therapie", "rezept"),
    A(1, 1, "11:15", 45, "sh", "C. Krüger", "Klassische Massage", "privat"),
    A(1, 2, "11:30", 20, "mb", "M. Sperling", "Kinesiotaping", "privat"),
    A(1, 3, "11:30", 20, "lk", "B. Frey", "Kinesiotaping", "privat"),
    A(1, 0, "13:00", 60, "hw", "H. Bauer", "Manuelle Therapie", "privat"),
    A(1, 1, "13:00", 20, "mb", "B. Claus", "Kinesiotaping", "privat"),
    A(1, 2, "13:00", 60, "lk", "C. Hartwig", "Sportphysiotherapie", "privat"),
    A(1, 3, "13:00", 20, "sh", "V. Zeller", "Kinesiotaping", "privat"),
    A(1, 1, "13:30", 45, "jr", "S. Marchand", "Krankengymnastik", "rezept"),
    A(1, 3, "13:30", 90, "mb", "A. Okafor", "Athletik-Check", "privat"),
    A(1, 0, "14:00", 45, "hw", "W. Kettler", "Manuelle Therapie", "rezept"),
    A(1, 2, "14:00", 60, "sh", "H. Kessler", "Klassische Massage", "privat"),
    A(1, 1, "14:15", 45, "lk", "U. Demir", "Schienenbegleitung", "zuweis"),
    A(1, 0, "14:45", 60, "hw", "G. Möller", "Manuelle Therapie", "privat"),
    A(1, 1, "15:00", 45, "jr", "Z. Ludwig", "Krankengymnastik", "rezept"),
    A(1, 2, "15:00", 60, "mb", "R. Yilmaz", "Sportphysiotherapie", "privat"),
    A(1, 3, "15:00", 60, "lk", "R. Haas", "Sportphysiotherapie", "privat"),
    A(1, 0, "15:45", 60, "sh", "S. Wendler", "Klassische Massage", "privat"),
    A(1, 1, "15:45", 45, "hw", "N. Aydin", "Lymphdrainage", "rezept"),
    A(1, 2, "16:00", 45, "jr", "N. Dietrich", "Manuelle Therapie", "rezept"),
    A(1, 3, "16:00", 60, "mb", "J. Aksoy", "Return-to-Sport", "paket"),
    A(1, 1, "16:30", 45, "hw", "T. Mahler", "Manuelle Therapie", "rezept"),
    A(1, 2, "16:45", 45, "lk", "C. Ziegler", "Schienenbegleitung", "zuweis"),
    A(1, 0, "17:00", 20, "mb", "M. Marchand", "Kinesiotaping", "privat"),
    A(1, 3, "17:15", 60, "hw", "Z. Arnold", "Krankengymnastik", "rezept"),
    A(1, 0, "17:30", 20, "mb", "R. Wendler", "Kinesiotaping", "privat"),
    A(1, 2, "17:30", 20, "lk", "C. Marchand", "Kinesiotaping", "privat"),
    A(1, 0, "18:15", 45, "hw", "D. Vogel", "Lymphdrainage", "rezept"),

    /* ---- Mittwoch ---- */
    A(2, 0, "08:00", 45, "sh", "T. Marchand", "Klassische Massage", "privat"),
    A(2, 1, "08:00", 60, "hw", "T. Ziegler", "Krankengymnastik", "rezept"),
    A(2, 2, "08:00", 45, "lk", "C. Ziegler", "Schienenbegleitung", "zuweis"),
    A(2, 2, "08:45", 60, "lk", "C. Marchand", "Manuelle Therapie", "privat"),
    A(2, 3, "08:45", 20, "sh", "H. Nowak", "Kinesiotaping", "privat"),
    A(2, 0, "09:00", 60, "mb", "R. Yilmaz", "Sportphysiotherapie", "privat"),
    A(2, 1, "09:00", 45, "jr", "Z. Ludwig", "Krankengymnastik", "rezept"),
    A(2, 3, "09:15", 60, "hw", "D. Nowak", "Krankengymnastik", "rezept"),
    A(2, 1, "09:45", 45, "jr", "S. Marchand", "Krankengymnastik", "rezept"),
    A(2, 2, "09:45", 45, "sh", "V. Zeller", "Klassische Massage", "privat"),
    A(2, 0, "10:00", 60, "mb", "R. Wendler", "Sportphysiotherapie", "privat"),
    A(2, 3, "10:15", 60, "lk", "R. Haas", "Sportphysiotherapie", "privat"),
    A(2, 1, "10:30", 60, "sh", "H. Kessler", "Klassische Massage", "privat"),
    A(2, 2, "10:30", 45, "jr", "G. Kovac", "Manuelle Therapie", "rezept"),
    A(2, 0, "11:00", 60, "mb", "V. Yilmaz", "Sportphysiotherapie", "privat"),
    A(2, 2, "11:15", 45, "hw", "D. Vogel", "Lymphdrainage", "rezept"),
    A(2, 3, "11:15", 20, "lk", "U. Kolb", "Kinesiotaping", "privat"),
    A(2, 1, "11:30", 20, "jr", "J. Zeller", "Elektro & Ultraschall", "rezept"),
    A(2, 0, "13:00", 45, "jr", "W. Duarte", "Krankengymnastik", "rezept"),
    A(2, 1, "13:00", 45, "hw", "W. Kettler", "Manuelle Therapie", "rezept"),
    A(2, 2, "13:00", 45, "sh", "C. Krüger", "Klassische Massage", "privat"),
    A(2, 3, "13:00", 90, "mb", "M. Marchand", "Athletik-Check", "privat"),
    A(2, 0, "13:45", 45, "hw", "A. Demir", "Lymphdrainage", "rezept"),
    A(2, 1, "13:45", 60, "lk", "F. Neuhaus", "Manuelle Therapie", "privat"),
    A(2, 2, "13:45", 45, "jr", "V. Engel", "Krankengymnastik", "rezept"),
    A(2, 0, "14:30", 20, "hw", "C. Bianchi", "Elektro & Ultraschall", "rezept"),
    A(2, 2, "14:30", 60, "sh", "C. Amrein", "Klassische Massage", "privat"),
    A(2, 3, "14:30", 60, "jr", "T. Wendler", "Krankengymnastik", "rezept"),
    A(2, 1, "14:45", 45, "lk", "B. Frey", "Schienenbegleitung", "zuweis"),
    A(2, 0, "15:00", 60, "mb", "H. Möller", "Sportphysiotherapie", "privat"),
    A(2, 1, "15:30", 60, "jr", "E. Kovac", "Krankengymnastik", "rezept"),
    A(2, 2, "15:30", 60, "sh", "S. Wendler", "Klassische Massage", "privat"),
    A(2, 3, "15:30", 20, "lk", "U. Adler", "Kinesiotaping", "privat"),
    A(2, 0, "16:00", 60, "mb", "S. Kramer", "Sportphysiotherapie", "privat"),
    A(2, 2, "16:30", 30, "sh", "A. Fuchs", "Lymphdrainage", "rezept"),
    A(2, 3, "16:30", 60, "jr", "H. Brandt", "Krankengymnastik", "rezept"),
    A(2, 0, "17:00", 60, "mb", "B. Ludwig", "Sportphysiotherapie", "privat"),
    A(2, 2, "17:30", 20, "jr", "S. Kirsch", "Elektro & Ultraschall", "rezept"),

    /* ---- Donnerstag ---- */
    A(3, 0, "08:00", 60, "mb", "H. Möller", "Sportphysiotherapie", "privat"),
    A(3, 0, "09:00", 60, "jr", "H. Brandt", "Krankengymnastik", "rezept"),
    A(3, 1, "09:00", 45, "hw", "D. Vogel", "Lymphdrainage", "rezept"),
    A(3, 2, "09:00", 60, "mb", "S. Kramer", "Sportphysiotherapie", "privat"),
    A(3, 1, "09:45", 60, "hw", "C. Bianchi", "Manuelle Therapie", "privat"),
    A(3, 0, "10:00", 45, "lk", "U. Adler", "CMD-Folge", "zuweis"),
    A(3, 2, "10:00", 30, "sh", "A. Fuchs", "Lymphdrainage", "rezept"),
    A(3, 3, "10:00", 60, "jr", "T. Wendler", "Krankengymnastik", "rezept"),
    A(3, 2, "10:30", 45, "sh", "H. Nowak", "Klassische Massage", "privat"),
    A(3, 0, "10:45", 60, "hw", "D. Nowak", "Krankengymnastik", "rezept"),
    A(3, 1, "10:45", 45, "lk", "U. Kolb", "Schienenbegleitung", "zuweis"),
    A(3, 3, "11:00", 45, "mb", "B. Claus", "Leistungs-Recheck", "privat"),
    A(3, 2, "11:15", 45, "sh", "V. Zeller", "Klassische Massage", "privat"),
    A(3, 1, "11:30", 20, "lk", "A. Reiss", "Kinesiotaping", "privat"),
    A(3, 0, "13:00", 45, "lk", "C. Ziegler", "Schienenbegleitung", "zuweis"),
    A(3, 1, "13:00", 45, "sh", "C. Ludwig", "Klassische Massage", "privat"),
    A(3, 2, "13:00", 60, "jr", "E. Kovac", "Krankengymnastik", "rezept"),
    A(3, 3, "13:00", 60, "mb", "R. Wendler", "Sportphysiotherapie", "privat"),
    A(3, 0, "13:45", 45, "hw", "A. Demir", "Lymphdrainage", "rezept"),
    A(3, 1, "13:45", 60, "lk", "R. Haas", "Sportphysiotherapie", "privat"),
    A(3, 2, "14:00", 45, "sh", "B. Riedel", "Lymphdrainage", "rezept"),
    A(3, 3, "14:00", 60, "jr", "W. Sauer", "Krankengymnastik", "rezept"),
    A(3, 0, "14:30", 45, "hw", "D. Behrend", "Krankengymnastik", "rezept"),
    A(3, 1, "14:45", 45, "sh", "E. Berger", "Lymphdrainage", "rezept"),
    A(3, 2, "14:45", 60, "lk", "C. Marchand", "Manuelle Therapie", "privat"),
    A(3, 3, "15:00", 90, "mb", "A. Okafor", "Athletik-Check", "privat"),
    A(3, 0, "15:15", 45, "jr", "S. Kirsch", "Krankengymnastik", "rezept"),
    A(3, 1, "15:30", 45, "hw", "A. Riedel", "Lymphdrainage", "rezept"),
    A(3, 2, "15:45", 45, "sh", "O. Hübner", "Klassische Massage", "privat"),
    A(3, 0, "16:00", 45, "lk", "O. Yilmaz", "Schienenbegleitung", "zuweis"),
    A(3, 1, "16:15", 45, "jr", "W. Duarte", "Krankengymnastik", "rezept"),
    A(3, 2, "16:30", 45, "sh", "B. Neuhaus", "Klassische Massage", "privat"),
    A(3, 3, "16:30", 60, "hw", "C. Arnold", "Krankengymnastik", "rezept"),
    A(3, 0, "16:45", 60, "lk", "F. Keller", "Manuelle Therapie", "privat"),
    A(3, 1, "17:00", 45, "jr", "V. Weiss", "Krankengymnastik", "rezept"),
    A(3, 2, "17:15", 45, "sh", "I. Frey", "Klassische Massage", "privat"),
    A(3, 1, "17:45", 45, "lk", "I. Baumann", "Manuelle Therapie", "rezept"),
    A(3, 0, "18:00", 60, "sh", "I. Ferreira", "Klassische Massage", "privat"),
    A(3, 2, "18:30", 20, "lk", "D. Sauer", "Kinesiotaping", "privat"),

    /* ---- Freitag ---- */
    A(4, 0, "08:00", 45, "sh", "B. Neuhaus", "Klassische Massage", "privat"),
    A(4, 1, "08:00", 60, "lk", "A. Reiss", "Manuelle Therapie", "privat"),
    A(4, 2, "08:00", 45, "jr", "V. Weiss", "Krankengymnastik", "rezept"),
    A(4, 0, "08:45", 45, "sh", "I. Frey", "Klassische Massage", "privat"),
    A(4, 2, "08:45", 20, "jr", "T. Wendler", "Elektro & Ultraschall", "rezept"),
    A(4, 1, "09:00", 60, "mb", "S. Kramer", "Sportphysiotherapie", "privat"),
    A(4, 3, "09:00", 20, "lk", "O. Yilmaz", "Kinesiotaping", "privat"),
    A(4, 2, "09:15", 60, "jr", "H. Brandt", "Krankengymnastik", "rezept"),
    A(4, 0, "09:30", 60, "sh", "I. Ferreira", "Klassische Massage", "privat"),
    A(4, 3, "09:30", 60, "lk", "G. Roth", "Sportphysiotherapie", "privat"),
    A(4, 1, "10:00", 45, "hw", "A. Demir", "Lymphdrainage", "rezept"),
    A(4, 2, "10:15", 60, "mb", "R. Yilmaz", "Sportphysiotherapie", "privat"),
    A(4, 0, "10:30", 45, "lk", "U. Kolb", "Schienenbegleitung", "zuweis"),
    A(4, 3, "10:30", 60, "jr", "W. Sauer", "Krankengymnastik", "rezept"),
    A(4, 1, "10:45", 60, "hw", "P. Reiss", "Krankengymnastik", "rezept"),
    A(4, 0, "11:15", 20, "mb", "R. Hofmann", "Kinesiotaping", "privat"),
    A(4, 2, "11:15", 45, "sh", "E. Berger", "Lymphdrainage", "rezept"),
    A(4, 3, "11:30", 20, "lk", "G. Vogt", "Kinesiotaping", "privat"),
    A(4, 0, "13:00", 60, "hw", "S. Ziegler", "Krankengymnastik", "rezept"),
    A(4, 1, "13:00", 60, "mb", "E. Amrein", "Sportphysiotherapie", "privat"),
    A(4, 2, "13:00", 60, "jr", "E. Kovac", "Krankengymnastik", "rezept"),
    A(4, 3, "13:00", 60, "lk", "K. Marchand", "Sportphysiotherapie", "privat"),
    A(4, 0, "14:00", 45, "hw", "H. Fuchs", "Krankengymnastik", "rezept"),
    A(4, 1, "14:00", 45, "sh", "H. Nowak", "Klassische Massage", "privat"),
    A(4, 2, "14:00", 60, "mb", "B. Duarte", "Sportphysiotherapie", "privat"),
    A(4, 3, "14:00", 60, "jr", "C. Baumann", "Krankengymnastik", "rezept"),
    A(4, 0, "14:45", 45, "sh", "O. Hübner", "Klassische Massage", "privat"),
    A(4, 1, "14:45", 45, "hw", "N. Frey", "Lymphdrainage", "rezept"),
    A(4, 2, "15:00", 60, "mb", "I. Amrein", "Sportphysiotherapie", "privat"),
    A(4, 3, "15:00", 60, "lk", "D. Mahler", "Sportphysiotherapie", "privat"),
    A(4, 0, "15:30", 60, "hw", "H. Kuhn", "Krankengymnastik", "rezept"),
    A(4, 1, "15:30", 45, "sh", "B. Riedel", "Lymphdrainage", "rezept"),
    A(4, 2, "16:00", 60, "mb", "N. Okafor", "Sportphysiotherapie", "privat"),
    A(4, 3, "16:00", 20, "lk", "C. Wagner", "Kinesiotaping", "privat"),
    A(4, 1, "16:15", 45, "sh", "I. Sauer", "Lymphdrainage", "rezept"),
    A(4, 3, "16:30", 60, "hw", "Y. Mertens", "Krankengymnastik", "rezept"),
    A(4, 0, "17:00", 20, "mb", "L. Behrend", "Kinesiotaping", "privat"),
    A(4, 2, "17:30", 45, "hw", "I. Behrend", "Krankengymnastik", "rezept"),
    A(4, 3, "17:30", 20, "mb", "Y. Lorenz", "Kinesiotaping", "privat"),
    A(4, 0, "18:15", 45, "hw", "Y. Ilic", "Manuelle Therapie", "rezept"),

    /* ---- Samstag ---- */
    A(5, 0, "09:00", 45, "hw", "H. Fuchs", "Krankengymnastik", "rezept"),
    A(5, 1, "09:00", 45, "lk", "O. Yilmaz", "Schienenbegleitung", "zuweis"),
    A(5, 2, "09:00", 60, "mb", "B. Duarte", "Sportphysiotherapie", "privat"),
    A(5, 1, "09:45", 45, "hw", "I. Behrend", "Krankengymnastik", "rezept"),
    A(5, 3, "09:45", 60, "lk", "K. Marchand", "Sportphysiotherapie", "privat"),
    A(5, 0, "10:00", 60, "mb", "I. Amrein", "Sportphysiotherapie", "privat"),
    A(5, 2, "10:30", 60, "hw", "P. Reiss", "Krankengymnastik", "rezept"),
    A(5, 1, "10:45", 45, "lk", "C. Wagner", "Schienenbegleitung", "zuweis"),
    A(5, 0, "11:00", 60, "mb", "E. Amrein", "Sportphysiotherapie", "privat"),
    A(5, 2, "11:30", 60, "lk", "A. Reiss", "Manuelle Therapie", "privat"),
    A(5, 3, "11:30", 60, "hw", "Y. Mertens", "Krankengymnastik", "rezept"),
    A(5, 0, "12:00", 60, "mb", "N. Okafor", "Sportphysiotherapie", "privat"),
    A(5, 2, "12:30", 20, "lk", "G. Vogt", "Kinesiotaping", "privat"),
  ];

  /* =======================================================================
     Preisliste — Privatsätze der Praxis.
     `unit` ist die Dauer, für die `eur` gilt; abweichende Dauern werden
     anteilig berechnet und auf 50 Cent gerundet, so wie auf der Rechnung.
     ======================================================================= */

  const PRICES = {
    "Manuelle Therapie":    { unit: 30, eur: 46 },
    "Krankengymnastik":     { unit: 30, eur: 38 },
    "Sportphysiotherapie":  { unit: 30, eur: 49 },
    "Klassische Massage":   { unit: 30, eur: 36 },
    "Lymphdrainage":        { unit: 30, eur: 42 },
    "Elektro & Ultraschall":{ unit: 20, eur: 12 },
    "Kinesiotaping":        { unit: 20, eur: 24 },
    "CMD-Ersttermin":       { unit: 60, eur: 135 },
    "CMD-Folge":            { unit: 45, eur: 98 },
    "Schienenbegleitung":   { unit: 45, eur: 86 },
    "Return-to-Sport":      { unit: 60, eur: 125 },
    "Leistungs-Recheck":    { unit: 45, eur: 95 },
    "Athletik-Check":       { unit: 90, eur: 215 },
  };

  const priceOf = (a) => {
    const p = PRICES[a.type];
    if (!p) return 0;
    return Math.round((p.eur * a.min) / p.unit * 2) / 2;   // auf 50 Cent
  };

  const eur = (n) =>
    n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const eur0 = (n) => Math.round(n).toLocaleString("de-DE") + " €";

  // Jede Rechnung braucht einen Zahlungsstand. Die Beispieldaten leiten ihn
  // fest aus dem Namen ab, damit die Zahlen bei jedem Laden dieselben sind.
  const hash = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };
  const PAYMENTS = ["Karte", "Überweisung", "Bar"];

  /* =======================================================================
     Helpers
     ======================================================================= */

  const DAY_START = 8, DAY_END = 19;
  // One break for the whole house, Monday to Friday (ArbZG). Saturday
  // shifts stay under six hours, so no break is required there.
  const LUNCH = [12 * 60, 13 * 60];
  const hasLunch = (day) => day < 5;
  // One source of truth for the row height — CSS reads it back off :root,
  // so the grid lines and the blocks can never drift apart.
  const HOUR_PX = 82;
  document.documentElement.style.setProperty("--hour", HOUR_PX + "px");
  const byId = (id) => document.getElementById(id);
  const therOf = (id) => THERAPISTS.find((t) => t.id === id);
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt = (mins) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

  const state = { day: 0, hidden: new Set(), view: "raum" };

  /* =======================================================================
     Sign-in — a curtain, not a lock (see the note in the page footer).
     The session flag only saves re-typing while the tab is open.
     ======================================================================= */

  const PASSWORD = "2026";
  const SESSION_KEY = "lk-intranet";
  const gate = byId("gate"), app = byId("app");

  function signIn() {
    gate.classList.add("is-open");
    app.hidden = false;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* private mode */ }
    render();
  }

  byId("gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const note = byId("gateNote");
    if (byId("gateInput").value.trim() === PASSWORD) {
      signIn();
    } else {
      note.textContent = "Passwort stimmt nicht — Demo-Passwort ist 2026.";
      note.classList.add("is-error");
      byId("gateInput").select();
    }
  });

  byId("logout").addEventListener("click", () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* private mode */ }
    location.reload();
  });

  /* =======================================================================
     Section tabs
     ======================================================================= */

  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => {
        const on = x === t;
        x.classList.toggle("is-on", on);
        x.setAttribute("aria-selected", String(on));
      });
      document.querySelectorAll(".panel").forEach((p) => {
        p.hidden = p.dataset.panel !== t.dataset.tab;
      });
    });
  });

  /* =======================================================================
     Controls
     ======================================================================= */

  const daysWrap = byId("days");
  DAYS.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "day" + (d.key === state.day ? " is-on" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(d.key === state.day));
    b.innerHTML = `<b>${d.short}</b><span>${d.date}</span>`;
    b.addEventListener("click", () => {
      state.day = d.key;
      daysWrap.querySelectorAll(".day").forEach((x, i) => {
        x.classList.toggle("is-on", i === d.key);
        x.setAttribute("aria-selected", String(i === d.key));
      });
      render();
    });
    daysWrap.appendChild(b);
  });

  const legend = byId("legend");
  THERAPISTS.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lg";
    b.style.setProperty("--c", t.color);
    b.setAttribute("aria-pressed", "true");
    b.innerHTML = `<span class="dot"></span>${t.name}`;
    b.addEventListener("click", () => {
      if (state.hidden.has(t.id)) state.hidden.delete(t.id);
      else state.hidden.add(t.id);
      const off = state.hidden.has(t.id);
      b.classList.toggle("is-off", off);
      b.setAttribute("aria-pressed", String(!off));
      render();
    });
    legend.appendChild(b);
  });

  document.querySelectorAll(".vbtn").forEach((b) => {
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      document.querySelectorAll(".vbtn").forEach((x) => x.classList.toggle("is-on", x === b));
      byId("boardWrap").hidden = state.view !== "raum";
      byId("listWrap").hidden = state.view !== "liste";
    });
  });

  /* =======================================================================
     Rendering
     ======================================================================= */

  const head = byId("boardHead"), body = byId("boardBody");
  head.style.setProperty("--rooms", ROOMS.length);
  body.style.setProperty("--rooms", ROOMS.length);

  function visibleForDay() {
    return APPOINTMENTS.filter((a) => a.day === state.day);
  }

  function renderHead() {
    head.innerHTML =
      `<div class="rh">Zeit</div>` +
      ROOMS.map((r) => `<div class="rh">${r.name}<small>${r.note}</small></div>`).join("");
  }

  function renderBoard() {
    const hours = DAY_END - DAY_START;
    let html = `<div class="axis">`;
    for (let h = DAY_START; h < DAY_END; h++) html += `<div class="tick">${String(h).padStart(2, "0")}:00</div>`;
    html += `</div>`;

    ROOMS.forEach((room) => {
      html += `<div class="col">`;
      for (let h = 0; h < hours; h++) html += `<div class="slot"></div>`;
      visibleForDay()
        .filter((a) => a.room === room.id)
        .forEach((a) => {
          const t = therOf(a.ther);
          const top = ((toMin(a.start) - DAY_START * 60) / 60) * HOUR_PX;
          const h = (a.min / 60) * HOUR_PX - 3;           // 3px keeps a surface gap between blocks
          const dim = state.hidden.has(a.ther) ? " is-dim" : "";
          // 45-minute blocks still fit the treatment if set tight; the
          // shortest ones collapse to a single line with just the name
          const short = a.min <= 20 ? " is-mini"
                      : a.min <= 30 ? " is-tight"
                      : a.min <= 45 ? " is-short" : "";
          html += `<button type="button" class="appt${dim}${short}"
              style="--c:${t.color}; top:${top}px; height:${h}px"
              data-id="${APPOINTMENTS.indexOf(a)}">
              <span class="who">${t.short}</span>
              <span class="t">${a.start}–${fmt(toMin(a.start) + a.min)}</span>
              <span class="n">${a.patient}</span>
              <span class="s">${a.type}</span>
            </button>`;
        });
      html += `</div>`;
    });
    if (hasLunch(state.day)) {
      html += `<div class="lunchband" style="top:${((LUNCH[0] - DAY_START * 60) / 60) * HOUR_PX}px;
               height:${((LUNCH[1] - LUNCH[0]) / 60) * HOUR_PX}px"><span>Mittagspause 12–13 Uhr</span></div>`;
    }
    body.innerHTML = html;

    body.querySelectorAll(".appt").forEach((el) => {
      el.addEventListener("click", () => openDrawer(APPOINTMENTS[+el.dataset.id]));
    });
  }

  function renderList() {
    const rows = visibleForDay()
      .filter((a) => !state.hidden.has(a.ther))
      .sort((x, y) => toMin(x.start) - toMin(y.start));
    byId("listBody").innerHTML = rows.map((a) => {
      const t = therOf(a.ther);
      return `<tr>
        <td>${a.start}–${fmt(toMin(a.start) + a.min)}</td>
        <td>${ROOMS[a.room].name}</td>
        <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.name}</span></td>
        <td>${a.patient}</td>
        <td>${a.type}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="5">Keine Termine für die gewählte Auswahl.</td></tr>`;
  }

  function renderStats() {
    const shown = visibleForDay().filter((a) => !state.hidden.has(a.ther));
    const minutes = shown.reduce((s, a) => s + a.min, 0);
    const closed = hasLunch(state.day) ? LUNCH[1] - LUNCH[0] : 0;
    const capacity = ROOMS.length * ((DAY_END - DAY_START) * 60 - closed);

    byId("statCount").textContent = shown.length;
    byId("statCountNote").textContent = `${DAYS[state.day].short} ${DAYS[state.day].date}`;
    byId("statHours").textContent = (minutes / 60).toFixed(1).replace(".", ",") + " h";

    const load = capacity ? Math.round((minutes / capacity) * 100) : 0;
    byId("statLoad").textContent = load + " %";
    byId("statLoadBar").style.width = load + "%";
    byId("statLoadNote").textContent = closed
      ? `${ROOMS.length} Räume · 08–19 Uhr ohne Mittagspause`
      : `${ROOMS.length} Räume · 08–19 Uhr`;

    // longest stretch with no appointment in any room
    const busy = new Array(DAY_END * 60).fill(false);
    shown.forEach((a) => {
      for (let m = toMin(a.start); m < toMin(a.start) + a.min; m++) busy[m] = true;
    });
    if (hasLunch(state.day)) for (let m = LUNCH[0]; m < LUNCH[1]; m++) busy[m] = true;
    let best = 0, run = 0, bestEnd = 0;
    for (let m = DAY_START * 60; m < DAY_END * 60; m++) {
      if (!busy[m]) { run++; if (run > best) { best = run; bestEnd = m + 1; } }
      else run = 0;
    }
    byId("statGap").textContent = best >= 60
      ? (best / 60).toFixed(1).replace(".", ",") + " h"
      : best + " min";
    byId("statGapNote").textContent = best
      ? `${fmt(bestEnd - best)}–${fmt(bestEnd)} praxisweit frei`
      : "durchgehend belegt";
  }

  /* =======================================================================
     Week matrix — therapists down, days across
     ======================================================================= */

  const statsFor = (list) => ({
    n: list.length,
    h: list.reduce((s, a) => s + a.min, 0) / 60,
  });

  function renderWeek() {
    byId("matrixHead").innerHTML =
      `<th scope="col">Therapeut:in</th>` +
      DAYS.map((d) => `<th scope="col">${d.short}<small>${d.date}</small></th>`).join("") +
      `<th scope="col" class="tot">Woche</th>`;

    // one shared scale so the cells are comparable across the whole table
    let peak = 0;
    THERAPISTS.forEach((t) => DAYS.forEach((d) => {
      const n = APPOINTMENTS.filter((a) => a.ther === t.id && a.day === d.key).length;
      if (n > peak) peak = n;
    }));

    byId("matrixBody").innerHTML = THERAPISTS.map((t) => {
      const cells = DAYS.map((d) => {
        const s = statsFor(APPOINTMENTS.filter((a) => a.ther === t.id && a.day === d.key));
        if (!s.n) return `<td class="mc is-empty"><span class="mc-n">–</span></td>`;
        const strength = 0.16 + (s.n / peak) * 0.5;
        return `<td class="mc" style="--c:${t.color}; --f:${strength}">
                  <span class="mc-n">${s.n}</span>
                  <span class="mc-h">${s.h.toFixed(1).replace(".", ",")} h</span>
                </td>`;
      }).join("");
      const w = statsFor(APPOINTMENTS.filter((a) => a.ther === t.id));
      return `<tr>
        <th scope="row" class="mrow" style="--c:${t.color}">
          <i></i><span><b>${t.name}</b><small>${t.role}</small></span>
        </th>
        ${cells}
        <td class="mc tot"><span class="mc-n">${w.n}</span><span class="mc-h">${w.h.toFixed(1).replace(".", ",")} h</span></td>
      </tr>`;
    }).join("");

    // room utilisation across the week
    const openMin = DAYS.length * (DAY_END - DAY_START) * 60;
    byId("roomsLoad").innerHTML = ROOMS.map((r) => {
      const mins = APPOINTMENTS.filter((a) => a.room === r.id).reduce((s, a) => s + a.min, 0);
      const pct = Math.round((mins / openMin) * 100);
      return `<div class="rl">
        <div class="rl-top"><span>${r.name}</span><b>${pct} %</b></div>
        <span class="meter"><i style="width:${pct}%"></i></span>
        <span class="rl-note">${(mins / 60).toFixed(1).replace(".", ",")} h belegt · ${r.note}</span>
      </div>`;
    }).join("");
  }

  /* =======================================================================
     Team
     ======================================================================= */

  function renderTeam() {
    byId("teamList").innerHTML = THERAPISTS.map((t) => {
      const mine = APPOINTMENTS.filter((a) => a.ther === t.id);
      const w = statsFor(mine);
      const rooms = [...new Set(mine.map((a) => ROOMS[a.room].name))].join(" · ") || "—";
      const types = [...new Set(mine.map((a) => a.type))];
      return `<article class="tcard" style="--c:${t.color}">
        <div class="tcard-top">
          <span class="tcard-badge">${t.short}</span>
          <div><h3>${t.name}</h3><p>${t.role}</p></div>
        </div>
        <dl class="tcard-figs">
          <div><dt>Termine</dt><dd>${w.n}</dd></div>
          <div><dt>Stunden</dt><dd>${w.h.toFixed(1).replace(".", ",")}</dd></div>
          <div><dt>Umsatz</dt><dd>${eur0(mine.reduce((s, a) => s + priceOf(a), 0))}</dd></div>
        </dl>
        <p class="tcard-rooms"><span>Räume</span>${rooms}</p>
        <div class="tcard-types">${types.map((x) => `<span>${x}</span>`).join("")}</div>
      </article>`;
    }).join("");
  }

  /* =======================================================================
     Abrechnung — eine Rechnung je Patient:in über die ganze Woche
     ======================================================================= */

  // gebaut, sobald die Datei geladen ist; die Woche ändert sich nicht mehr
  const INVOICES = (() => {
    const map = new Map();
    APPOINTMENTS.forEach((a, i) => {
      if (!map.has(a.patient)) map.set(a.patient, { patient: a.patient, items: [] });
      map.get(a.patient).items.push({ idx: i, appt: a, price: priceOf(a) });
    });

    return [...map.values()].map((inv) => {
      inv.items.sort((x, y) =>
        x.appt.day - y.appt.day || toMin(x.appt.start) - toMin(y.appt.start));
      inv.total = inv.items.reduce((s, it) => s + it.price, 0);
      inv.types = [...new Set(inv.items.map((it) => it.appt.type))];
      inv.bills = [...new Set(inv.items.map((it) => it.appt.bill))];
      inv.thers = [...new Set(inv.items.map((it) => it.appt.ther))];
      const last = inv.items[inv.items.length - 1].appt;
      inv.lastDay = DAYS[last.day];

      const h = hash(inv.patient);
      inv.paid = h % 100 < 62;
      inv.pay = PAYMENTS[h % PAYMENTS.length];
      inv.no = "R-2026-" + String(1200 + (h % 780)).padStart(4, "0");
      return inv;
    });
  })();

  const billState = { sort: "summe", q: "" };

  function billRows() {
    const q = billState.q.trim().toLowerCase();
    const rows = INVOICES.filter((inv) =>
      !q || inv.patient.toLowerCase().includes(q) ||
      inv.types.some((t) => t.toLowerCase().includes(q)));

    const by = {
      summe:   (x, y) => y.total - x.total,
      termine: (x, y) => y.items.length - x.items.length || y.total - x.total,
      name:    (x, y) => x.patient.localeCompare(y.patient, "de"),
    }[billState.sort];
    return rows.sort(by);
  }

  function renderBill() {
    const total = INVOICES.reduce((s, i) => s + i.total, 0);
    const open = INVOICES.filter((i) => !i.paid).reduce((s, i) => s + i.total, 0);
    const n = APPOINTMENTS.length;

    byId("billTotal").textContent = eur0(total);
    byId("billTotalNote").textContent = `${n} Positionen · ${INVOICES.length} Rechnungen`;
    byId("billOpen").textContent = eur0(open);
    byId("billOpenNote").textContent =
      `${INVOICES.filter((i) => !i.paid).length} offene Rechnungen · ${Math.round((open / total) * 100)} % vom Umsatz`;
    byId("billOpenBar").style.width = Math.round((open / total) * 100) + "%";
    byId("billAvg").textContent = eur0(total / n);
    byId("billHeads").textContent = INVOICES.length;
    byId("billHeadsNote").textContent =
      `Ø ${(n / INVOICES.length).toFixed(1).replace(".", ",")} Termine je Person`;

    /* --- Umsatz nach Leistung: eine Größe, deshalb ein Farbton --- */
    const perType = Object.keys(PRICES).map((type) => {
      const list = APPOINTMENTS.filter((a) => a.type === type);
      return { type, n: list.length, sum: list.reduce((s, a) => s + priceOf(a), 0) };
    }).filter((r) => r.n).sort((x, y) => y.sum - x.sum);

    const peak = perType[0].sum;
    byId("billBars").innerHTML = perType.map((r) => `
      <div class="bar">
        <span class="bar-label">${r.type}</span>
        <span class="bar-track"><i style="width:${(r.sum / peak) * 100}%"></i></span>
        <span class="bar-val"><b>${eur0(r.sum)}</b><small>${r.n}×</small></span>
      </div>`).join("");

    /* --- Rechnungen je Patient:in --- */
    const rows = billRows();
    byId("billBody").innerHTML = rows.map((inv) => `
      <tr tabindex="0" role="button" data-patient="${inv.patient}">
        <td class="bp"><b>${inv.patient}</b><small>${inv.no}</small></td>
        <td class="num">${inv.items.length}</td>
        <td><span class="chips">${inv.types.map((t) => `<span>${t}</span>`).join("")}</span></td>
        <td class="bmuted">${inv.bills.map((b) => BILL[b]).join(" · ")}</td>
        <td>${inv.paid
          ? `<span class="pill is-paid">✓ bezahlt<small>${inv.pay}</small></span>`
          : `<span class="pill is-open">● offen<small>seit ${inv.lastDay.date}</small></span>`}</td>
        <td class="num sum">${eur(inv.total)}</td>
      </tr>`).join("") ||
      `<tr><td colspan="6">Keine Treffer für „${billState.q}“.</td></tr>`;

    byId("billFoot").textContent = eur(rows.reduce((s, i) => s + i.total, 0));

    byId("billBody").querySelectorAll("tr[data-patient]").forEach((tr) => {
      const inv = INVOICES.find((i) => i.patient === tr.dataset.patient);
      tr.addEventListener("click", () => openInvoice(inv));
      tr.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvoice(inv); }
      });
    });

    byId("priceList").innerHTML = Object.entries(PRICES)
      .sort((a, b) => b[1].eur / b[1].unit - a[1].eur / a[1].unit)
      .map(([type, p]) => `<div class="pr">
        <span class="pr-name">${type}</span>
        <span class="pr-unit">${p.unit} Min.</span>
        <span class="pr-eur">${eur0(p.eur)}</span>
      </div>`).join("");
  }

  /* =======================================================================
     Umsatz je Therapeut:in — dieselben Positionen, nur anders gruppiert
     ======================================================================= */

  const therState = { split: "detail", hidden: new Set() };

  // Gruppenschlüssel je Ansicht. `detail` ist die Dreierkombination
  // Therapeut:in × Patient:in × Leistung, die anderen fassen eine Stufe zusammen.
  const SPLITS = {
    detail:   { key: (a) => [a.ther, a.patient, a.type],
                head: ["Therapeut:in", "Patient:in", "Leistung"] },
    patient:  { key: (a) => [a.ther, a.patient],
                head: ["Therapeut:in", "Patient:in", "Leistungen"] },
    leistung: { key: (a) => [a.ther, a.type],
                head: ["Therapeut:in", "Leistung", "Patient:innen"] },
  };

  function therGroups() {
    const split = SPLITS[therState.split];
    const map = new Map();
    APPOINTMENTS.forEach((a) => {
      if (therState.hidden.has(a.ther)) return;
      const k = JSON.stringify(split.key(a));
      if (!map.has(k)) {
        map.set(k, { ther: a.ther, patient: a.patient, type: a.type,
                     patients: new Set(), types: new Set(), n: 0, sum: 0 });
      }
      const g = map.get(k);
      g.patients.add(a.patient);
      g.types.add(a.type);
      g.n += 1;
      g.sum += priceOf(a);
    });
    // nach Therapeut:in in fester Reihenfolge, darin der größte Posten zuerst
    const order = (id) => THERAPISTS.findIndex((t) => t.id === id);
    return [...map.values()].sort((x, y) => order(x.ther) - order(y.ther) || y.sum - x.sum);
  }

  function renderTherRevenue() {
    const per = THERAPISTS.map((t) => {
      const mine = APPOINTMENTS.filter((a) => a.ther === t.id);
      const sum = mine.reduce((s, a) => s + priceOf(a), 0);
      const top = (pick) => {
        const acc = {};
        mine.forEach((a) => { acc[pick(a)] = (acc[pick(a)] || 0) + priceOf(a); });
        return Object.entries(acc).sort((x, y) => y[1] - x[1])[0];
      };
      return { t, n: mine.length, sum,
               heads: new Set(mine.map((a) => a.patient)).size,
               topType: top((a) => a.type), topPat: top((a) => a.patient) };
    }).sort((x, y) => y.sum - x.sum);

    const grand = per.reduce((s, x) => s + x.sum, 0);

    byId("therCards").innerHTML = per.map((r) => `
      <article class="tr-card" style="--c:${r.t.color}">
        <div class="tr-top">
          <span class="tr-badge">${r.t.short}</span>
          <div><h3>${r.t.name}</h3><p>${r.t.role}</p></div>
        </div>
        <span class="tr-sum">${eur0(r.sum)}</span>
        <span class="meter" aria-hidden="true"><i style="width:${(r.sum / grand) * 100}%"></i></span>
        <span class="tr-share">${Math.round((r.sum / grand) * 100)} % vom Wochenumsatz ·
          ${r.n} Termine · ${r.heads} Patient:innen · Ø ${eur0(r.sum / r.n)}</span>
        <dl class="tr-facts">
          <div><dt>Stärkste Leistung</dt><dd>${r.topType[0]}<b>${eur0(r.topType[1])}</b></dd></div>
          <div><dt>Stärkste:r Patient:in</dt><dd>${r.topPat[0]}<b>${eur0(r.topPat[1])}</b></dd></div>
        </dl>
      </article>`).join("");

    const head = SPLITS[therState.split].head;
    byId("therHead").innerHTML =
      head.map((h) => `<th scope="col">${h}</th>`).join("") +
      `<th scope="col" class="num">Termine</th><th scope="col" class="num">Umsatz</th>`;

    const rows = therGroups();
    byId("therBody").innerHTML = rows.map((g) => {
      const t = therOf(g.ther);
      const mid = {
        detail:   `<td>${g.patient}</td><td>${g.type}</td>`,
        patient:  `<td>${g.patient}</td>
                   <td><span class="chips">${[...g.types].map((x) => `<span>${x}</span>`).join("")}</span></td>`,
        leistung: `<td>${g.type}</td>
                   <td class="bmuted">${g.patients.size} ${g.patients.size === 1 ? "Person" : "Personen"}</td>`,
      }[therState.split];
      return `<tr>
        <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.name}</span></td>
        ${mid}
        <td class="num">${g.n}</td>
        <td class="num sum">${eur(g.sum)}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="5">Keine Therapeut:in ausgewählt.</td></tr>`;

    byId("therFoot").textContent = eur(rows.reduce((s, g) => s + g.sum, 0));
  }

  // Filterknöpfe — dieselbe Mechanik wie die Legende im Tagesplan
  const therPick = byId("therPick");
  THERAPISTS.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lg";
    b.style.setProperty("--c", t.color);
    b.setAttribute("aria-pressed", "true");
    b.innerHTML = `<span class="dot"></span>${t.name}`;
    b.addEventListener("click", () => {
      if (therState.hidden.has(t.id)) therState.hidden.delete(t.id);
      else therState.hidden.add(t.id);
      const off = therState.hidden.has(t.id);
      b.classList.toggle("is-off", off);
      b.setAttribute("aria-pressed", String(!off));
      renderTherRevenue();
    });
    therPick.appendChild(b);
  });

  document.querySelectorAll("[data-split]").forEach((b) => {
    b.addEventListener("click", () => {
      therState.split = b.dataset.split;
      document.querySelectorAll("[data-split]").forEach((x) => x.classList.toggle("is-on", x === b));
      renderTherRevenue();
    });
  });

  byId("billSearch").addEventListener("input", (e) => {
    billState.q = e.target.value;
    renderBill();
  });
  document.querySelectorAll("[data-sort]").forEach((b) => {
    b.addEventListener("click", () => {
      billState.sort = b.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((x) => x.classList.toggle("is-on", x === b));
      renderBill();
    });
  });

  function render() {
    renderHead();
    renderBoard();
    renderList();
    renderStats();
    renderWeek();
    renderBill();
    renderTherRevenue();
    renderTeam();
  }

  /* =======================================================================
     Detail drawer
     ======================================================================= */

  const drawer = byId("drawer");
  const drawerBody = byId("drawerBody");

  function openDrawer(a) {
    const t = therOf(a.ther);
    byId("dTime").textContent = `${DAYS[a.day].short} ${DAYS[a.day].date} · ${a.start}–${fmt(toMin(a.start) + a.min)}`;
    byId("dTitle").textContent = a.patient;
    drawerBody.innerHTML = `
      <dl class="drawer-list">
        <div><dt>Therapeut:in</dt><dd>${t.name} (${t.short})</dd></div>
        <div><dt>Raum</dt><dd>${ROOMS[a.room].name}</dd></div>
        <div><dt>Leistung</dt><dd>${a.type}</dd></div>
        <div><dt>Dauer</dt><dd>${a.min} Minuten</dd></div>
        <div><dt>Abrechnung</dt><dd>${BILL[a.bill] || "—"}</dd></div>
        <div><dt>Betrag</dt><dd>${eur(priceOf(a))}</dd></div>
      </dl>
      <button type="button" class="drawer-more" data-open-invoice="${a.patient}">
        Ganze Abrechnung von ${a.patient} ansehen →
      </button>`;
    drawerBody.querySelector("[data-open-invoice]").addEventListener("click", () => {
      openInvoice(INVOICES.find((i) => i.patient === a.patient));
    });
    drawer.hidden = false;
  }

  function openInvoice(inv) {
    byId("dTime").textContent = `${inv.no} · Woche 10.–15.08.2026`;
    byId("dTitle").textContent = inv.patient;
    drawerBody.innerHTML = `
      <div class="inv-head">
        ${inv.paid
          ? `<span class="pill is-paid">✓ bezahlt<small>${inv.pay}</small></span>`
          : `<span class="pill is-open">● offen<small>seit ${inv.lastDay.date}</small></span>`}
        <span class="inv-meta">${inv.items.length} Positionen · ${inv.bills.map((b) => BILL[b]).join(" · ")}</span>
      </div>
      <table class="postable">
        <caption class="sr-only">Einzelpositionen</caption>
        <thead>
          <tr><th scope="col">Tag</th><th scope="col">Leistung</th>
              <th scope="col">Therapeut:in</th><th scope="col" class="num">Dauer</th>
              <th scope="col" class="num">Betrag</th></tr>
        </thead>
        <tbody>
          ${inv.items.map((it) => {
            const a = it.appt, t = therOf(a.ther);
            return `<tr>
              <td>${DAYS[a.day].short} ${DAYS[a.day].date}<small>${a.start}</small></td>
              <td>${a.type}</td>
              <td><span class="who-cell" style="--c:${t.color}"><i></i>${t.short}</span></td>
              <td class="num">${a.min} Min.</td>
              <td class="num">${eur(it.price)}</td>
            </tr>`;
          }).join("")}
        </tbody>
        <tfoot>
          <tr><th scope="row" colspan="4">Gesamt</th><td class="num">${eur(inv.total)}</td></tr>
        </tfoot>
      </table>`;
    drawer.hidden = false;
  }
  function closeDrawer() { drawer.hidden = true; }
  byId("drawerClose").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e) => { if (e.target === drawer) closeDrawer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  /* =======================================================================
     Restore an open session — last, because signIn() renders and the
     renderers close over bindings declared above this point.
     ======================================================================= */

  let restored = false;
  try { restored = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { /* private mode */ }
  if (restored) signIn();
})();
