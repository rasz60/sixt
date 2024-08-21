export default {
  handleScroll() {
    var scroll = document.scrollingElement.scrollTop;
    this.scrolled = scroll <= 0;

    /*
        좌측 메뉴 이동 로직 : f/o
        var target1 = document.querySelector("#menuSection");
  
        if (target1 != null) {
          target1.style.top = scroll + "px";
        }
        */

    var dial = document.querySelector("#dial");
    if (dial != null) {
      dial.style.marginTop = scroll > 0 ? "92vh" : "0";
      dial.style.top = scroll + "px";
    }
  },
  goTop() {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  },
  fnSendMessage() {
    this.dropMenu = !this.dropMenu;
  },
};
