<template>
  <v-container>
    <v-row>
      <v-col v-if="uploading">
        <v-progress-circular
          :width="3"
          color="indigo"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col>
        <v-treeview
          selectable
          selected-color="indigo"
          v-model="tree"
          :open="initiallyOpen"
          :items="items"
          item-key="ruta"
          v-if="!uploading"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.mime === 'folder'">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              {{ files[item.mime] || 'mdi-file' }}
            </v-icon>
          </template>

          <template v-slot:append="{ item }">
            <v-icon
              @click="downloadItem(item)"
              v-if="item.mime !== 'folder'"
              color="indigo"
            >
              mdi-download
            </v-icon>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VistaArbolLectura',

  props: {
    showAlert: Function,
    setGalery: Function,
    displayComponent: Function,
    setProjectInfo: Function,
    id: String
  },

  data: () => ({
    id_proyecto: '',
    uploading: false,
    folderName: '',
    path: '',
    dialog: false,
    filesUpload: [],
    initiallyOpen: ['public'],
    files: {
      'application/pdf': 'mdi-file-pdf',
      'image/jpeg': 'mdi-file-image',
      'image/jpg': 'mdi-file-image',
      'image/png': 'mdi-file-image',
      'image/svg+xml': 'mdi-file-image',
      'application/msword': 'mdi-file-word',
      'application/x-rar-compressed': 'mdi-zip-box',
      'application/x-7z-compressed': 'mdi-zip-box',
      'application/vnd.ms-powerpoint': 'mdi-file-powerpoint',
      'application/vnd.ms-excel': 'mdi-file-excel',
      'application/vnd.oasis.opendocument.spreadsheet': 'mdi-file-excel',
      'text/html': 'mdi-language-html5',
      'application/javascript': 'mdi-language-javascript'
    },
    tree: [],
    items: []
  }),

  mounted () {
    this.uploading = true
    this.id_proyecto = this.id
    this.setItems()
  },

  watch: {
    dialog () {
      if (this.dialog) {
        this.folderName = ''
      }
    }
  },

  methods: {
    setItems () {
      axios
        .get('repositorio/mostrar/' + this.id_proyecto)
        .then(response => {
          this.items = response.data.directorio
          this.setGalery(response.data.galeria)
          this.setProjectInfo(response.data.datos)
          this.displayComponent(true)
        })
        .catch(error => {
          console.log(error)
          this.items = []
          this.showAlert({
            show: true,
            text: error.response.data.mensaje || 'Error en la petición.',
            color: 'red'
          })
          this.displayComponent(false)
        })
        .then(_ => {
          this.uploading = false
        })
    },

    downloadItem ({ url }) {
      window.open(url, '_blank')
      this.tree = []
    }
  }
}
</script>
