import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Swal from "sweetalert2/dist/sweetalert2.js";

Vue.use(Vuex)

const url = 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    isLogin: false,
    successRegister: false,
    composites: {},
    region: '',
    watchlistData: [],
    forumData: '',
    demoData: '',
    foundStock: ''
  },
  mutations: {
    SET_ISLOGIN (state, payload) {
      state.isLogin = payload
    },
    SET_SUCCESSREGISTER (state, payload) {
      state.successRegister = payload
    },
    SET_COMPOSITES (state, payload) {
      state.composites = payload
    },
    SET_REGION(state, payload) {
      state.region = payload
    },
    SET_WATCHLISTDATA(state, payload) {
      state.watchlistData = payload
    },
    SET_FORUMDATA(state, payload) {
      state.forumData = payload
    },
    SET_DEMODATA(state, payload) {
      state.demoData = payload
    },
    SET_FOUNDSTOCK(state, payload) {
      state.foundStock = payload
    }
  },
  actions: {
    async registerUser(context, payload) {
      try {
        const { data } = await axios({
          method: 'POST',
          url: `${url}/register`,
          data: payload
        })
        Swal.fire(`Successfully created ${data.email}'s account`)
        context.commit('SET_SUCCESSREGISTER', true)
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async loginUser (context, payload) {
      try {
        const data = await axios({
          method: 'POST',
          url: `${url}/login`,
          data: payload
        })
        localStorage.setItem('access_token', data.data.access_token)
        context.commit('SET_ISLOGIN', true)
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async fetchCompositeIndex(context, payload) {
      try {
        const data = await axios({
          method: 'GET',
          url: `${url}/composites?index=${payload}`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        context.commit('SET_COMPOSITES', data)
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async fetchWatchlist(context, ) {
      try {
        const { data } = await axios({
          method: 'GET',
          url: `${url}/watchlists`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        if(data) {
          let queryArr = data.map(element => {
            return element.stockName
          });
          let queryStr = queryArr.join('%2C')
          const fullData = await axios({
            method: 'GET',
            url: `${url}/bulksearch?stockName=${queryStr}`,
            headers: {
              access_token: localStorage.access_token
            }
          })
          context.commit('SET_WATCHLISTDATA', fullData.data)
        } 
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async fetchForum(context, ) {
      try {
        const data = await axios({
          method: 'GET',
          url: `${url}/forums`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        context.commit('SET_FORUMDATA', data)
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async fetchDemo(context, ) {
      try {
        const data = await axios({
          method: 'GET',
          url: `${url}/demo`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        context.commit('SET_DEMODATA', data)
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async searchStock(context, payload) {
      try {
        const  { data }  = await axios({
          method: 'GET',
          url: `${url}/search?stockName=${payload}`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        if(!data) {
          Swal.fire('Stock not found')
        }
        context.commit('SET_FOUNDSTOCK', data)
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async addToWatchlist(context, payload) {
      try {
        const  { data }  = await axios({
          method: 'POST',
          url: `${url}/watchlists`,
          data: {
            stockName: payload
          },
          headers: {
            access_token: localStorage.access_token
          }
        })
        if(data) {
          Swal.fire('Successfully added to your stocklist')
          context.commit('SET_FOUNDSTOCK', '')
        }
      } catch (error) {
        Swal.fire(error.response.data.message)
      }
    },
    async viewDetails(context, payload) {
      
    }
  },
  modules: {
  }
})
