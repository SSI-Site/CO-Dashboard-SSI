import { http, HttpResponse } from 'msw';
import { sponsorsMock } from '../data/sponsorsData';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const sponsorsHandlers = [
  http.get(`${BASE_URL}/admin/talks/sponsors/`, () => {
    return HttpResponse.json(sponsorsMock);
  }),
];
