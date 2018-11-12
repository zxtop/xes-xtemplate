import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

require('xes-submit');
let Answer = new XPIXI.AnswerInfo(this);

const state = {
  postArr: [],//答题情况
  goldnum: 0,
  tempNum: 0,//当前题号
  countNum: 2,//总题数
  delayed: 1000,//延时时间
  isPost: false,//是否已经提交答案
};
const getters = {};
const actions = {
  postAnswer({state}) {
    Answer.postAnswer(state.postArr, state.postArr.length);
    state.isPost = true;
  },
  pushToPostArr({state}, value) {
    state.postArr.push(value);
  }
};
const mutations = {
  setIsPost(state, value) {
    state.isPost = value;
  }
};
const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

export default store



// WEBPACK FOOTER //
// ./src/store/index.js