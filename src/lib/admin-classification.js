import { baseURL, axios, config } from "./base";

function index() {
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

function storeClassification(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/clasificacion/crear`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function updateClassification(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/clasificacion/modificar`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function destroyClassification(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/clasificacion/visible`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { index, storeClassification, updateClassification, destroyClassification };
