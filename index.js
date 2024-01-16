let cropper;
window.addEventListener('load', () => {
  cropper = new Cropper({
    uniqueId: 'somethingUnique',
    container: document.getElementById('cropper-container'),
    canvas: {
      width: window.innerWidth,
      height: window.innerHeight * 0.75,
      background: '#2f323a',
      imgSrc: 'sample.jpg' // use the alternative "image" attribute to directly point to an image object
    },
    selector: {
      min: {
        width: 50,
        height: 50
      },
      mask: true
    },
    labels: {
      confirmCrop: 'Confirm Crop',
      cancelCrop: 'Cancel Crop'
    }
  });
  resizeCropper = () => {
    cropper.canvas.width = window.innerWidth;
    cropper.canvas.height = window.innerHeight * 0.75;
    cropper.loadImage();
    cropper.loadMirror();
    cropper.toggleSection('tools');
    cropper.toggleSelector(false);
  }
  window.addEventListener('resize', resizeCropper);
});
