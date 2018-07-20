const queryString = require('query-string');
import axios from 'axios';

export const GET_DATA_FROM_URL = function (callback) {
  let parsed = queryString.parse(location.search);
  //判断是否是二次编辑
  if (parsed.pageId) {
    // http://localhost:5000#/
    axios.get("http://courseware.xesv5.com/api/Page/getDataJsonByPageId",{
      pageId: parsed.pageId,
      type: 2
    })
      .then(function (response) {
        getModuleJson(response.data.data.mainUrl, response.data.data.resourceUrl, response.data.data.moduleConfigUrl, callback);
      })
      .catch(function (error) {
        console.log(response.status);
      });
  } else {
    let path = decodeURIComponent(parsed.path);
    getModuleJson(path + "/main.json", path + "/resource.json", path + "/moduleConfig.json", callback);
  }
}

function getModuleJson(mainPath, resPath, moduleConfigPath, callback) {
  window.localStorage.removeItem("main");
  window.localStorage.removeItem("resource");
  window.localStorage.removeItem("moduleConfig");
  let requestMain = () => {
    return axios.get(mainPath, {})
      .then(function (response) {
        window.localStorage.setItem("main", JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("main.json loading failed!");
        console.log(response.status);
      });
  };
  let requestResources = () => {
    return axios.get(resPath, {})
      .then(function (response) {
        window.localStorage.setItem("resource", JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("resource.json loading failed!");
        console.log(response.status);
      });
  };
  let requestModule = () => {
    return axios.get(moduleConfigPath, {})
      .then(function (response) {
        window.localStorage.setItem("moduleConfig", JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("moduleConfig.json loading failed!");
        console.log(response.status);
      });
  };
  //结束跳转
  axios.all([requestMain(), requestResources(), requestModule()]).then(
    axios.spread(() => {
      callback();
    })
  );
}
