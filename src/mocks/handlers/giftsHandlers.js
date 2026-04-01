import { http, HttpResponse } from 'msw'
import { giftsMock } from '../data/giftsData'
import { studentGiftsMock } from '../data/studentGiftsData'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const giftsHandlers = [
	http.get(`${BASE_URL}/admin/gifts/`, () => {
		return HttpResponse.json(giftsMock);
	}),

	http.get(`${BASE_URL}/admin/student/:studentId/gifts`, ({ params }) => {
		const studentId = Number(params.studentId);
		const studentGifts = studentGiftsMock.filter((item) => item.student === studentId);
		return HttpResponse.json(studentGifts);
	}),
];