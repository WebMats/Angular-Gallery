class Paginator {
    constructor(items, after = null, pageSize) {
        this.items = items;
        this.cursor = after;
        this.pageSize = pageSize;
    }
    getCursorIndex() {
        return this.items.findIndex(item => this.cursor == item.id)
    }
    next() {
        const cursorIndex = this.getCursorIndex();
        let items = []
        if (cursorIndex >= 0) {
            items = this.items.slice(cursorIndex + 1, Math.min(this.items.length, cursorIndex + this.pageSize + 1))
        } else {
            items = this.items.slice(0, this.pageSize)
        } 
        this.cursor = items[items.length - 1].id
        return items
    }
    getCursor() {
        return this.cursor
    }
    setCursorToPrevPage() {
        if (this.pageSize !== 1 && (this.getCursorIndex() + 1) % this.pageSize !== 0) {
            this.cursor = this.items[this.getCursorIndex() - this.pageSize - ((this.getCursorIndex() + 1) % this.pageSize)] ? 
                this.items[this.getCursorIndex() - this.pageSize - ((this.getCursorIndex() + 1) % this.pageSize)].id : null;
            return
        } else {
            this.cursor = this.items[this.getCursorIndex() - (2 * this.pageSize)] ? this.items[this.getCursorIndex() - (2 * this.pageSize)].id : null;
        }
    }
    getPage() {
        return (Math.floor((this.getCursorIndex() + this.pageSize) / this.pageSize) - 1)
    }
    getLength() {
        return this.items.length
    }
}

module.exports = Paginator