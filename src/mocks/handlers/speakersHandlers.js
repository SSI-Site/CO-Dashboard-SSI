import { http, HttpResponse } from 'msw'
import { createPseudoId, speakers } from './_db'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const speakersHandlers = [
  http.get(`${BASE_URL}/speakers/`, () => {
    return HttpResponse.json(speakers);
  }),

  http.get(`${BASE_URL}/admin/speakers/:id`, ({ params }) => {
    const { id } = params;
    const speaker = speakers.find((item) => String(item.id) === String(id));

    if (!speaker) {
      return HttpResponse.json({ error: 'Palestrante não encontrado' }, { status: 404 });
    }

    return HttpResponse.json(speaker);
  }),

  http.post(`${BASE_URL}/admin/speakers/`, async ({ request }) => {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const speaker = {
      id: createPseudoId('speaker'),
      name: params.get('name') || 'Sem nome',
      description: params.get('description') || '',
      linkedin_link: params.get('linkedin_link') || null,
      instagram_link: params.get('instagram_link') || null,
      pronouns: params.get('pronouns') || '',
      role: params.get('role') || '',
    };

    speakers.push(speaker);
    return HttpResponse.json(speaker, { status: 201 });
  }),

  http.put(`${BASE_URL}/admin/speakers/:id`, async ({ params, request }) => {
    const index = speakers.findIndex((item) => String(item.id) === String(params.id));

    if (index < 0) {
      return HttpResponse.json({ error: 'Palestrante não encontrado' }, { status: 404 });
    }

    const body = await request.text();
    const form = new URLSearchParams(body);

    speakers[index] = {
      ...speakers[index],
      name: form.get('name') || speakers[index].name,
      description: form.get('description') || speakers[index].description,
      linkedin_link: form.get('linkedin_link') || null,
      instagram_link: form.get('instagram_link') || null,
      pronouns: form.get('pronouns') || '',
      role: form.get('role') || '',
    };

    return HttpResponse.json(speakers[index]);
  }),

  http.delete(`${BASE_URL}/admin/speakers/:id`, ({ params }) => {
    const index = speakers.findIndex((item) => String(item.id) === String(params.id));

    if (index < 0) {
      return HttpResponse.json({ error: 'Palestrante não encontrado' }, { status: 404 });
    }

    speakers.splice(index, 1);
    return HttpResponse.json({ ok: true });
  }),
];