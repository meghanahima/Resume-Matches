export const getCurrentHost = () => {
  // You can add logic here to determine which host to use
  // For now, returning localhost
  return HOSTS[import.meta.env.VITE_SERVER_URL].hostUrl;
}; 