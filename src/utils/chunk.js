function createChunks(Arr,chunck) {

    const result = Arr.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunck)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
          
        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
    return result
}



module.exports={createChunks}