
function getCalendar() {
  return new Promise((resolve, reject) => {
    axios
      .get('/calendario')
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
      .post("/calendario/crear", formData)
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
      .post('calendario/modificar', formData)
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
      .post('calendario/destruir', formData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { getCalendar, createDate, editDate, deleteDate };
