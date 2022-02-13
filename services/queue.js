let list = []
class Queue {
    constructor(guildId) {
      this.guildId = guildId;
      this.urls = []
      this.index = 0
    }
}

module.exports = {
    getQueue(guildId){
        let queue = list.find(i => i.guildId == guildId)
        if(typeof queue == 'undefined')
        {
            return false
        }
        else if (Object.keys(queue) == 0)
        {
            return false
        }
        return queue
    },
    get(guildId){
        let queue = this.getQueue(guildId)
        if(queue)
        {
            return queue.urls[queue.index]
        }
    },
    getAll(guildId)
    {
        return list
    },
    next(guildId){
        queue = this.getQueue(guildId)
        queue.index++
    },
    back(guildId){
        queue = this.getQueue(guildId)
        if(queue.index > 0){
            queue.index = queue.index - 2 
        }
    },
    add(guildId, url)
    {
        queue = this.getQueue(guildId)
        if(queue)
        {
            queue.urls.push(url) 
        }
        else{
            list.push(new Queue(guildId))
            this.add(guildId,url)
        }
       
    },
    remove(guildId)
    {
        queue = this.getQueue(guildId)
        queue.urls.splice(queue.index, 1);
    },
    clear(guildId){
        queue = this.getQueue(guildId)
        queue.urls = []
        queue.index = 0
    },
    finishedQueue(guildId)
    {
        queue = this.getQueue(guildId)
        if(queue)
        {
            if(queue.index + 1 > queue.urls.length)
            {
                return true
            }
            return false
        }
        return false
    }

}