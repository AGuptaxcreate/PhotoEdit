const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image = new Image();
let currentRotation = 0;
let flipX = false;
let filters = {
  brightness: 100,
  contrast: 100,
  saturation: 100
};

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      resetTransforms();
      drawImage();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function updateFilter(id) {
  filters[id] = document.getElementById(id).value;
  drawImage();
}

['brightness', 'contrast', 'saturation'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => updateFilter(id));
});

function drawImage() {
  if (!image.src) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply filters
  ctx.filter = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturation}%)
  `;

  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((currentRotation * Math.PI) / 180);
  ctx.scale(flipX ? -1 : 1, 1);

  // Adjust coordinates based on rotation
  if (currentRotation % 180 === 0) {
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2);
  } else {
    ctx.drawImage(image, -canvas.height / 2, -canvas.width / 2);
  }

  ctx.restore();
}

function rotate() {
  currentRotation = (currentRotation + 90) % 360;

  // Swap canvas dimensions on 90/270 rotation
  if (currentRotation % 180 !== 0) {
    [canvas.width, canvas.height] = [image.height, image.width];
  } else {
    [canvas.width, canvas.height] = [image.width, image.height];
  }

  drawImage();
}

function flip() {
  flipX = !flipX;
  drawImage();
}

function downloadImage() {
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL();
  link.click();
}

function resetTransforms() {
  currentRotation = 0;
  flipX = false;
  filters = { brightness: 100, contrast: 100, saturation: 100 };
  document.getElementById('brightness').value = 100;
  document.getElementById('contrast').value = 100;
  document.getElementById('saturation').value = 100;
}
