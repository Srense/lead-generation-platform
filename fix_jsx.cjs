const fs = require('fs');
const path = require('path');

const fixFile = (fileName) => {
    const file = path.join(__dirname, 'src', 'pages', fileName);
    let content = fs.readFileSync(file, 'utf8');

    // For ContactUs and Success, find `<Navbar />` and wipe everything until the immediate `</header>`
    content = content.replace(/<Navbar \/>[\s\S]*?<\/header>/, '<Navbar />');

    fs.writeFileSync(file, content);
};

fixFile('ContactUs.jsx');
fixFile('Success.jsx');

console.log('Fixed extraneous header elements.');
