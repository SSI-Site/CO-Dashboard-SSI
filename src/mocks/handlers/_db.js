import { giftsMock } from '../data/giftsData';
import { presencesMock } from '../data/presencesData';
import { speakersMock } from '../data/speakersData';
import { sponsorsMock } from '../data/sponsorsData';
import { studentGiftsMock } from '../data/studentGiftsData';
import { studentsMock } from '../data/studentsData';
import { talksMock } from '../data/talksData';
import { talksSpeakersMock } from '../data/talksSpeakersData';
import { winnersMock } from '../data/winnersData';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const clone = (value) => JSON.parse(JSON.stringify(value));

export const students = clone(studentsMock);
export const speakers = clone(speakersMock);
export const sponsors = clone(sponsorsMock);
export const gifts = clone(giftsMock);

export const talks = clone(talksMock).map((talk) => ({
  ...talk,
  sponsor_id: talk.sponsor_id ?? null,
}));

// Keep a few talks around "now" so pages with date/time filters remain testable in mock mode.
const now = new Date();

const toMockDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
};

const moveTalkToNow = (talkId, startOffsetMinutes, durationMinutes) => {
  const talk = talks.find((item) => Number(item.id) === Number(talkId));
  if (!talk) {
    return;
  }

  const start = new Date(now.getTime() + startOffsetMinutes * 60 * 1000);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  talk.start_time = toMockDate(start);
  talk.end_time = toMockDate(end);
};

const moveTalkToTomorrow = (talkId, hour, minute, durationMinutes) => {
  const talk = talks.find((item) => Number(item.id) === Number(talkId));
  if (!talk) {
    return;
  }

  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  talk.start_time = toMockDate(start);
  talk.end_time = toMockDate(end);
};

// Visible in Presential/Exterminate (today + within offset window) and Giveaway (today).
moveTalkToNow(29, 45, 70);
moveTalkToNow(33, 60, 70);
moveTalkToNow(34, 75, 70);

// Keep a couple of talks in the future so the talks list shows "Nao realizado".
moveTalkToTomorrow(35, 10, 0, 60);
moveTalkToTomorrow(36, 14, 30, 60);

export const talkSpeakers = clone(talksSpeakersMock).map((item) => ({
  id: Number(item.id),
  talk_id: Number(item.talk_id),
  speaker_id: String(item.speaker_id),
}));

const findStudentById = (studentId) => students.find((student) => student.id === studentId);

const findStudentByCode = (studentCode) =>
  students.find((student) => normalize(student.code) === normalize(studentCode));

const normalizePresence = (presence) => {
  const talkId = Number(presence.talk ?? presence.talk_id);
  const studentById = findStudentById(presence.student_id);
  const studentByCode = findStudentByCode(presence.student_document);
  const student = studentById || studentByCode;

  return {
    id: String(presence.id),
    talk: talkId,
    student_id: student?.id ?? String(presence.student_id ?? ''),
    student_document: student?.code ?? String(presence.student_document ?? ''),
  };
};

export const presences = clone(presencesMock).map(normalizePresence);

const ensurePresenceForTalk = (talkId) => {
  if (presences.some((presence) => Number(presence.talk) === Number(talkId))) {
    return;
  }

  const fallbackStudent = students[0];
  if (!fallbackStudent) {
    return;
  }

  presences.push({
    id: createPseudoId('presence-seed'),
    talk: Number(talkId),
    student_id: fallbackStudent.id,
    student_document: fallbackStudent.code,
  });
};

ensurePresenceForTalk(29);
ensurePresenceForTalk(33);

export const studentGifts = clone(studentGiftsMock).map((item) => ({
  id: String(item.id),
  received: Boolean(item.received),
  created_at: item.created_at,
  updated_at: item.updated_at,
  gift_id: String(item.gift_id),
  student_id: String(item.student_id),
}));

export const winners = clone(winnersMock).map((item) => ({
  id: Number(item.id),
  student_id: String(item.student_id ?? item.student),
  talk_id: Number(item.talk_id ?? item.talk),
  created_at: item.created_at,
}));

export const toWinnerResponse = (winner) => ({
  id: winner.id,
  student: winner.student_id,
  talk: winner.talk_id,
  created_at: winner.created_at,
});

export const findStudent = (identifier) => {
  const target = normalize(identifier);

  return students.find(
    (student) => normalize(student.id) === target || normalize(student.code) === target
  );
};

export const findTalk = (talkId) => talks.find((talk) => Number(talk.id) === Number(talkId));

export const getTalkSpeakerIds = (talkId) =>
  talkSpeakers
    .filter((item) => Number(item.talk_id) === Number(talkId))
    .map((item) => item.speaker_id);

export const toTalkResponse = (talk) => {
  const sponsor = sponsors.find((item) => Number(item.id) === Number(talk.sponsor_id)) || null;

  return {
    ...talk,
    sponsor,
    speakers: getTalkSpeakerIds(talk.id),
  };
};

export const toLectureResponse = (talk) => {
  const speakerNames = getTalkSpeakerIds(talk.id)
    .map((speakerId) => speakers.find((speaker) => speaker.id === speakerId)?.name)
    .filter(Boolean);

  return {
    ...toTalkResponse(talk),
    date_time: talk.start_time,
    speaker: speakerNames.join(', '),
  };
};

export const toPresenceResponse = (presence) => ({
  id: presence.id,
  talk: presence.talk,
  student_document: presence.student_document,
  student_id: presence.student_id,
});

export const getStudentPresenceCounts = (studentId) => {
  const totalPresences = presences.filter((presence) => presence.student_id === studentId);
  const inPersonPresences = totalPresences.filter((presence) => {
    const talk = findTalk(presence.talk);
    return talk?.mode === 'IP';
  });

  return {
    total_presences_count: totalPresences.length,
    in_person_presences_count: inPersonPresences.length,
  };
};

export const toStudentResponse = (student) => ({
  ...student,
  ...getStudentPresenceCounts(student.id),
});

export const toGiftResponse = (gift) => {
  const reservedCount = studentGifts.filter((item) => item.gift_id === gift.id).length;
  const totalAmount = Number(gift.total_amount) || 0;

  return {
    ...gift,
    total_amount: totalAmount,
    min_presence: Number(gift.min_presence) || 0,
    balance: Math.max(totalAmount - reservedCount, 0),
  };
};

export const toStudentGiftResponse = (studentGift) => {
  const gift = gifts.find((item) => item.id === studentGift.gift_id) || null;
  const student = students.find((item) => item.id === studentGift.student_id) || null;

  return {
    id: studentGift.id,
    received: Boolean(studentGift.received),
    created_at: studentGift.created_at,
    updated_at: studentGift.updated_at,
    gift,
    student,
  };
};

export const nextNumericId = (list) => {
  if (!list.length) {
    return 1;
  }

  return Math.max(...list.map((item) => Number(item.id) || 0)) + 1;
};

export const createPseudoId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
