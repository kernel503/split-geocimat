import { baseURL, axios } from './base';

function getInfoUser() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/geocimat/proyecto`)
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export { getInfoUser };
