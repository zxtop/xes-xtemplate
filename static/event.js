let stageObj;
let getObj = (obj, id) => {
  let getIdObj = function (obj, id) {
    if ("id" in obj && obj.id === id * 1) {
      return obj
    } else if ("children" in obj && obj.children.length > 0) {
      let len = obj.children.length;
      for (let i = 0; i < len; i++) {
        if (getIdObj(obj.children[i], id)) {
          return getIdObj(obj.children[i], id);
        }
      }
    }
  };
  return getIdObj(obj, id);
};


let eventPropagation = (ev, type, dataEvent) => {
  let evObj = ev;
  let targetObj = getObj(stageObj, ev.id * 1);
  if (targetObj === undefined) { console.error("没有找到id是" + ev.id + "对象"); return }
  if (dataEvent[targetObj.name] === undefined) { console.error("没有在this中找到name是" + targetObj.name + "的对象 无法触发emit"); return }
  dataEvent[targetObj.name].emit(type, ev);
  // console.log("id:" + ev.id +"  name:"+targetObj.name+"  触发" + type);
  if (targetObj.parent) {
    evObj.id = targetObj.parent.id;
    eventPropagation(evObj, type, dataEvent);
  }
};

export const EMIT_EVENT = function (event, stage, dataEventThis) {
  stageObj = stage;
  event.on("click", ev => {
    eventPropagation(ev, "xClick", dataEventThis);
  });
  event.on("dblclick", ev => {
    eventPropagation(ev, "xDblclick", dataEventThis);
  });
  event.on("mousedown", ev => {
    eventPropagation(ev, "xMousedown", dataEventThis);
  });
  event.on("mouseup", ev => {
    eventPropagation(ev, "xMouseup", dataEventThis);
  });
  event.on("mouseout", ev => {
    eventPropagation(ev, "xMouseout", dataEventThis);
  });
  event.on("mouseover", ev => {
    eventPropagation(ev, "xMouseover", dataEventThis);
  });
  event.on("mousemove", ev => {
    eventPropagation(ev,"xMousemove",dataEventThis);
  });
  event.on("keydown", ev => {
    eventPropagation(ev, "xKeydown", dataEventThis);
  });
  event.on("keyup", ev => {
    eventPropagation(ev, "xKeyup", dataEventThis);
  });
};
