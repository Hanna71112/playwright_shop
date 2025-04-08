class TextEditor {
  static changePriceFormatToText(price) {
    return price.replace(/\D/g, '').trim();
  }
}

export default TextEditor;
