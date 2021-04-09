<template>
  <v-app>
    <v-container>
      <v-container fluid>
        <v-row>
          <v-chip class="mb-5" color="secondary" label dark>
            Calendario
            <v-icon right> mdi-calendar-month </v-icon>
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="showAssignDate">
            Crear
            <v-icon right> mdi-plus </v-icon>
          </v-btn>
        </v-row>

        <v-row class="mt-0 mb-3">
          <v-chip-group mandatory>
            <v-chip
              color="secondary"
              @click="idStatusFiltered = -1"
              dark
              outlined
            >
              Mostrar Todos
            </v-chip>
            <v-chip
              v-for="statuses in visitStatuses"
              :key="statuses.id"
              :color="statuses.material_color"
              @click="idStatusFiltered = statuses.id"
              dark
            >
              {{ statuses.nombre }}
            </v-chip>
          </v-chip-group>
        </v-row>
        <v-sheet height="1000">
          <v-toolbar flat>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
          </v-toolbar>
          <v-calendar
            ref="calendar"
            v-model="focus"
            type="month"
            :events="getScheduled"
            locale="es-419"
            :event-color="getEventColor"
            @click:event="showProject"
            @change="changeDate"
          ></v-calendar>

          <v-dialog v-model="show" max-width="650">
            <v-card color="grey lighten-4">
              <v-toolbar dark>
                {{ visitInfo.project }}
                <v-spacer></v-spacer>
                <v-btn icon class="ml-5" @click="dialogDelete = true">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-chip class="my-3" :color="color" dark label>
                  {{ visitInfo.stateVisit }}
                </v-chip>
                <p>
                  {{ visitInfo.description }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="secondary" @click="show = false">
                  Cancelar
                </v-btn>
                <v-btn text color="green" @click="showEdit"> Editar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-sheet>

        <v-dialog v-model="dialog">
          <v-card>
            <v-form @submit.prevent="assignDate" ref="form" v-model="valid">
              <v-card-title> Asignar Fecha </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-autocomplete
                      auto-select-first
                      clearable
                      v-model="visitInfo.project"
                      :items="projects"
                      item-text="nombre"
                      item-value="identificador"
                      :rules="[v => !!v || 'Selecciona un proyecto']"
                      label="Proyecto "
                    ></v-autocomplete>

                    <v-select
                      v-model="visitInfo.idStatus"
                      :items="visitStatuses"
                      :rules="[v => !!v || 'Selecciona un estado']"
                      item-text="nombre"
                      item-value="id"
                      label="Estado de la visita"
                    ></v-select>

                    <v-textarea
                      v-model="visitInfo.description"
                      auto-grow
                      label="Nota"
                      :counter="200"
                      :rules="[
                        v =>
                          (v || '').length <= 200 ||
                          'La descripcion no debe sobrepasar de los 200 caracteres'
                      ]"
                    ></v-textarea>
                  </v-col>
                  <v-col>
                    <v-date-picker
                      full-width
                      locale="es-419"
                      v-model="visitInfo.dates"
                      range
                      required
                    >
                    </v-date-picker>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false">Cancelar</v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  type="submit"
                  @click="dialog = false"
                  :disabled="!valid"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" max-width="650">
          <v-card>
            <v-form
              @submit.prevent="editVisit"
              ref="formedit"
              v-model="validEdit"
            >
              <v-card-title> {{ visitInfo.project }} </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-select
                      v-model="visitInfo.idStatus"
                      :items="visitStatuses"
                      :rules="[v => !!v || 'Selecciona un estado']"
                      item-text="nombre"
                      item-value="id"
                      label="Estado de la visita"
                    ></v-select>

                    <v-textarea
                      v-model="visitInfo.description"
                      auto-grow
                      label="Descripcion"
                      :counter="200"
                      :rules="[
                        v =>
                          (v || '').length <= 200 ||
                          'La descripcion no debe sobrepasar de los 200 caracteres'
                      ]"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogEdit = false">Cancelar</v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  type="submit"
                  @click="dialogEdit = false"
                  :disabled="!valid"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="450">
          <v-card>
            <v-card-title class="headline"> Eliminar Visita </v-card-title>

            <v-card-text>
              ¿Seguro de eliminar la visita a {{ visitInfo.project }}?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red darken-1" text @click="deleteVisit()">
                Eliminar
              </v-btn>
              <v-btn text @click="dialogDelete = false"> Cancelar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar
          v-model="snackbar.state"
          :timeout="3000"
          :color="snackbar.color"
          left
        >
          {{ snackbar.message }}
          <v-btn text v-bind="attrs" @click="snackbar.state = false">
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-container>
    </v-container>
  </v-app>
</template>

<script>
import {
  getCalendar,
  createDate,
  editDate,
  deleteDate
} from '@/lib/project-calendar'

export default {
  name: 'Calendario',

  mounted () {
    this.getDates()
  },

  data () {
    return {
      value: '',
      idStatusFiltered: -1,

      dialog: false,
      dialogEdit: false,
      dialogDelete: false,
      show: false,

      projects: [],

      color: '',
      color2: '',
      stateVisit: '',
      focus: '',

      visitInfo: {
        id: null,
        project: '',
        idStatus: '',
        description: '',
        dates: [],
        classification: '',
        stateVisit: ''
      },

      colors: [
        'blue',
        'indigo',
        'deep-purple',
        'cyan',
        'green',
        'orange',
        'grey darken-1'
      ],

      snackbar: {
        state: false,
        message: '',
        color: ''
      },
      attrs: {},

      visitStatuses: [],

      scheduledVisits: [],

      valid: true,
      validEdit: true
    }
  },

  computed: {
    getScheduled () {
      if (this.idStatusFiltered === -1) {
        return this.scheduledVisits
      }
      return this.scheduledVisits.filter(
        ({ id_status }) => id_status === this.idStatusFiltered
      )
    }
  },

  methods: {
    getEventColor (event) {
      return event.materialColor
    },
    showAssignDate () {
      this.visitInfo = {}
      this.dialog = true
    },

    getDates () {
      getCalendar()
        .then(result => {
          this.scheduledVisits = result.calendario
          this.visitStatuses = result.estadoVisita
          this.projects = result.proyectos
        })
        .catch(err => {
          console.log(err)
          this.scheduledVisits = []
          this.visitStatuses = []
          this.projects = []
        })
    },

    assignDate () {
      this.$refs.form.validate()
      createDate(this.getFormData())
        .then(result => {
          this.showSnackbar(result.message, 'primary')
          this.pushVisit(result.newDate)
        })
        .catch(err => {
          this.showSnackbar('ocurrio un error', 'red')
          console.log(err)
        })
    },

    getFormData () {
      let [startDate, endDate] = this.visitInfo.dates
      var formData = {
        identificador: this.visitInfo.project,
        id_estado: this.visitInfo.idStatus,
        fecha_inicio: startDate,
        fecha_fin: endDate || startDate,
        descripcion: this.visitInfo.description
      }
      return formData
    },

    pushVisit (id) {
      let [startDate, endDate] = this.visitInfo.dates
      this.scheduledVisits.push({
        id: id,
        name: this.visitInfo.project,
        start: startDate,
        end: endDate || startDate,
        id_status: this.visitInfo.idStatus,
        materialColor: this.visitStatuses.find(
          element => element.id === this.visitInfo.idStatus
        ).material_color
      })
    },

    showProject ({ event }) {
      this.visitInfo.id = event.id
      this.visitInfo.project = event.name
      this.visitInfo.description = event.descripcion || 'Sin descripción.'
      this.visitInfo.idStatus = event.id_status
      this.visitInfo.stateVisit = this.visitStatuses.find(
        element => element.id === event.id_status
      ).nombre
      this.color = this.visitStatuses.find(
        element => element.id === event.id_status
      ).material_color
      this.color2 = event.cla_material_color
      this.show = true

      this.visitInfo.classification = event.clasificacion
    },

    editVisit () {
      this.$refs.formEdit.validate()
      var formEdit = {
        id: this.visitInfo.id,
        id_estado: this.visitInfo.idStatus,
        descripcion: this.visitInfo.description
      }
      editDate(formEdit)
        .then(result => {
          this.showSnackbar(result.message, 'success')

          this.editCalendar()
        })
        .catch(err => {
          this.showSnackbar('ocurrio un error', 'red')
          console.log(err)
        })
    },

    editCalendar () {
      let indexVisit = null
      this.scheduledVisits.forEach((element, index) => {
        if (element.id === this.visitInfo.id) {
          indexVisit = index
        }
      })
      this.scheduledVisits[indexVisit].id_status = this.visitInfo.idStatus
      this.scheduledVisits[indexVisit].materialColor = this.visitStatuses.find(
        element => element.id === this.visitInfo.idStatus
      ).material_color
      this.scheduledVisits[indexVisit].descripcion = this.visitInfo.description
      this.visitInfo = {}
    },

    deleteVisit () {
      let deleteData = {
        id: this.visitInfo.id
      }

      deleteDate(deleteData)
        .then(result => {
          this.showSnackbar(result.message, 'success')
          this.scheduledVisits = this.scheduledVisits.filter(
            element => element.id != this.visitInfo.id
          )
          this.show = false
          this.dialogDelete = false
          this.visitInfo = {}
        })
        .catch(err => {
          this.showSnackbar('ocurrio un error', 'red')
          console.log(err)
        })
    },

    showEdit () {
      this.dialogEdit = true
      this.show = false
    },

    prev () {
      this.$refs.calendar.prev()
      this.mes = ''
    },

    next () {
      this.$refs.calendar.next()
      this.mes = ''
    },

    changeDate () {
      this.$refs.calendar.checkChange()
      this.mes = ''
    },

    showSnackbar (message, color) {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.state = true
    }
  }
}
</script>
