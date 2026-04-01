import { http, HttpResponse } from 'msw'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const authHandlers = [
  http.post(`${BASE_URL}/admin/login`, async ({ request }) => {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const username = params.get('username');
    const password = params.get('password');

    if (!username || !password) {
      return HttpResponse.json({ detail: 'Credenciais invalidas' }, { status: 401 });
    }

    return HttpResponse.json({ message: 'Login realizado com sucesso' }, { status: 200 });
  }),

  http.post(`${BASE_URL}/admin/logout`, () => {
    return HttpResponse.json({ message: 'Deslogado' }, { status: 200 });
  }),
];