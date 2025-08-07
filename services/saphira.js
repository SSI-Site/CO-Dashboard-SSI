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

    addPresenceToUser: async (lectureId, studentId) => {
        const requestUrl = "/admin/presences/"
        const params = new URLSearchParams();
        params.append('talk', lectureId);
        params.append('student_document', studentId);

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
        return await axios.get(`/admin/talks/`);
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

    getSpeaker: async(id) => {
        const requestUrl = `/admin/speakers/${id}`
        return await axios.get(requestUrl)
    },

    postSpeaker: async(name, description, linkedin_link, instagram_link, pronouns, role) => {
        const requestUrl = '/admin/speakers/'
        const params = new URLSearchParams()
        
        params.append('name', name);
        params.append('description', description);
        params.append('linkedin_link', linkedin_link);
        params.append('instagram_link', instagram_link);
        params.append('pronouns', pronouns);
        params.append('role', role);

        return await axios.post(
            requestUrl,
            params.toString(),
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
    },

    updateSpeaker: async(id, name, description, linkedin_link, instagram_link, pronouns, role) => {
        const requestUrl = `/admin/speakers/${id}`
        const params = new URLSearchParams()
        params.append("name", name)
        params.append("description", description)
        params.append("linkedin_link", linkedin_link)
        params.append("instagram_link", instagram_link)
        params.append("pronouns", pronouns)
        params.append("role", role)

        return await axios.put(
            requestUrl,
            params.toString(),
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

        )
    },

    deleteSpeaker: async(id) => {
        const requestUrl = `admin/speakers/${id}`
        axios.delete(requestUrl)
    },

    getGifts: async() => {
        const requestUrl = '/admin/gifts/'
        return await axios.get(requestUrl)
    },

    postGift: async(name, description, min_presence, total_amount) => {
        const requestUrl = '/admin/gifts/'
        const params = new URLSearchParams()
        params.append('name', name)
        params.append('description', description)
        params.append("min_presence", min_presence)
        params.append("total_amount", total_amount)

        return await axios.post(
            requestUrl,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        
    },
    
    deleteGift: async(id) => {
        const requestUrl = `/admin/gifts/${id}`
        return await axios.delete(requestUrl);
    },

    updateGift: async(id, name, total_amount, min_presence, description) => {
        const requestUrl = `/admin/gifts/${id}`
        const params = new URLSearchParams()
        params.append("name", name)
        params.append("description", description)
        params.append("min_presence", min_presence)
        params.append("total_amount", total_amount)
        console.log('teste')
        return await axios.put(
            requestUrl,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
    },

    postSponsor: async(name, url) => {
        const requestUrl = '/admin/talks/sponsors/'
        const params = new URLSearchParams()
        params.append("name", name)
        params.append("url", url)

        return await axios.post(
            requestUrl,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
    },

    getSponsors: async() => {
        const requestUrl = '/admin/talks/sponsors/'
        return await axios.get(requestUrl)
    },

    updateSponsor: async(id, name, url) => {
        const requestUrl = `/admin/talks/sponsors/${id}`
        const params = new URLSearchParams()
        params.append("id", 5)
        params.append("name", name)
        params.append("url", url)

        return await axios.put(
            requestUrl,
            params.toString(),
            { 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
    },

    deleteSponsor: async(id) => {
        const requestUrl = `/admin/talks/sponsors/${id}`
        return axios.delete(requestUrl)
    },

    getTalks: async() => {
        const requestUrl = '/admin/talks'
        return await axios.get(requestUrl)
    },

    postTalk: async(start_time, end_time, speakers = [], activity_type, mode, sponsor_id, title, description) => {
        const requestUrl = '/admin/talks/'
        const params = {
            "start_time": start_time,
            "end_time": end_time,
            "speakers": speakers,
            "activity_type": activity_type,
            "mode": mode,
            "sponsor_id": sponsor_id == 'Nenhuma' ? null : sponsor_id,
            "title": title,
            "description": description,
        }

        return await axios.post(
            requestUrl,
            params,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    },

    removeTalk: async(id) => {
        const requestUrl = `/admin/talks/${id}`
        return await axios.delete(requestUrl)
    },

    updateTalk: async(id, start_time, end_time, speakers = [], activity_type, mode, sponsor_id, title, description) => {
        const requestUrl = `/admin/talks/${id}`
        const params = {
            "start_time": start_time,
            "end_time": end_time,
            "speakers": speakers,
            "activity_type": activity_type,
            "mode": mode,
            "sponsor_id": sponsor_id == 'Nenhuma' ? null : sponsor_id,
            "title": title,
            "description": description,
        }

        return await axios.put(
            requestUrl, 
            params,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    },

    getTalk: async(id) => {
        const requestUrl = `/admin/talks/${id}`
        return await axios.get(requestUrl)
    },

    getPresences: async() => {
        const requestUrl = '/admin/presences/'
        return axios.get(requestUrl)
    }
}

export default saphira;