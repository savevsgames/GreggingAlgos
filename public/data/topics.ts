export interface Topic {
  title: string;
  slug: string;
  category: "data-structures" | "algorithms";
  description: string;
  content: string;
  exampleCode: {
    javascript: string;
    python: string;
  };
}

export const topics: Topic[] = [
  {
    title: "Arrays",
    slug: "arrays",
    category: "data-structures",
    description: "Understanding arrays - the foundational data structure for storing sequential data.",
    content: `
      <h2>Introduction to Arrays</h2>
      <p>Arrays are one of the most fundamental data structures in computer science. They store elements in contiguous memory locations, providing fast access to elements using indices.</p>

      <h3>Key Characteristics</h3>
      <ul>
        <li>Fixed size (in most implementations)</li>
        <li>O(1) access time</li>
        <li>Contiguous memory allocation</li>
      </ul>
    `,
    exampleCode: {
      javascript: `// Example: Working with Arrays
const numbers = [1, 2, 3, 4, 5];

// Adding elements
numbers.push(6);
console.log("After push:", numbers);

// Accessing elements
console.log("First element:", numbers[0]);
console.log("Last element:", numbers[numbers.length - 1]);

// Iterating
console.log("\\nIterating through array:");
numbers.forEach(num => console.log(num));

// Array operations
const doubled = numbers.map(num => num * 2);
console.log("\\nDoubled numbers:", doubled);

const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log("Sum of numbers:", sum);`,
      python: `# Example: Working with Arrays (Lists in Python)
numbers = [1, 2, 3, 4, 5]

# Adding elements
numbers.append(6)
print("After append:", numbers)

# Accessing elements
print("First element:", numbers[0])
print("Last element:", numbers[-1])

# Iterating
print("\\nIterating through list:")
for num in numbers:
    print(num)

# List operations
doubled = [num * 2 for num in numbers]
print("\\nDoubled numbers:", doubled)

sum_numbers = sum(numbers)
print("Sum of numbers:", sum_numbers)`
    }
  },
  {
    title: "Graphs",
    slug: "graphs",
    category: "data-structures",
    description: "Explore graphs - a versatile data structure for representing relationships and networks.",
    content: `
      <h2>Understanding Graphs</h2>
      <p>Graphs are collections of vertices (nodes) connected by edges, used to represent relationships between objects.</p>
    `,
    exampleCode: {
      javascript: `// Example: Implementing a Simple Graph
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }
}

// Creating a graph
const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");

graph.addEdge("A", "B");
graph.addEdge("B", "C");

console.log("Graph structure:", graph.adjacencyList);`,
      python: `# Example: Implementing a Simple Graph
class Graph:
    def __init__(self):
        self.adjacency_list = {}

    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []

    def add_edge(self, vertex1, vertex2):
        self.adjacency_list[vertex1].append(vertex2)
        self.adjacency_list[vertex2].append(vertex1)

# Creating a graph
graph = Graph()
graph.add_vertex("A")
graph.add_vertex("B")
graph.add_vertex("C")

graph.add_edge("A", "B")
graph.add_edge("B", "C")

print("Graph structure:", graph.adjacency_list)`
    }
  },
  {
    title: "Hash Tables",
    slug: "hash-tables",
    category: "data-structures",
    description: "Learn about hash tables (dictionaries) for efficient key-value pair storage and retrieval.",
    content: `
      <h2>Hash Tables Explained</h2>
      <p>Hash tables provide fast access to values using keys through a hashing function.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "Linked Lists",
    slug: "linked-lists",
    category: "data-structures",
    description: "Discover linked lists - a dynamic data structure for sequential data storage.",
    content: `
      <h2>Linked Lists Deep Dive</h2>
      <p>Linked lists store elements in nodes that point to the next element in the sequence.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "Stacks and Queues",
    slug: "stacks-and-queues",
    category: "data-structures",
    description: "Master stacks (LIFO) and queues (FIFO) for managing ordered data.",
    content: `
      <h2>Stacks and Queues Overview</h2>
      <p>These structures handle data in specific orders: Last-In-First-Out for stacks and First-In-First-Out for queues.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "Dynamic Programming",
    slug: "dynamic-programming",
    category: "algorithms",
    description: "Learn dynamic programming techniques for solving complex problems efficiently.",
    content: `
      <h2>Dynamic Programming Fundamentals</h2>
      <p>Dynamic programming solves complex problems by breaking them down into simpler subproblems.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "Recursion",
    slug: "recursion",
    category: "algorithms",
    description: "Understanding recursion - solving problems by breaking them into smaller similar problems.",
    content: `
      <h2>Recursion Explained</h2>
      <p>Recursion is a method where a function calls itself to solve smaller instances of the same problem.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "Sorting",
    slug: "sorting",
    category: "algorithms",
    description: "Explore various sorting algorithms and their implementations.",
    content: `
      <h2>Sorting Algorithms</h2>
      <p>Sorting algorithms arrange data in a specific order, with different approaches offering various trade-offs.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "Traversals",
    slug: "traversals",
    category: "algorithms",
    description: "Learn different methods for visiting all elements in a data structure.",
    content: `
      <h2>Traversal Techniques</h2>
      <p>Traversal algorithms systematically visit every element in a data structure exactly once.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "BFS (Breadth-First Search)",
    slug: "bfs",
    category: "algorithms",
    description: "Master breadth-first search for exploring data structures level by level.",
    content: `
      <h2>Breadth-First Search</h2>
      <p>BFS explores a graph or tree by visiting all nodes at the current depth before moving to nodes at the next depth level.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  },
  {
    title: "DFS (Depth-First Search)",
    slug: "dfs",
    category: "algorithms",
    description: "Learn depth-first search for exploring data structures by going deep first.",
    content: `
      <h2>Depth-First Search</h2>
      <p>DFS explores a graph or tree by going as far as possible along each branch before backtracking.</p>
    `,
    exampleCode: { javascript: "", python: "" }
  }
];