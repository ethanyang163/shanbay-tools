// https://60devs.com/hot-reloading-for-chrome-extensions.html
const filesInDirectory = dir =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries =>
      Promise.all(
        entries
          .filter(e => e.name[0] !== '.')
          .map(e =>
            e.isDirectory
              ? filesInDirectory(e)
              : new Promise(resolve => e.file(resolve))
          )
      )
        .then(files => [...files])
        .then(resolve)
    )
  );

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files =>
    files.map(f => f.name + f.lastModified).join()
  );

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
      chrome.runtime.reload();
    }
  });
};

chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry(watchChanges);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      // NB: see https://github.com/xpl/crx-hotreload/issues/5
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});
