import * as api from "@/helpers/api";
import * as storage from "@/helpers/storage";
import i18n from "@/i18n";
import { findNearestLanguageMatch } from "@/utils/i18n";
import store, { useAppSelector } from "../";
import { setAppearance, setGlobalState, setLocale } from "../reducer/global";

export const initialGlobalState = async () => {
  const defaultGlobalState = {
    locale: "en" as Locale,
    appearance: "system" as Appearance,
    systemStatus: {
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
    } as SystemStatus,
  };

  const { locale: storageLocale, appearance: storageAppearance } = storage.get(["locale", "appearance"]);
  if (storageLocale) {
    defaultGlobalState.locale = storageLocale;
  }
  if (storageAppearance) {
    defaultGlobalState.appearance = storageAppearance;
  }

  const { data } = (await api.getSystemStatus()).data;
  if (data) {
    const customizedProfile = data.customizedProfile;
    defaultGlobalState.systemStatus = {
      ...data,
      customizedProfile: {
        name: customizedProfile.name || "memos",
        logoUrl: customizedProfile.logoUrl || "/logo.webp",
        description: customizedProfile.description,
        locale: customizedProfile.locale || "en",
        appearance: customizedProfile.appearance || "system",
        externalUrl: "",
      },
    };
    defaultGlobalState.locale = storageLocale || findNearestLanguageMatch(i18n.language);
    defaultGlobalState.appearance = customizedProfile.appearance;
  }
  store.dispatch(setGlobalState(defaultGlobalState));
};

export const useGlobalStore = () => {
  const state = useAppSelector((state) => state.global);

  return {
    state,
    getState: () => {
      return store.getState().global;
    },
    isDev: () => {
      return state.systemStatus.profile.mode !== "prod";
    },
    showAskAI: () => {
      const openAIConfig = state.systemStatus.openAIConfig;
      return Boolean(openAIConfig.key && openAIConfig.host);
    },
    fetchSystemStatus: async () => {
      const { data: systemStatus } = (await api.getSystemStatus()).data;
      store.dispatch(setGlobalState({ systemStatus: systemStatus }));
      return systemStatus;
    },
    setSystemStatus: (systemStatus: Partial<SystemStatus>) => {
      store.dispatch(
        setGlobalState({
          systemStatus: {
            ...state.systemStatus,
            ...systemStatus,
          },
        })
      );
    },
    setLocale: (locale: Locale) => {
      store.dispatch(setLocale(locale));
    },
    setAppearance: (appearance: Appearance) => {
      store.dispatch(setAppearance(appearance));
    },
  };
};
