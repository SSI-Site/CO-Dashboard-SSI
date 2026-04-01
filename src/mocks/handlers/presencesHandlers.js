import { http, HttpResponse } from 'msw';
import { presencesMock } from '../data/presencesData';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const presencesHandlers = [
  http.get(`${BASE_URL}/admin/presences/`, () => {
    return HttpResponse.json(presencesMock);
  }),
];
