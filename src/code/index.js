export function mainFun(pixiObjs) {
    (function () {
        console.log(pixiObjs);
    }.bind(pixiObjs))();
};