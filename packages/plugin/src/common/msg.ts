import { PluginSettings } from "./app";

export type PostMessage =
  | {
      type: "log";
      payload: {
        count: number;
        foo: boolean;
      };
    }
  | {
      type: "create";
      payload: {
        content: string;
      };
    }
  | {
      type: "close";
    }
  | {
      type: "notifiy";
      payload: {
        message: string;
        options?: NotificationOptions;
      };
    };

export type UIPostMessagePayload = {
  settings: PluginSettings;
};

export type UIPostMessage = {
  data: {
    pluginId: string;
    pluginMessage: UIPostMessagePayload;
  };
};

export const postToUI = (msg: UIPostMessagePayload) => {
  figma.ui.postMessage(msg);
};

export const postToFigma = (msg: PostMessage) => {
  parent.postMessage({ pluginMessage: msg }, "*");
};
