function Cropper(options) {
  this.selector = document.getElementById(options.selector.id);
  this.canvas = document.getElementById(options.canvas.id);
  this.handles = {
    tl: document.getElementById(options.selector.handles.tl),
    br: document.getElementById(options.selector.handles.br)
  }
  this.margins = {
    left: 0,
    top: 0
  }
  this.canvas.width = options.canvas.width;
  this.canvas.height = options.canvas.height;
  this.context = this.canvas.getContext('2d');
  this.mirror = document.createElement('canvas');
  this.mirrorContext = this.mirror.getContext('2d');
  const handleMove = () => {
    const onPointerDown = (event) => {
      this.pointerOffset.x = event.clientX - this.selector.offsetLeft;
      this.pointerOffset.y = event.clientY - this.selector.offsetTop;
      window.onpointerup = onPointerUp;
      window.onpointermove = onPointerMove;
    }
    const onPointerMove = (event) => {
      let x = event.clientX - this.pointerOffset.x;
      let y = event.clientY - this.pointerOffset.y;
      if (x < this.canvas.offsetLeft) {
        x = this.canvas.offsetLeft;
      }
      if (x > this.canvas.offsetLeft + this.canvas.offsetWidth - this.selector.offsetWidth) {
        x = this.canvas.offsetLeft + this.canvas.offsetWidth - this.selector.offsetWidth;
      }
      if (y < this.canvas.offsetTop) {
        y = this.canvas.offsetTop;
      }
      if (y > this.canvas.offsetTop + this.canvas.offsetHeight - this.selector.offsetHeight) {
        y = this.canvas.offsetTop + this.canvas.offsetHeight - this.selector.offsetHeight;
      }
      this.selector.style.left = x;
      this.selector.style.top = y;
    }
    const onPointerUp = (event) => {
      window.onpointerup = undefined;
      window.onpointermove = undefined;
    }
    this.selector.onpointerdown = onPointerDown;
  }
  const handleResize = (type) => {
    if (!this.handles[type]) {
      return;
    }
    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.onpointerup = onPointerUp;
      window.onpointermove = onPointerMove;
    }
    const onPointerMove = (event) => {
      let width;
      let height;
      switch (type) {
        case 'tl':
          const xSpan = this.selector.offsetLeft + this.selector.offsetWidth;
          const ySpan = this.selector.offsetTop + this.selector.offsetHeight;
          let left = event.pageX - this.canvas.parentElement.offsetLeft;
          let top = event.pageY - this.canvas.parentElement.offsetTop;
          if (left < 0) {
            left = 0;
          }
          if (left > xSpan) {
            left = xSpan;
          }
          if (top < 0) {
            top = 0;
          }
          if (top > ySpan) {
            top = ySpan;
          }
          width = xSpan - left;
          height = ySpan - top;
          this.selector.style.left = left;
          this.selector.style.top = top;
          this.selector.style.width = width;
          this.selector.style.height = height;
          break;
        case 'br':
          const maxWidth = this.canvas.offsetWidth - this.selector.offsetLeft;
          const maxHeight = this.canvas.offsetHeight - this.selector.offsetTop;
          width = event.pageX - this.canvas.parentElement.offsetLeft - this.selector.offsetLeft;
          height = event.pageY - this.canvas.parentElement.offsetTop - this.selector.offsetTop;
          if (width < 0) {
            width = 0;
          }
          if (this.selector.offsetLeft + width > this.canvas.offsetWidth) {
            width = maxWidth;
          }
          if (height < 0) {
            height = 0;
          }
          if (this.selector.offsetTop + height > this.canvas.offsetHeight) {
            height = maxHeight;
          }
          this.selector.style.width = width;
          this.selector.style.height = height;
          break;
      }
    }
    const onPointerUp = (event) => {
      window.onpointerup = undefined;
      window.onpointermove = undefined;
    }
    this.handles[type].onpointerdown = onPointerDown;
  }
  this.fit = (image, canvas) => {
    if (!canvas) {
      canvas = this.canvas;
    }
    let width;
    let height;
    if (image.width >= image.height) {
      width = canvas.width;
      height = image.height / image.width * width;
      if (height > canvas.height) {
        height = canvas.height;
        width = image.width / image.height * height;
      }
    }
    else {
      height = canvas.height;
      width = image.width / image.height * height;
      if (width > canvas.width) {
        width = canvas.width;
        height = image.height / image.width * width;
      }
    }
    return { width, height };
  }
  this.loadImage = () => {
    console.log('image loaded');
    const { width, height } = this.fit(this.image);
    this.margins.left = (this.canvas.width - width) / 2;
    this.margins.top = (this.canvas.height - height) / 2;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.image, this.margins.left, this.margins.top, width, height);
    this.resetSelector();
    this.image.onload = undefined;
  }
  this.image = new Image();
  this.image.onload = this.loadImage;
  this.pointerOffset = {};
  this.image.src = options.canvas.image;
  handleMove();
  handleResize('tl');
  handleResize('br');
  this.crop = () => {
    const maxSelectedWidth = this.canvas.width - this.margins.left * 2;
    const maxSelectedHeight = this.canvas.height - this.margins.top * 2;
    let selectedX = this.selector.offsetLeft - this.margins.left;
    let selectedY = this.selector.offsetTop - this.margins.top;
    let selectedWidth = this.selector.offsetWidth;
    let selectedHeight = this.selector.offsetHeight;
    if (selectedX < 0) {
      selectedWidth += selectedX;
      selectedX = 0;
    }
    if (selectedY < 0) {
      selectedHeight += selectedY;
      selectedY = 0;
    }
    if (selectedWidth > maxSelectedWidth) {
      selectedWidth = maxSelectedWidth;
    }
    if (selectedHeight > maxSelectedHeight) {
      selectedHeight = maxSelectedHeight;
    }
    const ICRatio = this.image.width / (this.canvas.width - this.margins.left * 2);
    let sx = ICRatio * selectedX;
    let sy = ICRatio * selectedY;
    let sw = ICRatio * selectedWidth;
    let sh = ICRatio * selectedHeight;
    const { width, height } = this.fit({ width: sw, height: sh });
    const marginLeft = (this.canvas.width - width) / 2;
    const marginTop = (this.canvas.height - height) / 2;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.image, sx, sy, sw, sh, marginLeft, marginTop, width, height);
    this.mirror.width = width;
    this.mirror.height = height;
    this.mirrorContext.drawImage(this.image, sx, sy, sw, sh, 0, 0, width, height);
    this.image = new Image();
    this.image.src = this.mirror.toDataURL('image/png', 1);
    this.image.onload = this.loadImage;
  }
  this.rotate = (rotation) => {
    rotation %= 4;
    if (rotation % 2) {
      this.mirror.width = this.image.height;
      this.mirror.height = this.image.width;
    }
    else {
      this.mirror.width = this.image.width;
      this.mirror.height = this.image.height;
    }
    this.mirrorContext.translate(this.mirror.width / 2, this.mirror.height / 2);
    this.mirrorContext.rotate(90 * rotation * Math.PI / 180);
    this.mirrorContext.translate(-this.image.width / 2, -this.image.height / 2);
    this.mirrorContext.drawImage(this.image, 0, 0);
    this.image = new Image();
    this.image.src = this.mirror.toDataURL('image/png', 1);
    this.image.onload = this.loadImage;
  }
  this.resetSelector = () => {
    this.selector.style.width = this.canvas.width / 2;
    this.selector.style.height = this.canvas.height / 2;
    this.selector.style.left = this.canvas.offsetLeft + this.canvas.width / 4;
    this.selector.style.top = this.canvas.offsetTop + this.canvas.height / 4;
  }
  this.reset = () => {
    this.image.onload = this.loadImage;
    this.image.src = options.canvas.image;
  }
}
