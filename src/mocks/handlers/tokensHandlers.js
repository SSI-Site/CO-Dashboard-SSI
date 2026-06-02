import { http, HttpResponse } from 'msw';
import { findTalk } from './_db';

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

const randomToken = () =>
  Math.random().toString(36).slice(2, 6).toUpperCase() +
  Math.random().toString(36).slice(2, 6).toUpperCase();

export const tokensHandlers = [
  http.post(`${BASE_URL}/admin/tokens`, async ({ request }) => {
    const body = await request.text();
    const form = new URLSearchParams(body);
    const talkId = form.get('talk');

    if (!findTalk(talkId)) {
      return HttpResponse.json({ talk: ['Palestra não encontrada'] }, { status: 400 });
    }

    return HttpResponse.json(
      {
        token: {
          code: randomToken(),
          talk: Number(talkId),
          begin: form.get('begin'),
          duration: Number(form.get('duration') || 5),
        },
      },
      { status: 201 }
    );
  }),
];
