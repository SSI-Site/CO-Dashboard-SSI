import { http, HttpResponse } from 'msw'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const authHandlers = [
  http.post(`${BASE_URL}/admin/login`, () => {
    return HttpResponse.json({ message: 'Login realizado com sucesso' });
  }),
  http.post(`${BASE_URL}/admin/logout`, () => {
    return HttpResponse.json({ message: 'Deslogado' });
  }),
];