import noCover from '../images/no-cover.png'

export default {
  /**
   * Remove 00 char code from a string. That's strange behaviour came from aurora.js metadata.
   * @param {string} string string to check
   * @returns {string}
   */
  removeNonASCII: (string) => {
    return string.replace(/\x00/g, '');
  },

  getURLfromBlob(coverData) {
    if (coverData) {
      const blob = new Blob([coverData], {'type': 'image/png'});
      return URL.createObjectURL(blob);
    } else {
      return noCover;
    }
  }
}
