import opentype from 'opentype.js';

async function testFetchFont() {
  try {
    const cssResponse = await fetch('https://fonts.googleapis.com/css?family=Caveat', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1'
      }
    });
    const css = await cssResponse.text();
    console.log(css);
    const urlMatch = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
    if (urlMatch) {
      console.log('Found TTF URL:', urlMatch[1]);
      const fontResponse = await fetch(urlMatch[1]);
      const fontBuffer = await fontResponse.arrayBuffer();
      const font = opentype.parse(fontBuffer);
      const path = font.getPath('Rudu', 0, 100, 72);
      console.log(path.toSVG());
    } else {
      console.log('No TTF URL found');
    }
  } catch(e) {
    console.error(e);
  }
}
testFetchFont();
