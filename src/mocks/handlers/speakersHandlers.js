import { http, HttpResponse } from 'msw'
import { speakersMock } from '../data/speakersData'

const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL || '';

export const speakersHandlers = [
  // Listar todos
  http.get(`${BASE_URL}/speakers/`, () => {
    return HttpResponse.json(speakersMock);
  }),

  // Buscar apenas 1 palestrante pelo ID
  http.get(`${BASE_URL}/admin/speakers/:id`, ({ params }) => {
    const { id } = params;
    const speaker = speakersMock.find((s) => String(s.id) === String(id));
    
    if (!speaker) {
      return HttpResponse.json({ error: 'Palestrante não encontrado' }, { status: 404 });
    }
    return HttpResponse.json(speaker);
  }),
];