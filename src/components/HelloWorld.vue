<template>
    <div class="stageParent">
      <!--<dom-stage :stageObj="stageObj" tabindex="-1" v-if="!canvasRenderer"></dom-stage>-->
      <!--<canvas-stage :stageObj="stageObj" tabindex="-1" v-if="canvasRenderer"></canvas-stage>-->
      这里面一会样渲染东西，容器大小1920*1080 可缩放<br/>
      当前页面url解析{{UrlParamHash()}}
    </div>
</template>
<script>
  import { domStage, domEE } from "xes_pixi_renderer";
  import { canvasStage, canvasEE } from "xes_canvas_renderer";
  import { PixiExporter } from "xeditor-convertor";
export default {
  name: 'HelloWorld',
  components:{domStage,canvasStage},
  data () {
    return {
      canvasRenderer:false,
      stageObj:{}
    }
  },
  created(){

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
    background:red;
    font-size:20px;
    margin: 0 auto;
  }

</style>
