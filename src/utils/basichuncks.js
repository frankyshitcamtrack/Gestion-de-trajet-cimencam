// chunking function
function chunk(arr, size) {
    if (size === 0) return [];
    const arrCount = Math.ceil((arr.length + Math.floor(arr.length / size)) / size);
    const chunks = [];
    for (let i=0; i<arrCount; ++i) {
      chunks.push(arr.slice(i * (size - 1), i * (size - 1) + size));
    }

    return chunks;
}

  
module.exports={chunk}