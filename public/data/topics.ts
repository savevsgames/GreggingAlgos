export interface Topic {
  title: string;
  slug: string;
  category: "data-structures" | "algorithms";
  description: string;
  content: string;
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
    `
  },
  {
    title: "Graphs",
    slug: "graphs",
    category: "data-structures",
    description: "Explore graphs - a versatile data structure for representing relationships and networks.",
    content: `
      <h2>Understanding Graphs</h2>
      <p>Graphs are collections of vertices (nodes) connected by edges, used to represent relationships between objects.</p>
    `
  },
  {
    title: "Hash Tables",
    slug: "hash-tables",
    category: "data-structures",
    description: "Learn about hash tables (dictionaries) for efficient key-value pair storage and retrieval.",
    content: `
      <h2>Hash Tables Explained</h2>
      <p>Hash tables provide fast access to values using keys through a hashing function.</p>
    `
  },
  {
    title: "Linked Lists",
    slug: "linked-lists",
    category: "data-structures",
    description: "Discover linked lists - a dynamic data structure for sequential data storage.",
    content: `
      <h2>Linked Lists Deep Dive</h2>
      <p>Linked lists store elements in nodes that point to the next element in the sequence.</p>
    `
  },
  {
    title: "Stacks and Queues",
    slug: "stacks-and-queues",
    category: "data-structures",
    description: "Master stacks (LIFO) and queues (FIFO) for managing ordered data.",
    content: `
      <h2>Stacks and Queues Overview</h2>
      <p>These structures handle data in specific orders: Last-In-First-Out for stacks and First-In-First-Out for queues.</p>
    `
  },
  {
    title: "Dynamic Programming",
    slug: "dynamic-programming",
    category: "algorithms",
    description: "Learn dynamic programming techniques for solving complex problems efficiently.",
    content: `
      <h2>Dynamic Programming Fundamentals</h2>
      <p>Dynamic programming solves complex problems by breaking them down into simpler subproblems.</p>
    `
  },
  {
    title: "Recursion",
    slug: "recursion",
    category: "algorithms",
    description: "Understanding recursion - solving problems by breaking them into smaller similar problems.",
    content: `
      <h2>Recursion Explained</h2>
      <p>Recursion is a method where a function calls itself to solve smaller instances of the same problem.</p>
    `
  },
  {
    title: "Sorting",
    slug: "sorting",
    category: "algorithms",
    description: "Explore various sorting algorithms and their implementations.",
    content: `
      <h2>Sorting Algorithms</h2>
      <p>Sorting algorithms arrange data in a specific order, with different approaches offering various trade-offs.</p>
    `
  },
  {
    title: "Traversals",
    slug: "traversals",
    category: "algorithms",
    description: "Learn different methods for visiting all elements in a data structure.",
    content: `
      <h2>Traversal Techniques</h2>
      <p>Traversal algorithms systematically visit every element in a data structure exactly once.</p>
    `
  },
  {
    title: "BFS (Breadth-First Search)",
    slug: "bfs",
    category: "algorithms",
    description: "Master breadth-first search for exploring data structures level by level.",
    content: `
      <h2>Breadth-First Search</h2>
      <p>BFS explores a graph or tree by visiting all nodes at the current depth before moving to nodes at the next depth level.</p>
    `
  },
  {
    title: "DFS (Depth-First Search)",
    slug: "dfs",
    category: "algorithms",
    description: "Learn depth-first search for exploring data structures by going deep first.",
    content: `
      <h2>Depth-First Search</h2>
      <p>DFS explores a graph or tree by going as far as possible along each branch before backtracking.</p>
    `
  }
];
