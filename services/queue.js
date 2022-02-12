let list = []
let index = 0
module.exports = {
    get(){
        return list[index]
    },
    getAll()
    {
        return list
    },
    next(){
        index++
    },
    back(){
        if(index > 0){
            index = index - 2 
        }
    },
    add(url)
    {
        list.push(url) 
    },
    remove()
    {
        list.splice(index, 1);
    },
    clear(){
        list = []
        index = 0
    },
    finishedQueue()
    {
        if(index + 1 > list.length)
        {
            return true
        }
        return false
    }

}