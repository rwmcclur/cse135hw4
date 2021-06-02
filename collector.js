

const staticData = [{
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    language: navigator.language
}];


let currClickPackage = []; // An array of current click events that have occurred

window.addEventListener('click', e => {
    // Object with some of the data from the click event object
    let clickEvent = {
      client: {
        x: e.clientX,
        y: e.clientY
      },
      page: {
        x: e.pageX,
        y: e.pageY
      }
    }
    currClickPackage.push(clickEvent);
  });


  const packageQueue = [];

  function enqueueData(data, isCurrClick) {
    packageQueue.push(JSON.stringify(data));
    if (isCurrClick) {
      currClickPackage = [];
    }
  }

  function sendData(isTimeout) {
    if (JSON.parse(packageQueue[0]).length == 0) {
      packageQueue.shift();
      return;
    }
    let collection = JSON.parse(packageQueue[0])[0]?.outerWidth ? 'staticData' : 'clickEvents';
    fetch(`https://reporting.ryanmcclure.xyz/collector/${collection}`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: packageQueue[0]
    }).then(response => response.json())
      .then(data => {
        console.log(data.json);
        packageQueue.shift(); // Removes the first index from the queue on success
      })
      .catch(err => {
        console.log(`Error: ${err}`); // Log the error if unsuccessful
        if (!isTimeout) {
          setTimeout(() => {
            sendData(true);
          }, 1000);
        }
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Send the initial static Data
    enqueueData(staticData, false);
    sendData();
  
    // Set interval for the click data
    setInterval(function () {
      enqueueData(currClickPackage, true); // Add package to the queue and reset the current package
      sendData(); // Send data from queue to the endpoint
    }, 5000); // Execute this code every 5 seconds (5000 ms)
  });