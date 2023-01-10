const pg = document.getElementById("playground");

const alphabet = [
  "Aa",
  "Bb",
  "Cc",
  "Dd",
  "Ee",
  "Ff",
  "Gg",
  "Hh",
  "Ii",
  "Jj",
  "Kk",
  "Ll",
  "Mm",
  "Nn",
  "Oo",
  "Pp",
  "Qq",
  "Rr",
  "Ss",
  "Tt",
  "Uu",
  "Vv",
  "Ww",
  "Xx",
  "Yy",
  "Zz",
];

const fontSize = 50;

let placedLettters = new Set();

let speaking = false;

const speakWord = (letter, el) => {
  speaking = true;

  // Here we will call our audio file
  console.log(`Speaking:`, letter);

  el.style.color = `#ff0000`;
  el.style.fontSize = `${fontSize * 3}px`;
  el.style.zIndex = 10;
  el.style.webkitTextStroke = "2px black";
  el.style.background = "rgba(0,0,0,0.7)";
  el.style.webkitBoxShadow = `0px 0px 28px 30px rgba(0,0,0,0.7)`;
  el.style.boxShadow = `0px 0px 28px 30px rgba(0,0,0,0.7)`;

  const box = el.getBoundingClientRect();

  // If offscreen right or bottom, move element on screen
  if (box.right >= pg.offsetWidth) {
    el.style.left = `${pg.offsetWidth - el.offsetWidth}px`;
  }
  if (box.bottom >= pg.offsetHeight) {
    el.style.top = `${pg.offsetHeight - el.offsetHeight}px`;
  }

  window.setTimeout(() => {
    speaking = false;

    el.remove();
    placedLettters.delete(el);

    if (placedLettters.size === 0) console.log("Restart game");
  }, 1500);
};

alphabet.forEach((letter) => {
  const newLetter = document.createElement("h1");
  newLetter.innerText = letter;

  newLetter.value = letter.charAt(0).toLocaleLowerCase();
  newLetter.addEventListener("click", (e) => {
    if (speaking) return;
    speakWord(e.target.value, e.target);
  });

  pg.insertAdjacentElement("afterbegin", newLetter);

  const randomLoc = () => {
    let xloc = Math.floor(Math.random() * pg.offsetWidth);
    let yloc = Math.floor(Math.random() * pg.offsetHeight);

    return { xloc: xloc, yloc: yloc };
  };

  // We give up repositioning recursively after 100 recursions / failed
  // placement attempts within setRandomLoc() and checkIntersections()
  let recursions = 0;

  const setRandomLoc = () => {
    if (recursions >= 100) return;
    coords = randomLoc();
    newLetter.style.cssText = `font-size: ${fontSize}px; top: ${coords.yloc}px; left: ${coords.xloc}px`;

    if (
      coords.xloc + newLetter.offsetWidth >= pg.offsetWidth ||
      coords.yloc + newLetter.offsetWidth >= pg.offsetHeight
    ) {
      setRandomLoc();
      recursions++;
    }
  };
  setRandomLoc();

  const checkIntersections = () => {
    if (recursions >= 100) return;

    placedLettters.forEach((element) => {
      if (elementsIntersect(newLetter, element)) {
        setRandomLoc();
        checkIntersections();
        recursions++;
      }
    });
  };
  checkIntersections();

  placedLettters.add(newLetter);
});

// Thank you chatGPT >.>
function elementsIntersect(el1, el2) {
  // get bounding rectangles for both elements
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  // check if the rectangles intersect
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
