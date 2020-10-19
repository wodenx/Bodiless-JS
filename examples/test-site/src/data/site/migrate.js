const fs = require('fs');
const files = fs.readdirSync('.');

files.forEach(file => {
  if (!file.startsWith('MainMenu')) return;
  if (file.endsWith('title$component$text.json')) {
    fs.renameSync(file, file.replace('title$component$text.json', 'title$text.json'));
  }
  if (file.endsWith('title$component.json')) {
    fs.renameSync(file, file.replace('title$component.json', 'title$link.json'));
  }
  if (file.endsWith('title.json')) {
    fs.writeFileSync(file, JSON.stringify({
      "component": "Link"
    }, null, 2));
    fs.renameSync(file, file.replace('title.json', 'title$link-toggle.json'));
  }
  if (file.endsWith('sublist.json')) {
    fs.writeFileSync(file.replace('sublist.json', 'cham-sublist.json'), JSON.stringify({
      "component": "SubMenu"
    }, null, 2));
  }
});