/**
 * time complexity O(1)
 * explain: number of operations is fixed regardless the input size
 * space complexity O(1)
 * explain: allocate fixed memory regardless the input size
 * */
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * time complexity O(n)
 * explain: number of operations increase as the input size grow
 * space complexity O(n)
 * explain: each element is stored in memory so the allocated memory
 * grows over time with the input size
 * */
function sum_to_n_b(n: number): number {
  const arr = Array.from({ length: n }, (_, index) => index + 1);
  return arr.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
}

/**
 * time complexity O(n)
 * explain: function calls itself n times (recursive calls grow with input size)
 * space complexity O(n)
 * explain: each recursive call adds a frame to the call stack,
 * resulting in n stack frames for input size
 * */
function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + (sum_to_n_c(n - 1) as number);
}
