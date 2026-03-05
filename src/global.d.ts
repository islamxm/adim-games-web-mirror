declare global {
  interface Window {
    AndroidHandler?: {
      postMessage: (action: string, data?: any) => void;
    };
    webkit?: {
      messageHandlers: {
        [key: string]: {
          postMessage: (data?: any) => void;
        };
      };
    };
  }
}
export {};
