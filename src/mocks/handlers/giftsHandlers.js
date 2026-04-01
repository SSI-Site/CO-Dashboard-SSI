import { http, HttpResponse } from 'msw'
import {
  createPseudoId,
  findStudent,
  gifts,
  studentGifts,
  toGiftResponse,
  toStudentGiftResponse,
} from './_db'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const giftsHandlers = [
	http.get(`${BASE_URL}/admin/gifts/`, () => {
		return HttpResponse.json(gifts.map((gift) => toGiftResponse(gift)));
	}),

	http.get(`${BASE_URL}/admin/student/:studentId/gifts`, ({ params }) => {
		const student = findStudent(params.studentId);

		if (!student) {
			return HttpResponse.json([], { status: 200 });
		}

		const studentGiftList = studentGifts
			.filter((item) => item.student_id === student.id)
			.map((item) => toStudentGiftResponse(item));

		return HttpResponse.json(studentGiftList);
	}),

	http.post(`${BASE_URL}/admin/gifts/`, async ({ request }) => {
		const body = await request.text();
		const form = new URLSearchParams(body);

		const gift = {
			id: createPseudoId('gift'),
			name: form.get('name') || 'Brinde',
			description: form.get('description') || '',
			min_presence: Number(form.get('min_presence') || 0),
			total_amount: Number(form.get('total_amount') || 0),
		};

		gifts.push(gift);
		return HttpResponse.json(toGiftResponse(gift), { status: 201 });
	}),

	http.put(`${BASE_URL}/admin/gifts/:id`, async ({ params, request }) => {
		const index = gifts.findIndex((item) => item.id === String(params.id));

		if (index < 0) {
			return HttpResponse.json({ error: 'Brinde nao encontrado' }, { status: 404 });
		}

		const body = await request.text();
		const form = new URLSearchParams(body);

		gifts[index] = {
			...gifts[index],
			name: form.get('name') || gifts[index].name,
			description: form.get('description') || gifts[index].description,
			min_presence: Number(form.get('min_presence') || gifts[index].min_presence),
			total_amount: Number(form.get('total_amount') || gifts[index].total_amount),
		};

		return HttpResponse.json(toGiftResponse(gifts[index]));
	}),

	http.delete(`${BASE_URL}/admin/gifts/:id`, ({ params }) => {
		const index = gifts.findIndex((item) => item.id === String(params.id));

		if (index < 0) {
			return HttpResponse.json({ error: 'Brinde nao encontrado' }, { status: 404 });
		}

		gifts.splice(index, 1);

		for (let i = studentGifts.length - 1; i >= 0; i -= 1) {
			if (studentGifts[i].gift_id === String(params.id)) {
				studentGifts.splice(i, 1);
			}
		}

		return HttpResponse.json({ ok: true });
	}),

	http.put(`${BASE_URL}/admin/student/gift/:studentGiftId`, ({ params }) => {
		const index = studentGifts.findIndex((item) => item.id === String(params.studentGiftId));

		if (index < 0) {
			return HttpResponse.json({ error: 'Registro de brinde nao encontrado' }, { status: 404 });
		}

		studentGifts[index] = {
			...studentGifts[index],
			received: true,
			updated_at: new Date().toISOString(),
		};

		return HttpResponse.json(toStudentGiftResponse(studentGifts[index]));
	}),
];