// same escaping as EJS <%= %>: null/undefined render as empty
const MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&#34;", "'": "&#39;" };

module.exports = value => (value == null ? "" : String(value).replace(/[&<>"']/g, c => MAP[c]));
