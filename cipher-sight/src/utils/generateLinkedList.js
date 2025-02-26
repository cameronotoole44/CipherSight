export class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    append(value) {
        const newNode = new ListNode(value);

        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }

        this.size++;
        return this;
    }

    prepend(value) {
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        return this;
    }

    insertAt(value, position) {
        if (position < 0 || position > this.size) {
            return false;
        }
        if (position === 0) {
            this.prepend(value);
            return true;
        }
        if (position === this.size) {
            this.append(value);
            return true;
        }

        const newNode = new ListNode(value);
        let current = this.head;
        let previous = null;
        let index = 0;

        while (index < position) {
            previous = current;
            current = current.next;
            index++;
        }
        newNode.next = current;
        previous.next = newNode;
        this.size++;
        return true;
    }

    remove(value) {
        if (!this.head) return false;
        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        let current = this.head;
        let previous = null;

        while (current && current.value !== value) {
            previous = current;
            current = current.next;
        }
        if (!current) return false;
        previous.next = current.next;
        this.size--;
        return true;
    }

    removeAt(position) {
        if (position < 0 || position >= this.size) {
            return false;
        }

        if (position === 0) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        let current = this.head;
        let previous = null;
        let index = 0;

        while (index < position) {
            previous = current;
            current = current.next;
            index++;
        }

        previous.next = current.next;
        this.size--;
        return true;
    }

    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }
}

export const generateSampleLinkedList = (size = 5) => {
    const list = new LinkedList();
    for (let i = 1; i <= size; i++) {
        list.append(`Node ${i}`);
    }
    return list;
};