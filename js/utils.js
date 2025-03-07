// utils.js

function fixSingleImagePath(url) {
  if (!url.includes('/images/')) return url; 
  let replaced = url.replace(/.*\/images\//, 'https://wiki.pokexgames.com/images/');
  const missingImages = [];
  const fileName = replaced.split('/').pop();
  if (missingImages.includes(fileName)) {
    replaced = 'https://wiki.pokexgames.com/images/4/49/NotFound.png';
  }
  return replaced;
}

function fixImagePaths(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('img').forEach(img => {
    img.src = fixSingleImagePath(img.src);
  });
  return div.innerHTML;
}

window.fixSingleImagePath = fixSingleImagePath;
window.fixImagePaths = fixImagePaths;
