import opentype from 'opentype.js';

const names = [
  'Caveat', 'Dancing Script', 'Pacifico', 'Satisfy', 'Sacramento',
  'Great Vibes', 'Allura', 'Parisienne', 'Yellowtail', 'Alex Brush'
];

async function testFetchFont() {
  const urls: string[] = [];
  try {
    for (const name of names) {
      const parsedName = name.replace(/ /g, '+');
      const cssResponse = await fetch('https://fonts.googleapis.com/css?family=' + parsedName, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1'
        }
      });
      const css = await cssResponse.text();
      const urlMatch = css.match(/url\((https:\/\/[^)]+\.woff)\)/);
      if (urlMatch) {
         urls.push(urlMatch[1]);
      } else {
         console.log("Not found for", name);
      }
    }
    console.log(urls);
  } catch(e) {
    console.error(e);
  }
}
testFetchFont();
