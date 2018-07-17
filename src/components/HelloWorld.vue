<template>
    <div>
         {{targetUrl}}
    </div>
</template>

<script>
  import { domStage, domEE } from "xes_pixi_renderer";
  import { canvasStage, canvasEE } from "xes_canvas_renderer";
  import { PixiExporter } from "xeditor-convertor";
export default {
  name: 'HelloWorld',
  data () {
    return {
      targetUrl:"当前页地址："
    }
  },
  created(){
    this.targetUrl+=window.location.href;
  },
  methods:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
