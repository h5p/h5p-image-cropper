let cropper;
window.addEventListener('load', (event) => {
  cropper = new Cropper({
    canvas: {
      id: 'canvas',
      width: 800,
      height: 400,
      image: 'sample.jpg'
    },
    selector: {
      id: 'selector',
      handles: {
        tl: 'tlHandle',
        br: 'brHandle'
      }
    }
  });
});
