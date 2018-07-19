<template>
    <div class="stageParent">
      <dom-stage :stageObj="stageObj" tabindex="-1" v-if="!canvasRenderer&&showStage"></dom-stage>
      <canvas-stage :stageObj="stageObj" tabindex="-1" v-if="canvasRenderer&&showStage"></canvas-stage>
      <!--这里面一会样渲染东西，容器大小1920*1080 可缩放<br/>-->
      <!--当前页面url解析{{UrlParamHash()}}-->
    </div>
</template>
<script>
  import { domStage, domEE } from "xes_pixi_renderer";
  import { canvasStage, canvasEE } from "xes_canvas_renderer";
  import { PixiExporter } from "xeditor-convertor";
  import {GET_DATA_FROM_URL} from "../../static/utils"
  import {EMIT_EVENT} from "../../static/event";
  export default{
  name: 'HelloWorld',
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
          EMIT_EVENT(dataThis.canvasRenderer?canvasEE:domEE,dataThis.stageObj);
          dataThis.showStage = true;
        }
      );
    });
  },
  methods:{

     UrlParamHash: function (url,name){
       let dataUrl = url||window.location.href||window.location.search;
       let params = {}, h;
       let host= dataUrl.split("?")[0];
       host.indexOf("http")>=0?params["host"]=host:"";
       let hash = dataUrl.slice(dataUrl.indexOf("?") + 1).split('&');
       for(let i = 0; i<hash.length; i++) {
         h = hash[i].split("=");
         params[h[0]] = h[1];
       }
       if(name){return params[name]}else {
         return params;
       }
     },
  }
}
</script>

<style scoped>
  .stageParent{
    width:19.2rem;
    height:10.8rem;
    background:pink;
    font-size:20px;
    margin: 0 auto;
  }

</style>
