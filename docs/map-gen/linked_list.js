class Node {
  constructor(value) {
    this.next = null;
    this.value = value;
  }
}

class LinkedList {
  constructor() {
    this.tail = null;
  }
  push(value) {
    let new_node = new Node(value);
    new_node.next = this.tail;
    this.tail = new_node;
  }
  is_empty() {
    if (this.tail === null) {
      return true;
    } else {
      return false;
    }
  }
  printnodes() {
    if (this.is_empty()) {
      return "empty list";
    } else {
      let a_node = this.tail ;
      let the_string = "[" + a_node.value + "] ";
      while (a_node.next !== null) {
        a_node = a_node.next;
        the_string += "[" + a_node.value + "] ";
      }
      return the_string;
    }
  }
}

class Queue extends LinkedList {
  constructor() {
    super();
    this.head = null;
  }
  enqueue(value) {
    super.push(value);
    if (this.head === null) {
      this.head = this.tail;
    }
  }
  dequeue() {
    let out = this.head;
    if (this.head === this.tail) {
      this.head = this.tail = null;
      return out.value;
    }
    let select = this.tail;
    while (select.next !== this.head) {
      select = select.next;
    }
    select.next = null;
    this.head = select;

    return out.value;
  }
}

export { Queue }
