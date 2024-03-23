import { getClient } from "../client";

export const reqModal = async (func) => {
  try {
    const { status, data } = await func();
    if (status === 200) {
      return data;
    } else {
      return {
        status: false,
        msg: `request failed with code ${status}`,
      };
    }
  } catch (e) {
    return {
      status: false,
      msg: "Something Unexpected happened",
    };
  }
};

export const login = () => {
  return reqModal(() => getClient().get("/login"));
};

export const postPrefs =async (prefs) => {
  return reqModal(() => getClient().post("/save-preferences", prefs));
} 

export const getId = () => {
  return reqModal(() => getClient().get("/give-me-id"));
};
