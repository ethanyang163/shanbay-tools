// Saves options to chrome.storage
function save_options() {
  var isDbclickOn = document.getElementById('isDbclickOn').checked;
  chrome.storage.sync.set(
    {
      isDbclickOn,
    },
    function () {
      // // Update status to let user know options were saved.
      // var status = document.getElementById('status');
      // status.textContent = 'Options saved.';
      // setTimeout(function () {
      //   status.textContent = '';
      // }, 750);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  console.log(chrome);
  chrome.storage.sync.get(
    {
      isDbclickOn,
    },
    function (items) {
      document.getElementById('isDbclickOn').checked = items.isDbclickOn;
    }
  );
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('isDbclickOn').addEventListener('change', save_options);
