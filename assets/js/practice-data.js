/* ==========================================================================
   Luca Kolhoff — shared reference data.

   One dataset for the whole site: the intranet, the online booking and the
   public price list all read from here, so an appointment can never be free
   on one page and taken on another.

   Everything below is EXAMPLE data. Replace it with the practice's own
   records — and read the note at the bottom of plan.html before you do.
   ========================================================================== */

window.PRAXIS = (() => {
  "use strict";

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

  /* ---------------------------------------------------------------------
     Opening hours and the house-wide break (ArbZG)
     --------------------------------------------------------------------- */

  const DAY_START = 8, DAY_END = 19;
  const LUNCH = [12 * 60, 13 * 60];
  const hasLunch = (weekday) => weekday < 5;          // 0 = Monday … 5 = Saturday

  // The example week is Monday 10.08. to Saturday 15.08.2026.
  const WEEK0 = "2026-08-10";
  const TODAY = "2026-08-11";

  /* ---------------------------------------------------------------------
     Catalogue — one entry per bookable position
     --------------------------------------------------------------------- */

  const TREAT = [0, 1, 2], LAB = [3], ANY = [0, 1, 2, 3];

  const SERVICES = [
    { key: "mt60",  name: "Manuelle Therapie",     min: 60, bill: "privat", rooms: TREAT, book: true,
      desc: "Gelenk für Gelenk befundet und behandelt — bei Blockaden, Bewegungseinschränkung und Schmerz." },
    { key: "mt45",  name: "Manuelle Therapie",     min: 45, bill: "rezept", rooms: TREAT, book: true,
      desc: "Dieselbe Behandlung auf Heilmittelverordnung." },
    { key: "kg45",  name: "Krankengymnastik",      min: 45, bill: "rezept", rooms: TREAT, book: true,
      desc: "Aktive Übungstherapie, angeleitet und Schritt für Schritt gesteigert." },
    { key: "kg60",  name: "Krankengymnastik",      min: 60, bill: "rezept", rooms: ANY,   book: true,
      desc: "Die lange Einheit mit Trainingsanteil im Athletik-Lab." },
    { key: "spo60", name: "Sportphysiotherapie",   min: 60, bill: "privat", rooms: ANY,   book: true,
      desc: "Für alle, die zurück in Belastung wollen — Befund, Behandlung und Belastungsaufbau." },
    { key: "cmd1",  name: "CMD-Ersttermin",        min: 60, bill: "zuweis", rooms: TREAT, book: true,
      desc: "Ausführliche Untersuchung von Kiefer, Halswirbelsäule und Bissfunktion." },
    { key: "cmdf",  name: "CMD-Folge",             min: 45, bill: "zuweis", rooms: TREAT, book: true,
      desc: "Folgetermin der Kieferbehandlung." },
    { key: "sch45", name: "Schienenbegleitung",    min: 45, bill: "zuweis", rooms: TREAT, book: true,
      desc: "Begleitung während der Schienentherapie, abgestimmt mit deiner Zahnarztpraxis." },
    { key: "mas45", name: "Klassische Massage",    min: 45, bill: "privat", rooms: TREAT, book: true,
      desc: "Klassische Massagetherapie an Rücken, Nacken oder Beinen." },
    { key: "mas60", name: "Klassische Massage",    min: 60, bill: "privat", rooms: TREAT, book: true,
      desc: "Die lange Einheit, ganzer Rücken." },
    { key: "lym45", name: "Lymphdrainage",         min: 45, bill: "rezept", rooms: TREAT, book: true,
      desc: "Manuelle Lymphdrainage nach Operationen und bei Schwellungen." },
    { key: "lym30", name: "Lymphdrainage",         min: 30, bill: "rezept", rooms: TREAT, book: true,
      desc: "Die kurze Einheit." },
    { key: "ele20", name: "Elektro & Ultraschall", min: 20, bill: "rezept", rooms: TREAT, book: false,
      desc: "Ergänzend zur Behandlung, meist im selben Termin." },
    { key: "tape20",name: "Kinesiotaping",         min: 20, bill: "privat", rooms: ANY,   book: true,
      desc: "Tape-Anlage, einzeln oder im Anschluss an eine Behandlung." },
    { key: "ath90", name: "Athletik-Check",        min: 90, bill: "privat", rooms: LAB,   book: true,
      desc: "Kraftmessung, Sprungdiagnostik und Seitenvergleich mit schriftlichem Befund." },
    { key: "rts60", name: "Return-to-Sport",       min: 60, bill: "paket",  rooms: LAB,   book: true,
      desc: "Aufbautraining bis zur Wettkampffreigabe. Wird als Paket abgerechnet." },
    { key: "rech45",name: "Leistungs-Recheck",     min: 45, bill: "privat", rooms: LAB,   book: true,
      desc: "Kontrollmessung im Verlauf." },
  ];

  // who is qualified for what
  // Every service needs more than one qualified person, otherwise a single
  // holiday takes it off the calendar for a fortnight.
  const SKILLS = {
    lk: ["Manuelle Therapie", "CMD-Ersttermin", "CMD-Folge", "Schienenbegleitung",
         "Sportphysiotherapie", "Krankengymnastik", "Kinesiotaping"],
    mb: ["Sportphysiotherapie", "Return-to-Sport", "Leistungs-Recheck", "Athletik-Check",
         "Krankengymnastik", "Kinesiotaping"],
    jr: ["Krankengymnastik", "Manuelle Therapie", "Klassische Massage", "Elektro & Ultraschall"],
    sh: ["Klassische Massage", "Lymphdrainage", "Krankengymnastik", "Kinesiotaping"],
    hw: ["Krankengymnastik", "Manuelle Therapie", "Lymphdrainage", "Klassische Massage",
         "Elektro & Ultraschall"],
  };

  // shift per weekday, [start hour, end hour]; a missing day means day off
  const SHIFTS = {
    lk: { 0: [8, 17], 1: [9, 18], 2: [8, 16], 3: [10, 19], 4: [8, 17], 5: [9, 13] },
    mb: { 0: [8, 17], 1: [9, 18], 2: [9, 18], 3: [8, 17], 4: [9, 18], 5: [9, 13] },
    jr: { 0: [8, 18], 1: [8, 17], 2: [9, 18], 3: [9, 18], 4: [8, 16] },
    sh: { 0: [9, 18], 1: [8, 17], 2: [8, 17], 3: [10, 19], 4: [8, 17] },
    hw: { 0: [10, 19], 1: [10, 19], 2: [8, 15], 3: [9, 18], 4: [10, 19], 5: [9, 13] },
  };

  /* ---------------------------------------------------------------------
     Absences, room blocks, prescriptions, records
     --------------------------------------------------------------------- */

  const ABSENCE_KIND = { urlaub: "Urlaub", krank: "Krank", fortbildung: "Fortbildung", frei: "Frei" };
  const ABSENCES = [
    { ther: "sh", from: "2026-08-17", to: "2026-08-21", kind: "urlaub",      note: "Sommerurlaub" },
    { ther: "jr", from: "2026-08-20", to: "2026-08-21", kind: "fortbildung", note: "Manuelle Therapie Refresher" },
    { ther: "mb", from: "2026-08-24", to: "2026-09-04", kind: "urlaub",      note: "Sommerurlaub" },
    { ther: "hw", from: "2026-08-28", to: "2026-08-28", kind: "fortbildung", note: "Lymphologie Aufbaukurs" },
    { ther: "lk", from: "2026-09-04", to: "2026-09-04", kind: "fortbildung", note: "CMD-Kongress" },
  ];

  const BLOCK_KIND = { reinigung: "Reinigung", wartung: "Wartung", lieferung: "Anlieferung" };
  const BLOCKS = [
    {
      "day": 0,
      "room": 3,
      "start": "08:00",
      "min": 30,
      "kind": "wartung",
      "note": "Kraftmessplatte kalibrieren"
    },
    {
      "day": 2,
      "room": 3,
      "start": "17:30",
      "min": 60,
      "kind": "lieferung",
      "note": "Anlieferung Gewichtsschlitten"
    },
    {
      "day": 3,
      "room": 2,
      "start": "08:00",
      "min": 30,
      "kind": "reinigung",
      "note": "Grundreinigung Raum III"
    },
    {
      "day": 4,
      "room": 1,
      "start": "17:00",
      "min": 45,
      "kind": "wartung",
      "note": "Liege Service"
    }
  ];

  const PRESCRIPTIONS = [
    {
      "no": "HV-2026-1001",
      "patient": "A. Demir",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-31",
      "units": 10,
      "done": 3,
      "started": "2026-08-06",
      "last": "2026-08-06"
    },
    {
      "no": "HV-2026-1002",
      "patient": "A. Fuchs",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-31",
      "units": 12,
      "done": 6,
      "started": "2026-08-03",
      "last": "2026-08-03"
    },
    {
      "no": "HV-2026-1003",
      "patient": "A. Riedel",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-16",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1004",
      "patient": "B. Frey",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-07-10",
      "units": 6,
      "done": 4,
      "started": "2026-07-12",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1005",
      "patient": "B. Riedel",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-30",
      "units": 10,
      "done": 3,
      "started": "2026-08-09",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1006",
      "patient": "C. Arnold",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-14",
      "units": 10,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1007",
      "patient": "C. Baumann",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-15",
      "units": 6,
      "done": 2,
      "started": "2026-07-17",
      "last": "2026-07-17"
    },
    {
      "no": "HV-2026-1008",
      "patient": "C. Bianchi",
      "ther": "hw",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-07",
      "units": 10,
      "done": 4,
      "started": "2026-07-11",
      "last": "2026-07-11"
    },
    {
      "no": "HV-2026-1009",
      "patient": "C. Wagner",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-07-19",
      "units": 10,
      "done": 1,
      "started": "2026-08-07",
      "last": "2026-08-07"
    },
    {
      "no": "HV-2026-1010",
      "patient": "C. Ziegler",
      "ther": "lk",
      "type": "Schienenbegleitung",
      "kind": "zuweis",
      "issued": "2026-07-12",
      "units": 10,
      "done": 5,
      "started": "2026-07-14",
      "last": "2026-07-29"
    },
    {
      "no": "HV-2026-1011",
      "patient": "D. Behrend",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-06-30",
      "units": 12,
      "done": 8,
      "started": "2026-07-05",
      "last": "2026-07-05"
    },
    {
      "no": "HV-2026-1012",
      "patient": "D. Nowak",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-17",
      "units": 12,
      "done": 2,
      "started": "2026-07-20",
      "last": "2026-07-20"
    },
    {
      "no": "HV-2026-1013",
      "patient": "D. Vogel",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-23",
      "units": 6,
      "done": 1,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1014",
      "patient": "E. Berger",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-06-30",
      "units": 6,
      "done": 1,
      "started": "2026-07-18",
      "last": "2026-07-25"
    },
    {
      "no": "HV-2026-1015",
      "patient": "E. Kovac",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-04",
      "units": 6,
      "done": 1,
      "started": "2026-07-10",
      "last": "2026-07-10"
    },
    {
      "no": "HV-2026-1016",
      "patient": "G. Kovac",
      "ther": "jr",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-18",
      "units": 10,
      "done": 3,
      "started": "2026-08-03",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1017",
      "patient": "H. Brandt",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-10",
      "units": 10,
      "done": 3,
      "started": "2026-07-13",
      "last": "2026-07-13"
    },
    {
      "no": "HV-2026-1018",
      "patient": "H. Fuchs",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-02",
      "units": 12,
      "done": 11,
      "started": "2026-07-05",
      "last": "2026-07-05"
    },
    {
      "no": "HV-2026-1019",
      "patient": "H. Kuhn",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-05",
      "units": 12,
      "done": 2,
      "started": "2026-07-19",
      "last": "2026-07-19"
    },
    {
      "no": "HV-2026-1020",
      "patient": "I. Baumann",
      "ther": "lk",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-29",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1021",
      "patient": "I. Behrend",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-07",
      "units": 6,
      "done": 3,
      "started": "2026-07-12",
      "last": "2026-07-12"
    },
    {
      "no": "HV-2026-1022",
      "patient": "I. Sauer",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-25",
      "units": 12,
      "done": 0,
      "started": null,
      "last": "2026-07-30"
    },
    {
      "no": "HV-2026-1023",
      "patient": "J. Zeller",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-17",
      "units": 6,
      "done": 4,
      "started": "2026-07-30",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1024",
      "patient": "K. Roth",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-01",
      "units": 6,
      "done": 4,
      "started": "2026-07-15",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1025",
      "patient": "L. Winkler",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-08-05",
      "units": 12,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1026",
      "patient": "N. Aydin",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-06",
      "units": 6,
      "done": 4,
      "started": "2026-07-12",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1027",
      "patient": "N. Dietrich",
      "ther": "jr",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-26",
      "units": 6,
      "done": 4,
      "started": "2026-07-30",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1028",
      "patient": "N. Frey",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-07",
      "units": 12,
      "done": 5,
      "started": "2026-07-17",
      "last": "2026-07-17"
    },
    {
      "no": "HV-2026-1029",
      "patient": "O. Yilmaz",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-07-16",
      "units": 10,
      "done": 3,
      "started": "2026-07-30",
      "last": "2026-07-30"
    },
    {
      "no": "HV-2026-1030",
      "patient": "P. Mahler",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-18",
      "units": 6,
      "done": 4,
      "started": "2026-08-01",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1031",
      "patient": "P. Reiss",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-17",
      "units": 10,
      "done": 2,
      "started": "2026-07-31",
      "last": "2026-07-31"
    },
    {
      "no": "HV-2026-1032",
      "patient": "R. Duarte",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-18",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1033",
      "patient": "S. Kirsch",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-31",
      "units": 12,
      "done": 9,
      "started": "2026-08-09",
      "last": "2026-08-09"
    },
    {
      "no": "HV-2026-1034",
      "patient": "S. Marchand",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-19",
      "units": 10,
      "done": 6,
      "started": "2026-07-28",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1035",
      "patient": "S. Ziegler",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-20",
      "units": 6,
      "done": 3,
      "started": "2026-07-29",
      "last": "2026-07-29"
    },
    {
      "no": "HV-2026-1036",
      "patient": "T. Mahler",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-27",
      "units": 6,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1037",
      "patient": "T. Wendler",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-23",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1038",
      "patient": "T. Ziegler",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-28",
      "units": 6,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1039",
      "patient": "U. Adler",
      "ther": "lk",
      "type": "CMD-Folge",
      "kind": "zuweis",
      "issued": "2026-07-06",
      "units": 6,
      "done": 3,
      "started": "2026-07-11",
      "last": "2026-07-11"
    },
    {
      "no": "HV-2026-1040",
      "patient": "U. Demir",
      "ther": "lk",
      "type": "Schienenbegleitung",
      "kind": "zuweis",
      "issued": "2026-08-05",
      "units": 12,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1041",
      "patient": "U. Kolb",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-07-14",
      "units": 6,
      "done": 6,
      "started": "2026-08-02",
      "last": "2026-08-02"
    },
    {
      "no": "HV-2026-1042",
      "patient": "V. Aydin",
      "ther": "jr",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-28",
      "units": 12,
      "done": 8,
      "started": "2026-08-09",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1043",
      "patient": "V. Engel",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-08-05",
      "units": 6,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1044",
      "patient": "V. Weiss",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-13",
      "units": 10,
      "done": 4,
      "started": "2026-07-20",
      "last": "2026-07-20"
    },
    {
      "no": "HV-2026-1045",
      "patient": "W. Duarte",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-13",
      "units": 10,
      "done": 6,
      "started": "2026-07-21",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1046",
      "patient": "W. Kettler",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-25",
      "units": 6,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1047",
      "patient": "W. Obermann",
      "ther": "lk",
      "type": "CMD-Ersttermin",
      "kind": "zuweis",
      "issued": "2026-07-26",
      "units": 10,
      "done": 6,
      "started": "2026-08-01",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1048",
      "patient": "W. Sauer",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-23",
      "units": 12,
      "done": 6,
      "started": "2026-07-30",
      "last": "2026-07-30"
    },
    {
      "no": "HV-2026-1049",
      "patient": "Y. Ilic",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-06-30",
      "units": 6,
      "done": 3,
      "started": "2026-07-11",
      "last": "2026-07-11"
    },
    {
      "no": "HV-2026-1050",
      "patient": "Y. Kolb",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-06-27",
      "units": 12,
      "done": 11,
      "started": "2026-07-01",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1051",
      "patient": "Y. Mertens",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-28",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1052",
      "patient": "Z. Arnold",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-06-29",
      "units": 10,
      "done": 5,
      "started": "2026-07-07",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1053",
      "patient": "Z. Ludwig",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-16",
      "units": 6,
      "done": 4,
      "started": "2026-07-19",
      "last": "2026-08-11"
    }
  ];

  const PATIENTS = [
    {
      "name": "A. Demir",
      "ther": "hw",
      "born": 1971,
      "phone": "+49 000 662 75",
      "mail": "demir@example.de",
      "street": "Eichenkamp 50",
      "since": "2024-06-13",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "A. Fuchs",
      "ther": "sh",
      "born": 1996,
      "phone": "+49 000 478 97",
      "mail": "fuchs@example.de",
      "street": "Birkenallee 28",
      "since": "2025-07-24",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "A. Okafor",
      "ther": "mb",
      "born": 1981,
      "phone": "+49 000 210 50",
      "mail": "okafor@example.de",
      "street": "Lindenstraße 69",
      "since": "2026-01-08",
      "remind": false,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "A. Reiss",
      "ther": "lk",
      "born": 1966,
      "phone": "+49 000 243 74",
      "mail": "reiss@example.de",
      "street": "Hafenstraße 36",
      "since": "2025-09-19",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "A. Riedel",
      "ther": "hw",
      "born": 1990,
      "phone": "+49 000 329 65",
      "mail": "riedel@example.de",
      "street": "Am Mühlbach 40",
      "since": "2024-05-03",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "B. Claus",
      "ther": "mb",
      "born": 1978,
      "phone": "+49 000 627 36",
      "mail": "claus@example.de",
      "street": "Sonnenhalde 11",
      "since": "2024-09-03",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "B. Duarte",
      "ther": "mb",
      "born": 1993,
      "phone": "+49 000 470 52",
      "mail": "duarte@example.de",
      "street": "Lindenstraße 37",
      "since": "2026-06-05",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "B. Frey",
      "ther": "lk",
      "born": 1988,
      "phone": "+49 000 653 32",
      "mail": "frey@example.de",
      "street": "Sonnenhalde 30",
      "since": "2024-09-09",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "B. Ludwig",
      "ther": "mb",
      "born": 1998,
      "phone": "+49 000 855 24",
      "mail": "ludwig@example.de",
      "street": "Ahornweg 64",
      "since": "2026-04-22",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "B. Neuhaus",
      "ther": "sh",
      "born": 1973,
      "phone": "+49 000 205 76",
      "mail": "neuhaus@example.de",
      "street": "Ahornweg 45",
      "since": "2024-06-06",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "B. Riedel",
      "ther": "sh",
      "born": 1977,
      "phone": "+49 000 765 84",
      "mail": "riedel@example.de",
      "street": "Sonnenhalde 78",
      "since": "2026-07-19",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Amrein",
      "ther": "sh",
      "born": 1974,
      "phone": "+49 000 223 17",
      "mail": "amrein@example.de",
      "street": "Lindenstraße 53",
      "since": "2025-03-05",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Arnold",
      "ther": "hw",
      "born": 1958,
      "phone": "+49 000 649 83",
      "mail": "arnold@example.de",
      "street": "Sonnenhalde 77",
      "since": "2024-03-17",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Baumann",
      "ther": "jr",
      "born": 1958,
      "phone": "+49 000 660 21",
      "mail": "baumann@example.de",
      "street": "Birkenallee 43",
      "since": "2024-08-09",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "C. Bianchi",
      "ther": "hw",
      "born": 1978,
      "phone": "+49 000 826 34",
      "mail": "bianchi@example.de",
      "street": "Talblick 41",
      "since": "2024-05-08",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Hartwig",
      "ther": "lk",
      "born": 2000,
      "phone": "+49 000 175 24",
      "mail": "hartwig@example.de",
      "street": "Talblick 84",
      "since": "2026-06-06",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Krüger",
      "ther": "sh",
      "born": 1966,
      "phone": "+49 000 100 27",
      "mail": "krueger@example.de",
      "street": "Lindenstraße 33",
      "since": "2026-06-05",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Ludwig",
      "ther": "sh",
      "born": 1972,
      "phone": "+49 000 221 49",
      "mail": "ludwig@example.de",
      "street": "Birkenallee 52",
      "since": "2024-10-13",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "C. Marchand",
      "ther": "lk",
      "born": 1965,
      "phone": "+49 000 686 52",
      "mail": "marchand@example.de",
      "street": "Hafenstraße 67",
      "since": "2024-10-21",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "C. Wagner",
      "ther": "lk",
      "born": 1965,
      "phone": "+49 000 445 50",
      "mail": "wagner@example.de",
      "street": "Eichenkamp 32",
      "since": "2026-01-04",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "C. Ziegler",
      "ther": "lk",
      "born": 2005,
      "phone": "+49 000 510 85",
      "mail": "ziegler@example.de",
      "street": "Lindenstraße 50",
      "since": "2026-04-07",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "D. Behrend",
      "ther": "hw",
      "born": 1955,
      "phone": "+49 000 654 62",
      "mail": "behrend@example.de",
      "street": "Lindenstraße 68",
      "since": "2024-04-15",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "D. Mahler",
      "ther": "lk",
      "born": 1960,
      "phone": "+49 000 457 66",
      "mail": "mahler@example.de",
      "street": "Hafenstraße 69",
      "since": "2026-06-24",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "D. Nowak",
      "ther": "hw",
      "born": 1957,
      "phone": "+49 000 404 41",
      "mail": "nowak@example.de",
      "street": "Kirchplatz 42",
      "since": "2024-11-30",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "D. Sauer",
      "ther": "lk",
      "born": 1964,
      "phone": "+49 000 710 72",
      "mail": "sauer@example.de",
      "street": "Ahornweg 86",
      "since": "2024-03-08",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "D. Vogel",
      "ther": "hw",
      "born": 1997,
      "phone": "+49 000 990 80",
      "mail": "vogel@example.de",
      "street": "Lindenstraße 56",
      "since": "2024-04-12",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "E. Amrein",
      "ther": "mb",
      "born": 2001,
      "phone": "+49 000 518 97",
      "mail": "amrein@example.de",
      "street": "Lindenstraße 75",
      "since": "2026-02-11",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "E. Berger",
      "ther": "sh",
      "born": 2008,
      "phone": "+49 000 892 84",
      "mail": "berger@example.de",
      "street": "Ahornweg 10",
      "since": "2024-05-08",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "E. Kovac",
      "ther": "jr",
      "born": 1989,
      "phone": "+49 000 554 31",
      "mail": "kovac@example.de",
      "street": "Ahornweg 19",
      "since": "2026-05-12",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "F. Keller",
      "ther": "lk",
      "born": 1973,
      "phone": "+49 000 460 30",
      "mail": "keller@example.de",
      "street": "Birkenallee 16",
      "since": "2024-10-12",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "F. Neuhaus",
      "ther": "lk",
      "born": 1952,
      "phone": "+49 000 761 60",
      "mail": "neuhaus@example.de",
      "street": "Talblick 6",
      "since": "2025-11-24",
      "remind": false,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "G. Kovac",
      "ther": "jr",
      "born": 1963,
      "phone": "+49 000 634 27",
      "mail": "kovac@example.de",
      "street": "Ahornweg 48",
      "since": "2024-03-16",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "G. Möller",
      "ther": "hw",
      "born": 2005,
      "phone": "+49 000 451 52",
      "mail": "moeller@example.de",
      "street": "Ahornweg 19",
      "since": "2024-03-04",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "G. Roth",
      "ther": "lk",
      "born": 2001,
      "phone": "+49 000 600 66",
      "mail": "roth@example.de",
      "street": "Birkenallee 33",
      "since": "2025-09-11",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "G. Vogt",
      "ther": "lk",
      "born": 1973,
      "phone": "+49 000 885 88",
      "mail": "vogt@example.de",
      "street": "Birkenallee 50",
      "since": "2025-04-07",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "H. Bauer",
      "ther": "hw",
      "born": 1994,
      "phone": "+49 000 204 80",
      "mail": "bauer@example.de",
      "street": "Talblick 45",
      "since": "2024-07-15",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "H. Brandt",
      "ther": "jr",
      "born": 1971,
      "phone": "+49 000 473 54",
      "mail": "brandt@example.de",
      "street": "Eichenkamp 23",
      "since": "2024-03-30",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "H. Fuchs",
      "ther": "hw",
      "born": 1983,
      "phone": "+49 000 209 67",
      "mail": "fuchs@example.de",
      "street": "Hafenstraße 81",
      "since": "2026-06-01",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "H. Kessler",
      "ther": "sh",
      "born": 1996,
      "phone": "+49 000 614 88",
      "mail": "kessler@example.de",
      "street": "Lindenstraße 80",
      "since": "2026-04-07",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "H. Kuhn",
      "ther": "hw",
      "born": 1994,
      "phone": "+49 000 449 91",
      "mail": "kuhn@example.de",
      "street": "Eichenkamp 33",
      "since": "2025-10-11",
      "remind": false,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "H. Möller",
      "ther": "mb",
      "born": 1969,
      "phone": "+49 000 774 75",
      "mail": "moeller@example.de",
      "street": "Hafenstraße 2",
      "since": "2025-07-17",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "H. Nowak",
      "ther": "sh",
      "born": 1951,
      "phone": "+49 000 567 16",
      "mail": "nowak@example.de",
      "street": "Sonnenhalde 50",
      "since": "2025-12-03",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "I. Amrein",
      "ther": "mb",
      "born": 1976,
      "phone": "+49 000 296 98",
      "mail": "amrein@example.de",
      "street": "Eichenkamp 38",
      "since": "2024-11-19",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "I. Baumann",
      "ther": "lk",
      "born": 1979,
      "phone": "+49 000 246 17",
      "mail": "baumann@example.de",
      "street": "Am Mühlbach 26",
      "since": "2024-09-19",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "I. Behrend",
      "ther": "hw",
      "born": 1955,
      "phone": "+49 000 692 36",
      "mail": "behrend@example.de",
      "street": "Sonnenhalde 60",
      "since": "2025-07-06",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "I. Ferreira",
      "ther": "sh",
      "born": 2006,
      "phone": "+49 000 820 73",
      "mail": "ferreira@example.de",
      "street": "Talblick 14",
      "since": "2025-06-30",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "I. Frey",
      "ther": "sh",
      "born": 1994,
      "phone": "+49 000 954 61",
      "mail": "frey@example.de",
      "street": "Kirchplatz 29",
      "since": "2026-06-25",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "I. Sauer",
      "ther": "sh",
      "born": 1985,
      "phone": "+49 000 635 61",
      "mail": "sauer@example.de",
      "street": "Am Mühlbach 8",
      "since": "2025-02-21",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "J. Aksoy",
      "ther": "mb",
      "born": 1958,
      "phone": "+49 000 718 44",
      "mail": "aksoy@example.de",
      "street": "Am Mühlbach 3",
      "since": "2024-08-05",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "J. Zeller",
      "ther": "jr",
      "born": 2006,
      "phone": "+49 000 827 58",
      "mail": "zeller@example.de",
      "street": "Birkenallee 25",
      "since": "2025-01-21",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "K. Marchand",
      "ther": "lk",
      "born": 1984,
      "phone": "+49 000 720 40",
      "mail": "marchand@example.de",
      "street": "Lindenstraße 77",
      "since": "2024-12-21",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "K. Roth",
      "ther": "hw",
      "born": 1954,
      "phone": "+49 000 259 42",
      "mail": "roth@example.de",
      "street": "Hafenstraße 13",
      "since": "2025-01-18",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "L. Behrend",
      "ther": "mb",
      "born": 1984,
      "phone": "+49 000 813 35",
      "mail": "behrend@example.de",
      "street": "Ahornweg 75",
      "since": "2026-01-22",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "L. Winkler",
      "ther": "jr",
      "born": 1964,
      "phone": "+49 000 713 85",
      "mail": "winkler@example.de",
      "street": "Rosenweg 17",
      "since": "2024-09-15",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "M. Marchand",
      "ther": "mb",
      "born": 1950,
      "phone": "+49 000 795 48",
      "mail": "marchand@example.de",
      "street": "Eichenkamp 15",
      "since": "2025-11-20",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "M. Sperling",
      "ther": "mb",
      "born": 1997,
      "phone": "+49 000 505 22",
      "mail": "sperling@example.de",
      "street": "Sonnenhalde 56",
      "since": "2026-03-13",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "N. Aydin",
      "ther": "hw",
      "born": 1979,
      "phone": "+49 000 831 44",
      "mail": "aydin@example.de",
      "street": "Sonnenhalde 51",
      "since": "2026-05-22",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "N. Dietrich",
      "ther": "jr",
      "born": 2002,
      "phone": "+49 000 805 25",
      "mail": "dietrich@example.de",
      "street": "Lindenstraße 79",
      "since": "2024-06-26",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "N. Frey",
      "ther": "hw",
      "born": 1987,
      "phone": "+49 000 892 60",
      "mail": "frey@example.de",
      "street": "Lindenstraße 18",
      "since": "2025-06-27",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "N. Okafor",
      "ther": "mb",
      "born": 1956,
      "phone": "+49 000 608 55",
      "mail": "okafor@example.de",
      "street": "Lindenstraße 75",
      "since": "2025-01-27",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "N. Tran",
      "ther": "mb",
      "born": 1997,
      "phone": "+49 000 348 24",
      "mail": "tran@example.de",
      "street": "Kirchplatz 61",
      "since": "2025-01-25",
      "remind": false,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "O. Hübner",
      "ther": "sh",
      "born": 2007,
      "phone": "+49 000 960 61",
      "mail": "huebner@example.de",
      "street": "Lindenstraße 87",
      "since": "2024-04-25",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "O. Vogt",
      "ther": "lk",
      "born": 1999,
      "phone": "+49 000 731 33",
      "mail": "vogt@example.de",
      "street": "Ahornweg 10",
      "since": "2025-07-07",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "O. Yilmaz",
      "ther": "lk",
      "born": 1973,
      "phone": "+49 000 444 73",
      "mail": "yilmaz@example.de",
      "street": "Kirchplatz 57",
      "since": "2024-07-14",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "P. Mahler",
      "ther": "sh",
      "born": 1992,
      "phone": "+49 000 739 52",
      "mail": "mahler@example.de",
      "street": "Lindenstraße 10",
      "since": "2026-06-02",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "P. Reiss",
      "ther": "hw",
      "born": 1988,
      "phone": "+49 000 199 19",
      "mail": "reiss@example.de",
      "street": "Eichenkamp 27",
      "since": "2024-04-10",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "R. Duarte",
      "ther": "jr",
      "born": 1968,
      "phone": "+49 000 789 39",
      "mail": "duarte@example.de",
      "street": "Ahornweg 28",
      "since": "2024-08-23",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "R. Haas",
      "ther": "lk",
      "born": 1964,
      "phone": "+49 000 725 12",
      "mail": "haas@example.de",
      "street": "Am Mühlbach 22",
      "since": "2024-07-30",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "R. Hofmann",
      "ther": "mb",
      "born": 1949,
      "phone": "+49 000 131 66",
      "mail": "hofmann@example.de",
      "street": "Talblick 16",
      "since": "2025-01-22",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "R. Wendler",
      "ther": "mb",
      "born": 1986,
      "phone": "+49 000 240 88",
      "mail": "wendler@example.de",
      "street": "Talblick 29",
      "since": "2024-08-11",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "R. Yilmaz",
      "ther": "mb",
      "born": 1967,
      "phone": "+49 000 979 37",
      "mail": "yilmaz@example.de",
      "street": "Am Mühlbach 3",
      "since": "2024-11-30",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "S. Kirsch",
      "ther": "jr",
      "born": 1972,
      "phone": "+49 000 113 12",
      "mail": "kirsch@example.de",
      "street": "Hafenstraße 67",
      "since": "2024-11-21",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "S. Kramer",
      "ther": "mb",
      "born": 1994,
      "phone": "+49 000 210 57",
      "mail": "kramer@example.de",
      "street": "Birkenallee 48",
      "since": "2025-03-22",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "S. Marchand",
      "ther": "jr",
      "born": 1972,
      "phone": "+49 000 233 24",
      "mail": "marchand@example.de",
      "street": "Rosenweg 1",
      "since": "2024-06-26",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "S. Wendler",
      "ther": "sh",
      "born": 2010,
      "phone": "+49 000 523 63",
      "mail": "wendler@example.de",
      "street": "Eichenkamp 29",
      "since": "2024-04-09",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "S. Ziegler",
      "ther": "hw",
      "born": 1981,
      "phone": "+49 000 103 68",
      "mail": "ziegler@example.de",
      "street": "Talblick 14",
      "since": "2025-11-23",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "T. Mahler",
      "ther": "hw",
      "born": 1961,
      "phone": "+49 000 290 94",
      "mail": "mahler@example.de",
      "street": "Lindenstraße 66",
      "since": "2024-11-15",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "T. Marchand",
      "ther": "sh",
      "born": 1972,
      "phone": "+49 000 187 61",
      "mail": "marchand@example.de",
      "street": "Birkenallee 3",
      "since": "2025-07-31",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "T. Wendler",
      "ther": "jr",
      "born": 1997,
      "phone": "+49 000 845 86",
      "mail": "wendler@example.de",
      "street": "Birkenallee 45",
      "since": "2024-12-04",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "T. Ziegler",
      "ther": "hw",
      "born": 1992,
      "phone": "+49 000 253 57",
      "mail": "ziegler@example.de",
      "street": "Hafenstraße 13",
      "since": "2024-07-20",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "U. Adler",
      "ther": "lk",
      "born": 1995,
      "phone": "+49 000 298 85",
      "mail": "adler@example.de",
      "street": "Lindenstraße 37",
      "since": "2026-07-08",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "U. Demir",
      "ther": "lk",
      "born": 1964,
      "phone": "+49 000 713 85",
      "mail": "demir@example.de",
      "street": "Rosenweg 17",
      "since": "2024-09-15",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "U. Kolb",
      "ther": "lk",
      "born": 1980,
      "phone": "+49 000 104 60",
      "mail": "kolb@example.de",
      "street": "Ahornweg 69",
      "since": "2025-11-30",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "V. Aydin",
      "ther": "jr",
      "born": 2009,
      "phone": "+49 000 109 50",
      "mail": "aydin@example.de",
      "street": "Eichenkamp 38",
      "since": "2025-10-05",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "V. Engel",
      "ther": "jr",
      "born": 1976,
      "phone": "+49 000 121 31",
      "mail": "engel@example.de",
      "street": "Kirchplatz 59",
      "since": "2025-06-20",
      "remind": false,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "V. Thiel",
      "ther": "lk",
      "born": 1995,
      "phone": "+49 000 889 84",
      "mail": "thiel@example.de",
      "street": "Lindenstraße 52",
      "since": "2024-07-07",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "V. Weiss",
      "ther": "jr",
      "born": 1994,
      "phone": "+49 000 868 46",
      "mail": "weiss@example.de",
      "street": "Eichenkamp 86",
      "since": "2026-06-09",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "V. Yilmaz",
      "ther": "mb",
      "born": 1968,
      "phone": "+49 000 853 38",
      "mail": "yilmaz@example.de",
      "street": "Birkenallee 33",
      "since": "2026-02-27",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "V. Zeller",
      "ther": "sh",
      "born": 1988,
      "phone": "+49 000 692 40",
      "mail": "zeller@example.de",
      "street": "Ahornweg 80",
      "since": "2026-01-12",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "W. Duarte",
      "ther": "jr",
      "born": 1980,
      "phone": "+49 000 443 23",
      "mail": "duarte@example.de",
      "street": "Talblick 61",
      "since": "2025-10-10",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "W. Kettler",
      "ther": "hw",
      "born": 1957,
      "phone": "+49 000 744 98",
      "mail": "kettler@example.de",
      "street": "Talblick 69",
      "since": "2024-02-26",
      "remind": false,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "W. Obermann",
      "ther": "lk",
      "born": 2008,
      "phone": "+49 000 265 75",
      "mail": "obermann@example.de",
      "street": "Birkenallee 77",
      "since": "2026-01-10",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "W. Sauer",
      "ther": "jr",
      "born": 1950,
      "phone": "+49 000 139 87",
      "mail": "sauer@example.de",
      "street": "Hafenstraße 60",
      "since": "2024-03-09",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "Y. Ilic",
      "ther": "hw",
      "born": 1984,
      "phone": "+49 000 417 29",
      "mail": "ilic@example.de",
      "street": "Sonnenhalde 42",
      "since": "2026-04-21",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "Y. Kolb",
      "ther": "hw",
      "born": 1974,
      "phone": "+49 000 953 15",
      "mail": "kolb@example.de",
      "street": "Kirchplatz 50",
      "since": "2024-04-01",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "Y. Lorenz",
      "ther": "mb",
      "born": 1991,
      "phone": "+49 000 443 10",
      "mail": "lorenz@example.de",
      "street": "Lindenstraße 19",
      "since": "2024-12-19",
      "remind": true,
      "channel": "SMS",
      "note": ""
    },
    {
      "name": "Y. Mertens",
      "ther": "hw",
      "born": 1972,
      "phone": "+49 000 533 97",
      "mail": "mertens@example.de",
      "street": "Rosenweg 35",
      "since": "2024-12-18",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "Z. Arnold",
      "ther": "hw",
      "born": 1994,
      "phone": "+49 000 584 39",
      "mail": "arnold@example.de",
      "street": "Sonnenhalde 42",
      "since": "2024-11-23",
      "remind": true,
      "channel": "E-Mail",
      "note": ""
    },
    {
      "name": "Z. Ludwig",
      "ther": "jr",
      "born": 2005,
      "phone": "+49 000 206 65",
      "mail": "ludwig@example.de",
      "street": "Sonnenhalde 26",
      "since": "2025-06-08",
      "remind": true,
      "channel": "SMS",
      "note": ""
    }
  ];

  const WAITLIST = [
    {
      "patient": "R. Kastner",
      "phone": "+49 000 214 08",
      "type": "Manuelle Therapie",
      "ther": "lk",
      "prefer": "vormittags",
      "since": "2026-08-03",
      "note": "Schulter, akut"
    },
    {
      "patient": "N. Bertram",
      "phone": "+49 000 776 41",
      "type": "Krankengymnastik",
      "ther": "",
      "prefer": "ab 17 Uhr",
      "since": "2026-08-05",
      "note": "nach der Arbeit"
    },
    {
      "patient": "S. Grabowski",
      "phone": "+49 000 318 26",
      "type": "Klassische Massage",
      "ther": "sh",
      "prefer": "egal",
      "since": "2026-08-06",
      "note": ""
    },
    {
      "patient": "D. Achterberg",
      "phone": "+49 000 902 55",
      "type": "Sportphysiotherapie",
      "ther": "mb",
      "prefer": "Mo/Mi",
      "since": "2026-08-07",
      "note": "Rückkehr nach Meniskus"
    },
    {
      "patient": "L. Petzold",
      "phone": "+49 000 445 19",
      "type": "Lymphdrainage",
      "ther": "",
      "prefer": "vormittags",
      "since": "2026-08-08",
      "note": "nach OP"
    },
    {
      "patient": "T. Havemann",
      "phone": "+49 000 663 72",
      "type": "CMD-Ersttermin",
      "ther": "lk",
      "prefer": "egal",
      "since": "2026-08-09",
      "note": "Zuweisung Dr. Radtke"
    },
    {
      "patient": "F. Oswald",
      "phone": "+49 000 128 34",
      "type": "Krankengymnastik",
      "ther": "hw",
      "prefer": "ab 16 Uhr",
      "since": "2026-08-10",
      "note": ""
    }
  ];

  // requests that came in through the website before this session started
  const SEED_REQUESTS = [
    {
      "id": "A-2041",
      "name": "M. Steinke",
      "phone": "+49 000 501 77",
      "mail": "steinke@example.de",
      "type": "Manuelle Therapie",
      "ther": "",
      "date": "2026-08-13",
      "start": "16:30",
      "note": "Nackenverspannung seit zwei Wochen",
      "at": "2026-08-10 19:42",
      "state": "offen",
      "kind": "termin"
    },
    {
      "id": "A-2042",
      "name": "J. Wollny",
      "phone": "+49 000 662 13",
      "mail": "wollny@example.de",
      "type": "Sportphysiotherapie",
      "ther": "mb",
      "date": "2026-08-14",
      "start": "09:15",
      "note": "",
      "at": "2026-08-10 21:05",
      "state": "offen",
      "kind": "termin"
    },
    {
      "id": "A-2043",
      "name": "P. Erdmann",
      "phone": "+49 000 337 90",
      "mail": "",
      "type": "",
      "ther": "",
      "date": "",
      "start": "",
      "note": "Frage zur Kostenübernahme",
      "at": "2026-08-11 07:12",
      "state": "offen",
      "kind": "rueckruf",
      "window": "08–10 Uhr"
    },
    {
      "id": "A-2044",
      "name": "C. Lindner",
      "phone": "+49 000 884 26",
      "mail": "lindner@example.de",
      "type": "Lymphdrainage",
      "ther": "sh",
      "date": "2026-08-17",
      "start": "10:00",
      "note": "Rezept liegt vor",
      "at": "2026-08-11 07:48",
      "state": "offen",
      "kind": "termin"
    },
    {
      "id": "A-2039",
      "name": "B. Kuypers",
      "phone": "+49 000 220 61",
      "mail": "kuypers@example.de",
      "type": "Klassische Massage",
      "ther": "",
      "date": "2026-08-12",
      "start": "14:45",
      "note": "",
      "at": "2026-08-09 16:20",
      "state": "bestätigt",
      "kind": "termin"
    },
    {
      "id": "A-2038",
      "name": "H. Salzmann",
      "phone": "+49 000 471 03",
      "mail": "",
      "type": "",
      "ther": "",
      "date": "",
      "start": "",
      "note": "Rückruf wegen Parkplatz",
      "at": "2026-08-09 11:02",
      "state": "erledigt",
      "kind": "rueckruf",
      "window": "14–16 Uhr"
    }
  ];

  const MONTHS = [
    {
      "label": "Feb",
      "iso": "2026-02",
      "revenue": 63110,
      "appts": 877,
      "partial": false
    },
    {
      "label": "Mär",
      "iso": "2026-03",
      "revenue": 68120,
      "appts": 946,
      "partial": false
    },
    {
      "label": "Apr",
      "iso": "2026-04",
      "revenue": 59900,
      "appts": 832,
      "partial": false
    },
    {
      "label": "Mai",
      "iso": "2026-05",
      "revenue": 70040,
      "appts": 973,
      "partial": false
    },
    {
      "label": "Jun",
      "iso": "2026-06",
      "revenue": 62580,
      "appts": 869,
      "partial": false
    },
    {
      "label": "Jul",
      "iso": "2026-07",
      "revenue": 62570,
      "appts": 869,
      "partial": false
    },
    {
      "label": "Aug",
      "iso": "2026-08",
      "revenue": 30512,
      "appts": 422,
      "partial": true
    }
  ];

  const REVIEWS = [
    {
      "author": "Katrin M.",
      "stars": 5,
      "date": "2026-07-28",
      "text": "Nach dem Kreuzbandriss dachte ich, Sport wäre für mich erledigt. Zwölf Wochen später stand ich wieder auf dem Platz. Der Plan war von Anfang an klar und ehrlich."
    },
    {
      "author": "Tobias R.",
      "stars": 5,
      "date": "2026-07-14",
      "text": "Endlich jemand, der beim Kiefer nicht nur am Kiefer arbeitet. Das Knacken ist weg, die Kopfschmerzen auch."
    },
    {
      "author": "Andrea W.",
      "stars": 5,
      "date": "2026-06-30",
      "text": "Pünktlich, ruhig, keine Massenabfertigung. Man merkt, dass hier nicht im Fünfzehn-Minuten-Takt gearbeitet wird."
    },
    {
      "author": "Micha L.",
      "stars": 4,
      "date": "2026-06-11",
      "text": "Fachlich top. Ein Stern Abzug nur, weil die Parkplatzsituation vormittags eng ist."
    },
    {
      "author": "Sabine K.",
      "stars": 5,
      "date": "2026-05-22",
      "text": "Die Lymphdrainage nach meiner OP hat mir sehr geholfen. Sehr einfühlsam erklärt, was passiert und warum."
    },
    {
      "author": "Jens D.",
      "stars": 5,
      "date": "2026-05-02",
      "text": "Termin online gebucht, zwei Tage später dran gewesen. So sollte das überall laufen."
    }
  ];

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */

  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt = (mins) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const therOf = (id) => THERAPISTS.find((t) => t.id === id);
  const svcOf = (key) => SERVICES.find((s) => s.key === key);

  const iso = (d) => d.toISOString().slice(0, 10);
  const parse = (s) => new Date(s + "T12:00:00Z");
  const addDays = (s, n) => { const d = parse(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
  // Monday = 0 … Sunday = 6, the order the practice thinks in
  const weekday = (s) => (parse(s).getUTCDay() + 6) % 7;
  const deDate = (s) => {
    const d = parse(s);
    return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
  };
  const DE_DAY = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

  const priceFor = (svc) => {
    const p = PRICES[svc.name];
    return p ? Math.round((p.eur * svc.min) / p.unit * 2) / 2 : 0;
  };

  const absentOn = (therId, dateISO) =>
    ABSENCES.find((a) => a.ther === therId && a.from <= dateISO && dateISO <= a.to) || null;

  /* ---------------------------------------------------------------------
     Availability.

     The example week is the practice's normal load, so a date beyond it
     reuses that weekday's bookings — otherwise every future day would look
     suspiciously empty. A stable hash frees roughly one booking in seven so
     the weeks are not carbon copies of each other.
     --------------------------------------------------------------------- */

  const noise = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  };

  function loadFor(dateISO) {
    const wd = weekday(dateISO);
    if (wd > 5) return [];                                   // Sunday: closed
    // The current week is real and stays as it is. Later weeks are only
    // partly booked — a diary fills up as the date comes closer, so the
    // further out you look, the more is still open.
    if (dateISO >= WEEK0 && dateISO <= addDays(WEEK0, 5)) {
      return APPOINTMENTS.filter((a) => a.day === wd);
    }
    const ahead = daysBetween(TODAY, dateISO);
    const booked = Math.max(0.42, 1 - 0.045 * ahead);
    return APPOINTMENTS.filter((a) => a.day === wd)
      .filter((a) => noise(dateISO + a.start + a.patient) < booked);
  }

  function blocksFor(dateISO) {
    const wd = weekday(dateISO);
    return BLOCKS.filter((b) => b.day === wd);
  }

  /** Free start times for a service on a date, as [{ start, ther, room }]. */
  function slotsFor(serviceKey, dateISO, therWish) {
    const svc = svcOf(serviceKey);
    if (!svc || dateISO <= TODAY) return [];
    const wd = weekday(dateISO);
    if (wd > 5) return [];

    const taken = loadFor(dateISO).concat(blocksFor(dateISO).map(
      (b) => ({ room: b.room, start: b.start, min: b.min, ther: null })));
    const overlap = (list, a, b) => list.some((x) => {
      const s = toMin(x.start), e = s + x.min;
      return a < e && b > s;
    });

    const staff = THERAPISTS.filter((t) =>
      (!therWish || t.id === therWish) &&
      (SKILLS[t.id] || []).includes(svc.name) &&
      SHIFTS[t.id][wd] && !absentOn(t.id, dateISO));

    const out = [];
    for (let t = DAY_START * 60; t + svc.min <= DAY_END * 60; t += 15) {
      const end = t + svc.min;
      if (hasLunch(wd) && t < LUNCH[1] && end > LUNCH[0]) continue;
      const ther = staff.find((p) => {
        const [h0, h1] = SHIFTS[p.id][wd];
        if (t < h0 * 60 || end > h1 * 60) return false;
        return !overlap(taken.filter((x) => x.ther === p.id), t, end);
      });
      if (!ther) continue;
      const room = svc.rooms.find((r) => !overlap(taken.filter((x) => x.room === r), t, end));
      if (room === undefined) continue;
      out.push({ start: fmt(t), ther: ther.id, room });
    }
    return out;
  }

  /** The next `days` bookable dates from tomorrow on, Sundays skipped. */
  function nextDates(days) {
    const out = [];
    for (let i = 1; out.length < days && i < days * 2; i++) {
      const d = addDays(TODAY, i);
      if (weekday(d) <= 5) out.push(d);
    }
    return out;
  }

  /* ---------------------------------------------------------------------
     Requests from the website. Kept in localStorage so the booking page and
     the intranet see the same list within one browser — a real practice
     needs a server here, see the note in plan.html.
     --------------------------------------------------------------------- */

  const STORE = "lk-anfragen";
  function readRequests() {
    let mine = [];
    try { mine = JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { /* private mode */ }
    return SEED_REQUESTS.concat(Array.isArray(mine) ? mine : []);
  }
  function addRequest(r) {
    let mine = [];
    try { mine = JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { /* private mode */ }
    if (!Array.isArray(mine)) mine = [];
    r.id = "A-" + (2100 + mine.length);
    mine.push(r);
    try { localStorage.setItem(STORE, JSON.stringify(mine)); } catch (e) { /* private mode */ }
    return r;
  }

  return {
    THERAPISTS, ROOMS, DAYS, BILL, APPOINTMENTS, PRICES, priceOf, eur, eur0, PAYMENTS, hash,
    DAY_START, DAY_END, LUNCH, hasLunch, WEEK0, TODAY,
    SERVICES, SKILLS, SHIFTS, ABSENCES, ABSENCE_KIND, BLOCKS, BLOCK_KIND,
    PRESCRIPTIONS, PATIENTS, WAITLIST, MONTHS, REVIEWS,
    toMin, fmt, therOf, svcOf, priceFor, absentOn,
    iso, addDays, daysBetween, weekday, deDate, DE_DAY,
    slotsFor, nextDates, loadFor, blocksFor, readRequests, addRequest,
  };
})();
