let h1, h, s1, s, b1, b, i, j,h2;
let p = 1;
let mv = 15;
let colmv = 5;
let alph = 5;
let maxVary;
let colorData;
let treePlace;
let treeNum;
let img= [];


function preload() {
  colorData = loadJSON('colors.json');

  // 나무 이미지
  // tree assets: https://www.onlygfx.com/17-dead-tree-silhouette-png-transparent/
  // default: 39
  for (i = 0; i < 39; i++) {
    img[i] = loadImage(`assets/dead-tree-silhouette-${i}.png`);  //  나무 - 블개. 현재 39개
    //img[i] = loadImage(`assets/dead-tree-silhouette-w-${i}.png`);  // 나무 - 흰색. 현재 4개
  }
}

function setup() {
  //createCanvas(1040, 1040);
  createCanvas(windowWidth, windowHeight);

  newArt();
  setInterval(newArt, 60000); // generate new art every 3 seconds
}

function newArt() {
  colorMode(HSB, 360, 120, 100, 255);
  noStroke();
  maxVary = random(5,15); // 20
  selectRandomPalette();
  numb = (width * height) / 25; //number of watercolor drawings needed based on square inches
  background(h1, s1-10, b1-30);
  fillBackground();
  filter(BLUR,8); 
  addPaperTexture();

  // 나무 이미지
  //let selectedTree = Math.floor(random(38));  // default: 38
  let selectedTree = random(img);
  console.log("treenum: ", selectedTree);
  //treePlace = random(2);
  //img[treeNum].resize(0, (height / 1.5)); // * 2

  // 나무 이미지 크기 조정
  let treeScale = random(0.4, 0.5);  // 0.666: h*(2/3) 화면 대비 나무는 2/3 높이 기준
  let ratioTree = selectedTree.width / selectedTree.height;
  console.log("imgWidth: ", selectedTree.width, "imgHeight: ", selectedTree.height, "ratioTree: ", ratioTree);
  let imgHeight = height * treeScale;
  let imgWidth = imgHeight * ratioTree;

  console.log("imgWidth: ", imgWidth, "imgHeight: ", imgHeight, "ratioTree: ", ratioTree);

  let posX = random(0, width - imgWidth)  // 임의의 위치
  let posY = height - imgHeight + 35; // 나무의 높이를 아래로 35px 내림. 밑면이 바닥에 닿도록.
  image(selectedTree, posX, posY, imgWidth, imgHeight);
  //drawTree(selectedTree);
}

function drawTree(selectedTree) {
  //image(selectedTree, posX, posY, imgWidth, imgHeight);
  // if (treePlace < 1) {
  //   image(img[treeNum], width/2, height/3 + height*0.02);
  // } else {
  //   image(img[treeNum], 0, height/3 + height*0.02);
  // }
}

function selectRandomPalette() {
  let palettes = Object.values(colorData);
  let selectedPalette = random(palettes);
  console.log('Selected Palette:', selectedPalette);
  let randomColor = random(selectedPalette);
  let rgb = hexToRgb(randomColor);
  h1 = h = rgbToHsb(rgb.r, rgb.g, rgb.b).h;
  hMax = h1 + maxVary;
  hMin = h1 - maxVary;
  s1 = s = 90;
  sMax = 100;
  sMin = 40;
  b1 = b = 70;
  bMax = 70;
  bMin = 30;
  i = random(width);
  j = random(height);
}

function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return { r, g, b };
}

function rgbToHsb(r, g, b) {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;
  let h, s, v = max;

  if (delta === 0) h = 0;
  else if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  s = max === 0 ? 0 : delta / max;

  return { h: Math.round(h), s: Math.round(s * 100), b: Math.round((v / 255) * 100) };
}

function fillBackground() {
    for (q = 0; q < numb; q++) {
      i = i + random(-mv, mv);
      j = j + random(-mv, mv);
      h = h + random(-colmv, colmv);
      s = s + random(-colmv*2, colmv*2);
      b = b + random(-colmv*2, colmv*2);
      if (i < 0) {
        i = width;
      }
      else if (i > width) {
        i = 0;
      }
      if (j < 0) {
        j = height;
      }
      else if (j > height) {
        j = 0;
      }
      if (h > hMax) {
        h = hMax;
      }
      else if (h < hMin) {
        h = hMin;
      }
      h2=h;
      if (h > 360) {
        h2 = h - 360;
      }
      else if (h < 0) {
        h2 = h + 360;
      }
      if (s > sMax) {
        s = sMax;
      }
      if (s < sMin) {
        s = sMin;
      }
      if (b > bMax) {
        b = bMax;
      }
      else if (b < bMin) {
        b = bMin;
      }
      for (let layer = 5; layer > 0; layer--) {
        let layerAlpha = alph * (layer / 5);
        let layerSize = map(layer, 5, 0, 50, 10);
        fill(h2, s, b, layerAlpha);
        push();
        translate(i, j);
        rotate(random(PI * 2));
        beginShape();
        for (m = 0; m < PI * 2; m += 1) {
          let r = random(layerSize * 0.8, layerSize);
          let x = cos(m) * r;
          let y = sin(m) * r;
          vertex(x, y);
        }
        endShape(CLOSE);
        pop();
      }
    }
}

function addPaperTexture(){
  noFill();
  let textureNum = width * height / 50;
  for(let t = 0; t < textureNum; t++){
    stroke(random(100,150), random(100,150), random(100,150), 6);
    let x = random(-width * 0.2, width * 1.2);
    let y = random(-height * 0.2, height * 1.2);
    push();
      translate(x, y);
      let mul = random(1, 10);
      strokeWeight(2*mul);  // 3
      point(0, 0);
      strokeWeight(1*mul*0.5);
      rotate(random(PI * 2));
      curve(random(60, 220), 0, 0, random(-50, 50), random(-50, 50), random(60, 120), random(60, 120), random(60, 220));
    pop();
  }

  // Additional textures for variation
  // for(let k = 0; k < textureNum / 5; k++){
  //   stroke(random(50, 200), random(50, 200), random(50, 200), 15);
  //   let startX = random(width);
  //   let startY = random(height);
  //   let endX = startX + random(-50, 50);
  //   let endY = startY + random(-50, 50);
  //   strokeWeight(random(0.5, 2));
  //   line(startX, startY, endX, endY);
  // }
}

function keyPressed() {
    if (key === 's' || key === 'S') {
      let timestamp = nf(year(), 2) + nf(month(), 2) + nf(day(), 2) + "-" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
      saveCanvas("output/03-paper-texture-v1-" + timestamp, "jpg");
    }
}
