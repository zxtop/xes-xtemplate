<template>
  <div class="container">
    <dom-stage :stageObj="stageObj" tabindex="-1" v-if="!canvasRenderer&&showStage"></dom-stage>
    <canvas-stage :stageObj="stageObj" tabindex="-1" v-if="canvasRenderer&&showStage"></canvas-stage>
  </div>
</template>
<script>
  import { domStage, domEE } from "xes_pixi_renderer";
  import { canvasStage, canvasEE } from "xes_canvas_renderer";
  import { PixiExporter } from "xeditor-convertor";
  import {GET_DATA_FROM_URL} from "../../static/utils"
  import {EMIT_EVENT} from "../../static/event";
  import {pageSizeFun} from "../../static/preload";
  import { mainFun } from "../code/index";
  export default{
    name: 'Index',
    components:{domStage,canvasStage},
    data () {
      return {
        canvasRenderer:false,
        stageObj:{},
        showStage:false,
      }
    },
    created(){
      let dataThis = this;
      GET_DATA_FROM_URL(()=>{
        let pixi = new PixiExporter(
          JSON.parse(window.localStorage.getItem("main")),
          JSON.parse(window.localStorage.getItem("resource")),
          (current, all) => {
            console.log("资源加载个数：" + current);
            console.log("资源总个数：" + all);
          },
          () => {
            dataThis.stageObj = pixi.pixiApp.stage;
            pageSizeFun(document, window,dataThis.stageObj.width,dataThis.stageObj.height);
            let stageObj = dataThis.stageObj.toObj();
            EMIT_EVENT(dataThis.canvasRenderer?canvasEE:domEE,dataThis.stageObj, stageObj);
            dataThis.showStage = true;
            mainFun.bind(stageObj)();
          }
        );
      });
    },

    methods:{
//      UrlParamHash: function (url,name){
//        let dataUrl = url||window.location.href||window.location.search;
//        let params = {}, h;
//        let host= dataUrl.split("?")[0];
//        host.indexOf("http")>=0?params["host"]=host:"";
//        let hash = dataUrl.slice(dataUrl.indexOf("?") + 1).split('&');
//        for(let i = 0; i<hash.length; i++) {
//          h = hash[i].split("=");
//          params[h[0]] = h[1];
//        }
//        if(name){return params[name]}else {
//          return params;
//        }
//      },
    }
  }
</script>

<style scoped>
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 19.20rem;
    height: 10.80rem;
    transform: translate(-50%, -50%);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

</style>
