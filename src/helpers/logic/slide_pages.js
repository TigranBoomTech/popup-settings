const slide_pages = (direction, idName) => {
  if (document.getElementById(idName)) {
    document.getElementById(idName).classList.remove("slideToLeft");
    document.getElementById(idName).classList.remove("slideToRight");
    void document.getElementById(idName).offsetWidth;
    document.getElementById(idName).classList.add(direction);
  }
};

export default slide_pages;
