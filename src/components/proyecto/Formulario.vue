<template>
  <v-app>
    <v-container>
      <v-container fluid>
        <v-chip class="mb-5" color="secondary" label text-color="white">
          Crear Proyecto.
          <v-icon right> mdi-text-box-plus </v-icon>
        </v-chip>
        <v-form
          ref="form"
          v-model="validForm"
          @submit.prevent="submitForm"
          lazy-validation
        >
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.projectName"
                :rules="rules.requiredInputField"
                label="Nombre del proyecto"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu
                v-model="showCalendar"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.date"
                    label="Fecha de inicio"
                    append-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.date"
                  locale="es-419"
                  @input="showCalendar = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.clasification"
                :rules="rules.requiredSelectField"
                :items="clasifications"
                item-text="nombre"
                item-value="id"
                label="Clasificación"
                outlined
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.area"
                :rules="rules.requiredSelectField"
                :items="unidades"
                item-text="nombre"
                item-value="id"
                label="Unidad"
                outlined
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.longitude"8080
                :rules="rules.numberLongitudeField"
                label="Longitud"
                append-icon="mdi-map-marker"
                required
                outlined
                @keyup="onChangeLngLat"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.latitude"
                :rules="rules.numberLatitudeField"
                label="Latitud"
                append-icon="mdi-map-marker"
                outlined
                @keyup="onChangeLngLat"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="d-flex" justify="center">
            <div id="myMap" :style="{ width: '85vw', height: '100vh' }"></div>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="12" sm="12">
              <v-textarea
                @keyup.prevent
                :rules="rules.textAreaField"
                v-model="form.description"
                label="Descripción del proyecto"
                rows="5"
                value=""
                counter
                maxlength="500"
                outlined
              ></v-textarea>
            </v-col>
          </v-row>

          <v-btn color="grey lighten-2" @click="cleanForm" class="mr-4">
            Limpiar Formulario
          </v-btn>
          <v-btn color="indigo" class="mr-4" @click="submitForm" dark>
            Registrar Proyecto
          </v-btn>
        </v-form>
        <v-snackbar
          v-model="snackbar.visible"
          :timeout="3000"
          :color="snackbar.color"
          left
        >
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.visible = false">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-container>
  </v-app>
</template>

<script>
// https://stackoverflow.com/questions/55966573/parse-json-encoded-data-in-vue-component
const defaultForm = Object.freeze({
  projectName: '',
  clasification: '',
  area: '',
  longitude: '',
  latitude: '',
  description: '',
  date: new Date().toISOString().substr(0, 10)
})

export default {
  name: 'Formulario',

  data () {
    return {
      validForm: false,
      showCalendar: false,
      form: { ...defaultForm },
      map: null,

      clasifications: [],
      unidades: [],

      snackbar: {
        visible: false,
        text: '',
        color: ''
      },

      rules: {
        requiredInputField: [
          value => !!value || 'Este campo es requerido.',
          value =>
            value.length <= 255 ||
            'El nombre del proyecto no puede tener más de 255 caracteres.'
        ],

        requiredSelectField: [value => !!value || 'Este campo es requerido.'],

        textAreaField: [
          value =>
            value.length <= 500 ||
            'El nombre del proyecto no puede tener más de 500 caracteres.'
        ],

        numberLongitudeField: [
          value =>
            parseFloat(value) == value || 'Este campo debe ser un número.',
          value =>
            (parseFloat(value) <= 180 && parseFloat(value) >= -180) ||
            'Rango valido -180 a 180.'
        ],

        numberLatitudeField: [
          value =>
            parseFloat(value) == value || 'Este campo debe ser un número.',
          value =>
            (parseFloat(value) <= 90 && parseFloat(value) >= -90) ||
            'Rango valido -90 a 90.'
        ]
      }
    }
  },

  mounted () {
    this.setListField()
    setTimeout(() => {
      const navigationBarMode = Microsoft.Maps.NavigationBarMode
      const map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(
          13.785946117539993,
          -89.00934191406253
        ),
        navigationBarMode: navigationBarMode.compact,
        supportedMapTypes: [
          Microsoft.Maps.MapTypeId.road,
          Microsoft.Maps.MapTypeId.aerial,
          Microsoft.Maps.MapTypeId.grayscale,
          Microsoft.Maps.MapTypeId.canvasDark,
          Microsoft.Maps.MapTypeId.canvasLight
        ],
        zoom: 9
      })
      this.map = map
      Microsoft.Maps.Events.addHandler(map, 'click', event => {
        console.log(event)
        map.entities.clear()
        const {
          location: { latitude, longitude }
        } = event
        this.form.latitude = latitude.toFixed(6)
        this.form.longitude = longitude.toFixed(6)
        this.setPinOnMap(this.form.latitude, this.form.longitude)
      })
    }, 1500)
  },

  methods: {
    setListField () {
      axios
        .get('clasificacion')
        .then(response => {
          const {
            data: { clasificaciones, unidades }
          } = response
          this.clasifications = clasificaciones
          this.unidades = unidades
        })
        .catch(error => {
          console.log(error)
          const message =
            error.response.status + ' Error en al cargar los datos.'
          this.errorNotification(message)
        })
    },

    submitForm () {
      this.validForm = this.$refs.form.validate()
      if (!this.validForm) {
        return this.errorNotification('Debe completar el formulario.')
      }

      axios
        .post('proyecto/crear', this.getFormData())
        .then(response => {
          if (response.status === 201) {
            this.successNotificacion(response.data.mensaje)
            this.cleanForm()
            return
          }
          const message = error.response.status + ' Error al crear el registro.'
          this.errorNotification(message)
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 422) {
            return this.errorNotification(error.response.data.error)
          }
          const message = error.response.status + ' Error al crear el registro.'
          this.errorNotification(message)
        })
    },

    getFormData () {
      const {
        projectName: nombre,
        clasification: id_clasificacion,
        area: id_unidad,
        longitude: longitud,
        latitude: latitud,
        date: fecha_creado,
        description: descripcion
      } = this.form

      return {
        nombre,
        id_clasificacion,
        id_unidad,
        fecha_creado,
        longitud,
        latitud,
        descripcion
      }
    },

    successNotificacion (message) {
      this.snackbar = {
        visible: true,
        text: message,
        color: 'indigo'
      }
    },

    errorNotification (message) {
      return (this.snackbar = {
        visible: true,
        text: message,
        color: 'red'
      })
    },

    cleanForm () {
      this.$refs.form.resetValidation()
      this.form = { ...defaultForm }
    },

    onChangeLngLat () {
      if (+this.form.latitude && +this.form.longitude && this.validForm) {
        this.setPinOnMap(this.form.latitude, this.form.longitude)
      }
    },

    setPinOnMap (latitude, longitude) {
      this.map.entities.clear()
      const pin = new Microsoft.Maps.Pushpin({ latitude, longitude })
      this.map.entities.push(pin)
    }
  }
}
</script>
