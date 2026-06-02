import { http, HttpResponse } from 'msw';
import { createPseudoId, findStudent, findTalk, presences, toPresenceResponse } from './_db';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const presencesHandlers = [
  http.get(`${BASE_URL}/admin/presences/`, () => {
    return HttpResponse.json(presences.map((presence) => toPresenceResponse(presence)));
  }),

  http.post(`${BASE_URL}/admin/presences/`, async ({ request }) => {
    const body = await request.text();
    const form = new URLSearchParams(body);
    const talkId = Number(form.get('talk'));
    const studentDocument = form.get('student_document');

    const talk = findTalk(talkId);
    if (!talk) {
      return HttpResponse.json({ talk: ['Palestra não encontrada'] }, { status: 400 });
    }

    const student = findStudent(studentDocument);
    if (!student) {
      return HttpResponse.json('Estudante não encontrado', { status: 400 });
    }

    const alreadyRegistered = presences.some(
      (presence) => Number(presence.talk) === talkId && presence.student_id === student.id
    );

    if (alreadyRegistered) {
      return HttpResponse.json('Presença já cadastrada', { status: 400 });
    }

    const created = {
      id: createPseudoId('presence'),
      talk: talkId,
      student_id: student.id,
      student_document: student.code,
    };

    presences.push(created);
    return HttpResponse.json(toPresenceResponse(created), { status: 201 });
  }),

  http.delete(`${BASE_URL}/admin/presences/:lectureId/:document`, ({ params }) => {
    const talk = findTalk(params.lectureId);

    if (!talk) {
      return HttpResponse.json({ talk: ['Palestra não encontrada'] }, { status: 400 });
    }

    const student = findStudent(params.document);
    if (!student) {
      return HttpResponse.json('Estudante não encontrado', { status: 400 });
    }

    const index = presences.findIndex(
      (presence) =>
        Number(presence.talk) === Number(params.lectureId) &&
        presence.student_id === student.id
    );

    if (index < 0) {
      return HttpResponse.json('Presença não encontrada', { status: 404 });
    }

    const [removed] = presences.splice(index, 1);
    return HttpResponse.json(toPresenceResponse(removed));
  }),
];
