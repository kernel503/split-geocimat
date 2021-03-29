import { baseURL, axios, config } from './base';

function getClassification() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/geocimat/clasificacion`)
      .then((response) => {
        resolve(response.data.clasificaciones);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function createProject(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/proyecto/crear`, formData, config)
      .then((response) => {
        resolve(response.data.mensaje);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { getClassification, createProject };
