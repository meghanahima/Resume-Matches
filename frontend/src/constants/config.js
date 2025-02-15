export const HOSTS = [
  {
    name: "localhost",
    hostUrl: "http://localhost:5000"
  },
  {
    name: "production",
    hostUrl: "http://alkdfj:5000"
  }
];

export const getCurrentHost = () => {
  // You can add logic here to determine which host to use
  // For now, returning localhost
  return HOSTS[0].hostUrl;
}; 