<template>
  <v-app>
    <v-container>
      <div>
        <v-row class="my-5 mx-1">
          <v-chip color="secondary" label text-color="white">
            Clasificación
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
                <tr
                  v-for="(item, index) in listClassification"
                  :key="item.nombre"
                >
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
              <span class="headline">Crear Clasificacion</span>
            </v-card-title>
            <v-form
              @submit.prevent="createClassification"
              ref="form"
              v-model="valid"
            >
              <v-card-text>
                <v-text-field
                  outlined
                  v-model="nombre"
                  label="Nombre *"
                  name="nombre"
                  autofocus
                  required
                  :counter="50"
                  :rules="[
                    v => !!v || 'El nombre es requerido',
                    v =>
                      (v && v.length <= 50) ||
                      'El nombre no debe sobrepasar los 50 caracteres'
                  ]"
                ></v-text-field>
                <MaterialColorPicker
                  v-bind:formData="formData"
                ></MaterialColorPicker>
                <small>* indica un campo obligatorio</small>
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
                  @click="dialog = false"
                  :disabled="!valid"
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
              <span class="headline">Editar Clasificacion</span>
            </v-card-title>
            <v-form
              @submit.prevent="editClassification"
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
                <small>* indica un campo obligatorio</small>
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
import {
  index,
  storeClassification,
  updateClassification,
  destroyClassification
} from '@/lib/clasificacion'

export default {
  name: 'Clasificacion',

  components: {
    MaterialColorPicker
  },

  data () {
    return {
      listClassification: [],

      formData: {
        otroAtributo: true,
        colorSelected: 'blue'
      },

      dialog: false,
      dialogEdit: false,

      nombre: '',
      color: null,
      indexClassification: null,
      idClassification: null,

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

  created () {
    this.getClassification()
  },

  methods: {
    getClassification () {
      index()
        .then(result => {
          this.listClassification = result
        })
        .catch(err => {
          console.log(err)
          this.listClassification = []
        })
    },

    create () {
      this.settingdata()
      this.dialog = true
    },

    changeState (valor, index) {
      this.idClassification = this.listClassification[index].id
      let formData = {
        id: this.idClassification,
        visible: valor
      }
      destroyClassification(formData)
        .then(result => {
          this.showSnackbar(result.message, 'success')
        })
        .catch(err => {
          this.listClassification[index].visible = !valor
          this.showSnackbar('ocurrio un error', 'red')
          console.log(err)
        })
    },

    createClassification () {
      this.$refs.form.validate()

      if (this.validate(this.nombre, this.formData.colorSelected)) {
        let formData = {
          nombre: this.nombre,
          material_color: this.formData.colorSelected,
          visible: true
        }

        storeClassification(formData)
          .then(result => {
            this.showSnackbar(result.message, 'primary')
            this.pushClassification(result.clasificacion)
          })
          .catch(err => {
            this.showSnackbar('ocurrio un error', 'red')
            console.log(err)
          })
      }
    },

    pushClassification (clasificacion) {
      this.listClassification.push({
        id: clasificacion.id,
        nombre: clasificacion.nombre,
        material_color: clasificacion.material_color,
        visible: clasificacion.visible
      })
    },

    edit (index) {
      this.settingdata()
      this.nombre = this.listClassification[index].nombre
      this.formData.colorSelected = this.listClassification[
        index
      ].material_color
      this.indexClassification = index
      this.idClassification = this.listClassification[index].id
      this.dialogEdit = true
    },

    editClassification () {
      this.$refs.formEdit.validate()
      if (this.validate(this.nombre, this.formData.colorSelected)) {
        let updateData = {
          id: this.idClassification,
          nombre: this.nombre,
          material_color: this.formData.colorSelected
        }

        updateClassification(updateData)
          .then(result => {
            this.showSnackbar(result.message, 'primary')
            this.listClassification[
              this.indexClassification
            ].nombre = this.nombre
            this.listClassification[
              this.indexClassification
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
      this.indexClassification = null
      this.idClassification = null
      this.formData.colorSelected = 'blue'
    },

    validate (nombre, color) {
      if (color === null && nombre.length == 0) {
        this.showSnackbar('Los campos de nombre y color estan vacios', 'red')
        return false
      } else if (nombre.length === 0) {
        this.showSnackbar(
          'El campo del nombre de la Clasificación esta vacio',
          'red'
        )
        return false
      } else if (color === null) {
        this.showSnackbar('El color esta vacio', 'red')
        return false
      }
      return true
    }
  }
}
</script>
