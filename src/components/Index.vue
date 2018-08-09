<template>
  <div class="container">
    <dom-stage :stageObj="stageObj" tabindex="-1" v-if="!canvasRenderer&&showStage"></dom-stage>
    <canvas-stage :stageObj="stageObj" tabindex="-1" v-if="canvasRenderer&&showStage"></canvas-stage>
  </div>
</template>
<script>
  import { domStage, domEE } from 'xes_pixi_renderer'
  import { canvasStage, canvasEE } from 'xes_canvas_renderer'
  import { PixiExporter } from 'xeditor-convertor'
  import { GET_DATA_FROM_URL } from '../core/utils'
  import { EMIT_EVENT } from '../core/event'
  import { pageSizeFun } from '../core/preload'
  import { mainFun } from '../code/index'

  export default {
    name: 'Index',
    components: {domStage, canvasStage},
    data () {
      return {
        canvasRenderer: true,
        stageObj: {},
        showStage: false,
      }
    },
    created () {
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
            dataThis.stageObj = pixi.pixiApp.stage
            pageSizeFun(document, window, dataThis.stageObj.width, dataThis.stageObj.height)
            let stageObj = dataThis.stageObj.toObj()
            EMIT_EVENT(dataThis.canvasRenderer ? canvasEE : domEE, dataThis.stageObj, stageObj)
            dataThis.showStage = true
            mainFun.bind(stageObj)()
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
