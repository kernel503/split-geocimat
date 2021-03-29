<template>
  <v-app>
    <v-container>
      <div>
        <v-row class="my-5 mx-1">
          <v-chip color="secondary" label text-color="white">
            Estado de Visita
            <v-icon right>
              mdi-text-box-plus
            </v-icon>
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="create()">
            Crear
            <v-icon right>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-row>
        <template>
          <v-simple-table>
            <template>
              <thead>
                <tr>
                  <th class="text-left">
                    No.
                  </th>
                  <th class="text-left">
                    Nombre
                  </th>
                  <th class="text-left">
                    Color
                  </th>
                  <th class="text-left">
                    Visible
                  </th>
                  <th class="text-left">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listState" :key="item.nombre">
                  <td>{{ index + 1 }}</td>

                  <td>{{ item.nombre }}</td>
                  <td>
                    <v-chip
                      class="ma-2"
                      :color="item.material_color"
                      text-color="white"
                    >
                      {{ item.nombre }}
                    </v-chip>
                  </td>
                  <td>
                    <v-switch
                      :input-value="item.visible"
                      @change="value => changeState(value, index)"
                    ></v-switch>
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon @click="edit(index)">
                          <v-icon dark v-bind="attrs" v-on="on">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>

        <v-dialog v-model="dialog" persistent max-width="600">
          <v-card>
            <v-card-title>
              <span class="headline">Agregar estado</span>
            </v-card-title>
            <v-form @submit.prevent="createState" ref="form" v-model="valid">
              <v-card-text>
                <v-text-field
                  outlined
                  v-model="nombre"
                  label="Nombre *"
                  name="nombre"
                  :rules="[
                    v => !!v || 'El nombre es requerido',
                    v =>
                      (v && v.length <= 50) ||
                      'El nombre no debe sobrepasar los 50 caracteres'
                  ]"
                  autofocus
                  required
                ></v-text-field>

                <MaterialColorPicker
                  v-bind:formData="formData"
                ></MaterialColorPicker>

                <small>* Indica los campos obligatorios</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  type="submit"
                  :disabled="!valid"
                  @click="dialog = false"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" persistent max-width="600">
          <v-card>
            <v-card-title>
              <span class="headline">Editar Estado </span>
            </v-card-title>
            <v-form
              @submit.prevent="editState"
              ref="formEdit"
              v-model="validEdit"
            >
              <v-card-text>
                <v-text-field
                  outlined
                  v-model="nombre"
                  label="Nombre *"
                  name="nombre"
                  :rules="[
                    v => !!v || 'El nombre es requerido',
                    v =>
                      (v && v.length <= 50) ||
                      'El nombre no debe sobrepasar los 50 caracteres'
                  ]"
                  autofocus
                  required
                ></v-text-field>

                <MaterialColorPicker
                  v-bind:formData="formData"
                ></MaterialColorPicker>

                <small>* Indica los campos obligatorios</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogEdit = false">
                  Cancelar
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  type="submit"
                  @click="dialogEdit = false"
                  :disabled="!validEdit"
                >
                  Editar
                </v-btn>
              </v-card-actions>
            </v-form>
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
      </div>
    </v-container>
  </v-app>
</template>

<script>
import MaterialColorPicker from '@/components/MaterialColorPicker'
// import {
//   index,
//   storeVisitingState,
//   updateVisitingState,
//   destroyVisitingState
// } from '@/lib/admin-visitingstate'

export default {
  name: 'EstadoVisita',

  components: {
    MaterialColorPicker
  },

  data () {
    return {
      listState: [],
      formData: {
        otroAtributo: true,
        colorSelected: 'blue'
      },

      dialog: false,
      dialogEdit: false,

      nombre: '',
      color: null,
      indexState: null,
      idState: null,

      snackbar: {
        state: false,
        message: '',
        color: ''
      },

      on: true,
      attrs: {},
      valid: true,
      validEdit: true
    }
  },

  mounted () {
    this.getState()
  },

  methods: {
    getState () {
      index()
        .then(result => {
          this.listState = result
        })
        .catch(err => {
          console.log(err)
          this.listState = []
        })
    },

    create () {
      this.settingdata()
      this.dialog = true
    },

    changeState (valor, index) {
      this.idState = this.listState[index].id

      let destroyData = {
        id: this.idState,
        visible: valor
      }

      destroyVisitingState(destroyData)
        .then(result => {
          this.showSnackbar(result.message, 'primary')
        })
        .catch(err => {
          this.listState[index].visible = !valor
          this.showSnackbar('ocurrio un error', 'red')
          console.log(err)
        })
    },

    createState () {
      this.$refs.form.validate()

      if (this.validate(this.nombre, this.formData.colorSelected)) {
        let storeData = {
          nombre: this.nombre,
          material_color: this.formData.colorSelected,
          visible: true
        }

        storeVisitingState(storeData)
          .then(result => {
            this.showSnackbar(result.message, 'primary')
            this.pushVisitingState(result.estadovisita)
          })
          .catch(err => {
            this.showSnackbar('ocurrio un error', 'red')
            console.log(err)
          })
      }
    },

    pushVisitingState (estadovisita) {
      this.listState.push({
        id: estadovisita.id,
        nombre: estadovisita.nombre,
        material_color: estadovisita.material_color,
        visible: estadovisita.visible
      })
    },

    edit (index) {
      this.settingdata()
      this.idState = this.listState[index].id
      this.nombre = this.listState[index].nombre
      this.formData.colorSelected = this.listState[index].material_color
      this.indexState = index
      this.dialogEdit = true
    },

    editState () {
      this.$refs.formEdit.validate()

      if (this.validate(this.nombre, this.formData.colorSelected)) {
        let updateData = {
          id: this.idState,
          nombre: this.nombre,
          material_color: this.formData.colorSelected
        }

        updateVisitingState(updateData)
          .then(result => {
            this.showSnackbar(result.message, 'primary')
            this.listState[this.indexState].nombre = this.nombre
            this.listState[
              this.indexState
            ].material_color = this.formData.colorSelected
          })
          .catch(err => {
            this.showSnackbar('ocurrio un error', 'red')
            console.log(err)
          })
      }
    },

    showSnackbar (message, color) {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.state = true
    },

    settingdata () {
      this.nombre = ''
      this.formData.colorSelected = 'blue'
    },

    validate (nombre, color) {
      if (color === null && nombre.length == 0) {
        this.showSnackbar('Los campos de nombre y color estan vacios', 'red')
        return false
      }
      if (nombre.length === 0) {
        this.showSnackbar(
          'El campo del nombre del estado de la visita esta vacio',
          'red'
        )
        return false
      }
      if (color === null) {
        this.showSnackbar('El color esta vacio', 'red')
        return false
      }
      return true
    }
  }
}
</script>
