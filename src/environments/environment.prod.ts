import packageInfo from '../../package.json';

const apiUrl = "https://clapnest-backend.onrender.com/graphql";
const socketUrl = "https://clapnest-backend.onrender.com";

export const environment = {
  production      : true,
  version         : packageInfo.version,
  appName         : 'ClapNest',
  envName         : 'production',
  apiUrl          : apiUrl,
  socketUrl       : socketUrl,
};
