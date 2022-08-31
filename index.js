const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const previewImg = document.querySelector(".preview-img img");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterSlider = document.querySelector(".slider input");
const filterValue = document.querySelector(".filter-info .value");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.querySelector(".reset-filter");

let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0";

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%)  invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0];

  if (!file) {
    return;
  }
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

const updateFilter = () => {
  filterValue.textContent = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  }

  if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  }

  if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  }

  if (selectedFilter.id === "grayscale") {
    grayscale = filterSlider.value;
  }

  applyFilters();
};

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.clientWidth;
  canvas.height = previewImg.clientHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%)  invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); //translate canvas from center
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);

  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.textContent = option.textContent;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterSlider.textContent = `${brightness}%`;
    }

    if (option.id === "saturation") {
      filterSlider.max = "200";

      filterSlider.value = saturation;
      filterSlider.textContent = `${saturation}%`;
    }
    if (option.id === "inversion") {
      filterSlider.max = "100";

      filterSlider.value = inversion;
      filterSlider.textContent = `${inversion}%`;
    }
    if (option.id === "grayscale") {
      filterSlider.max = "100";

      filterSlider.value = grayscale;
      filterSlider.textContent = `${grayscale}%`;
    }
  });
});

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    }
    if (option.id === "right") {
      rotate += 90;
    }
    if (option.id === "vertical") {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    }

    applyFilters();
  });
});

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
