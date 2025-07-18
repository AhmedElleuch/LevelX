export const getThemeColors = (mode) => {
  if (mode === 'dark') {
    return {
      background: '#000',
      card: '#333',
      text: '#fff',
      border: '#555',
      primary: '#00aaff',
    };
  }
  return {
    background: '#fff',
    card: '#f9f9f9',
    text: '#000',
    border: '#ccc',
    primary: '#00aaff',
  };
};