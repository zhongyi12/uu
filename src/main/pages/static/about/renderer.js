
const electron_1 = require('electron');

const isArray = a => !!a && (a.constructor === Array);

electron_1.ipcRenderer.on('about-window:info', (_, info) => {
  const app_name = electron_1.remote.app.getName();
  const open_home = () => electron_1.shell.openExternal(info.homepage);
  const content = info.use_inner_html ? 'innerHTML' : 'innerText';
  document.title = `About ${app_name}`;
  const title_elem = document.querySelector('.title');
  title_elem.innerText = `${app_name} ${electron_1.remote.app.getVersion()}`;
  title_elem.addEventListener('click', open_home);
  if (info.homepage) {
    document
      .querySelector('.logo');
      // .addEventListener('click', open_home);
  }
  const copyright_elem = document.querySelector('.copyright');
  if (info.copyright) {
    copyright_elem[content] = info.copyright;
  }
  else if (info.license) {
    copyright_elem[content] = `Distrubuted under ${info.license} license.`;
  }
  const icon_elem = document.getElementById('app-icon');
  icon_elem.src = info.icon_path;
  if (info.description) {
    const desc_elem = document.querySelector('.description');
    desc_elem[content] = info.description;
  }
  if (info.bug_report_url) {
    const bug_report = document.querySelector('.bug-report-link');
    bug_report.innerText = 'found bug?';
    bug_report.addEventListener('click', (e) => {
      e.preventDefault();
      electron_1.shell.openExternal(info.bug_report_url);
    });
  }
  if (info.css_path) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = info.css_path;
    document.head.appendChild(link);
  }
  if (info.adjust_window_size) {
    const height = document.body.scrollHeight;
    const width = document.body.scrollWidth;
    const win = electron_1.remote.getCurrentWindow();
    if (height > 0 && width > 0) {
      win.setContentSize(width, height + 40);
    }
  }

  if (info.versions) {
    const versions = document.querySelector('.versions');
    const vs = info.versions;
    for (const ver of vs) {
      const tr = document.createElement('tr');
      const version_td = document.createElement('td');
      if (typeof ver === 'string') {
        version_td.innerText = ver;
        version_td.setAttribute('colspan', '2');
        version_td.setAttribute('class', 'title-td');
      }
      else if (isArray(ver)) {
        const name_td = document.createElement('td');
        name_td.innerText = ver[0];
        tr.appendChild(name_td);
        version_td.innerText = `  ${ver[1]}`;
      }
      tr.appendChild(version_td);
      versions.appendChild(tr);
    }
  }
});

