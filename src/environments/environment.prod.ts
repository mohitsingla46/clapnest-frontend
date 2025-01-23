import packageInfo from '../../package.json';

const apiUrl = "http://localhost:5000/graphql";
const socketUrl = "http://localhost:5000";

export const environment = {
  production      : true,
  version         : packageInfo.version,
  appName         : 'ClapNest',
  envName         : 'production',
  apiUrl          : apiUrl,
  socketUrl       : socketUrl,
};
