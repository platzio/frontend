import { ref, reactive, toRefs } from 'vue'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { User } from './models/user'

const ACCESS_TOKEN_ITEM = 'access_token'

interface AuthMeResponse {
    User?: User;
}

export function createAuth() {
    const access_token = ref<string | null>(localStorage.getItem(ACCESS_TOKEN_ITEM))

    const state = reactive({
        ready: false,
        status: null as string | null,
        needsLogin: false,
        curUser: null as User | null,
    })

    const start = async () => {
        state.status = null
        state.ready = false
        state.needsLogin = false
        state.curUser = null

        try {
            const res = await axios.get('/api/v2/auth/me')
            const data = res.data as AuthMeResponse
            if (data.User) {
                state.curUser = data.User
                state.needsLogin = false
                state.ready = true
            } else {
                state.status = `🫠 It looks like you've logged-in as a deployments. Deployments don't use the frontend, silly.`
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response && err.response.status == StatusCodes.UNAUTHORIZED) {
                state.needsLogin = true
            } else {
                state.status = `🌧 Authentication failed, will try again in a few seconds (${err})`
                setTimeout(start, 4500)
            }
        }
    }

    const setAccessToken = (new_access_token: string) => {
        localStorage.setItem('access_token', new_access_token)
        access_token.value = new_access_token
    }

    const logout = () => {
        state.status = null
        state.ready = false
        state.needsLogin = false
        state.curUser = null
        access_token.value = null
        localStorage.removeItem(ACCESS_TOKEN_ITEM)
    }

    axios.interceptors.request.use(
        async (config) => {
            if (access_token.value) {
                config.headers = {
                    authorization: `Bearer ${access_token.value}`
                };
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return reactive({
        start,
        setAccessToken,
        logout,
        ...toRefs(state)
    })
}
