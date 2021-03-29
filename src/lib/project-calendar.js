import { baseURL, axios, config } from './base';

function getCalendar() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/geocimat/calendario`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function createDate(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/calendario/crear`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function editDate(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/calendario/modificar`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function deleteDate(formData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseURL}/geocimat/calendario/destruir`, formData, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { getCalendar, createDate, editDate, deleteDate };
