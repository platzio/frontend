import { ref, reactive, toRefs } from "vue";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { AuthenticationApi, Configuration, type User } from "@platzio/sdk";

const ACCESS_TOKEN_ITEM = "access_token";

export function createAuth() {
  const access_token = ref<string>(
    localStorage.getItem(ACCESS_TOKEN_ITEM) || ""
  );

  const sdkConfig = () =>
    new Configuration({
      basePath: `${window.location.protocol}//${window.location.host}`,
      accessToken: () => access_token.value,
    });

  const api = new AuthenticationApi(sdkConfig());

  const state = reactive({
    ready: false,
    status: undefined as string | undefined,
    needsLogin: false,
    curUser: null as User | null,
  });

  const start = async () => {
    state.status = undefined;
    state.ready = false;
    state.needsLogin = false;
    state.curUser = null;

    try {
      const res = await api.authMe();
      const data = res.data;
      if ("User" in data) {
        state.curUser = data.User;
        state.needsLogin = false;
        state.ready = true;
      } else {
        state.status = `🫠 It looks like you've logged-in as a deployments. Deployments don't use the frontend, silly.`;
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status == StatusCodes.UNAUTHORIZED
      ) {
        state.needsLogin = true;
      } else {
        state.status = `🌧 Authentication failed, will try again in a few seconds (${err})`;
        setTimeout(start, 4500);
      }
    }
  };

  const setAccessToken = (new_access_token: string) => {
    localStorage.setItem("access_token", new_access_token);
    access_token.value = new_access_token;
  };

  const logout = () => {
    state.status = undefined;
    state.ready = false;
    state.needsLogin = false;
    state.curUser = null;
    access_token.value = "";
    localStorage.removeItem(ACCESS_TOKEN_ITEM);
  };

  axios.interceptors.request.use(
    async (config) => {
      if (access_token.value) {
        config.headers.setAuthorization(`Bearer ${access_token.value}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return reactive({
    start,
    sdkConfig,
    setAccessToken,
    logout,
    ...toRefs(state),
  });
}
