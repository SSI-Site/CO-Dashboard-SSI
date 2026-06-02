import { http, HttpResponse } from 'msw'
import {
  findTalk,
  nextNumericId,
  talks,
  talkSpeakers,
  toLectureResponse,
  toTalkResponse,
} from './_db'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

const parseSponsorId = (value) => {
  if (value === null || value === undefined || value === '' || value === 'Nenhuma') {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const talksHandlers = [
	http.get(`${BASE_URL}/admin/talks/`, () => {
		return HttpResponse.json(talks.map((talk) => toLectureResponse(talk)));
	}),

	http.get(`${BASE_URL}/admin/talks`, () => {
		return HttpResponse.json(talks.map((talk) => toTalkResponse(talk)));
	}),

	http.get(`${BASE_URL}/admin/talks/:id(\\d+)`, ({ params }) => {
		const talk = findTalk(params.id);

		if (!talk) {
			return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
		}

		return HttpResponse.json(toTalkResponse(talk));
	}),

	http.post(`${BASE_URL}/admin/talks/`, async ({ request }) => {
		const payload = await request.json();

		const talk = {
			id: nextNumericId(talks),
			title: payload.title || 'Nova palestra',
			description: payload.description || '',
			start_time: payload.start_time,
			end_time: payload.end_time,
			activity_type: payload.activity_type || 'PR',
			sponsor_id: parseSponsorId(payload.sponsor_id),
			mode: payload.mode || 'IP',
		};

		talks.push(talk);

		const speakerIds = Array.isArray(payload.speakers) ? payload.speakers : [];
		speakerIds.forEach((speakerId) => {
			talkSpeakers.push({
				id: nextNumericId(talkSpeakers),
				talk_id: talk.id,
				speaker_id: String(speakerId),
			});
		});

		return HttpResponse.json(toTalkResponse(talk), { status: 201 });
	}),

	http.put(`${BASE_URL}/admin/talks/:id(\\d+)`, async ({ params, request }) => {
		const index = talks.findIndex((talk) => Number(talk.id) === Number(params.id));

		if (index < 0) {
			return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
		}

		const payload = await request.json();

		talks[index] = {
			...talks[index],
			title: payload.title || talks[index].title,
			description: payload.description || talks[index].description,
			start_time: payload.start_time || talks[index].start_time,
			end_time: payload.end_time || talks[index].end_time,
			activity_type: payload.activity_type || talks[index].activity_type,
			mode: payload.mode || talks[index].mode,
			sponsor_id: parseSponsorId(payload.sponsor_id),
		};

		for (let i = talkSpeakers.length - 1; i >= 0; i -= 1) {
			if (Number(talkSpeakers[i].talk_id) === Number(params.id)) {
				talkSpeakers.splice(i, 1);
			}
		}

		const speakerIds = Array.isArray(payload.speakers) ? payload.speakers : [];
		speakerIds.forEach((speakerId) => {
			talkSpeakers.push({
				id: nextNumericId(talkSpeakers),
				talk_id: Number(params.id),
				speaker_id: String(speakerId),
			});
		});

		return HttpResponse.json(toTalkResponse(talks[index]));
	}),

	http.delete(`${BASE_URL}/admin/talks/:id(\\d+)`, ({ params }) => {
		const index = talks.findIndex((talk) => Number(talk.id) === Number(params.id));

		if (index < 0) {
			return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
		}

		talks.splice(index, 1);

		for (let i = talkSpeakers.length - 1; i >= 0; i -= 1) {
			if (Number(talkSpeakers[i].talk_id) === Number(params.id)) {
				talkSpeakers.splice(i, 1);
			}
		}

		return HttpResponse.json({ ok: true });
	}),
];