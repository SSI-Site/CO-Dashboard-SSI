import { http, HttpResponse } from 'msw'
import { talksMock } from '../data/talksData'
import { talksSpeakersMock } from '../data/talksSpeakersData'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const talksHandlers = [
	http.get(`${BASE_URL}/admin/talks/`, () => {
		return HttpResponse.json(talksMock);
	}),

	http.get(`${BASE_URL}/admin/talks`, () => {
		return HttpResponse.json(talksMock);
	}),

	http.get(`${BASE_URL}/admin/talks/:id`, ({ params }) => {
		const talk = talksMock.find((item) => String(item.id) === String(params.id));

		if (!talk) {
			return HttpResponse.json({ error: 'Palestra nao encontrada' }, { status: 404 });
		}

		return HttpResponse.json(talk);
	}),
];