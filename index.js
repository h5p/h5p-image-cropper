let cropper;
window.addEventListener('load', (event) => {
  this.cropper = new Cropper({
    uniqueId: 'somethingUnique',
    container: document.getElementById('cropper-container'),
    canvas: {
      width: 800,
      height: 400,
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
});
