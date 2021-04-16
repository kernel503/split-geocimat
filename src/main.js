import Vue from 'vue';
import axios from 'axios';
import vuetify from './plugins/vuetify';

import Formulario from './components/proyecto/Formulario';
import Repositorio from './components/proyecto/Repositorio.vue';
import RepositorioLectura from './components/proyecto/RepositorioLectura.vue';
import Calendario from './components/Calendario.vue';
import EstadoVisita from './components/EstadoVisita.vue';
import Clasificacion from './components/Clasificacion.vue';

window.axios = axios;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] =
  document.querySelector('input[name="_token"]')?.value || 'INVALID_CSRF_TOKEN';
axios.defaults.baseURL = window.location.origin + '/geocimat' || 'http://127.0.0.1:8000/geocimat';

Vue.config.productionTip = false;

Vue.component('formulario-proyecto', Formulario);
Vue.component('repositorio-detalle', Repositorio);
Vue.component('repositorio-lectura', RepositorioLectura);
Vue.component('clasificacion-crud', Clasificacion);
Vue.component('estado-crud', EstadoVisita);
Vue.component('calendario-asignacion', Calendario);

new Vue({
  el: '#app',
  vuetify,
});
