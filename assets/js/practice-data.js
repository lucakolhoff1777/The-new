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
      "issued": "2026-07-24",
      "units": 6,
      "done": 1,
      "started": "2026-07-31",
      "last": "2026-07-31"
    },
    {
      "no": "HV-2026-1002",
      "patient": "A. Fuchs",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-13",
      "units": 10,
      "done": 2,
      "started": "2026-07-23",
      "last": "2026-07-23"
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
      "issued": "2026-07-25",
      "units": 10,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1005",
      "patient": "B. Riedel",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-06-26",
      "units": 6,
      "done": 2,
      "started": "2026-06-28",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1006",
      "patient": "C. Arnold",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-14",
      "units": 6,
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
      "issued": "2026-07-24",
      "units": 6,
      "done": 2,
      "started": "2026-08-09",
      "last": "2026-08-09"
    },
    {
      "no": "HV-2026-1008",
      "patient": "C. Bianchi",
      "ther": "hw",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-06-29",
      "units": 12,
      "done": 7,
      "started": "2026-07-09",
      "last": "2026-07-09"
    },
    {
      "no": "HV-2026-1009",
      "patient": "C. Wagner",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-06-29",
      "units": 12,
      "done": 9,
      "started": "2026-07-05",
      "last": "2026-07-05"
    },
    {
      "no": "HV-2026-1010",
      "patient": "C. Ziegler",
      "ther": "lk",
      "type": "Schienenbegleitung",
      "kind": "zuweis",
      "issued": "2026-07-30",
      "units": 10,
      "done": 1,
      "started": null,
      "last": "2026-07-29"
    },
    {
      "no": "HV-2026-1011",
      "patient": "D. Behrend",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-22",
      "units": 6,
      "done": 4,
      "started": "2026-08-02",
      "last": "2026-08-02"
    },
    {
      "no": "HV-2026-1012",
      "patient": "D. Nowak",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-06",
      "units": 6,
      "done": 2,
      "started": "2026-07-09",
      "last": "2026-07-09"
    },
    {
      "no": "HV-2026-1013",
      "patient": "D. Vogel",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-06-27",
      "units": 10,
      "done": 2,
      "started": "2026-06-30",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1014",
      "patient": "E. Berger",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-06",
      "units": 10,
      "done": 2,
      "started": "2026-07-20",
      "last": "2026-07-25"
    },
    {
      "no": "HV-2026-1015",
      "patient": "E. Kovac",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-06-30",
      "units": 10,
      "done": 3,
      "started": "2026-07-18",
      "last": "2026-07-18"
    },
    {
      "no": "HV-2026-1016",
      "patient": "G. Kovac",
      "ther": "jr",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-19",
      "units": 6,
      "done": 2,
      "started": "2026-07-30",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1017",
      "patient": "H. Brandt",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-20",
      "units": 10,
      "done": 5,
      "started": "2026-07-24",
      "last": "2026-07-24"
    },
    {
      "no": "HV-2026-1018",
      "patient": "H. Fuchs",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-23",
      "units": 6,
      "done": 5,
      "started": "2026-07-28",
      "last": "2026-07-28"
    },
    {
      "no": "HV-2026-1019",
      "patient": "H. Kuhn",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-31",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1020",
      "patient": "I. Baumann",
      "ther": "lk",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-02",
      "units": 6,
      "done": 4,
      "started": "2026-07-07",
      "last": "2026-07-07"
    },
    {
      "no": "HV-2026-1021",
      "patient": "I. Behrend",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-01",
      "units": 6,
      "done": 1,
      "started": "2026-07-08",
      "last": "2026-07-08"
    },
    {
      "no": "HV-2026-1022",
      "patient": "I. Sauer",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-24",
      "units": 6,
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
      "issued": "2026-07-31",
      "units": 6,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1024",
      "patient": "K. Roth",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-24",
      "units": 12,
      "done": 4,
      "started": "2026-08-09",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1025",
      "patient": "L. Winkler",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-06-28",
      "units": 10,
      "done": 9,
      "started": "2026-07-16",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1026",
      "patient": "N. Aydin",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-14",
      "units": 10,
      "done": 6,
      "started": "2026-07-26",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1027",
      "patient": "N. Dietrich",
      "ther": "jr",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-01",
      "units": 10,
      "done": 8,
      "started": "2026-07-12",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1028",
      "patient": "N. Frey",
      "ther": "hw",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-24",
      "units": 12,
      "done": 5,
      "started": "2026-08-09",
      "last": "2026-08-09"
    },
    {
      "no": "HV-2026-1029",
      "patient": "O. Yilmaz",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-07-08",
      "units": 6,
      "done": 1,
      "started": "2026-07-15",
      "last": "2026-07-15"
    },
    {
      "no": "HV-2026-1030",
      "patient": "P. Mahler",
      "ther": "sh",
      "type": "Lymphdrainage",
      "kind": "rezept",
      "issued": "2026-07-17",
      "units": 12,
      "done": 3,
      "started": "2026-07-26",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1031",
      "patient": "P. Reiss",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-17",
      "units": 6,
      "done": 1,
      "started": "2026-07-28",
      "last": "2026-07-28"
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
      "issued": "2026-07-04",
      "units": 10,
      "done": 2,
      "started": "2026-07-16",
      "last": "2026-07-16"
    },
    {
      "no": "HV-2026-1034",
      "patient": "S. Marchand",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-17",
      "units": 10,
      "done": 4,
      "started": "2026-07-19",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1035",
      "patient": "S. Ziegler",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-20",
      "units": 12,
      "done": 3,
      "started": "2026-08-03",
      "last": "2026-08-03"
    },
    {
      "no": "HV-2026-1036",
      "patient": "T. Mahler",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-26",
      "units": 6,
      "done": 3,
      "started": "2026-08-02",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1037",
      "patient": "T. Wendler",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-15",
      "units": 10,
      "done": 1,
      "started": "2026-07-18",
      "last": "2026-07-18"
    },
    {
      "no": "HV-2026-1038",
      "patient": "T. Ziegler",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-08",
      "units": 10,
      "done": 5,
      "started": "2026-07-25",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1039",
      "patient": "U. Adler",
      "ther": "lk",
      "type": "CMD-Folge",
      "kind": "zuweis",
      "issued": "2026-07-03",
      "units": 10,
      "done": 5,
      "started": "2026-07-05",
      "last": "2026-07-05"
    },
    {
      "no": "HV-2026-1040",
      "patient": "U. Demir",
      "ther": "lk",
      "type": "Schienenbegleitung",
      "kind": "zuweis",
      "issued": "2026-06-30",
      "units": 10,
      "done": 3,
      "started": "2026-07-18",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1041",
      "patient": "U. Kolb",
      "ther": "lk",
      "type": "Kinesiotaping",
      "kind": "zuweis",
      "issued": "2026-07-20",
      "units": 6,
      "done": 6,
      "started": "2026-07-24",
      "last": "2026-07-24"
    },
    {
      "no": "HV-2026-1042",
      "patient": "V. Aydin",
      "ther": "jr",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-29",
      "units": 10,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1043",
      "patient": "V. Engel",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-01",
      "units": 10,
      "done": 8,
      "started": "2026-07-06",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1044",
      "patient": "V. Weiss",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-04",
      "units": 10,
      "done": 3,
      "started": "2026-07-22",
      "last": "2026-07-22"
    },
    {
      "no": "HV-2026-1045",
      "patient": "W. Duarte",
      "ther": "jr",
      "type": "Elektro & Ultraschall",
      "kind": "rezept",
      "issued": "2026-07-09",
      "units": 6,
      "done": 2,
      "started": "2026-07-20",
      "last": "2026-08-10"
    },
    {
      "no": "HV-2026-1046",
      "patient": "W. Kettler",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-07-30",
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
      "issued": "2026-07-07",
      "units": 10,
      "done": 9,
      "started": "2026-07-25",
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1048",
      "patient": "W. Sauer",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-08-07",
      "units": 6,
      "done": 0,
      "started": null,
      "last": null
    },
    {
      "no": "HV-2026-1049",
      "patient": "Y. Ilic",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-06-26",
      "units": 12,
      "done": 8,
      "started": "2026-07-09",
      "last": "2026-07-09"
    },
    {
      "no": "HV-2026-1050",
      "patient": "Y. Kolb",
      "ther": "hw",
      "type": "Manuelle Therapie",
      "kind": "rezept",
      "issued": "2026-06-30",
      "units": 6,
      "done": 3,
      "started": "2026-07-16",
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
      "done": 3,
      "started": "2026-08-09",
      "last": "2026-08-09"
    },
    {
      "no": "HV-2026-1052",
      "patient": "Z. Arnold",
      "ther": "hw",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-08-02",
      "units": 6,
      "done": 2,
      "started": null,
      "last": "2026-08-11"
    },
    {
      "no": "HV-2026-1053",
      "patient": "Z. Ludwig",
      "ther": "jr",
      "type": "Krankengymnastik",
      "kind": "rezept",
      "issued": "2026-07-18",
      "units": 6,
      "done": 4,
      "started": "2026-08-06",
      "last": "2026-08-11"
    }
  ];

  const PATIENTS = [
    {
      "name": "A. Demir",
      "ther": "hw",
      "born": 1987,
      "phone": "+49 000 983 92",
      "mail": "demir@example.de",
      "street": "Ahornweg 11",
      "since": "2025-07-09",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "9HHADE",
      "firstAt": "2024-08-20",
      "visitsAll": 43,
      "noshows": 0
    },
    {
      "name": "A. Fuchs",
      "ther": "sh",
      "born": 1964,
      "phone": "+49 000 135 85",
      "mail": "fuchs@example.de",
      "street": "Birkenallee 70",
      "since": "2025-09-09",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "M4HVTM",
      "firstAt": "2025-10-25",
      "visitsAll": 25,
      "noshows": 0
    },
    {
      "name": "A. Okafor",
      "ther": "mb",
      "born": 2003,
      "phone": "+49 000 343 18",
      "mail": "okafor@example.de",
      "street": "Hafenstraße 21",
      "since": "2026-01-24",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "DEJ7LU",
      "firstAt": "2025-10-29",
      "visitsAll": 27,
      "noshows": 1
    },
    {
      "name": "A. Reiss",
      "ther": "lk",
      "born": 1986,
      "phone": "+49 000 653 97",
      "mail": "reiss@example.de",
      "street": "Lindenstraße 83",
      "since": "2024-08-25",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "VFUTKN",
      "firstAt": "2026-07-05",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "A. Riedel",
      "ther": "hw",
      "born": 1983,
      "phone": "+49 000 714 46",
      "mail": "riedel@example.de",
      "street": "Ahornweg 49",
      "since": "2025-09-11",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "PR9E4W",
      "firstAt": "2026-05-10",
      "visitsAll": 5,
      "noshows": 0
    },
    {
      "name": "B. Claus",
      "ther": "mb",
      "born": 1984,
      "phone": "+49 000 229 59",
      "mail": "claus@example.de",
      "street": "Sonnenhalde 45",
      "since": "2025-12-10",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "EY7JXY",
      "firstAt": "2024-08-11",
      "visitsAll": 50,
      "noshows": 7
    },
    {
      "name": "B. Duarte",
      "ther": "mb",
      "born": 2003,
      "phone": "+49 000 368 36",
      "mail": "duarte@example.de",
      "street": "Sonnenhalde 47",
      "since": "2025-04-16",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "PVHYUX",
      "firstAt": "2024-10-15",
      "visitsAll": 51,
      "noshows": 2
    },
    {
      "name": "B. Frey",
      "ther": "lk",
      "born": 2001,
      "phone": "+49 000 990 85",
      "mail": "frey@example.de",
      "street": "Rosenweg 69",
      "since": "2025-02-04",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "9ADDTC",
      "firstAt": "2025-04-04",
      "visitsAll": 60,
      "noshows": 4
    },
    {
      "name": "B. Ludwig",
      "ther": "mb",
      "born": 2008,
      "phone": "+49 000 420 75",
      "mail": "ludwig@example.de",
      "street": "Rosenweg 44",
      "since": "2024-02-24",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "JYDPKD",
      "firstAt": "2026-06-26",
      "visitsAll": 7,
      "noshows": 1
    },
    {
      "name": "B. Neuhaus",
      "ther": "sh",
      "born": 1984,
      "phone": "+49 000 510 80",
      "mail": "neuhaus@example.de",
      "street": "Kirchplatz 42",
      "since": "2024-11-08",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "7VWVUA",
      "firstAt": "2025-03-03",
      "visitsAll": 115,
      "noshows": 0
    },
    {
      "name": "B. Riedel",
      "ther": "sh",
      "born": 1981,
      "phone": "+49 000 715 21",
      "mail": "riedel@example.de",
      "street": "Birkenallee 87",
      "since": "2025-01-06",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "FV9E7K",
      "firstAt": "2026-01-09",
      "visitsAll": 46,
      "noshows": 4
    },
    {
      "name": "C. Amrein",
      "ther": "sh",
      "born": 1988,
      "phone": "+49 000 143 22",
      "mail": "amrein@example.de",
      "street": "Am Mühlbach 39",
      "since": "2025-10-04",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "CKMLDR",
      "firstAt": "2025-03-08",
      "visitsAll": 90,
      "noshows": 0
    },
    {
      "name": "C. Arnold",
      "ther": "hw",
      "born": 1995,
      "phone": "+49 000 640 85",
      "mail": "arnold@example.de",
      "street": "Sonnenhalde 31",
      "since": "2024-06-07",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "NFYEDR",
      "firstAt": "2024-10-17",
      "visitsAll": 111,
      "noshows": 10
    },
    {
      "name": "C. Baumann",
      "ther": "jr",
      "born": 1995,
      "phone": "+49 000 437 61",
      "mail": "baumann@example.de",
      "street": "Kirchplatz 53",
      "since": "2025-08-23",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "LYH93J",
      "firstAt": "2023-12-04",
      "visitsAll": 120,
      "noshows": 7
    },
    {
      "name": "C. Bianchi",
      "ther": "hw",
      "born": 1959,
      "phone": "+49 000 910 81",
      "mail": "bianchi@example.de",
      "street": "Ahornweg 54",
      "since": "2026-02-21",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "LW9C3D",
      "firstAt": "2026-04-06",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "C. Hartwig",
      "ther": "lk",
      "born": 1982,
      "phone": "+49 000 807 46",
      "mail": "hartwig@example.de",
      "street": "Sonnenhalde 52",
      "since": "2024-03-17",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "VEUK7D",
      "firstAt": "2026-06-12",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "C. Krüger",
      "ther": "sh",
      "born": 2010,
      "phone": "+49 000 183 56",
      "mail": "krueger@example.de",
      "street": "Rosenweg 83",
      "since": "2024-09-07",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "V7ELP7",
      "firstAt": "2025-03-03",
      "visitsAll": 100,
      "noshows": 6
    },
    {
      "name": "C. Ludwig",
      "ther": "sh",
      "born": 1963,
      "phone": "+49 000 670 75",
      "mail": "ludwig@example.de",
      "street": "Talblick 77",
      "since": "2025-06-11",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "DMWDUP",
      "firstAt": "2024-02-04",
      "visitsAll": 115,
      "noshows": 23
    },
    {
      "name": "C. Marchand",
      "ther": "lk",
      "born": 1994,
      "phone": "+49 000 989 95",
      "mail": "marchand@example.de",
      "street": "Am Mühlbach 71",
      "since": "2025-07-23",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "3R9PRY",
      "firstAt": "2025-11-23",
      "visitsAll": 47,
      "noshows": 0
    },
    {
      "name": "C. Wagner",
      "ther": "lk",
      "born": 1990,
      "phone": "+49 000 184 96",
      "mail": "wagner@example.de",
      "street": "Rosenweg 41",
      "since": "2025-11-22",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "NYY3XV",
      "firstAt": "2024-12-10",
      "visitsAll": 92,
      "noshows": 13
    },
    {
      "name": "C. Ziegler",
      "ther": "lk",
      "born": 1966,
      "phone": "+49 000 372 10",
      "mail": "ziegler@example.de",
      "street": "Rosenweg 21",
      "since": "2025-08-03",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "C3AAX3",
      "firstAt": "2025-06-26",
      "visitsAll": 22,
      "noshows": 1
    },
    {
      "name": "D. Behrend",
      "ther": "hw",
      "born": 2010,
      "phone": "+49 000 572 85",
      "mail": "behrend@example.de",
      "street": "Talblick 48",
      "since": "2025-12-02",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "KD447M",
      "firstAt": "2023-10-02",
      "visitsAll": 120,
      "noshows": 5
    },
    {
      "name": "D. Mahler",
      "ther": "lk",
      "born": 1979,
      "phone": "+49 000 263 50",
      "mail": "mahler@example.de",
      "street": "Am Mühlbach 14",
      "since": "2024-08-05",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "P4HDM9",
      "firstAt": "2024-08-16",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "D. Nowak",
      "ther": "hw",
      "born": 1991,
      "phone": "+49 000 644 39",
      "mail": "nowak@example.de",
      "street": "Talblick 10",
      "since": "2024-07-10",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "W3LTKN",
      "firstAt": "2025-07-30",
      "visitsAll": 39,
      "noshows": 8
    },
    {
      "name": "D. Sauer",
      "ther": "lk",
      "born": 1951,
      "phone": "+49 000 564 23",
      "mail": "sauer@example.de",
      "street": "Ahornweg 47",
      "since": "2025-07-07",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "9TXVRX",
      "firstAt": "2025-04-30",
      "visitsAll": 50,
      "noshows": 3
    },
    {
      "name": "D. Vogel",
      "ther": "hw",
      "born": 1968,
      "phone": "+49 000 904 54",
      "mail": "vogel@example.de",
      "street": "Lindenstraße 46",
      "since": "2025-11-28",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "RTWPCX",
      "firstAt": "2025-02-18",
      "visitsAll": 32,
      "noshows": 0
    },
    {
      "name": "E. Amrein",
      "ther": "mb",
      "born": 2009,
      "phone": "+49 000 676 52",
      "mail": "amrein@example.de",
      "street": "Talblick 62",
      "since": "2025-11-02",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "WWLMHV",
      "firstAt": "2025-03-22",
      "visitsAll": 79,
      "noshows": 5
    },
    {
      "name": "E. Berger",
      "ther": "sh",
      "born": 2002,
      "phone": "+49 000 785 86",
      "mail": "berger@example.de",
      "street": "Sonnenhalde 85",
      "since": "2026-02-23",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "NVAJ4U",
      "firstAt": "2024-09-14",
      "visitsAll": 100,
      "noshows": 6
    },
    {
      "name": "E. Kovac",
      "ther": "jr",
      "born": 1959,
      "phone": "+49 000 862 43",
      "mail": "kovac@example.de",
      "street": "Sonnenhalde 61",
      "since": "2025-09-08",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "PMY4DX",
      "firstAt": "2024-10-20",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "F. Keller",
      "ther": "lk",
      "born": 1983,
      "phone": "+49 000 516 35",
      "mail": "keller@example.de",
      "street": "Ahornweg 60",
      "since": "2026-06-22",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "44KLJC",
      "firstAt": "2024-07-21",
      "visitsAll": 120,
      "noshows": 11
    },
    {
      "name": "F. Neuhaus",
      "ther": "lk",
      "born": 1978,
      "phone": "+49 000 953 36",
      "mail": "neuhaus@example.de",
      "street": "Lindenstraße 65",
      "since": "2026-04-18",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "4DXD4Y",
      "firstAt": "2026-06-27",
      "visitsAll": 8,
      "noshows": 0
    },
    {
      "name": "G. Kovac",
      "ther": "jr",
      "born": 1983,
      "phone": "+49 000 772 12",
      "mail": "kovac@example.de",
      "street": "Lindenstraße 74",
      "since": "2025-10-02",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "HDPH9K",
      "firstAt": "2024-03-20",
      "visitsAll": 85,
      "noshows": 17
    },
    {
      "name": "G. Möller",
      "ther": "hw",
      "born": 1984,
      "phone": "+49 000 540 32",
      "mail": "moeller@example.de",
      "street": "Sonnenhalde 55",
      "since": "2025-01-09",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "W3FLFC",
      "firstAt": "2025-02-18",
      "visitsAll": 115,
      "noshows": 16
    },
    {
      "name": "G. Roth",
      "ther": "lk",
      "born": 1957,
      "phone": "+49 000 511 17",
      "mail": "roth@example.de",
      "street": "Kirchplatz 44",
      "since": "2024-07-01",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "NJ3KRJ",
      "firstAt": "2023-11-19",
      "visitsAll": 93,
      "noshows": 0
    },
    {
      "name": "G. Vogt",
      "ther": "lk",
      "born": 1971,
      "phone": "+49 000 434 88",
      "mail": "vogt@example.de",
      "street": "Eichenkamp 18",
      "since": "2026-07-09",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "UWPJ7M",
      "firstAt": "2026-05-19",
      "visitsAll": 11,
      "noshows": 0
    },
    {
      "name": "H. Bauer",
      "ther": "hw",
      "born": 1990,
      "phone": "+49 000 510 90",
      "mail": "bauer@example.de",
      "street": "Birkenallee 69",
      "since": "2024-11-10",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "PLR4RE",
      "firstAt": "2025-07-30",
      "visitsAll": 48,
      "noshows": 0
    },
    {
      "name": "H. Brandt",
      "ther": "jr",
      "born": 1949,
      "phone": "+49 000 633 12",
      "mail": "brandt@example.de",
      "street": "Eichenkamp 73",
      "since": "2026-03-18",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "TPMRCA",
      "firstAt": "2024-11-14",
      "visitsAll": 120,
      "noshows": 5
    },
    {
      "name": "H. Fuchs",
      "ther": "hw",
      "born": 1961,
      "phone": "+49 000 232 46",
      "mail": "fuchs@example.de",
      "street": "Rosenweg 85",
      "since": "2025-11-18",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "NCHYC4",
      "firstAt": "2024-02-21",
      "visitsAll": 116,
      "noshows": 2
    },
    {
      "name": "H. Kessler",
      "ther": "sh",
      "born": 1977,
      "phone": "+49 000 787 33",
      "mail": "kessler@example.de",
      "street": "Sonnenhalde 16",
      "since": "2025-09-02",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "DCHNHM",
      "firstAt": "2025-02-09",
      "visitsAll": 66,
      "noshows": 0
    },
    {
      "name": "H. Kuhn",
      "ther": "hw",
      "born": 1987,
      "phone": "+49 000 261 24",
      "mail": "kuhn@example.de",
      "street": "Eichenkamp 67",
      "since": "2025-06-29",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "CUAX3J",
      "firstAt": "2025-06-06",
      "visitsAll": 83,
      "noshows": 0
    },
    {
      "name": "H. Möller",
      "ther": "mb",
      "born": 1956,
      "phone": "+49 000 869 46",
      "mail": "moeller@example.de",
      "street": "Am Mühlbach 40",
      "since": "2026-03-20",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "AXXFYC",
      "firstAt": "2025-06-13",
      "visitsAll": 64,
      "noshows": 0
    },
    {
      "name": "H. Nowak",
      "ther": "sh",
      "born": 1966,
      "phone": "+49 000 905 34",
      "mail": "nowak@example.de",
      "street": "Eichenkamp 69",
      "since": "2026-03-26",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "LCXY7A",
      "firstAt": "2025-05-25",
      "visitsAll": 93,
      "noshows": 19
    },
    {
      "name": "I. Amrein",
      "ther": "mb",
      "born": 1981,
      "phone": "+49 000 877 32",
      "mail": "amrein@example.de",
      "street": "Rosenweg 54",
      "since": "2024-09-11",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "7J73MY",
      "firstAt": "2024-07-12",
      "visitsAll": 120,
      "noshows": 17
    },
    {
      "name": "I. Baumann",
      "ther": "lk",
      "born": 1979,
      "phone": "+49 000 358 73",
      "mail": "baumann@example.de",
      "street": "Eichenkamp 80",
      "since": "2025-10-31",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "FFPKWK",
      "firstAt": "2026-03-23",
      "visitsAll": 10,
      "noshows": 0
    },
    {
      "name": "I. Behrend",
      "ther": "hw",
      "born": 1993,
      "phone": "+49 000 165 46",
      "mail": "behrend@example.de",
      "street": "Birkenallee 34",
      "since": "2024-07-30",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "XY4KER",
      "firstAt": "2025-05-18",
      "visitsAll": 38,
      "noshows": 5
    },
    {
      "name": "I. Ferreira",
      "ther": "sh",
      "born": 1973,
      "phone": "+49 000 860 68",
      "mail": "ferreira@example.de",
      "street": "Lindenstraße 50",
      "since": "2025-04-22",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "K4FDCK",
      "firstAt": "2026-05-07",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "I. Frey",
      "ther": "sh",
      "born": 1972,
      "phone": "+49 000 400 60",
      "mail": "frey@example.de",
      "street": "Rosenweg 2",
      "since": "2026-06-24",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "N9ULLA",
      "firstAt": "2026-01-25",
      "visitsAll": 34,
      "noshows": 1
    },
    {
      "name": "I. Sauer",
      "ther": "sh",
      "born": 1958,
      "phone": "+49 000 175 71",
      "mail": "sauer@example.de",
      "street": "Kirchplatz 67",
      "since": "2026-02-19",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "7VPWUX",
      "firstAt": "2026-03-25",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "J. Aksoy",
      "ther": "mb",
      "born": 1999,
      "phone": "+49 000 208 52",
      "mail": "aksoy@example.de",
      "street": "Eichenkamp 9",
      "since": "2025-04-22",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "CR9HWW",
      "firstAt": "2024-10-25",
      "visitsAll": 36,
      "noshows": 2
    },
    {
      "name": "J. Zeller",
      "ther": "jr",
      "born": 1978,
      "phone": "+49 000 635 35",
      "mail": "zeller@example.de",
      "street": "Talblick 82",
      "since": "2024-03-18",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "VERKVK",
      "firstAt": "2024-01-06",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "K. Marchand",
      "ther": "lk",
      "born": 1958,
      "phone": "+49 000 454 12",
      "mail": "marchand@example.de",
      "street": "Lindenstraße 5",
      "since": "2025-05-15",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "CJUDCJ",
      "firstAt": "2023-11-02",
      "visitsAll": 55,
      "noshows": 2
    },
    {
      "name": "K. Roth",
      "ther": "hw",
      "born": 1983,
      "phone": "+49 000 795 45",
      "mail": "roth@example.de",
      "street": "Eichenkamp 60",
      "since": "2024-09-27",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "EYP4XN",
      "firstAt": "2023-09-05",
      "visitsAll": 96,
      "noshows": 0
    },
    {
      "name": "L. Behrend",
      "ther": "mb",
      "born": 2010,
      "phone": "+49 000 785 43",
      "mail": "behrend@example.de",
      "street": "Hafenstraße 29",
      "since": "2025-12-21",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "D7PH4V",
      "firstAt": "2025-02-07",
      "visitsAll": 43,
      "noshows": 2
    },
    {
      "name": "L. Winkler",
      "ther": "jr",
      "born": 1983,
      "phone": "+49 000 525 45",
      "mail": "winkler@example.de",
      "street": "Talblick 25",
      "since": "2025-01-20",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "DEAAUU",
      "firstAt": "2025-04-28",
      "visitsAll": 92,
      "noshows": 2
    },
    {
      "name": "M. Marchand",
      "ther": "mb",
      "born": 2005,
      "phone": "+49 000 627 45",
      "mail": "marchand@example.de",
      "street": "Am Mühlbach 19",
      "since": "2026-05-13",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "XUL9LJ",
      "firstAt": "2024-08-28",
      "visitsAll": 80,
      "noshows": 7
    },
    {
      "name": "M. Sperling",
      "ther": "mb",
      "born": 1997,
      "phone": "+49 000 182 79",
      "mail": "sperling@example.de",
      "street": "Ahornweg 43",
      "since": "2024-05-06",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "NETHXX",
      "firstAt": "2026-05-13",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "N. Aydin",
      "ther": "hw",
      "born": 1969,
      "phone": "+49 000 989 15",
      "mail": "aydin@example.de",
      "street": "Am Mühlbach 84",
      "since": "2024-07-04",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "UPHCV4",
      "firstAt": "2023-09-21",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "N. Dietrich",
      "ther": "jr",
      "born": 1978,
      "phone": "+49 000 821 10",
      "mail": "dietrich@example.de",
      "street": "Kirchplatz 49",
      "since": "2026-01-28",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "CD747W",
      "firstAt": "2025-10-15",
      "visitsAll": 24,
      "noshows": 3
    },
    {
      "name": "N. Frey",
      "ther": "hw",
      "born": 1952,
      "phone": "+49 000 804 98",
      "mail": "frey@example.de",
      "street": "Eichenkamp 14",
      "since": "2025-06-30",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "YRJA4D",
      "firstAt": "2024-09-11",
      "visitsAll": 120,
      "noshows": 7
    },
    {
      "name": "N. Okafor",
      "ther": "mb",
      "born": 1957,
      "phone": "+49 000 886 29",
      "mail": "okafor@example.de",
      "street": "Sonnenhalde 17",
      "since": "2025-04-25",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "7DFH79",
      "firstAt": "2026-03-25",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "N. Tran",
      "ther": "mb",
      "born": 1993,
      "phone": "+49 000 888 26",
      "mail": "tran@example.de",
      "street": "Lindenstraße 3",
      "since": "2024-11-12",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "KA7VTP",
      "firstAt": "2023-11-20",
      "visitsAll": 120,
      "noshows": 17
    },
    {
      "name": "O. Hübner",
      "ther": "sh",
      "born": 1993,
      "phone": "+49 000 363 64",
      "mail": "huebner@example.de",
      "street": "Kirchplatz 13",
      "since": "2025-08-12",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "RHNE3P",
      "firstAt": "2025-09-19",
      "visitsAll": 53,
      "noshows": 0
    },
    {
      "name": "O. Vogt",
      "ther": "lk",
      "born": 1966,
      "phone": "+49 000 854 33",
      "mail": "vogt@example.de",
      "street": "Talblick 52",
      "since": "2024-11-29",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "VEUMAE",
      "firstAt": "2024-07-02",
      "visitsAll": 113,
      "noshows": 0
    },
    {
      "name": "O. Yilmaz",
      "ther": "lk",
      "born": 1979,
      "phone": "+49 000 723 90",
      "mail": "yilmaz@example.de",
      "street": "Birkenallee 6",
      "since": "2025-11-25",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "3LDRVU",
      "firstAt": "2026-07-17",
      "visitsAll": 2,
      "noshows": 0
    },
    {
      "name": "P. Mahler",
      "ther": "sh",
      "born": 1952,
      "phone": "+49 000 322 79",
      "mail": "mahler@example.de",
      "street": "Eichenkamp 60",
      "since": "2024-07-16",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "XRJVLA",
      "firstAt": "2023-09-28",
      "visitsAll": 71,
      "noshows": 0
    },
    {
      "name": "P. Reiss",
      "ther": "hw",
      "born": 1965,
      "phone": "+49 000 467 65",
      "mail": "reiss@example.de",
      "street": "Ahornweg 39",
      "since": "2025-01-16",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "VEVHCL",
      "firstAt": "2026-03-30",
      "visitsAll": 11,
      "noshows": 0
    },
    {
      "name": "R. Duarte",
      "ther": "jr",
      "born": 1996,
      "phone": "+49 000 724 56",
      "mail": "duarte@example.de",
      "street": "Eichenkamp 7",
      "since": "2024-12-13",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "JJWDNA",
      "firstAt": "2024-01-15",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "R. Haas",
      "ther": "lk",
      "born": 1958,
      "phone": "+49 000 191 21",
      "mail": "haas@example.de",
      "street": "Rosenweg 49",
      "since": "2024-09-07",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "TXWFF3",
      "firstAt": "2024-12-26",
      "visitsAll": 56,
      "noshows": 1
    },
    {
      "name": "R. Hofmann",
      "ther": "mb",
      "born": 1992,
      "phone": "+49 000 913 65",
      "mail": "hofmann@example.de",
      "street": "Sonnenhalde 86",
      "since": "2025-11-29",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "MAYECE",
      "firstAt": "2024-12-07",
      "visitsAll": 81,
      "noshows": 0
    },
    {
      "name": "R. Wendler",
      "ther": "mb",
      "born": 1998,
      "phone": "+49 000 875 38",
      "mail": "wendler@example.de",
      "street": "Talblick 55",
      "since": "2024-07-23",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "UX4KT9",
      "firstAt": "2024-07-23",
      "visitsAll": 68,
      "noshows": 0
    },
    {
      "name": "R. Yilmaz",
      "ther": "mb",
      "born": 1982,
      "phone": "+49 000 368 47",
      "mail": "yilmaz@example.de",
      "street": "Lindenstraße 11",
      "since": "2026-01-02",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "H44H9X",
      "firstAt": "2024-10-14",
      "visitsAll": 61,
      "noshows": 0
    },
    {
      "name": "S. Kirsch",
      "ther": "jr",
      "born": 1967,
      "phone": "+49 000 963 72",
      "mail": "kirsch@example.de",
      "street": "Kirchplatz 56",
      "since": "2026-01-26",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "XPH4DR",
      "firstAt": "2025-09-26",
      "visitsAll": 60,
      "noshows": 2
    },
    {
      "name": "S. Kramer",
      "ther": "mb",
      "born": 1949,
      "phone": "+49 000 884 82",
      "mail": "kramer@example.de",
      "street": "Hafenstraße 16",
      "since": "2025-12-07",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "AJHCMW",
      "firstAt": "2025-07-20",
      "visitsAll": 49,
      "noshows": 7
    },
    {
      "name": "S. Marchand",
      "ther": "jr",
      "born": 1987,
      "phone": "+49 000 307 54",
      "mail": "marchand@example.de",
      "street": "Lindenstraße 62",
      "since": "2025-02-13",
      "remind": false,
      "channel": "E-Mail",
      "note": "",
      "code": "KAHLFA",
      "firstAt": "2025-01-31",
      "visitsAll": 107,
      "noshows": 0
    },
    {
      "name": "S. Wendler",
      "ther": "sh",
      "born": 1988,
      "phone": "+49 000 862 31",
      "mail": "wendler@example.de",
      "street": "Birkenallee 66",
      "since": "2025-03-26",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "3JJY4A",
      "firstAt": "2024-06-20",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "S. Ziegler",
      "ther": "hw",
      "born": 2006,
      "phone": "+49 000 312 88",
      "mail": "ziegler@example.de",
      "street": "Rosenweg 73",
      "since": "2024-10-31",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "KHAUKV",
      "firstAt": "2025-09-10",
      "visitsAll": 63,
      "noshows": 9
    },
    {
      "name": "T. Mahler",
      "ther": "hw",
      "born": 2006,
      "phone": "+49 000 566 95",
      "mail": "mahler@example.de",
      "street": "Eichenkamp 69",
      "since": "2024-10-28",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "C3A739",
      "firstAt": "2025-09-16",
      "visitsAll": 31,
      "noshows": 2
    },
    {
      "name": "T. Marchand",
      "ther": "sh",
      "born": 2009,
      "phone": "+49 000 476 80",
      "mail": "marchand@example.de",
      "street": "Am Mühlbach 73",
      "since": "2026-02-13",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "C3JMX4",
      "firstAt": "2026-05-19",
      "visitsAll": 13,
      "noshows": 0
    },
    {
      "name": "T. Wendler",
      "ther": "jr",
      "born": 1998,
      "phone": "+49 000 475 64",
      "mail": "wendler@example.de",
      "street": "Kirchplatz 58",
      "since": "2025-07-23",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "W3KRCV",
      "firstAt": "2025-01-02",
      "visitsAll": 89,
      "noshows": 8
    },
    {
      "name": "T. Ziegler",
      "ther": "hw",
      "born": 1965,
      "phone": "+49 000 723 88",
      "mail": "ziegler@example.de",
      "street": "Ahornweg 29",
      "since": "2024-07-10",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "9LWWWW",
      "firstAt": "2024-01-08",
      "visitsAll": 120,
      "noshows": 2
    },
    {
      "name": "U. Adler",
      "ther": "lk",
      "born": 1999,
      "phone": "+49 000 651 60",
      "mail": "adler@example.de",
      "street": "Kirchplatz 25",
      "since": "2025-09-24",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "KN4DKT",
      "firstAt": "2025-09-28",
      "visitsAll": 60,
      "noshows": 5
    },
    {
      "name": "U. Demir",
      "ther": "lk",
      "born": 1992,
      "phone": "+49 000 220 34",
      "mail": "demir@example.de",
      "street": "Talblick 83",
      "since": "2024-09-29",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "LJXFUE",
      "firstAt": "2024-12-18",
      "visitsAll": 59,
      "noshows": 4
    },
    {
      "name": "U. Kolb",
      "ther": "lk",
      "born": 1975,
      "phone": "+49 000 115 42",
      "mail": "kolb@example.de",
      "street": "Birkenallee 10",
      "since": "2025-06-27",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "NTP3CT",
      "firstAt": "2024-09-04",
      "visitsAll": 72,
      "noshows": 0
    },
    {
      "name": "V. Aydin",
      "ther": "jr",
      "born": 2004,
      "phone": "+49 000 346 54",
      "mail": "aydin@example.de",
      "street": "Sonnenhalde 56",
      "since": "2025-10-10",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "XMAKPK",
      "firstAt": "2024-10-06",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "V. Engel",
      "ther": "jr",
      "born": 2000,
      "phone": "+49 000 536 67",
      "mail": "engel@example.de",
      "street": "Ahornweg 59",
      "since": "2025-08-09",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "LCPKR3",
      "firstAt": "2024-02-15",
      "visitsAll": 112,
      "noshows": 0
    },
    {
      "name": "V. Thiel",
      "ther": "lk",
      "born": 1989,
      "phone": "+49 000 847 26",
      "mail": "thiel@example.de",
      "street": "Kirchplatz 67",
      "since": "2025-08-22",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "PVL9YK",
      "firstAt": "2025-05-04",
      "visitsAll": 50,
      "noshows": 7
    },
    {
      "name": "V. Weiss",
      "ther": "jr",
      "born": 1977,
      "phone": "+49 000 760 18",
      "mail": "weiss@example.de",
      "street": "Hafenstraße 38",
      "since": "2025-12-11",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "JVFRT3",
      "firstAt": "2024-05-10",
      "visitsAll": 119,
      "noshows": 11
    },
    {
      "name": "V. Yilmaz",
      "ther": "mb",
      "born": 1985,
      "phone": "+49 000 856 52",
      "mail": "yilmaz@example.de",
      "street": "Kirchplatz 5",
      "since": "2025-08-07",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "C9FYER",
      "firstAt": "2026-02-14",
      "visitsAll": 25,
      "noshows": 2
    },
    {
      "name": "V. Zeller",
      "ther": "sh",
      "born": 1969,
      "phone": "+49 000 580 89",
      "mail": "zeller@example.de",
      "street": "Lindenstraße 51",
      "since": "2024-11-06",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "ETPRTA",
      "firstAt": "2023-08-07",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "W. Duarte",
      "ther": "jr",
      "born": 1974,
      "phone": "+49 000 703 24",
      "mail": "duarte@example.de",
      "street": "Am Mühlbach 13",
      "since": "2025-02-19",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "FNR3HF",
      "firstAt": "2026-04-20",
      "visitsAll": 1,
      "noshows": 0
    },
    {
      "name": "W. Kettler",
      "ther": "hw",
      "born": 1975,
      "phone": "+49 000 985 14",
      "mail": "kettler@example.de",
      "street": "Rosenweg 24",
      "since": "2024-03-03",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "9YXX7C",
      "firstAt": "2023-10-01",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "W. Obermann",
      "ther": "lk",
      "born": 1966,
      "phone": "+49 000 566 88",
      "mail": "obermann@example.de",
      "street": "Lindenstraße 21",
      "since": "2024-05-31",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "KFKHPU",
      "firstAt": "2025-09-08",
      "visitsAll": 48,
      "noshows": 4
    },
    {
      "name": "W. Sauer",
      "ther": "jr",
      "born": 1975,
      "phone": "+49 000 896 47",
      "mail": "sauer@example.de",
      "street": "Am Mühlbach 49",
      "since": "2025-04-26",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "HNLREU",
      "firstAt": "2023-10-31",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "Y. Ilic",
      "ther": "hw",
      "born": 1997,
      "phone": "+49 000 350 45",
      "mail": "ilic@example.de",
      "street": "Eichenkamp 59",
      "since": "2024-05-15",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "NU93YV",
      "firstAt": "2024-03-23",
      "visitsAll": 116,
      "noshows": 5
    },
    {
      "name": "Y. Kolb",
      "ther": "hw",
      "born": 1949,
      "phone": "+49 000 718 45",
      "mail": "kolb@example.de",
      "street": "Sonnenhalde 30",
      "since": "2026-02-07",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "PEDJN7",
      "firstAt": "2024-10-31",
      "visitsAll": 120,
      "noshows": 17
    },
    {
      "name": "Y. Lorenz",
      "ther": "mb",
      "born": 1994,
      "phone": "+49 000 277 60",
      "mail": "lorenz@example.de",
      "street": "Talblick 73",
      "since": "2026-05-31",
      "remind": true,
      "channel": "E-Mail",
      "note": "",
      "code": "J9R9KC",
      "firstAt": "2025-02-08",
      "visitsAll": 100,
      "noshows": 0
    },
    {
      "name": "Y. Mertens",
      "ther": "hw",
      "born": 1999,
      "phone": "+49 000 165 61",
      "mail": "mertens@example.de",
      "street": "Talblick 1",
      "since": "2024-04-08",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "LKFHKE",
      "firstAt": "2023-10-30",
      "visitsAll": 120,
      "noshows": 0
    },
    {
      "name": "Z. Arnold",
      "ther": "hw",
      "born": 1988,
      "phone": "+49 000 879 14",
      "mail": "arnold@example.de",
      "street": "Lindenstraße 25",
      "since": "2024-09-22",
      "remind": false,
      "channel": "SMS",
      "note": "",
      "code": "EHAUFV",
      "firstAt": "2025-05-05",
      "visitsAll": 50,
      "noshows": 0
    },
    {
      "name": "Z. Ludwig",
      "ther": "jr",
      "born": 1972,
      "phone": "+49 000 519 34",
      "mail": "ludwig@example.de",
      "street": "Ahornweg 56",
      "since": "2026-06-21",
      "remind": true,
      "channel": "SMS",
      "note": "",
      "code": "A494RK",
      "firstAt": "2025-11-22",
      "visitsAll": 55,
      "noshows": 2
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
     Attendance, exercise plans and finished reports
     --------------------------------------------------------------------- */

  // outcome per appointment index; only days that already happened have one
  const ATTEND_KIND = { kam: "gekommen", spaet: "zu spät", abgesagt: "kurzfristig abgesagt",
                        noshow: "nicht erschienen" };
  const ATTEND = {
    "0": "kam",
    "1": "kam",
    "2": "kam",
    "3": "kam",
    "4": "spaet",
    "5": "kam",
    "6": "kam",
    "7": "kam",
    "8": "kam",
    "9": "kam",
    "10": "kam",
    "11": "kam",
    "12": "kam",
    "13": "kam",
    "14": "kam",
    "15": "kam",
    "16": "kam",
    "17": "kam",
    "18": "kam",
    "19": "kam",
    "20": "kam",
    "21": "kam",
    "22": "kam",
    "23": "kam",
    "24": "kam",
    "25": "abgesagt",
    "26": "kam",
    "27": "kam",
    "28": "abgesagt",
    "29": "kam",
    "30": "kam",
    "31": "kam",
    "32": "kam",
    "33": "kam",
    "34": "kam",
    "35": "abgesagt",
    "36": "kam",
    "37": "kam",
    "38": "abgesagt",
    "39": "kam",
    "40": "kam",
    "41": "kam",
    "42": "kam",
    "43": "kam",
    "44": "noshow",
    "45": "kam",
    "46": "kam",
    "47": "kam",
    "48": "kam",
    "49": "kam",
    "50": "kam",
    "51": "kam",
    "52": "noshow",
    "53": "kam",
    "54": "noshow",
    "55": "noshow",
    "56": "kam",
    "57": "kam",
    "58": "kam",
    "59": "noshow",
    "60": "kam",
    "61": "kam",
    "62": "kam",
    "63": "kam",
    "64": "kam",
    "65": "abgesagt",
    "66": "noshow",
    "67": "kam",
    "68": "kam",
    "69": "kam",
    "70": "kam",
    "71": "kam",
    "72": "kam",
    "73": "spaet",
    "74": "spaet",
    "75": "kam",
    "76": "kam",
    "77": "kam",
    "78": "kam",
    "79": "kam",
    "80": "kam"
  };

  const EXERCISES = [
    {
      "key": "brueck",
      "name": "Brücke",
      "dose": "3 × 12",
      "note": "Becken langsam abrollen, Rippen unten lassen."
    },
    {
      "key": "clam",
      "name": "Muschel",
      "dose": "3 × 15 je Seite",
      "note": "Becken senkrecht halten, nicht nach hinten kippen."
    },
    {
      "key": "birddog",
      "name": "Vierfüßler diagonal",
      "dose": "3 × 10 je Seite",
      "note": "Rücken bleibt ein Brett, kein Hohlkreuz."
    },
    {
      "key": "wall",
      "name": "Wandsitz",
      "dose": "3 × 40 Sek.",
      "note": "Knie über der Fußmitte, Fersen belastet."
    },
    {
      "key": "calf",
      "name": "Wadenheben einbeinig",
      "dose": "3 × 15",
      "note": "Oben zwei Sekunden halten, langsam ablassen."
    },
    {
      "key": "band",
      "name": "Außenrotation am Band",
      "dose": "3 × 15",
      "note": "Ellbogen am Körper, Handtuch dazwischen."
    },
    {
      "key": "scap",
      "name": "Schulterblatt-Retraktion",
      "dose": "3 × 12",
      "note": "Schultern nach hinten unten, nicht hochziehen."
    },
    {
      "key": "nack",
      "name": "Nackenretraktion",
      "dose": "10 × 5 Sek.",
      "note": "Doppelkinn machen, Blick bleibt waagerecht."
    },
    {
      "key": "kiefer",
      "name": "Kieferöffnung kontrolliert",
      "dose": "10 × langsam",
      "note": "Zunge am Gaumen, geradeaus öffnen ohne Knacken."
    },
    {
      "key": "hueft",
      "name": "Hüftbeuger-Dehnung",
      "dose": "3 × 45 Sek. je Seite",
      "note": "Gesäß anspannen, Becken aufrichten."
    },
    {
      "key": "ischio",
      "name": "Nordic Curls exzentrisch",
      "dose": "3 × 6",
      "note": "So langsam wie möglich ablassen."
    },
    {
      "key": "balance",
      "name": "Einbeinstand instabil",
      "dose": "4 × 30 Sek.",
      "note": "Blick geradeaus, später Augen zu."
    }
  ];

  const PLANS = [
    {
      "patient": "A. Demir",
      "ther": "hw",
      "updated": "2026-07-31",
      "goal": "Treppensteigen ohne Pause.",
      "items": [
        {
          "key": "band",
          "days": 5
        },
        {
          "key": "kiefer",
          "days": 3
        },
        {
          "key": "scap",
          "days": 4
        },
        {
          "key": "brueck",
          "days": 5
        }
      ]
    },
    {
      "patient": "A. Fuchs",
      "ther": "sh",
      "updated": "2026-08-07",
      "goal": "Kiefer ohne Knacken öffnen können.",
      "items": [
        {
          "key": "hueft",
          "days": 5
        },
        {
          "key": "band",
          "days": 3
        },
        {
          "key": "calf",
          "days": 5
        }
      ]
    },
    {
      "patient": "A. Okafor",
      "ther": "mb",
      "updated": "2026-07-12",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "hueft",
          "days": 4
        },
        {
          "key": "scap",
          "days": 5
        },
        {
          "key": "kiefer",
          "days": 7
        },
        {
          "key": "band",
          "days": 5
        }
      ]
    },
    {
      "patient": "A. Reiss",
      "ther": "lk",
      "updated": "2026-08-09",
      "goal": "Treppensteigen ohne Pause.",
      "items": [
        {
          "key": "brueck",
          "days": 4
        },
        {
          "key": "balance",
          "days": 3
        },
        {
          "key": "nack",
          "days": 7
        }
      ]
    },
    {
      "patient": "A. Riedel",
      "ther": "hw",
      "updated": "2026-08-02",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "brueck",
          "days": 7
        },
        {
          "key": "balance",
          "days": 3
        },
        {
          "key": "nack",
          "days": 7
        }
      ]
    },
    {
      "patient": "B. Claus",
      "ther": "mb",
      "updated": "2026-07-23",
      "goal": "Nachts durchschlafen können.",
      "items": [
        {
          "key": "balance",
          "days": 5
        },
        {
          "key": "band",
          "days": 4
        },
        {
          "key": "nack",
          "days": 7
        },
        {
          "key": "kiefer",
          "days": 3
        }
      ]
    },
    {
      "patient": "B. Duarte",
      "ther": "mb",
      "updated": "2026-08-04",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "ischio",
          "days": 4
        },
        {
          "key": "brueck",
          "days": 7
        },
        {
          "key": "balance",
          "days": 7
        }
      ]
    },
    {
      "patient": "B. Frey",
      "ther": "lk",
      "updated": "2026-08-10",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "brueck",
          "days": 3
        },
        {
          "key": "hueft",
          "days": 7
        },
        {
          "key": "band",
          "days": 7
        },
        {
          "key": "clam",
          "days": 4
        }
      ]
    },
    {
      "patient": "B. Ludwig",
      "ther": "mb",
      "updated": "2026-08-08",
      "goal": "Schmerzfrei durch den Arbeitstag kommen.",
      "items": [
        {
          "key": "balance",
          "days": 4
        },
        {
          "key": "ischio",
          "days": 7
        },
        {
          "key": "band",
          "days": 7
        }
      ]
    },
    {
      "patient": "B. Neuhaus",
      "ther": "sh",
      "updated": "2026-07-30",
      "goal": "Kiefer ohne Knacken öffnen können.",
      "items": [
        {
          "key": "band",
          "days": 3
        },
        {
          "key": "calf",
          "days": 7
        },
        {
          "key": "wall",
          "days": 5
        },
        {
          "key": "clam",
          "days": 7
        }
      ]
    },
    {
      "patient": "B. Riedel",
      "ther": "sh",
      "updated": "2026-07-15",
      "goal": "Schmerzfrei durch den Arbeitstag kommen.",
      "items": [
        {
          "key": "band",
          "days": 4
        },
        {
          "key": "ischio",
          "days": 7
        },
        {
          "key": "calf",
          "days": 7
        },
        {
          "key": "balance",
          "days": 4
        },
        {
          "key": "nack",
          "days": 5
        }
      ]
    },
    {
      "patient": "C. Amrein",
      "ther": "sh",
      "updated": "2026-08-05",
      "goal": "Nachts durchschlafen können.",
      "items": [
        {
          "key": "ischio",
          "days": 4
        },
        {
          "key": "kiefer",
          "days": 7
        },
        {
          "key": "birddog",
          "days": 3
        },
        {
          "key": "clam",
          "days": 7
        }
      ]
    },
    {
      "patient": "C. Arnold",
      "ther": "hw",
      "updated": "2026-08-02",
      "goal": "Nachts durchschlafen können.",
      "items": [
        {
          "key": "kiefer",
          "days": 4
        },
        {
          "key": "balance",
          "days": 4
        },
        {
          "key": "ischio",
          "days": 4
        },
        {
          "key": "band",
          "days": 3
        },
        {
          "key": "wall",
          "days": 7
        }
      ]
    },
    {
      "patient": "C. Baumann",
      "ther": "jr",
      "updated": "2026-08-06",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "nack",
          "days": 3
        },
        {
          "key": "balance",
          "days": 4
        },
        {
          "key": "brueck",
          "days": 4
        },
        {
          "key": "hueft",
          "days": 5
        }
      ]
    },
    {
      "patient": "C. Bianchi",
      "ther": "hw",
      "updated": "2026-07-17",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "hueft",
          "days": 7
        },
        {
          "key": "birddog",
          "days": 5
        },
        {
          "key": "wall",
          "days": 7
        },
        {
          "key": "scap",
          "days": 4
        },
        {
          "key": "balance",
          "days": 5
        }
      ]
    },
    {
      "patient": "C. Hartwig",
      "ther": "lk",
      "updated": "2026-07-12",
      "goal": "Kiefer ohne Knacken öffnen können.",
      "items": [
        {
          "key": "wall",
          "days": 7
        },
        {
          "key": "brueck",
          "days": 5
        },
        {
          "key": "birddog",
          "days": 5
        }
      ]
    },
    {
      "patient": "C. Krüger",
      "ther": "sh",
      "updated": "2026-07-30",
      "goal": "Nachts durchschlafen können.",
      "items": [
        {
          "key": "birddog",
          "days": 3
        },
        {
          "key": "ischio",
          "days": 7
        },
        {
          "key": "calf",
          "days": 7
        },
        {
          "key": "hueft",
          "days": 5
        },
        {
          "key": "clam",
          "days": 3
        }
      ]
    },
    {
      "patient": "C. Ludwig",
      "ther": "sh",
      "updated": "2026-08-01",
      "goal": "Treppensteigen ohne Pause.",
      "items": [
        {
          "key": "band",
          "days": 3
        },
        {
          "key": "brueck",
          "days": 3
        },
        {
          "key": "nack",
          "days": 7
        }
      ]
    },
    {
      "patient": "C. Marchand",
      "ther": "lk",
      "updated": "2026-07-18",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "kiefer",
          "days": 3
        },
        {
          "key": "nack",
          "days": 7
        },
        {
          "key": "ischio",
          "days": 5
        },
        {
          "key": "scap",
          "days": 3
        },
        {
          "key": "hueft",
          "days": 4
        }
      ]
    },
    {
      "patient": "C. Wagner",
      "ther": "lk",
      "updated": "2026-07-26",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "calf",
          "days": 4
        },
        {
          "key": "brueck",
          "days": 3
        },
        {
          "key": "clam",
          "days": 3
        }
      ]
    },
    {
      "patient": "C. Ziegler",
      "ther": "lk",
      "updated": "2026-07-22",
      "goal": "Schmerzfrei durch den Arbeitstag kommen.",
      "items": [
        {
          "key": "ischio",
          "days": 4
        },
        {
          "key": "hueft",
          "days": 5
        },
        {
          "key": "kiefer",
          "days": 3
        },
        {
          "key": "calf",
          "days": 5
        }
      ]
    },
    {
      "patient": "D. Behrend",
      "ther": "hw",
      "updated": "2026-07-29",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "birddog",
          "days": 4
        },
        {
          "key": "calf",
          "days": 5
        },
        {
          "key": "balance",
          "days": 5
        },
        {
          "key": "ischio",
          "days": 4
        },
        {
          "key": "brueck",
          "days": 4
        }
      ]
    },
    {
      "patient": "D. Mahler",
      "ther": "lk",
      "updated": "2026-07-26",
      "goal": "Wieder 5 km am Stück laufen.",
      "items": [
        {
          "key": "clam",
          "days": 7
        },
        {
          "key": "balance",
          "days": 7
        },
        {
          "key": "band",
          "days": 7
        }
      ]
    },
    {
      "patient": "D. Nowak",
      "ther": "hw",
      "updated": "2026-08-02",
      "goal": "Wieder 5 km am Stück laufen.",
      "items": [
        {
          "key": "birddog",
          "days": 7
        },
        {
          "key": "scap",
          "days": 7
        },
        {
          "key": "clam",
          "days": 7
        },
        {
          "key": "balance",
          "days": 4
        }
      ]
    },
    {
      "patient": "D. Sauer",
      "ther": "lk",
      "updated": "2026-07-18",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "kiefer",
          "days": 3
        },
        {
          "key": "calf",
          "days": 7
        },
        {
          "key": "birddog",
          "days": 3
        },
        {
          "key": "nack",
          "days": 3
        }
      ]
    },
    {
      "patient": "D. Vogel",
      "ther": "hw",
      "updated": "2026-07-18",
      "goal": "Treppensteigen ohne Pause.",
      "items": [
        {
          "key": "nack",
          "days": 3
        },
        {
          "key": "clam",
          "days": 7
        },
        {
          "key": "ischio",
          "days": 5
        },
        {
          "key": "wall",
          "days": 3
        }
      ]
    },
    {
      "patient": "E. Amrein",
      "ther": "mb",
      "updated": "2026-07-17",
      "goal": "Zurück ins Mannschaftstraining ohne Einschränkung.",
      "items": [
        {
          "key": "brueck",
          "days": 7
        },
        {
          "key": "calf",
          "days": 7
        },
        {
          "key": "scap",
          "days": 5
        }
      ]
    },
    {
      "patient": "E. Berger",
      "ther": "sh",
      "updated": "2026-08-09",
      "goal": "Schmerzfrei durch den Arbeitstag kommen.",
      "items": [
        {
          "key": "birddog",
          "days": 7
        },
        {
          "key": "kiefer",
          "days": 7
        },
        {
          "key": "clam",
          "days": 5
        },
        {
          "key": "nack",
          "days": 5
        }
      ]
    },
    {
      "patient": "E. Kovac",
      "ther": "jr",
      "updated": "2026-08-01",
      "goal": "Wieder 5 km am Stück laufen.",
      "items": [
        {
          "key": "balance",
          "days": 7
        },
        {
          "key": "brueck",
          "days": 4
        },
        {
          "key": "scap",
          "days": 4
        },
        {
          "key": "nack",
          "days": 4
        }
      ]
    },
    {
      "patient": "F. Keller",
      "ther": "lk",
      "updated": "2026-07-14",
      "goal": "Wieder 5 km am Stück laufen.",
      "items": [
        {
          "key": "wall",
          "days": 4
        },
        {
          "key": "calf",
          "days": 3
        },
        {
          "key": "scap",
          "days": 3
        },
        {
          "key": "clam",
          "days": 7
        }
      ]
    },
    {
      "patient": "F. Neuhaus",
      "ther": "lk",
      "updated": "2026-07-17",
      "goal": "Wieder 5 km am Stück laufen.",
      "items": [
        {
          "key": "brueck",
          "days": 5
        },
        {
          "key": "clam",
          "days": 5
        },
        {
          "key": "scap",
          "days": 4
        },
        {
          "key": "balance",
          "days": 4
        }
      ]
    },
    {
      "patient": "G. Kovac",
      "ther": "jr",
      "updated": "2026-08-10",
      "goal": "Schmerzfrei durch den Arbeitstag kommen.",
      "items": [
        {
          "key": "nack",
          "days": 5
        },
        {
          "key": "band",
          "days": 3
        },
        {
          "key": "calf",
          "days": 7
        },
        {
          "key": "wall",
          "days": 7
        }
      ]
    },
    {
      "patient": "G. Möller",
      "ther": "hw",
      "updated": "2026-07-28",
      "goal": "Nachts durchschlafen können.",
      "items": [
        {
          "key": "calf",
          "days": 4
        },
        {
          "key": "nack",
          "days": 5
        },
        {
          "key": "hueft",
          "days": 7
        }
      ]
    },
    {
      "patient": "G. Roth",
      "ther": "lk",
      "updated": "2026-08-02",
      "goal": "Nachts durchschlafen können.",
      "items": [
        {
          "key": "wall",
          "days": 3
        },
        {
          "key": "nack",
          "days": 5
        },
        {
          "key": "hueft",
          "days": 5
        }
      ]
    }
  ];

  const SEED_REPORTS = [
    {
      "id": "B-4102",
      "patient": "A. Okafor",
      "ther": "mb",
      "date": "2026-08-10",
      "time": "09:00",
      "type": "Athletik-Check",
      "at": "2026-08-10 14:40",
      "befund": "HWS-Rotation rechts weiterhin endgradig eingeschränkt, C2/C3 druckdolent. Kopfschmerz seit letzter Einheit von 6 auf 3 gesunken.",
      "behandlung": "Mobilisation C2/C3 in Rotation, Weichteiltechnik M. trapezius descendens beidseits, abschließend Traktion in Rückenlage.",
      "reaktion": "Gut vertragen, keine Schwindelsymptomatik. Rotation nach Behandlung seitengleich frei.",
      "plan": "Nackenretraktion täglich fortführen, Dosis auf 10 × 5 Sekunden erhöht. Nächste Einheit Kräftigung tiefe Nackenmuskulatur.",
      "uebergabe": "Bei Vertretung: keine Manipulation, nur Mobilisation — Patientin ist sehr sensibel am Übergang C0/C1."
    },
    {
      "id": "B-4103",
      "patient": "J. Aksoy",
      "ther": "mb",
      "date": "2026-08-10",
      "time": "13:00",
      "type": "Return-to-Sport",
      "at": "2026-08-10 15:40",
      "befund": "LWS-Extension schmerzhaft, Lasègue negativ. Schmerz aktuell VAS 4 von 10, vor zwei Wochen 7.",
      "behandlung": "Mobilisation L4/L5, Weichteiltechnik Erector spinae, Anleitung Brücke und Vierfüßler diagonal.",
      "reaktion": "Schmerzfrei nach der Einheit, Extension deutlich besser.",
      "plan": "Übungsplan erweitert um Vierfüßler diagonal. Rezept läuft noch über vier Einheiten, Folgetermine stehen.",
      "uebergabe": ""
    },
    {
      "id": "B-4104",
      "patient": "V. Yilmaz",
      "ther": "mb",
      "date": "2026-08-11",
      "time": "09:00",
      "type": "Sportphysiotherapie",
      "at": "2026-08-11 16:40",
      "befund": "Sprungkraft im Seitenvergleich bei 91 Prozent (Vorwoche 87). Kein Schmerz bei einbeiniger Landung.",
      "behandlung": "Plyometrie-Progression Stufe 3, Landetechnik, abschließend Wadenheben einbeinig mit Zusatzlast.",
      "reaktion": "Belastung gut toleriert, kein Erguss, keine Instabilität.",
      "plan": "Ab nächster Woche Richtungswechsel unter Zeitdruck. Freigabe fürs Mannschaftstraining frühestens in drei Wochen.",
      "uebergabe": "Kein Kontakttraining vor dem nächsten Recheck."
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

  /* ---------------------------------------------------------------------
     Behandlungsberichte.

     Seeded examples plus whatever this browser has written. A real practice
     needs this on a server — a treatment record is a legal document under
     § 630f BGB and has to survive a cleared browser cache.
     --------------------------------------------------------------------- */

  const REPORT_STORE = "lk-berichte";
  function readStore(key) {
    try { const v = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function writeStore(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode */ }
  }
  const readReports = () => SEED_REPORTS.concat(readStore(REPORT_STORE));
  function saveReport(r) {
    const mine = readStore(REPORT_STORE);
    const known = mine.findIndex((x) => x.id === r.id);
    if (known >= 0) mine[known] = r;
    else { r.id = "B-" + (4200 + mine.length); mine.push(r); }
    writeStore(REPORT_STORE, mine);
    return r;
  }

  // appointments a patient cancelled or moved through the link in their
  // reminder — kept apart from the practice's own diary
  const CHANGE_STORE = "lk-terminaenderungen";
  const readChanges = () => readStore(CHANGE_STORE);
  function addChange(c) {
    const mine = readStore(CHANGE_STORE);
    mine.push(c);
    writeStore(CHANGE_STORE, mine);
    return c;
  }

  const patientByCode = (code) =>
    PATIENTS.find((p) => p.code.toUpperCase() === String(code || "").trim().toUpperCase()) || null;
  const planFor = (name) => PLANS.find((p) => p.patient === name) || null;
  const exerciseOf = (key) => EXERCISES.find((e) => e.key === key);

  /** Appointments of one patient from today on, newest last. */
  function upcomingOf(name) {
    const gone = new Set(readChanges().filter((c) => c.patient === name).map((c) => c.key));
    return APPOINTMENTS
      .map((a, i) => ({ a, i, date: addDays(WEEK0, a.day) }))
      .filter((x) => x.a.patient === name && x.date >= TODAY)
      .filter((x) => !gone.has(x.date + x.a.start))
      .sort((x, y) => x.date.localeCompare(y.date) || toMin(x.a.start) - toMin(y.a.start));
  }

  /** An .ics file the patient can drop into their own calendar. */
  function icsFor({ title, dateISO, start, min, location, description }) {
    const CRLF = String.fromCharCode(13, 10);
    const NL = String.fromCharCode(10);
    const ESC_NL = String.fromCharCode(92) + "n";          // literal backslash-n
    const stamp = (d, t) => d.split("-").join("") + "T" + t.split(":").join("") + "00";
    const end = fmt(toMin(start) + min);
    const fold = (s) => String(s || "").split(NL).join(ESC_NL);
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Luca Kolhoff//Praxis//DE",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:" + stamp(dateISO, start) + "@lucakolhoff.de",
      "DTSTAMP:" + stamp(dateISO, start),
      "DTSTART;TZID=Europe/Berlin:" + stamp(dateISO, start),
      "DTEND;TZID=Europe/Berlin:" + stamp(dateISO, end),
      "SUMMARY:" + fold(title),
      "LOCATION:" + fold(location || "Musterstraße 12, 00000 Musterstadt"),
      "DESCRIPTION:" + fold(description),
      "BEGIN:VALARM", "TRIGGER:-PT24H", "ACTION:DISPLAY",
      "DESCRIPTION:Termin morgen in der Praxis Luca Kolhoff", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join(CRLF);
  }

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
    ATTEND, ATTEND_KIND, EXERCISES, PLANS, planFor, exerciseOf, patientByCode,
    readReports, saveReport, readChanges, addChange, upcomingOf, icsFor,
    toMin, fmt, therOf, svcOf, priceFor, absentOn,
    iso, addDays, daysBetween, weekday, deDate, DE_DAY,
    slotsFor, nextDates, loadFor, blocksFor, readRequests, addRequest,
  };
})();
