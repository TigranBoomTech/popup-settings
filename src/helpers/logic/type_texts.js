const typeWriter = (txt, i) => {
  if (i < txt.length) {
    document.getElementsByClassName("bma_rule_text")[0].innerHTML +=
      txt.charAt(i);
    i++;
    setTimeout(function () {
      typeWriter(txt, i);
    }, 50);
  }
};

const type_texts = (txt) => {
  let textIndex = document.getElementsByClassName("bma_rule_text")[0]
    ? document.getElementsByClassName("bma_rule_text")[0].innerHTML.length
    : 0;
  typeWriter(txt, textIndex);
};

export default type_texts;
