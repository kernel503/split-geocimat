import { baseURL, axios, config } from "./base";

function index() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/geocimat/estadovisita`)
      .then((response) => {
        resolve(response.data.estadovisita);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function storeVisitingState(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/estadovisita/crear`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function updateVisitingState(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/estadovisita/modificar`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function destroyVisitingState(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/estadovisita/visible`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export {
  index,
  storeVisitingState,
  updateVisitingState,
  destroyVisitingState,
};
