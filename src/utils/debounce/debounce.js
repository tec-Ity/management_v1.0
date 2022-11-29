const debounce = (callback, ms) => {
  let timer = 0;
  return function (...args) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
};

export default debounce;
