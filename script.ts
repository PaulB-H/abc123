const pg = document.getElementById("playground") as HTMLDivElement;

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const fontSize = 50;

let placedLetters = new Set<HTMLHeadingElement>();

let speaking = false;

const speakWord = (el: HTMLHeadingElement): void => {
  speaking = true;

  // Here we will call our audio file
  // console.log(`Speaking:`, letter);

  el.style.color = `#ff0000`;
  el.style.fontSize = `${fontSize * 3}px`;
  el.style.zIndex = "10";
  el.style.webkitTextStroke = "2px black";
  el.style.background = "rgba(0,0,0,0.7)";
  el.style.webkitBoxShadow = `0px 0px 28px 30px rgba(0,0,0,0.7)`;
  el.style.boxShadow = `0px 0px 28px 30px rgba(0,0,0,0.7)`;

  const elRect = el.getBoundingClientRect();

  // If offscreen right or bottom, move element on screen
  if (elRect.right >= pg.offsetWidth) {
    el.style.left = `${pg.offsetWidth - el.offsetWidth}px`;
  }
  if (elRect.bottom >= pg.offsetHeight) {
    el.style.top = `${pg.offsetHeight - el.offsetHeight}px`;
  }

  window.setTimeout((): void => {
    speaking = false;

    el.remove();
    placedLetters.delete(el);

    if (placedLetters.size === 0) setupGame();
  }, 1500);
};

// Thank you chatGPT >.>
const elementsIntersect = (
  el1: HTMLHeadingElement,
  el2: HTMLHeadingElement
): boolean => {
  // get bounding rectangles for both elements
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  // check if the rectangles intersect
  // if ALL the the values are true, return true
  // else if one is false return false
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
};

const setupGame = (): void => {
  placedLetters.clear();

  alphabet.forEach((letter) => {
    const newLetter = document.createElement("h1");
    newLetter.innerText = letter;

    newLetter.addEventListener("touchstart", (): void => {
      if (speaking) return;

      speakWord(newLetter);
    });
    newLetter.addEventListener("click", (): void => {
      if (speaking) return;

      speakWord(newLetter);
    });

    pg.insertAdjacentElement("afterbegin", newLetter);

    interface coords {
      xloc: number;
      yloc: number;
    }
    const randomLoc = (): coords => {
      let xloc = Math.floor(Math.random() * pg.offsetWidth);
      let yloc = Math.floor(Math.random() * pg.offsetHeight);

      return { xloc: xloc, yloc: yloc };
    };

    // We give up repositioning recursively after 100 recursions / failed
    // placement attempts within setRandomLoc() and checkIntersections()
    let recursions = 0;

    const setRandomLoc = (): void => {
      if (recursions >= 100) return;
      const coords = randomLoc();
      newLetter.style.cssText = `font-size: ${fontSize}px; top: ${coords.yloc}px; left: ${coords.xloc}px`;

      if (
        coords.xloc + newLetter.offsetWidth >= pg.offsetWidth ||
        coords.yloc + newLetter.offsetHeight >= pg.offsetHeight
      ) {
        setRandomLoc();
        recursions++;
      }
    };
    setRandomLoc();

    const checkIntersections = (): void => {
      if (recursions >= 100) return;

      placedLetters.forEach((element: HTMLHeadingElement) => {
        if (elementsIntersect(newLetter, element)) {
          setRandomLoc();
          checkIntersections();
          recursions++;
        }
      });
    };
    checkIntersections();

    placedLetters.add(newLetter);
  });
};

setupGame();

// Using this to disable pinch to zoom...
pg.addEventListener("touchstart", (e) => e.preventDefault(), false);
