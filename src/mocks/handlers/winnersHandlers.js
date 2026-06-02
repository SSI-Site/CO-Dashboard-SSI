import { http, HttpResponse } from 'msw';
import { findStudent, findTalk, nextNumericId, presences, toWinnerResponse, winners } from './_db';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

const pickWinnerByTalk = (lectureId) => {
  const normalizedTalkId = Number(lectureId);

  const alreadyWon = new Set(
    winners
      .filter((winner) => Number(winner.talk_id) === normalizedTalkId)
      .map((winner) => winner.student_id)
  );

  const eligiblePresence = presences.find(
    (presence) =>
      Number(presence.talk) === normalizedTalkId && !alreadyWon.has(presence.student_id)
  );

  if (!eligiblePresence) {
    return null;
  }

  return findStudent(eligiblePresence.student_id);
};

export const winnersHandlers = [
  http.get(`${BASE_URL}/admin/winners/`, () => {
    return HttpResponse.json(winners.map((winner) => toWinnerResponse(winner)));
  }),

  http.get(`${BASE_URL}/admin/winners/:lectureId/draw`, ({ params }) => {
    const talk = findTalk(params.lectureId);
    if (!talk) {
      return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
    }

    const winner = pickWinnerByTalk(params.lectureId);

    if (!winner) {
      return HttpResponse.json({ error: 'Sem elegiveis para sorteio' }, { status: 404 });
    }

    return HttpResponse.json(winner);
  }),

  http.get(`${BASE_URL}/admin/:lectureId/in-person-draw`, ({ params }) => {
    const talk = findTalk(params.lectureId);
    if (!talk) {
      return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
    }

    const winner = pickWinnerByTalk(params.lectureId);

    if (!winner) {
      return HttpResponse.json({ error: 'Sem elegiveis para sorteio presencial' }, { status: 404 });
    }

    return HttpResponse.json(winner);
  }),

  http.post(`${BASE_URL}/admin/winners/:lectureId`, async ({ params, request }) => {
    const talk = findTalk(params.lectureId);

    if (!talk) {
      return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
    }

    const body = await request.text();
    const form = new URLSearchParams(body);
    const student = findStudent(form.get('student'));

    if (!student) {
      return HttpResponse.json({ error: 'Estudante nao encontrado' }, { status: 404 });
    }

    const existing = winners.find(
      (winner) =>
        Number(winner.talk_id) === Number(params.lectureId) && winner.student_id === student.id
    );

    if (existing) {
      return HttpResponse.json(toWinnerResponse(existing), { status: 200 });
    }

    const created = {
      id: nextNumericId(winners),
      student_id: student.id,
      talk_id: Number(params.lectureId),
      created_at: new Date().toISOString(),
    };

    winners.push(created);
    return HttpResponse.json(toWinnerResponse(created), { status: 201 });
  }),
];
