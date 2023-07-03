import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL;

const saphira = {

  getGivawayResult: async (lectureId) => {
    const requestUrl = `${BASE_URL}/talk/${lectureId}/draw`
    return axios.get(requestUrl);
  },

  getPresencialOnlyGivawayResult: async (lectureId) => {
    const requestUrl = `${BASE_URL}/talk/${lectureId}/draw_auditorium`
    return axios.get(requestUrl);
  },

  getLectures: async () => {
    return axios.get(`${BASE_URL}/talks`);
  },

  listPresences: async (email) => {
    const requestUrl = `${BASE_URL}/user/${email}/presences`

    return axios.get(requestUrl);
  },

  getTokenGenerated: async (lectureId) => {
    const requestUrl = `${BASE_URL}/talk/${lectureId}/draw_auditorium` // REVER COM INFRA
    return axios.get(requestUrl);
  }

}

export default saphira;