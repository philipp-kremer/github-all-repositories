// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.

/*
    GitHub Configuration

    Configure your github credentials
*/

// Credentials
const GITHUB_USERNAME = '';
const API_KEY = '';

function colorConfig() {
    const tintLogo = false;
    const tintColor = new Color('#FC6D26');

    // dark mode
    const darkBackgroud = new Color('#1A1B1E');
    const darkHeader = new Color('#2A2B30');
    const darkText = new Color('#E3E3E3');

    // light mode
    const lightBackgroud = new Color('#FFFFFF');
    const lightHeader = new Color('');
    const lightText = new Color('#000000');

    // extra
    const textError = new Color('#ED4337');

    return {
        bgColor: Color.dynamic(lightBackgroud, darkBackgroud),
        bgHeaderColor: Color.dynamic(lightHeader, darkHeader),
        textColor: Color.dynamic(lightText, darkText),
        textError: textError,
        tintColor: tintColor,
        tintLogo: tintLogo,
    };
}

const oWidget = new ListWidget();

if (config.runsInWidget) {
    if (config.widgetFamily == 'small') {
        onWidget = await createSmallWidget();
    }
    else if (config.widgetFamily == 'medium') {
        onWidget = await createMediumWidget();
    } else {
        onWidget = await createLargeWidget();
    }
    Script.setWidget(onWidget);
} else {
    onWidget = await createSmallWidget();
    onWidget.presentSmall();
    onWidget = await createMediumWidget();
    onWidget.presentMedium();
    onWidget = await createLargeWidget();
    onWidget.presentLarge();
}

async function createWidgetHeader(oWidget) {
    const colors = colorConfig();
    const gitHubLogo = await getImage('github-logo');

    const header = oWidget.addStack();

    const text = header.addText('Repositories');
    text.font = Font.lightSystemFont(16);
    text.textColor = colors.textColor;

    header.addSpacer();
    const logoImage = header.addImage(gitHubLogo);
    logoImage.imageSize = new Size(20, 20);
}

/**
 * Creates small sized widget.
 *
 * @return {ListWidget}
 */
async function createSmallWidget() {
    // Initialize widget
    const colors = colorConfig();

    oWidget.backgroundColor = colors.bgColor;

    await createWidgetHeader(oWidget);

    oWidget.addSpacer();

    await addDefaultWidgetData(oWidget);

    return oWidget;
}

/**
 * Creates medium sized widget.
 *
 * @return {ListWidget}
 */
async function createMediumWidget() {
    // Initialize widget
    const colors = colorConfig();

    oWidget.backgroundColor = colors.bgColor;

    await createWidgetHeader(oWidget);

    oWidget.addSpacer();

    await addDefaultWidgetData(oWidget);

    return oWidget;
}

/**
 * Creates large sized widget.
 *
 * @return {ListWidget}
 */
async function createLargeWidget() {
    // Initialize widget
    const colors = colorConfig();

    oWidget.backgroundColor = colors.bgColor;

    await createWidgetHeader(oWidget);

    oWidget.addSpacer();

    await addDefaultWidgetData(oWidget);

    return oWidget;
}

/**
 *
 * @params {ListWidget} oWidget
 */
async function addDefaultWidgetData(oWidget) {
    const colors = colorConfig();

    const data = await fetchData();
    const oUpperTextStack = oWidget.addStack();

    if (data.count >= 0) {
        oUpperTextStack.layoutVertically();
        oUpperTextStack.spacing = 10;
        addRepoList(data.response, oWidget);
    } else {
        oUpperTextStack.addText('Oops. Something went wrong!');
        oUpperTextStack.font = Font.boldSystemFont(10);
        oUpperTextStack.textColor = colors.textError;
    }
}



async function fetchData() {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    const request = new Request(url);
    request.headers = { "Authorization": API_KEY }

    let response = await request.loadJSON()

    const repoCount = response.length;

    return {
        count: repoCount,
        response
    }
}

function addRepoList(response, oWidget) {
    const colors = colorConfig();

    const oUpperTextStack = oWidget.addStack();
    oUpperTextStack.layoutVertically();

    response.map(repo => {
        const header = oUpperTextStack.addText(repo.name);
        header.font = Font.boldSystemFont(10);
        header.textColor = colors.textColor;

        const description = oUpperTextStack.addText(repo.description || '');
        description.font = Font.lightSystemFont(5);
        description.textColor = colors.textColor;
    });

    oUpperTextStack.addSpacer();
}

async function getImage(name) {
    let data = '';
    switch (name) {
        case 'github-logo':
            data = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RERCMUIwOUY4NkNFMTFFM0FBNTJFRTMzNTJEMUJDNDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RERCMUIwOUU4NkNFMTFFM0FBNTJFRTMzNTJEMUJDNDYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MTc4QTJBOTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1MTc4QTJCOTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jUqS1wAAApVJREFUeNq0l89rE1EQx3e3gVJoSPzZeNEWPKgHoa0HBak0iHiy/4C3WvDmoZ56qJ7txVsPQu8qlqqHIhRKJZceesmhioQEfxTEtsoSpdJg1u/ABJ7Pmc1m8zLwgWTmzcw3L+/te+tHUeQltONgCkyCi2AEDHLsJ6iBMlgHL8FeoqokoA2j4CloRMmtwTmj7erHBXPgCWhG6a3JNXKdCiDl1cidVbXZkJoXQRi5t5BrxwoY71FzU8S4JuAIqFkJ2+BFSlEh525b/hr3+k/AklDkNsf6wTT4yv46KIMNpsy+iMdMc47HNWxbsgVcUn7FmLAzzoFAWDsBx+wVP6bUpp5ewI+DOeUx0Wd9D8F70BTGNjkWtqnhmT1JQAHcUgZd8Lo3rQb1LAT8eJVUfgGvHQigGp+V2Z0iAUUl8QH47kAA1XioxIo+bRN8OG8F/oBjwv+Z1nJgX5jpdzQDw0LCjsPmrcW7I/iHScCAEDj03FtD8A0EyuChHgg4KTlJQF3wZ7WELppnBX+dBFSVpJsOBWi1qiRgSwnOgoyD5hmuJdkWCVhTgnTvW3AgYIFrSbZGh0UW/Io5Vp+DQoK7o80pztWMemZbgxeNwCNwDbw1fIfgGZjhU6xPaJgBV8BdsMw5cbZoHsenwYFxkZzl83xTSKTiviCAfCsJLysH3POfC8m8NegyGAGfLP/VmGmfSChgXroR0RSWjEFv2J/nG84cuKFMf4sTCZqXuJd4KaXFVjEG3+tw4eXbNK/YC9oXXs3O8NY8y99L4BXY5cvLY/Bb2VZ58EOJVcB18DHJq9lRsKr8inyKGVjlmh29mtHs3AHfuhCwy1vXT/Nu2GKQt+UHsGdctyX6eQyNvc+5sfX9Dl7Pe2J/BRgAl2CpwmrsHR0AAAAASUVORK5CYII=';
            break;
        default:
            data = '';
            break;
    }

    return Image.fromData(Data.fromBase64String(data));
}