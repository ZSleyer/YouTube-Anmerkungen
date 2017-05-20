/*******************************************************
 * YTA - YouTube-Anmerkungen Kopieren - Version 4.50
 * 
 * Copyright © 2013 - 2016 ZSleyerLP - All Rights Reserved
 * 
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * 
 * Written by ZSleyerLP <webmaster@zsleyerlp.com>, Februar 2016
 *******************************************************/
function goToYTA() {
  console.log('Going to yta...');
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isYTAUrl(tab.url)) {
        console.log('Found YTA tab: ' + tab.url + '. ' +
                    'Focusing and refreshing count...');
        chrome.tabs.update(tab.id, {selected: true});
        startRequest({scheduleRequest:false, showLoadingAnimation:false});
        return;
      }
    }
    console.log('Could not find YTA tab. Creating one...');
    chrome.tabs.create({url: getYTAUrl()});
  });
}

function isYTAUrl(url) {
  // Return whether the URL starts with the YTA prefix.
  return url.indexOf(getYTAUrl()) == 0;
}

function getYTAUrl() {
  return "https://yta.zsleyer.de/?auth=YTA9ZnHtUtNDlfmscK8MjF9JQe2sQNnGINXeD0ftaGIK6Cyrr45w3BOIPUD3l8Z0nHhjrH330nZKnKaKkn4wsyKPoL02mSZ8RgR3xFqUFs7Zsi57nUg4ezeQ2gEJrF0hWegfuLkeR87nFnEaVC3rWXUDoteO6Rn2C57floBFAk67ksLjQpDouA7makQ64qbEJZsrHVvYKYZuMobgXsnG6oeuKnC0NH5MuqXNo62bE9SnYMH5jIr1FJHSQBBDQ";
}

chrome.browserAction.onClicked.addListener(goToYTA);