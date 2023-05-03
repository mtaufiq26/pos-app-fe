/**
 * 
 * @param {string} text 
 * @returns 
 */
export default function trimText (text) {
  return text.substring(0, 90) + (text.length > 89 ? "..." : "");
}