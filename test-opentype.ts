import opentype from 'opentype.js';

async function generateSvgPath(url: string, text: string): Promise<string> {
  const maxSize = 450;
  const maxHeight = 150;
  
  try {
    const fontResponse = await fetch(url);
    if (!fontResponse.ok) {
       console.log("NOT OK", fontResponse.status);
       return '';
    }
    const fontBuffer = await fontResponse.arrayBuffer();
    const font = opentype.parse(fontBuffer);
    
    // Find optimal font size
    let fontSize = 120;
    let path = font.getPath(text, 0, 0, fontSize);
    let bbox = path.getBoundingBox();
    let width = bbox.x2 - bbox.x1;
    let height = bbox.y2 - bbox.y1;
    
    if (width > maxSize || height > maxHeight) {
       const scale = Math.min(maxSize / width, maxHeight / height);
       fontSize = fontSize * scale;
       path = font.getPath(text, 0, 0, fontSize);
       bbox = path.getBoundingBox();
       width = bbox.x2 - bbox.x1;
       height = bbox.y2 - bbox.y1;
    }

    // Center it in a 500x200 canvas
    const startX = (500 - width) / 2 - bbox.x1;
    const startY = (200 - height) / 2 - bbox.y1;
    const finalPath = font.getPath(text, startX, startY, fontSize);
    
    // Custom serialization to avoid NaN issues in opentype.js
    return finalPath.commands.map(cmd => {
        if (cmd.type === 'M') return 'M' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'L') return 'L' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'Q') return 'Q' + cmd.x1 + ',' + cmd.y1 + ' ' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'C') return 'C' + cmd.x1 + ',' + cmd.y1 + ' ' + cmd.x2 + ',' + cmd.y2 + ' ' + cmd.x + ',' + cmd.y;
        if (cmd.type === 'Z') return 'Z';
        return '';
    }).join(' ');
  } catch (e) {
    console.error('Font fetch error', e);
    return '';
  }
}

generateSvgPath('https://fonts.gstatic.com/s/caveat/v23/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpZw.woff', 'Rudu').then(console.log);
