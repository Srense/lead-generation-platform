const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Replace header/nav
    content = content.replace(/<(header|nav)[\s\S]*?<\/(header|nav)>/, '<Navbar />');

    // Replace footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/, '<Footer />');

    // Check if we already imported Navbar to prevent duplicate injection
    if (!content.includes('import Navbar')) {
        content = "import Navbar from '../components/Navbar';\n" + "import Footer from '../components/Footer';\n" + content;
    }

    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Successfully refactored components');
