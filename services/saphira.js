import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL;

const saphira = {

  adminLogIn : async (user, password) => {
    const requestUrl = `${BASE_URL}/admin/login`
    const params = new URLSearchParams();
    params.append('email', user);
    params.append('password', password);
    return axios.post(requestUrl, params, { withCredentials: true });
  },

  addPresentialPresenceToUser: async (lectureId, document) => {
    const requestUrl = `${BASE_URL}/admin/presence/add/${document}`
    const params = new URLSearchParams();
    params.append('id', lectureId);
    return axios.post(requestUrl, params);
  },

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

  listPresences: async (document) => {
    const requestUrl = `${BASE_URL}/admin/presence/get/${document}`
    return axios.get(requestUrl);
  },

  getTokenGenerated: async (lectureId, currentTime) => {
    const requestUrl = `${BASE_URL}/admin/token/add`
    const params = new URLSearchParams();
    params.append('id', lectureId);
    params.append('duration', '5');
    params.append('begin', currentTime);
    return axios.post(requestUrl, params);
  }

}

export default saphira;