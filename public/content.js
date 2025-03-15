let TIME_LIMIT = 1000 * 60 * 60; // Default time limit

const { hostname } = new URL(window.location.href);
let interval;

chrome.runtime.sendMessage({ type: 'getGoals' }, (goals) => {
  if (goals && goals[hostname]) {
    TIME_LIMIT = goals[hostname] * 1000 * 60; // Set time limit based on user-defined goals in minutes
  }
});

function replaceContent(message) {
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column;">
      <h1>${message}</h1>
      <p>${message === 'Time limit exceeded! Get back to work!' ? 'Take a break!' : ''}</p>
    </div>
  `;
}

function checkTimeLimit(domainTimes, goals) {
  if (domainTimes && domainTimes[hostname] >= TIME_LIMIT) {
    replaceContent('Time limit exceeded! Get back to work!');
    clearInterval(interval);
  } else if (goals && goals[hostname] && domainTimes[hostname] < goals[hostname] * 1000 * 60) {
    replaceContent('You are on track! Keep going!');
  }
}

chrome.runtime.sendMessage({ type: 'getTimes' }, (domainTimes) => {
  checkTimeLimit(domainTimes);
  interval = setInterval(() => {
    chrome.runtime.sendMessage({ type: 'getTimes' }, (updatedDomainTimes) => {
      checkTimeLimit(updatedDomainTimes);
    });
  }, 1000);
});
