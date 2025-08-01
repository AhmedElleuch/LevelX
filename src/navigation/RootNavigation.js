let createNavigationContainerRef;
try {
  ({ createNavigationContainerRef } = require('@react-navigation/native'));
} catch (e) {
  createNavigationContainerRef = undefined;
}

export const navigationRef =
  typeof createNavigationContainerRef === 'function'
    ? createNavigationContainerRef()
    : {
        isReady: () => false,
        navigate: () => {},
        canGoBack: () => false,
        goBack: () => {},
      };
export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const goBack = () => {
  if (navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};