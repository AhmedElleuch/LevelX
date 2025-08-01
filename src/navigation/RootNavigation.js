import { createNavigationContainerRef } from '@react-navigation/native';

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