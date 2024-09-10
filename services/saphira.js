import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_SAPHIRA_URL;

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
    }

}

export default saphira;