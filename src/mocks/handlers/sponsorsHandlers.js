import { http, HttpResponse } from 'msw';
import { nextNumericId, sponsors } from './_db';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const sponsorsHandlers = [
  http.get(`${BASE_URL}/admin/talks/sponsors/`, () => {
    return HttpResponse.json(sponsors);
  }),

  http.post(`${BASE_URL}/admin/talks/sponsors/`, async ({ request }) => {
    const body = await request.text();
    const form = new URLSearchParams(body);

    const sponsor = {
      id: nextNumericId(sponsors),
      name: form.get('name') || 'Novo patrocinador',
      url: form.get('url') || '',
    };

    sponsors.push(sponsor);
    return HttpResponse.json(sponsor, { status: 201 });
  }),

  http.put(`${BASE_URL}/admin/talks/sponsors/:id`, async ({ params, request }) => {
    const index = sponsors.findIndex((item) => Number(item.id) === Number(params.id));

    if (index < 0) {
      return HttpResponse.json({ error: 'Empresa nao encontrada' }, { status: 404 });
    }

    const body = await request.text();
    const form = new URLSearchParams(body);

    sponsors[index] = {
      ...sponsors[index],
      name: form.get('name') || sponsors[index].name,
      url: form.get('url') || sponsors[index].url,
    };

    return HttpResponse.json(sponsors[index]);
  }),

  http.delete(`${BASE_URL}/admin/talks/sponsors/:id`, ({ params }) => {
    const index = sponsors.findIndex((item) => Number(item.id) === Number(params.id));

    if (index < 0) {
      return HttpResponse.json({ error: 'Empresa nao encontrada' }, { status: 404 });
    }

    sponsors.splice(index, 1);
    return HttpResponse.json({ ok: true });
  }),
];
