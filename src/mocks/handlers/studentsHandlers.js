import { http, HttpResponse } from 'msw';
import { studentsMock } from '../data/studentsData';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

const normalize = (value) => String(value).trim().toLowerCase();

const findStudent = (identifier) => {
  const target = normalize(identifier);

  return studentsMock.find(
    (student) => normalize(student.code) === target || normalize(student.id) === target
  );
};

export const studentsHandlers = [
  http.get(`${BASE_URL}/admin/students/`, () => {
    return HttpResponse.json(studentsMock);
  }),

  http.get(`${BASE_URL}/admin/students/search/:name`, ({ params }) => {
    const term = normalize(params.name || '');

    const result = studentsMock.filter((student) =>
      normalize(student.name).includes(term)
    );

    return HttpResponse.json(result);
  }),

  http.get(`${BASE_URL}/admin/student/:document/profile`, ({ params }) => {
    const student = findStudent(params.document);

    if (!student) {
      return HttpResponse.json({ error: 'Estudante nao encontrado' }, { status: 404 });
    }

    return HttpResponse.json(student);
  }),

  http.get(`${BASE_URL}/admin/student/:ssiID`, ({ params }) => {
    const student = findStudent(params.ssiID);

    if (!student) {
      return HttpResponse.json({ error: 'Estudante nao encontrado' }, { status: 404 });
    }

    return HttpResponse.json(student);
  }),
];
