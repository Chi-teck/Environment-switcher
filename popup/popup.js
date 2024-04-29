async function getCurrentUrl() {
    const queryOptions = {active: true, currentWindow: true};
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
}

function clickHandler(event) {
    const options = {url:  event.target.dataset.url};
    event.ctrlKey || event.type === 'auxclick' ?
        chrome.tabs.create(options) :
        chrome.tabs.update(null, options);
    window.close();
}

function createItem(label, url, active) {
    const li = document.createElement('li');
    const button = document.createElement('button')
    button.innerHTML = label;
    button.dataset.url = url;
    button.addEventListener('click', clickHandler)
    button.addEventListener('auxclick', clickHandler)
    li.appendChild(button);
    if (active) {
        li.classList.add('active');
    }
    return li;
}

async function init(data) {
    const projects = data.projects || [];

    const findProject = function (url) {
        const checkEnvironment = environment => url.origin === environment.baseUrl;
        const checkProject = project => project.environments.find(checkEnvironment);
        return projects.find(checkProject);
    }

    const currentUrl = new URL(await getCurrentUrl());
    const project = findProject(currentUrl);

    const list = document.createElement('ul');
    list.setAttribute('id', 'environments');

    if (project) {
        const addEnvironmentItem = function (environment) {
            if (environment.status) {
                const item = createItem(
                    environment.name ,
                    environment.baseUrl +  currentUrl.pathname,
                    currentUrl.origin === environment.baseUrl,
                );
                list.appendChild(item);
            }
        }
        project.environments.forEach(addEnvironmentItem);
    }

    let path = 'options/index.html';
    if (project) {
       path += '#/project/' + project.id
    }
    const item = createItem('Options', chrome.runtime.getURL(path), false)
    list.appendChild(item).classList.add('options')
    document.body.appendChild(list);
}

chrome.storage.sync.get().then(init);
