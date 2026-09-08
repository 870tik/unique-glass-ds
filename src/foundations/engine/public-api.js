  /* ---------- public API ---------- */
  window.LiquidGlass = {
    mode: mode,
    observer: function () { return observerInfo; },
    physique: function () { return physiqueInfo; },
    signals: function () { return signalsInfo; },
    enableTilt: function () { /* iOS: ユーザー操作の中から呼ぶこと */
      if (!tiltAttach) return Promise.resolve('off');
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        return DeviceOrientationEvent.requestPermission().then(function (s) {
          if (s === 'granted') tiltAttach();
          return s;
        });
      }
      tiltAttach();
      return Promise.resolve('granted');
    },
    reducedMotion: reduceMotion,
    reducedTransparency: reduceTransp,
    refresh: rebuildAll,
    lens: applyLens,
    gel: gel,
    light: light,
    nav: nav,
    modal: modal,
    menu: menu,
    select: select,
    command: command,
    toast: toast,
    tooltip: tooltip,
    switch: switchCtl,
    slider: slider,
    progress: progress,
    drawer: drawer,
    contextMenu: contextMenu,
    combobox: combobox,
    datepicker: datepicker,
    dropzone: dropzone,
    Spring: Spring
  };
})();
