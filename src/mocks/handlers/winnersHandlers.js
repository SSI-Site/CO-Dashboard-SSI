import { http, HttpResponse } from 'msw';
import { presencesMock } from '../data/presencesData';
import { studentsMock } from '../data/studentsData';
import { winnersMock } from '../data/winnersData';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

const pickWinnerByTalk = (lectureId) => {
  const normalizedTalkId = Number(lectureId);

  const eligiblePresence = presencesMock.find((presence) => presence.talk === normalizedTalkId);

  if (!eligiblePresence) {
    return null;
  }

  return studentsMock.find(
    (student) => String(student.code) === String(eligiblePresence.student_document)
  );
};

export const winnersHandlers = [
  http.get(`${BASE_URL}/admin/winners/`, () => {
    return HttpResponse.json(winnersMock);
  }),

  http.get(`${BASE_URL}/admin/winners/:lectureId/draw`, ({ params }) => {
    const winner = pickWinnerByTalk(params.lectureId);

    if (!winner) {
      return HttpResponse.json({ error: 'Sem elegiveis para sorteio' }, { status: 404 });
    }

    return HttpResponse.json(winner);
  }),

  http.get(`${BASE_URL}/admin/:lectureId/in-person-draw`, ({ params }) => {
    const winner = pickWinnerByTalk(params.lectureId);

    if (!winner) {
      return HttpResponse.json({ error: 'Sem elegiveis para sorteio presencial' }, { status: 404 });
    }

    return HttpResponse.json(winner);
  }),
];
