Simple no dependency image cropping & rotation tool.  
Requires static file server to load example index.html in a browser.  
Use `cropper.crop()` in browser console to trigger crop action.  
Use `cropper.rotate(1)` in browser console to rotate the current image by 90 degrees clockwise. Uses integers for rotation amount and direction. Positive numbers for clockwise & negative numbers for counter-clockwise rotation. `cropper.rotate(-2)` will rotate the image by 180 degrees counter-clockwise.  
Use `cropper.reset()` in browser console to reset changes and reload the original image.  
