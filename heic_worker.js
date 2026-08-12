const { workerData, parentPort } = require('worker_threads');
const convert = require('heic-convert');

(async () => {
    try {
        const outputBuffer = await convert({
            buffer: workerData.buffer,
            format: 'JPEG',
            quality: 0.75
        });
        parentPort.postMessage({ ok: true, buffer: outputBuffer }, [outputBuffer.buffer]);
    } catch (e) {
        parentPort.postMessage({ ok: false, error: e.message });
    }
})();
