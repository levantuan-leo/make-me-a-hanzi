/* eslint-disable no-unused-vars */
const decodeMedian = (buffer, i) => {
  const character = String.fromCodePoint(buffer[i] + (buffer[i + 1] << 8));
  const medians = [];
  const num_medians = buffer[i + 2];
  i += 3;
  for (let j = 0; j < num_medians; j++) {
    const length = buffer[i];
    if (buffer.slice) {
      medians.push(buffer.slice(i + 1, i + length + 1));
    } else {
      const median = [];
      for (let k = 0; k < length; k++) {
        median.push(buffer[i + k + 1]);
      }
      medians.push(median);
    }
    i += length + 1;
  }
  return [[character, medians], i];
};

// Methods that return promises follow.

// Returns a Promise which resolves to an ArrayBuffer containing the data.
export const loadBinaryData = (url) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = (event) => {
      if (request.status != 200)
        throw new Error("loadBinaryData failed: " + request.status);
      resolve(new Uint8Array(request.response));
    };
    request.send(null);
  });
};

// Returns a Promise that resolves to a list of (character, medians) pairs.
export const decodeMedians = (buffer) => {
  var result = [];
  var decoded = null;
  for (var i = 0; i < buffer.length; ) {
    decoded = decodeMedian(buffer, i);
    result.push(decoded[0]);
    i = decoded[1];
  }
  return result;
};
