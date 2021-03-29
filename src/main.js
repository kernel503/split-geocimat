import Vue from 'vue';
import vuetify from './plugins/vuetify';
import HelloWorld from './components/HelloWorld';
import Formulario from './components/proyecto/Formulario';
Vue.config.productionTip = false;

Vue.component('hello-world', HelloWorld);
Vue.component('formulario-proyecto', Formulario);

new Vue({
  el: '#app',
  vuetify,
});

// function GetMap() {
//   const navigationBarMode = Microsoft.Maps.NavigationBarMode;
//   const map = new Microsoft.Maps.Map('#myMap', {
//     center: new Microsoft.Maps.Location(13.785946117539993, -89.00934191406253),
//     navigationBarMode: navigationBarMode.compact,
//     supportedMapTypes: [
//       Microsoft.Maps.MapTypeId.road,
//       Microsoft.Maps.MapTypeId.aerial,
//       Microsoft.Maps.MapTypeId.grayscale,
//       Microsoft.Maps.MapTypeId.canvasDark,
//       Microsoft.Maps.MapTypeId.canvasLight,
//     ],
//     zoom: 9,
//   });
//   Microsoft.Maps.Events.addHandler(map, 'click', function(event) {
//     map.entities.clear();
//     const {
//       location: { latitude, longitude },
//     } = event;
//     const pin = new Microsoft.Maps.Pushpin(
//       { latitude, longitude },
//       {
//         color: 'red',
//         icon: 'https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png',
//       }
//     );
//     map.entities.push(pin);
//   });
// }

// const script = document.querySelector('#map-done');
// script.addEventListener('load', function() {
//   console.log('descargado');
//   checkElement('#myMap').then((selector) => {
//     console.log('montado');
//     GetMap();
//   });
// });

// const checkElement = async (selector) => {
//   while (document.querySelector(selector) === null) {
//     await new Promise((r) => setTimeout(r, 500));
//   }
//   return true;
// };
