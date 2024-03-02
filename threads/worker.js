// worker.js
const { workerData, parentPort } = require('worker_threads');
const initData = workerData;
console.log(initData)
parentPort.on('message', (message) => {
    if (typeof message == 'string') {
        // Do some work with the received message
        const result = {
            message,
            workerData
        }
        console.log(message)
        // Send the result back to the main thread
        parentPort.postMessage(result);
    } else {
        throw new Error("bukan string")
    }
});
