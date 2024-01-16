let cropper;
window.addEventListener('load', () => {
  this.cropper = new Cropper({
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
  this.resizeCropper = () => {
    this.cropper.canvas.width = window.innerWidth;
    this.cropper.canvas.height = window.innerHeight * 0.75;
    this.cropper.loadImage();
    this.cropper.loadMirror();
    this.cropper.toggleSection('tools');
    this.cropper.toggleSelector(false);
  }
  window.addEventListener('resize', this.resizeCropper);
});
