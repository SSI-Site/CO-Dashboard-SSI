import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL;
import cookie from 'js-cookie';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

axios.interceptors.request.use((config) => {
    const csrfToken = cookie.get('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const saphira = {

    adminLogIn : async (username, password) => {
        const requestUrl = `${BASE_URL}/admin/login`
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        return await axios.post(
            requestUrl, 
            params.toString(),
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    },

    adminLogOut: async () => {
        const requestUrl = `${BASE_URL}/admin/logout`
        return await axios.post(requestUrl);
    },

    addPresentialPresenceToUser: async (lectureId, document) => {
        const requestUrl = `${BASE_URL}/admin/presences`
        const params = new URLSearchParams();
        params.append('talk', lectureId);
        params.append('student_document', document);

        return await axios.post(
            requestUrl,
            params.toString(),
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    },

    getGivawayResult: async (lectureId) => {
        const requestUrl = `${BASE_URL}/admin/${lectureId}/draw`
        return await axios.get(requestUrl);
    },

    getPresencialOnlyGivawayResult: async (lectureId) => {
        const requestUrl = `${BASE_URL}/admin/${lectureId}/in-person-draw`
        return await axios.get(requestUrl);
    },

    getLectures: async () => {
        return await axios.get(`${BASE_URL}/admin/talks`);
    },

    getStudentInfo: async (document) => {
        const requestUrl = `${BASE_URL}/admin/student/${document}`
        return await axios.get(requestUrl);
    },

    generateOnlineToken: async (lectureId, currentTime) => {
        const requestUrl = `${BASE_URL}/admin/tokens`
        const params = new URLSearchParams();
        params.append('talk', lectureId);
        params.append('duration', '5');
        params.append('begin', currentTime);
        return await axios.post(
            requestUrl,
            params,
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    },

    removePresenceFromUser: async (lectureId, document) => {
        const requestUrl = `${BASE_URL}/admin/presence/${lectureId}/${document}`
        return await axios.delete(requestUrl);
    },
}

export default saphira;