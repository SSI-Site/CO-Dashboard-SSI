import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL;
import cookie from 'js-cookie';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = BASE_URL

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
        const requestUrl = "/admin/login";
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
        const requestUrl = "/admin/logout";
        return await axios.post(requestUrl);
    },

    addPresenceToUser: async (lectureId, document, isOnline) => {
        const requestUrl = "/admin/presences"
        const params = new URLSearchParams();
        params.append('talk', lectureId);
        params.append('student_document', document);

        if (isOnline) {
            params.append('online', 'true');
        }

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
        const requestUrl = `/admin/${lectureId}/draw`
        return await axios.get(requestUrl);
    },

    getPresencialOnlyGivawayResult: async (lectureId) => {
        const requestUrl = `/admin/${lectureId}/in-person-draw`
        return await axios.get(requestUrl);
    },

    getLectures: async () => {
        return await axios.get(`/admin/talks`);
    },

    getStudentInfo: async (document) => {
        const requestUrl = `/admin/student/${document}`
        return await axios.get(requestUrl);
    },

    generateOnlineToken: async (lectureId, currentTime) => {
        const requestUrl = `/admin/tokens`
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

    searchStudentByName: async (name) => {
        const requestUrl = `/admin/students/search/${name}`
        return await axios.get(requestUrl);
    },

    removePresenceFromUser: async (lectureId, document) => {
        const requestUrl = `/admin/presence/${lectureId}/${document}`
        return await axios.delete(requestUrl);
    },

    getSpeakers: async() => {
        const requestUrl = '/speakers/'
        return await axios.get(
            requestUrl
        )
    },

    postSpeaker: async(name, description, social_media, pronouns, role) => {
        const requestUrl = '/admin/speakers/'
        const params = new URLSearchParams()
        
        params.append('name', name)
        params.append('description', description)
        params.append('social_media', social_media)
        params.append('pronouns', pronouns)
        params.append('role', role)

        return await axios.post(
            requestUrl,
            params.toString(),
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
    }
}

export default saphira;