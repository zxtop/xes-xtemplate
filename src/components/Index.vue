<template>
  <div class="container">

        <canvas-stage v-if="showStage" :stageObj="stageObj" tabindex="-1"></canvas-stage>
        
  </div>
</template>
<script>
  
  import { canvasStage, canvasEE } from 'xes_canvas_renderer'
  
  import { PixiExporter } from 'xeditor-convertor'
  import {bindStages} from "../code/bindStageEvent";
  import { GET_DATA_FROM_URL } from '../core/utils'
  import { EMIT_EVENT } from '../core/event'
  import { pageSizeFun } from '../core/preload'
  
  
    require('xes_fillvacancy')
  
    require('xes-pixi-audio')
  
    require('xes-submit')
  

  export default {
    name: 'Index',
    components: {
    
        canvasStage
        
    },
  data() {
    return {
      stageObj: {},
      showStage: false,
      pixi: {}
    }
  },
  watch: {
    stageObjId(){
      this.pixi.pixiApp.stage = this.stageObj;
        
          EMIT_EVENT(canvasEE, this.stageObj, this.stageObj.toObj())
          
      }
  },
  computed: {
    stageObjId(){
      return this.stageObj.id;
    }
  },
  created() {
    let dataThis = this
    GET_DATA_FROM_URL(() => {
      let pixi = new PixiExporter(
        JSON.parse(window.localStorage.getItem('main')),
        JSON.parse(window.localStorage.getItem('resource')),
        (current, all) => {
          console.log('资源加载个数：' + current)
          console.log('资源总个数：' + all)
        },
        () => {
          let body = document.getElementsByTagName('body')[0];
          if (body.className === '') {
            body.className = 'load-complete';
          } else {
            body.className += ' load-complete';
          }
          let data = { type: "loadComplete" };
          window.parent.postMessage(data, "*");
          window.addEventListener("message", function(e) {
            if (e.data.type == "lookAnswerStatus") {
              console.log("回显结束");
              let data = { type: "doStatusComplete" };
              window.parent.postMessage(data, "*");
            }
          });
          this.pixi = pixi;
          let stages = pixi.pixiApp.stages
          dataThis.stageObj = pixi.pixiApp.stage
          pageSizeFun(document, window, dataThis.stageObj.width, dataThis.stageObj.height)
          let stageObj = dataThis.stageObj.toObj()
          dataThis.showStage = true
          bindStages(this,stages)
          }
      )
    })
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
