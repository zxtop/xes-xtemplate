export const EMIT_EVENT = function (event,pixiObj){
      event.on("click", ev => {
        console.log(ev);
      });
      event.on("dblclick", ev => {
        console.log(ev);
      });
      event.on("mousedown", ev => {
        console.log(ev)
      });
      event.on("mouseup", ev => {
        console.log(ev)
      });
      // event.on("mouseout", ev => {
      //   console.log(ev)
      // });
      // event.on("mouseover", ev => {
      //   console.log(ev)
      // });
      event.on("keydown", ev => {
        console.log(ev)
      });
      event.on("keyup", ev => {
        console.log(ev)
      });
};
