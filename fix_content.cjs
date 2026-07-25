const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Replace branding
    content = content.replace(/HarshSwati/g, 'HarshBhati');

    if (!content.includes('import { Link }')) {
        content = "import { Link } from 'react-router-dom';\n" + content;
    }

    // Replace links
    content = content.replace(/<a([^>]+)href="#(training)?"([^>]*)>Training<\/a>/g, '<Link$1to="/"$3>Training</Link>');
    content = content.replace(/<a([^>]+)href="#(benefits)?"([^>]*)>Benefits<\/a>/g, '<Link$1to="/benefits"$3>Benefits</Link>');
    content = content.replace(/<a([^>]+)href="#(contact)?"([^>]*)>Contact<\/a>/g, '<Link$1to="/contact"$3>Contact</Link>');
    content = content.replace(/<a([^>]+)href="#"([^>]*)>HarshBhati<\/a>/g, '<Link$1to="/"$3>HarshBhati</Link>');

    fs.writeFileSync(path.join(dir, file), content);
});

console.log('Successfully completed refactoring');
