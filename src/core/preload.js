export const pageSizeFun = function (doc, win,widthNum,heightNum) {
  var docEl = doc.documentElement;
  var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
  var onResize = function () {
    var clientWidth = docEl.clientWidth;
    var clientHeight = docEl.clientHeight;
    var base;
    if (!clientWidth) return;

    var aspectRatio = clientWidth / clientHeight;
    if (aspectRatio > widthNum / heightNum) {
      docEl.style.fontSize = 100 * (clientHeight / heightNum) + 'px';
      base = 100 * (clientHeight / heightNum);
      win.appLeft = ((clientWidth - widthNum/100 * base) >> 1) + 'px';
      win.appTop = '0px';
    } else {
      docEl.style.fontSize = 100 * (clientWidth / widthNum) + 'px';
      base = 100 * (clientWidth / widthNum);
      win.appLeft = '0px';
      win.appTop = ((clientHeight - heightNum/100 * base) >> 1) + 'px';
    }
  };
  try {
    onResize();
  } catch (e) {
  }

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, onResize, false);
  doc.addEventListener('DOMContentLoaded', onResize, false);

};
