/* eslint-disable */
function validateSupportedBrowser() {
  var allowedBrowsersSet = [
    { name: 'Chrome', version: 75 },
    { name: 'Firefox', version: 40 },
    { name: 'Safari', version: 13 },
    { name: 'Edge', version: 85 }
  ];

  var getBrowserInfo = (userAgent) => {
    var parser = new window.UAParser(userAgent);
    var browserInfo = parser.getBrowser();
    var browserMajorVersion = parseInt(browserInfo.version.split('.', 1), 10);
    return { browserName: browserInfo.name, browserMajorVersion };
  };

  var browserInfoObject = getBrowserInfo(navigator.userAgent);
  var hasInvalidVersionOfSupportedBrower = false;
  for (var i = 0; i < allowedBrowsersSet.length; i += 1) {
    if (
      browserInfoObject.browserName === allowedBrowsersSet[i].name &&
      browserInfoObject.browserMajorVersion < allowedBrowsersSet[i].version
    ) {
      hasInvalidVersionOfSupportedBrower = true;
      break;
    }
  }

  if (hasInvalidVersionOfSupportedBrower)
    window.location.replace('/supported-browsers.html');
}

if (!document.getElementById('ua-parser-script')) {
  var uaParserJSScriptTag = document.createElement('script');
  uaParserJSScriptTag.setAttribute('id', 'ua-parser-script');
  uaParserJSScriptTag.setAttribute(
    'src',
    'https://cdnjs.cloudflare.com/ajax/libs/UAParser.js/1.0.33/ua-parser.min.js'
  );
  document.head.appendChild(uaParserJSScriptTag);

  uaParserJSScriptTag.addEventListener('load', validateSupportedBrowser);
}
