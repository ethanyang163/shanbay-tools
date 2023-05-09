const options = ["isSelectOn"];

function restoreOptions() {
  chrome.storage.sync.get(options, items => {
    options.forEach(option => document.getElementById(option).checked = items[option])
  })
}

document.addEventListener("DOMContentLoaded", restoreOptions);

options.forEach((option) =>
  document.getElementById(option).addEventListener("change", () => {
    const checked = document.getElementById(option).checked;
    document.getElementById("result").innerHTML = `${option} ${checked}`;
    chrome.storage.sync.set({ [option]: checked });
  })
);
