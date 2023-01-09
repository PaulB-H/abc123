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

let placedLettters = [];

alphabet.forEach((letter) => {
  const newLetter = document.createElement("h1");
  newLetter.innerText = letter;
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

  placedLettters.push(newLetter);
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
