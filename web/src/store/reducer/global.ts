import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  locale: Locale;
  appearance: Appearance;
  systemStatus: SystemStatus;
}

const globalSlice = createSlice({
  name: "global",
  initialState: {
    locale: "en",
    appearance: "system",
    systemStatus: {
      host: undefined,
      profile: {
        mode: "demo",
        version: "",
      },
      dbSize: 0,
      allowSignUp: false,
      ignoreUpgrade: false,
      disablePublicMemos: false,
      additionalStyle: "",
      additionalScript: "",
      customizedProfile: {
        name: "memos",
        logoUrl: "/logo.webp",
        description: "",
        locale: "en",
        appearance: "system",
        externalUrl: "",
      },
      openAIConfig: {
        key: "",
        host: "",
      },
    },
  } as State,
  reducers: {
    setGlobalState: (state, action: PayloadAction<Partial<State>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      return {
        ...state,
        locale: action.payload,
      };
    },
    setAppearance: (state, action: PayloadAction<Appearance>) => {
      return {
        ...state,
        appearance: action.payload,
      };
    },
  },
});

export const { setGlobalState, setLocale, setAppearance } = globalSlice.actions;

export default globalSlice.reducer;
