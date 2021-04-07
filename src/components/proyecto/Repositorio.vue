<template>
  <v-app>
    <v-container>
      <div>
        <div v-show="showComponent">
          <v-row class="my-5 mx-1">
            <v-chip color="secondary" label text-color="white">
              <h3>
                {{ idProyecto }}
              </h3>
              <v-icon right> mdi-text-box-plus </v-icon>
            </v-chip>
          </v-row>
          <v-toolbar elevation="0">
            <v-tabs dark background-color="primary" grow v-model="tab">
              <v-tab>Repositorio</v-tab>
              <v-tab>Galería</v-tab>
              <v-tab>Información</v-tab>
            </v-tabs>
          </v-toolbar>

          <v-tabs-items v-model="tab" class="mt-2">
            <v-tab-item>
              <VistaArbol
                v-bind:showAlert="showAlert"
                v-bind:setGalery="setGalery"
                v-bind:displayComponent="displayComponent"
                v-bind:setProjectInfo="setProjectInfo"
                v-bind:id="idProyecto"
              />
            </v-tab-item>

            <v-tab-item>
              <v-card class="pa-2 mt-2" elevation="0">
                <v-btn-toggle>
                  <v-btn small @click="sizeCols--">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn small @click="sizeCols++">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <v-row class="mt-1">
                  <v-col
                    v-for="picture in galeryList"
                    :key="picture.id"
                    class="d-flex child-flex"
                    :cols="sizeColsLimit"
                  >
                    <v-img
                      :src="picture.url"
                      :lazy-src="picture.url"
                      aspect-ratio="1"
                      class="grey lighten-2"
                      alt="picture.name"
                      @click="openImage(picture)"
                      :style="{ cursor: 'pointer' }"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card class="mx-auto my-12" max-width="500">
                <template slot="progress">
                  <v-progress-linear
                    color="deep-purple"
                    height="10"
                    indeterminate
                  ></v-progress-linear>
                </template>
                <v-img
                  height="500"
                  :src="projectInfo.url"
                  :lazy-src="projectInfo.url"
                  aspect-ratio="1"
                  class="grey lighten-2"
                  alt="picture.name"
                ></v-img>
                <v-card-title> </v-card-title>
                <v-card-text>
                  <v-chip>{{ projectInfo.categoria }}</v-chip>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-title>{{ projectInfo.descripcion }}</v-card-title>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-snackbar
            v-model="snackbar.show"
            :timeout="4000"
            :color="snackbar.color"
            left
          >
            {{ snackbar.text }}
            <template v-slot:action="{ attrs }">
              <v-btn text v-bind="attrs" @click="snackbar.show = false">
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>
        </div>
        <div v-show="!showComponent">Este proyecto no existe.</div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import VistaArbol from './VistaArbol.vue'

export default {
  name: 'Repositorio',

  components: {
    VistaArbol
  },

  data () {
    return {
      snackbar: {
        show: false,
        text: '',
        color: ''
      },

      showComponent: true,

      idProyecto: '',
      tab: 0,
      sizeCols: 2,
      galeryList: [],

      projectInfo: {
        url:
          'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-89.229461,14.187164,13.58,0/500x500?access_token=pk.eyJ1Ijoia2VybmVsNTAzIiwiYSI6ImNrZHA5cmhiYTIwamgyeXBkOTgyZmU1cmkifQ.bK_Wbz4134Uf33qBDGklKg',
        descripcion: '',
        categoria: ''
      }
    }
  },

  computed: {
    sizeColsLimit () {
      if (this.sizeCols <= 1) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sizeCols = 1
      }
      if (this.sizeCols >= 12) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sizeCols = 12
      }
      return this.sizeCols
    }
  },

  created () {
    this.idProyecto =
      decodeURI(window.location.pathname.split('/').slice(-1)) || 'error'
  },

  methods: {
    displayComponent (value) {
      this.showComponent = value
    },

    showAlert (data) {
      this.snackbar = data
    },

    setGalery (list) {
      this.galeryList = list
    },

    setProjectInfo ({ descripcion, categoria, longitud, latitud }) {
      const info = {
        descripcion,
        categoria,
        url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${longitud},${latitud},13.58,0/500x500?access_token=pk.eyJ1Ijoia2VybmVsNTAzIiwiYSI6ImNrZHA5cmhiYTIwamgyeXBkOTgyZmU1cmkifQ.bK_Wbz4134Uf33qBDGklKg`
      }
      this.projectInfo = info
    },

    openImage ({ url }) {
      window.open(url, '_blank')
    }
  }
}
</script>
