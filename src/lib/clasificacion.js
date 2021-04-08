function index() {
  return new Promise((resolve, reject) => {
    axios
      .get('clasificacion')
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
      .post('clasificacion/crear', formData)
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
      .post('clasificacion/modificar', formData)
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
      .post('clasificacion/visible', formData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { index, storeClassification, updateClassification, destroyClassification };
