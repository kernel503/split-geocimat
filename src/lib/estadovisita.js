function index() {
  return new Promise((resolve, reject) => {
    axios
      .get('estadovisita')
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
      .post('estadovisita/crear', formData)
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
      .post('estadovisita/modificar', formData)
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
      .post('estadovisita/visible', formData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { index, storeVisitingState, updateVisitingState, destroyVisitingState };
