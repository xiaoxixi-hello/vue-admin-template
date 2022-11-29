import { login, logout, getInfo, checkRefreshToken } from '@/api/user'
import { getToken, setToken, removeToken, setRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login 处理登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // 返回code 2000 成功 做如下
    if (result.code === 200) {
      // 提交 + 存储token
      commit('SET_TOKEN', result.token)
      commit('SET_REFRESH_TOKEN', result.refresh_token)
      setToken(result.token)
      setRefreshToken(result.refresh_token)
      return 'ok'
    } else {
      // 失败 做如下
      return Promise.reject(new Error('faild'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state).then(response => {
        if (!response) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = response

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // accessToken超时
  handleCheckRefreshToken({ state, commit }) {
    return new Promise((resolve, reject) => {
      checkRefreshToken().then(res => {
        console.log(res)
        const data = res.data
        commit('SET_TOKEN', data.token)
        setToken(data.token)

        resolve()
      }).catch((error) => {
        console.log('error.......', error)
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
