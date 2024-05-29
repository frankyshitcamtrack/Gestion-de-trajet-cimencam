// chunking function
function chunk(arr, size) {
  if (size === 0) return [];
  const arrCount = Math.ceil(arr.length / size);


  const chunks = [];
  for (let i=0; i<arrCount; ++i) {
    chunks.push(arr.slice(i *size , i * (size) + size));
  }
return chunks;
 
}
  
module.exports={chunk}