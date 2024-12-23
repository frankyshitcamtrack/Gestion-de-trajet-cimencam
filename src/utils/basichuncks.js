// chunking function
function chunk(arr, size) {
  if (size === 0) return [];
  const arrCount = Math.ceil(arr.length / size);

  const chunks = [];
  for (let i = 0; i < arrCount; ++i) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function createOverlappingChunks(array, chunkSize) {
  if (chunkSize < 2) {
    throw new Error('Chunk size must be at least 2 to allow overlapping.');
  }

  const chunks = [];
  for (let i = 0; i < array.length - chunkSize + 1; i += chunkSize - 1) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
}

module.exports = { chunk };
