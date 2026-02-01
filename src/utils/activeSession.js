let activeSession = null;

export const getActiveSession = () => activeSession;

export const setActiveSession = (session) => {
  activeSession = session;
};

export const clearActiveSession = () => {
  activeSession = null;
};
