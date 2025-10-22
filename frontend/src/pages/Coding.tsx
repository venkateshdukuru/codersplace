"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code,
  Clock,
  Users,
  Target,
  X,
  Play,
  CheckCircle,
  BookOpen,
  Lightbulb,
  Terminal,
  Settings,
  History,
  Lock,
} from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import { SolutionsViewer } from "@/components/coding/SolutionsViewer";
import { useNavigate } from "react-router-dom";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  description: string;
  problemStatement: string;
  time: string;
  solved: number;
}

interface QuestionData {
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints: string[];
  hints: string[];
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  testCases: {
    input: string;
    output: string;
  }[];
}

const Coding = () => {
  const navigate = useNavigate();
  // const { isAuthenticated } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [isSolutionsViewerOpen, setIsSolutionsViewerOpen] = useState(false);

  const topics = [
    "Arrays",
    "Linked Lists",
    "Trees",
    "Stack",
    "Dynamic Programming",
    "Graphs",
    "Heap",
    "Trie",
    "Backtracking",
    "Binary Search",
    "Two Pointers",
    "Sliding Window",
    "String Manipulation",
    "Math",
    "Bit Manipulation",
    "Greedy",
    "Union Find",
    "Intervals",
  ];

  const problems = [
    // Arrays
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      topic: "Arrays",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.

Follow-up: Can you come up with an algorithm that is less than O(n²) time complexity?`,
      time: "15 min",
      solved: 1234,
    },
    {
      id: 2,
      title: "Best Time to Buy and Sell Stock",
      difficulty: "easy",
      topic: "Arrays",
      description:
        "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
      problemStatement: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
• 1 ≤ prices.length ≤ 10⁵
• 0 ≤ prices[i] ≤ 10⁴`,
      time: "20 min",
      solved: 1098,
    },
    {
      id: 3,
      title: "Contains Duplicate",
      difficulty: "easy",
      topic: "Arrays",
      description:
        "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      problemStatement: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Example 1:
Input: nums = [1,2,3,1]
Output: true

Example 2:
Input: nums = [1,2,3,4]
Output: false

Example 3:
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true

Constraints:
• 1 ≤ nums.length ≤ 10⁵
• -10⁹ ≤ nums[i] ≤ 10⁹`,
      time: "10 min",
      solved: 1456,
    },
    {
      id: 4,
      title: "Product of Array Except Self",
      difficulty: "medium",
      topic: "Arrays",
      description:
        "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      problemStatement: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.

Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

Constraints:
• 2 ≤ nums.length ≤ 10⁵
• -30 ≤ nums[i] ≤ 30
• The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

Follow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)`,
      time: "25 min",
      solved: 789,
    },
    {
      id: 5,
      title: "Maximum Subarray",
      difficulty: "medium",
      topic: "Arrays",
      description:
        "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      problemStatement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

Constraints:
• 1 ≤ nums.length ≤ 10⁵
• -10⁴ ≤ nums[i] ≤ 10⁴

Follow up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.`,
      time: "30 min",
      solved: 645,
    },
    {
      id: 6,
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "medium",
      topic: "Arrays",
      description:
        "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
      problemStatement: `Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:

[4,5,6,7,0,1,2] if it was rotated 4 times.
[0,1,2,4,5,6,7] if it was rotated 7 times.

Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].

Given the sorted rotated array nums of unique elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.

Example 1:
Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.

Example 2:
Input: nums = [4,5,6,7,0,1,2]
Output: 0
Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.

Example 3:
Input: nums = [11,13,15,17]
Output: 11
Explanation: The original array was [11,13,15,17] and it was rotated 4 times.

Constraints:
• n == nums.length
• 1 ≤ n ≤ 5000
• -5000 ≤ nums[i] ≤ 5000
• All the integers of nums are unique.
• nums is sorted and rotated between 1 and n times.`,
      time: "20 min",
      solved: 567,
    },
    {
      id: 7,
      title: "Container With Most Water",
      difficulty: "medium",
      topic: "Arrays",
      description:
        "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that can hold the most water.",
      problemStatement: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container that can hold the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

Example 2:
Input: height = [1,1]
Output: 1

Constraints:
• n == height.length
• 2 ≤ n ≤ 10⁵
• 0 ≤ height[i] ≤ 10⁴`,
      time: "25 min",
      solved: 678,
    },
    {
      id: 8,
      title: "3Sum",
      difficulty: "medium",
      topic: "Arrays",
      description:
        "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      problemStatement: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.

Example 2:
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.

Constraints:
• 3 ≤ nums.length ≤ 3000
• -10⁵ ≤ nums[i] ≤ 10⁵`,
      time: "35 min",
      solved: 534,
    },
    {
      id: 9,
      title: "Merge Intervals",
      difficulty: "medium",
      topic: "Arrays",
      description:
        "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      problemStatement: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example 1:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Example 2:
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

Constraints:
• 1 ≤ intervals.length ≤ 10⁴
• intervals[i].length == 2
• 0 ≤ starti ≤ endi ≤ 10⁴`,
      time: "30 min",
      solved: 456,
    },
    {
      id: 10,
      title: "Median of Two Sorted Arrays",
      difficulty: "hard",
      topic: "Arrays",
      description:
        "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      problemStatement: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

Example 1:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.

Example 2:
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.

Constraints:
• nums1.length == m
• nums2.length == n
• 0 ≤ m ≤ 1000
• 0 ≤ n ≤ 1000
• 1 ≤ m + n ≤ 2000
• -10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶`,
      time: "45 min",
      solved: 234,
    },

    // Linked Lists
    {
      id: 11,
      title: "Reverse Linked List",
      difficulty: "easy",
      topic: "Linked Lists",
      description:
        "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      problemStatement: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:
Input: head = []
Output: []

Constraints:
• The number of nodes in the list is the range [0, 5000].
• -5000 ≤ Node.val ≤ 5000

Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?`,
      time: "15 min",
      solved: 1123,
    },
    {
      id: 12,
      title: "Linked List Cycle",
      difficulty: "easy",
      topic: "Linked Lists",
      description:
        "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
      problemStatement: `Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.

Return true if there is a cycle in the linked list. Otherwise, return false.

Example 1:
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

Example 2:
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.

Example 3:
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.

Constraints:
• The number of the nodes in the list is in the range [0, 10⁴].
• -10⁵ ≤ Node.val ≤ 10⁵
• pos is -1 or a valid index in the linked-list.

Follow up: Can you solve it using O(1) (i.e. constant) memory?`,
      time: "20 min",
      solved: 934,
    },
    {
      id: 13,
      title: "Merge Two Sorted Lists",
      difficulty: "easy",
      topic: "Linked Lists",
      description:
        "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
      problemStatement: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: list1 = [], list2 = []
Output: []

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]

Constraints:
• The number of nodes in both lists is in the range [0, 50].
• -100 ≤ Node.val ≤ 100
• Both list1 and list2 are sorted in non-decreasing order.`,
      time: "20 min",
      solved: 876,
    },
    {
      id: 14,
      title: "Remove Nth Node From End",
      difficulty: "medium",
      topic: "Linked Lists",
      description:
        "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
      problemStatement: `Given the head of a linked list, remove the nth node from the end of the list and return its head.

Example 1:
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]

Example 2:
Input: head = [1], n = 1
Output: []

Example 3:
Input: head = [1,2], n = 1
Output: [1]

Constraints:
• The number of nodes in the list is sz.
• 1 ≤ sz ≤ 30
• 0 ≤ Node.val ≤ 100
• 1 ≤ n ≤ sz

Follow up: Could you do this in one pass?`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 15,
      title: "Reorder List",
      difficulty: "medium",
      topic: "Linked Lists",
      description:
        "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …",
      problemStatement: `You are given the head of a singly linked-list. The list can be represented as:

L0 → L1 → … → Ln - 1 → Ln

Reorder the list to be on the following form:

L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

You may not modify the values in the list's nodes. Only nodes themselves may be changed.

Example 1:
Input: head = [1,2,3,4]
Output: [1,4,2,3]

Example 2:
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]

Constraints:
• The number of nodes in the list is in the range [1, 5 * 10⁴].
• 1 ≤ Node.val ≤ 1000`,
      time: "35 min",
      solved: 345,
    },
    {
      id: 16,
      title: "Merge k Sorted Lists",
      difficulty: "hard",
      topic: "Linked Lists",
      description:
        "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      problemStatement: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example 1:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6

Example 2:
Input: lists = []
Output: []

Example 3:
Input: lists = [[]]
Output: []

Constraints:
• k == lists.length
• 0 ≤ k ≤ 10⁴
• 0 ≤ lists[i].length ≤ 500
• -10⁴ ≤ lists[i][j] ≤ 10⁴
• lists[i] is sorted in ascending order.
• The sum of lists[i].length will not exceed 10⁴.`,
      time: "45 min",
      solved: 432,
    },

    // Trees
    {
      id: 17,
      title: "Maximum Depth of Binary Tree",
      difficulty: "easy",
      topic: "Trees",
      description: "Given the root of a binary tree, return its maximum depth.",
      problemStatement: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: 3

Example 2:
Input: root = [1,null,2]
Output: 2

Constraints:
• The number of nodes in the tree is in the range [0, 10⁴].
• -100 ≤ Node.val ≤ 100`,
      time: "15 min",
      solved: 1345,
    },
    {
      id: 18,
      title: "Same Tree",
      difficulty: "easy",
      topic: "Trees",
      description:
        "Given the roots of two binary trees p and q, write a function to check if they are the same or not.",
      problemStatement: `Given the roots of two binary trees p and q, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

Example 1:
Input: p = [1,2,3], q = [1,2,3]
Output: true

Example 2:
Input: p = [1,2], q = [1,null,2]
Output: false

Example 3:
Input: p = [1,2,1], q = [1,1,2]
Output: false

Constraints:
• The number of nodes in both trees is in the range [0, 100].
• -10⁴ ≤ Node.val ≤ 10⁴`,
      time: "15 min",
      solved: 987,
    },
    {
      id: 19,
      title: "Invert Binary Tree",
      difficulty: "easy",
      topic: "Trees",
      description:
        "Given the root of a binary tree, invert the tree, and return its root.",
      problemStatement: `Given the root of a binary tree, invert the tree, and return its root.

Example 1:
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Example 2:
Input: root = [2,1,3]
Output: [2,3,1]

Example 3:
Input: root = []
Output: []

Constraints:
• The number of nodes in the tree is in the range [0, 100].
• -100 ≤ Node.val ≤ 100`,
      time: "10 min",
      solved: 1456,
    },
    {
      id: 20,
      title: "Binary Tree Level Order Traversal",
      difficulty: "medium",
      topic: "Trees",
      description:
        "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      problemStatement: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Example 2:
Input: root = [1]
Output: [[1]]

Example 3:
Input: root = []
Output: []

Constraints:
• The number of nodes in the tree is in the range [0, 2000].
• -1000 ≤ Node.val ≤ 1000`,
      time: "25 min",
      solved: 678,
    },
    {
      id: 21,
      title: "Binary Tree Inorder Traversal",
      difficulty: "medium",
      topic: "Trees",
      description:
        "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      problemStatement: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Example 1:
Input: root = [1,null,2,3]
Output: [1,3,2]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]

Constraints:
• The number of nodes in the tree is in the range [0, 100].
• -100 ≤ Node.val ≤ 100

Follow up: Recursive solution is trivial, could you do it iteratively?`,
      time: "25 min",
      solved: 756,
    },
    {
      id: 22,
      title: "Validate Binary Search Tree",
      difficulty: "medium",
      topic: "Trees",
      description:
        "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      problemStatement: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
• The left subtree of a node contains only nodes with keys less than the node's key.
• The right subtree of a node contains only nodes with keys greater than the node's key.
• Both the left and right subtrees must also be binary search trees.

Example 1:
Input: root = [2,1,3]
Output: true

Example 2:
Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.

Constraints:
• The number of nodes in the tree is in the range [1, 10⁴].
• -2³¹ ≤ Node.val ≤ 2³¹ - 1`,
      time: "30 min",
      solved: 545,
    },
    {
      id: 23,
      title: "Lowest Common Ancestor",
      difficulty: "medium",
      topic: "Trees",
      description:
        "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
      problemStatement: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

Example 1:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.

Example 2:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.

Example 3:
Input: root = [2,1], p = 2, q = 1
Output: 2

Constraints:
• The number of nodes in the tree is in the range [2, 10⁵].
• -10⁹ ≤ Node.val ≤ 10⁹
• All Node.val are unique.
• p != q
• p and q will exist in the BST.`,
      time: "25 min",
      solved: 456,
    },
    {
      id: 24,
      title: "Binary Tree Maximum Path Sum",
      difficulty: "hard",
      topic: "Trees",
      description:
        "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.",
      problemStatement: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.

Example 1:
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.

Example 2:
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.

Constraints:
• The number of nodes in the tree is in the range [1, 3 * 10⁴].
• -1000 ≤ Node.val ≤ 1000`,
      time: "40 min",
      solved: 234,
    },
    {
      id: 25,
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "hard",
      topic: "Trees",
      description:
        "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.",
      problemStatement: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

Clarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.

Example 1:
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]

Example 2:
Input: root = []
Output: []

Constraints:
• The number of nodes in the tree is in the range [0, 10⁴].
• -1000 ≤ Node.val ≤ 1000`,
      time: "50 min",
      solved: 178,
    },

    // Stack
    {
      id: 26,
      title: "Valid Parentheses",
      difficulty: "easy",
      topic: "Stack",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      problemStatement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Constraints:
• 1 ≤ s.length ≤ 10⁴
• s consists of parentheses only '()[]{}'.`,
      time: "20 min",
      solved: 987,
    },
    {
      id: 27,
      title: "Min Stack",
      difficulty: "easy",
      topic: "Stack",
      description:
        "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      problemStatement: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the MinStack class:
• MinStack() initializes the stack object.
• void push(int val) pushes the element val onto the stack.
• void pop() removes the element on the top of the stack.
• int top() gets the top element of the stack.
• int getMin() retrieves the minimum element in the stack.

You must implement a solution with O(1) time complexity for each function.

Example 1:
Input
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output
[null,null,null,null,-3,null,0,-2]

Explanation
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2

Constraints:
• -2³¹ ≤ val ≤ 2³¹ - 1
• Methods pop, top and getMin operations will always be called on non-empty stacks.
• At most 3 * 10⁴ calls will be made to push, pop, top, and getMin.`,
      time: "25 min",
      solved: 765,
    },
    {
      id: 28,
      title: "Evaluate Reverse Polish Notation",
      difficulty: "medium",
      topic: "Stack",
      description:
        "You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation.",
      problemStatement: `You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation.

Evaluate the expression. Return an integer that represents the value of the expression.

Note that:
• The valid operators are '+', '-', '*', and '/'.
• Each operand may be an integer or another expression.
• The division between two integers always truncates toward zero.
• There will not be any division by zero.
• The input represents a valid arithmetic expression in a reverse polish notation.
• The answer and all the intermediate calculations can be represented in a 32-bit integer.

Example 1:
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9

Example 2:
Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6

Example 3:
Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
Explanation: ((10 * (6 / ((9 + 3) * -11))) + 17) + 5 = 22

Constraints:
• 1 ≤ tokens.length ≤ 10⁴
• tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].`,
      time: "25 min",
      solved: 456,
    },
    {
      id: 29,
      title: "Daily Temperatures",
      difficulty: "medium",
      topic: "Stack",
      description:
        "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
      problemStatement: `Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.

Example 1:
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]

Example 2:
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]

Example 3:
Input: temperatures = [30,60,90]
Output: [1,1,0]

Constraints:
• 1 ≤ temperatures.length ≤ 10⁵
• 30 ≤ temperatures[i] ≤ 100`,
      time: "30 min",
      solved: 567,
    },
    {
      id: 30,
      title: "Largest Rectangle in Histogram",
      difficulty: "hard",
      topic: "Stack",
      description:
        "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      problemStatement: `Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

Example 1:
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The above is a histogram where width of each bar is 1.
The largest rectangle is shown in the red area, which has an area = 10 units.

Example 2:
Input: heights = [2,4]
Output: 4

Constraints:
• 1 ≤ heights.length ≤ 10⁵
• 0 ≤ heights[i] ≤ 10⁴`,
      time: "45 min",
      solved: 234,
    },

    // Dynamic Programming
    {
      id: 31,
      title: "Climbing Stairs",
      difficulty: "easy",
      topic: "Dynamic Programming",
      description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      problemStatement: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

Example 2:
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

Constraints:
• 1 ≤ n ≤ 45`,
      time: "15 min",
      solved: 1234,
    },
    {
      id: 32,
      title: "House Robber",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.",
      problemStatement: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

Example 1:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

Example 2:
Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount you can rob = 2 + 9 + 1 = 12.

Constraints:
• 1 ≤ nums.length ≤ 100
• 0 ≤ nums[i] ≤ 400`,
      time: "25 min",
      solved: 678,
    },
    {
      id: 33,
      title: "Coin Change",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",
      problemStatement: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.

Example 1:
Input: coins = [1,3,4], amount = 6
Output: 2
Explanation: 6 = 3 + 3

Example 2:
Input: coins = [2], amount = 3
Output: -1

Example 3:
Input: coins = [1], amount = 0
Output: 0

Constraints:
• 1 ≤ coins.length ≤ 12
• 1 ≤ coins[i] ≤ 2³¹ - 1
• 0 ≤ amount ≤ 10⁴`,
      time: "30 min",
      solved: 567,
    },
    {
      id: 34,
      title: "Longest Increasing Subsequence",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
      problemStatement: `Given an integer array nums, return the length of the longest strictly increasing subsequence.

Example 1:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,18], therefore the length is 4.

Example 2:
Input: nums = [0,1,0,3,2,3]
Output: 4

Example 3:
Input: nums = [7,7,7,7,7,7,7]
Output: 1

Constraints:
• 1 ≤ nums.length ≤ 2500
• -10⁴ ≤ nums[i] ≤ 10⁴

Follow up: Can you come up with an algorithm that runs in O(n log n) time complexity?`,
      time: "35 min",
      solved: 456,
    },
    {
      id: 35,
      title: "Word Break",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
      problemStatement: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

Example 1:
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".

Example 2:
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.

Example 3:
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false

Constraints:
• 1 ≤ s.length ≤ 300
• 1 ≤ wordDict.length ≤ 1000
• 1 ≤ wordDict[i].length ≤ 20
• s and wordDict[i] consist of only lowercase English letters.
• All the strings of wordDict are unique.`,
      time: "30 min",
      solved: 445,
    },
    {
      id: 36,
      title: "Combination Sum IV",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "Given an array of distinct integers nums and a target integer target, return the number of possible combinations that add up to target.",
      problemStatement: `Given an array of distinct integers nums and a target integer target, return the number of possible combinations that add up to target.

The test cases are generated so that the answer can fit in a 32-bit integer.

Example 1:
Input: nums = [1,2,3], target = 4
Output: 7
Explanation:
The possible combination ways are:
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
Note that different sequences are counted as different combinations.

Example 2:
Input: nums = [9], target = 3
Output: 0

Constraints:
• 1 ≤ nums.length ≤ 200
• 1 ≤ nums[i] ≤ 1000
• All the elements of nums are unique.
• 1 ≤ target ≤ 1000

Follow up: What if negative numbers are allowed in the given array? How does it change the problem? What limitation we need to add to the question to allow negative numbers?`,
      time: "30 min",
      solved: 334,
    },
    {
      id: 37,
      title: "House Robber II",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle.",
      problemStatement: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have the same security system as the previous problem, which means they cannot be robbed on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

Example 1:
Input: nums = [2,3,2]
Output: 3
Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.

Example 2:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

Example 3:
Input: nums = [1,2,3]
Output: 3

Constraints:
• 1 ≤ nums.length ≤ 100
• 0 ≤ nums[i] ≤ 1000`,
      time: "30 min",
      solved: 445,
    },
    {
      id: 38,
      title: "Decode Ways",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "A message containing letters from A-Z can be encoded into numbers using the following mapping: 'A' -> \"1\", 'B' -> \"2\", ..., 'Z' -> \"26\".",
      problemStatement: `A message containing letters from A-Z can be encoded into numbers using the following mapping:

'A' -> "1"
'B' -> "2"
...
'Z' -> "26"

To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways). For example, "11106" can be mapped into:

"AAJF" with the grouping (1 1 10 6)
"KJF" with the grouping (11 10 6)

Note that the grouping (1 11 06) is invalid because "06" cannot be mapped into 'F' since "6" is different from "06".

Given a string s containing only digits, return the number of ways to decode it.

The test cases are generated so that the answer fits in a 32-bit integer.

Example 1:
Input: s = "12"
Output: 2
Explanation: "12" could be decoded as "AB" (1 2) or "L" (12).

Example 2:
Input: s = "226"
Output: 3
Explanation: "226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).

Example 3:
Input: s = "06"
Output: 0
Explanation: "06" cannot be mapped to "F" because of the leading zero ("6" is different from "06").

Constraints:
• 1 ≤ s.length ≤ 100
• s contains only digits and may contain leading zero(s).`,
      time: "35 min",
      solved: 389,
    },
    {
      id: 39,
      title: "Unique Paths",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.",
      problemStatement: `There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.

Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

The test cases are generated so that the answer will be less than or equal to 2 * 10⁹.

Example 1:
Input: m = 3, n = 7
Output: 28

Example 2:
Input: m = 3, n = 2
Output: 3
Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down

Constraints:
• 1 ≤ m, n ≤ 100`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 40,
      title: "Jump Game",
      difficulty: "medium",
      topic: "Dynamic Programming",
      description:
        "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.",
      problemStatement: `You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.

Example 1:
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.

Example 2:
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

Constraints:
• 1 ≤ nums.length ≤ 10⁴
• 0 ≤ nums[i] ≤ 10⁵`,
      time: "25 min",
      solved: 556,
    },

    // Graphs
    {
      id: 41,
      title: "Number of Islands",
      difficulty: "medium",
      topic: "Graphs",
      description:
        "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      problemStatement: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

Example 1:
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1

Example 2:
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3

Constraints:
• m == grid.length
• n == grid[i].length
• 1 ≤ m, n ≤ 300
• grid[i][j] is '0' or '1'.`,
      time: "30 min",
      solved: 678,
    },
    {
      id: 42,
      title: "Clone Graph",
      difficulty: "medium",
      topic: "Graphs",
      description:
        "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
      problemStatement: `Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.

class Node {
    public int val;
    public List<Node> neighbors;
}

Test case format:

For simplicity, each node's value is the same as the node's index (1-indexed). For example, the first node with val = 1, the second node with val = 2, and so on. The graph is represented in the test case using an adjacency list.

An adjacency list is a collection of unordered lists used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.

The given node will always be the first node with val = 1. You must return the copy of the given node as a reference to the cloned graph.

Example 1:
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.
1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).

Example 2:
Input: adjList = [[]]
Output: [[]]
Explanation: Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.

Example 3:
Input: adjList = []
Output: []
Explanation: This an empty graph, it does not have any nodes.

Constraints:
• The number of nodes in the graph is in the range [0, 100].
• 1 ≤ Node.val ≤ 100
• Node.val is unique for each node.
• There are no repeated edges and no self-loops in the graph.
• The Graph is connected and all nodes can be visited starting from the given node.`,
      time: "35 min",
      solved: 456,
    },
    {
      id: 43,
      title: "Pacific Atlantic Water Flow",
      difficulty: "medium",
      topic: "Graphs",
      description:
        "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.",
      problemStatement: `There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.

Example 1:
Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
Explanation: The following cells can flow to the Pacific and Atlantic oceans, as shown below:
[0,4]: [0,4] -> Pacific Ocean 
       [0,4] -> Atlantic Ocean
[1,3]: [1,3] -> [0,3] -> Pacific Ocean 
       [1,3] -> [1,4] -> Atlantic Ocean
[1,4]: [1,4] -> [1,3] -> [0,3] -> Pacific Ocean 
       [1,4] -> Atlantic Ocean
[2,2]: [2,2] -> [1,2] -> [0,2] -> Pacific Ocean 
       [2,2] -> [2,3] -> [2,4] -> Atlantic Ocean
[3,0]: [3,0] -> Pacific Ocean 
       [3,0] -> [4,0] -> Atlantic Ocean
[3,1]: [3,1] -> [3,0] -> Pacific Ocean 
       [3,1] -> [4,1] -> Atlantic Ocean
[4,0]: [4,0] -> Pacific Ocean 
       [4,0] -> Atlantic Ocean
Note that there are other possible paths for these cells to flow to the Pacific and Atlantic oceans.

Example 2:
Input: heights = [[1]]
Output: [[0,0]]
Explanation: The water can flow from the only cell to the Pacific and Atlantic oceans.

Constraints:
• m == heights.length
• n == heights[r].length
• 1 ≤ m, n ≤ 200
• 0 ≤ heights[r][c] ≤ 2 * 10⁵`,
      time: "40 min",
      solved: 345,
    },
    {
      id: 44,
      title: "Course Schedule",
      difficulty: "medium",
      topic: "Graphs",
      description:
        "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
      problemStatement: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.

Example 1:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0. So it is possible.

Example 2:
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.

Constraints:
• 1 ≤ numCourses ≤ 2000
• 0 ≤ prerequisites.length ≤ 5000
• prerequisites[i].length == 2
• 0 ≤ ai, bi < numCourses
• All the pairs prerequisites[i] are unique.`,
      time: "35 min",
      solved: 567,
    },
    {
      id: 45,
      title: "Course Schedule II",
      difficulty: "medium",
      topic: "Graphs",
      description:
        "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
      problemStatement: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.

Example 1:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]
Explanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].

Example 2:
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,2,1,3]
Explanation: There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.
So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].

Example 3:
Input: numCourses = 1, prerequisites = []
Output: [0]

Constraints:
• 1 ≤ numCourses ≤ 2000
• 0 ≤ prerequisites.length ≤ numCourses * (numCourses - 1)
• prerequisites[i].length == 2
• 0 ≤ ai, bi < numCourses
• ai != bi
• All the pairs [ai, bi] are distinct.`,
      time: "35 min",
      solved: 445,
    },
    {
      id: 46,
      title: "Graph Valid Tree",
      difficulty: "medium",
      topic: "Graphs",
      description:
        "You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph.",
      problemStatement: `You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph.

Return true if the edges of the given graph make up a valid tree, and false otherwise.

Example 1:
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true

Example 2:
Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
Output: false

Constraints:
• 1 ≤ n ≤ 2000
• 0 ≤ edges.length ≤ 5000
• edges[i].length == 2
• 0 ≤ ai, bi < n
• ai != bi
• There are no self-loops or repeated edges.`,
      time: "30 min",
      solved: 389,
    },
    {
      id: 47,
      title: "Word Ladder",
      difficulty: "hard",
      topic: "Graphs",
      description:
        "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:",
      problemStatement: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

• Every adjacent pair of words differs by a single letter.
• Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
• sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.

Example 1:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.

Example 2:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0
Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.

Constraints:
• 1 ≤ beginWord.length ≤ 10
• endWord.length == beginWord.length
• 1 ≤ wordList.length ≤ 5000
• wordList[i].length == beginWord.length
• beginWord, endWord, and wordList[i] consist of lowercase English letters.
• beginWord != endWord
• All the words in wordList are unique.`,
      time: "45 min",
      solved: 234,
    },
    {
      id: 48,
      title: "Alien Dictionary",
      difficulty: "hard",
      topic: "Graphs",
      description:
        "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.",
      problemStatement: `There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.

You are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language.

Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return "". If there are multiple solutions, return any of them.

A string s is lexicographically smaller than a string t if at the first position i where s and t differ, the character s[i] comes before t[i] in the alien language. If the first min(s.length, t.length) positions are the same, then s is smaller if and only if s.length < t.length.

Example 1:
Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"

Example 2:
Input: words = ["z","x"]
Output: "zx"

Example 3:
Input: words = ["z","x","z"]
Output: ""
Explanation: The order is invalid, so return "".

Constraints:
• 1 ≤ words.length ≤ 100
• 1 ≤ words[i].length ≤ 100
• words[i] consists of only lowercase English letters.`,
      time: "50 min",
      solved: 178,
    },

    // Heap
    {
      id: 49,
      title: "Kth Largest Element",
      difficulty: "medium",
      topic: "Heap",
      description: "Find the kth largest element in an unsorted array.",
      problemStatement: `Find the kth largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Example 1:
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5

Example 2:
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4

Constraints:
• 1 ≤ k ≤ nums.length ≤ 10⁵
• -10⁴ ≤ nums[i] ≤ 10⁴`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 50,
      title: "Top K Frequent Elements",
      difficulty: "medium",
      topic: "Heap",
      description:
        "Given an integer array nums and an integer k, return the k most frequent elements.",
      problemStatement: `Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

Example 1:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Example 2:
Input: nums = [1], k = 1
Output: [1]

Constraints:
• 1 ≤ nums.length ≤ 10⁵
• -10⁴ ≤ nums[i] ≤ 10⁴
• k is in the range [1, the number of unique elements in the array].
• It is guaranteed that the answer is unique.

Follow up: Your algorithm's time complexity must be better than O(n log n), where n is the array's size.`,
      time: "30 min",
      solved: 456,
    },
    {
      id: 51,
      title: "Find Median from Data Stream",
      difficulty: "hard",
      topic: "Heap",
      description: "The median is the middle value in an ordered integer list.",
      problemStatement: `The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

For example, for arr = [2,3,4], the median is 3.
For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.

Implement the MedianFinder class:
• MedianFinder() initializes the MedianFinder object.
• void addNum(int num) adds the integer num from the data stream to the data structure.
• double findMedian() returns the median of all elements so far. Answers within 10⁻⁵ of the actual answer will be accepted.

Example 1:
Input
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output
[null, null, null, 1.5, null, 2.0]

Explanation
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr = [1, 2, 3]
medianFinder.findMedian(); // return 2.0

Constraints:
• -10⁵ ≤ num ≤ 10⁵
• There will be at least one element in the data structure before calling findMedian.
• At most 5 * 10⁴ calls will be made to addNum and findMedian.

Follow up:
• If all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?
• If 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?`,
      time: "40 min",
      solved: 234,
    },

    // Trie
    {
      id: 52,
      title: "Implement Trie",
      difficulty: "medium",
      topic: "Trie",
      description:
        'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
      problemStatement: `A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the Trie class:
• Trie() Initializes the trie object.
• void insert(String word) Inserts the string word into the trie.
• boolean search(String word) Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.
• boolean startsWith(String prefix) Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.

Example 1:
Input
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output
[null, null, true, false, true, null, true]

Explanation
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // return True
trie.search("app");     // return False
trie.startsWith("app"); // return True
trie.insert("app");
trie.search("app");     // return True

Constraints:
• 1 ≤ word.length, prefix.length ≤ 2000
• word and prefix consist only of lowercase English letters.
• At most 3 * 10⁴ calls in total will be made to insert, search, and startsWith.`,
      time: "35 min",
      solved: 445,
    },
    {
      id: 53,
      title: "Word Search II",
      difficulty: "hard",
      topic: "Trie",
      description:
        "Given an m x n board of characters and a list of strings words, return all words on the board.",
      problemStatement: `Given an m x n board of characters and a list of strings words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

Example 1:
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]

Example 2:
Input: board = [["a","b"],["c","d"]], words = ["abcb"]
Output: []

Constraints:
• m == board.length
• n == board[i].length
• 1 ≤ m, n ≤ 12
• board[i][j] is a lowercase English letter.
• 1 ≤ words.length ≤ 3 * 10⁴
• 1 ≤ words[i].length ≤ 10
• words[i] consists of lowercase English letters.
• All the strings of words are unique.`,
      time: "50 min",
      solved: 178,
    },

    // Backtracking
    {
      id: 54,
      title: "Subsets",
      difficulty: "medium",
      topic: "Backtracking",
      description:
        "Given an integer array nums of unique elements, return all possible subsets (the power set).",
      problemStatement: `Given an integer array nums of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

Example 1:
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

Example 2:
Input: nums = [0]
Output: [[],[0]]

Constraints:
• 1 ≤ nums.length ≤ 10
• -10 ≤ nums[i] ≤ 10
• All the numbers of nums are unique.`,
      time: "30 min",
      solved: 567,
    },
    {
      id: 55,
      title: "Combination Sum",
      difficulty: "medium",
      topic: "Backtracking",
      description:
        "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.",
      problemStatement: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

Example 1:
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.

Example 2:
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]

Example 3:
Input: candidates = [2], target = 1
Output: []

Constraints:
• 1 ≤ candidates.length ≤ 30
• 2 ≤ candidates[i] ≤ 40
• All elements of candidates are distinct.
• 1 ≤ target ≤ 40`,
      time: "35 min",
      solved: 456,
    },
    {
      id: 56,
      title: "Permutations",
      difficulty: "medium",
      topic: "Backtracking",
      description:
        "Given an array nums of distinct integers, return all the possible permutations.",
      problemStatement: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

Example 1:
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

Example 2:
Input: nums = [0,1]
Output: [[0,1],[1,0]]

Example 3:
Input: nums = [1]
Output: [[1]]

Constraints:
• 1 ≤ nums.length ≤ 6
• -10 ≤ nums[i] ≤ 10
• All the integers of nums are unique.`,
      time: "30 min",
      solved: 545,
    },
    {
      id: 57,
      title: "Letter Combinations of Phone Number",
      difficulty: "medium",
      topic: "Backtracking",
      description:
        "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.",
      problemStatement: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

2: abc
3: def
4: ghi
5: jkl
6: mno
7: pqrs
8: tuv
9: wxyz

Example 1:
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Example 2:
Input: digits = ""
Output: []

Example 3:
Input: digits = "2"
Output: ["a","b","c"]

Constraints:
• 0 ≤ digits.length ≤ 4
• digits[i] is a digit in the range ['2', '9'].`,
      time: "25 min",
      solved: 678,
    },
    {
      id: 58,
      title: "Palindrome Partitioning",
      difficulty: "medium",
      topic: "Backtracking",
      description:
        "Given a string s, partition s such that every substring of the partition is a palindrome.",
      problemStatement: `Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.

Example 1:
Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]

Example 2:
Input: s = "raceacar"
Output: [["r","a","c","e","a","c","a","r"],["r","a","ce","c","a","r"],["r","ace","ca","r"],["r","aceca","r"],["race","a","c","a","r"],["raceacar"]]

Example 3:
Input: s = "a"
Output: [["a"]]

Constraints:
• 1 ≤ s.length ≤ 16
• s contains only lowercase English letters.`,
      time: "35 min",
      solved: 389,
    },
    {
      id: 59,
      title: "N-Queens",
      difficulty: "hard",
      topic: "Backtracking",
      description:
        "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.",
      problemStatement: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.

Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.

Example 1:
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above

Example 2:
Input: n = 1
Output: [["Q"]]

Constraints:
• 1 ≤ n ≤ 9`,
      time: "45 min",
      solved: 234,
    },
    {
      id: 60,
      title: "Word Search",
      difficulty: "medium",
      topic: "Backtracking",
      description:
        "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      problemStatement: `Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

Example 1:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true

Example 2:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true

Example 3:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false

Constraints:
• m == board.length
• n = board[i].length
• 1 ≤ m, n ≤ 6
• 1 ≤ word.length ≤ 15
• board and word consists of only lowercase and uppercase English letters.

Follow up: Could you use search pruning to make your solution faster with a larger board?`,
      time: "30 min",
      solved: 456,
    },

    // Binary Search
    {
      id: 61,
      title: "Binary Search",
      difficulty: "easy",
      topic: "Binary Search",
      description:
        "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
      problemStatement: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4

Example 2:
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1

Constraints:
• 1 ≤ nums.length ≤ 10⁴
• -10⁴ < nums[i], target < 10⁴
• All the integers in nums are unique.
• nums is sorted in ascending order.`,
      time: "15 min",
      solved: 1234,
    },
    {
      id: 62,
      title: "Search in Rotated Sorted Array",
      difficulty: "medium",
      topic: "Binary Search",
      description:
        "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k.",
      problemStatement: `There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Example 2:
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1

Example 3:
Input: nums = [1], target = 0
Output: -1

Constraints:
• 1 ≤ nums.length ≤ 5000
• -10⁴ ≤ nums[i] ≤ 10⁴
• All values of nums are unique.
• nums is an ascending array that is possibly rotated.
• -10⁴ ≤ target ≤ 10⁴`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 63,
      title: "Find First and Last Position",
      difficulty: "medium",
      topic: "Binary Search",
      description:
        "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.",
      problemStatement: `Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.

If target is not found in the array, return [-1, -1].

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]

Example 2:
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]

Example 3:
Input: nums = [], target = 0
Output: [-1,-1]

Constraints:
• 0 ≤ nums.length ≤ 10⁵
• -10⁹ ≤ nums[i] ≤ 10⁹
• nums is a non-decreasing array.
• -10⁹ ≤ target ≤ 10⁹`,
      time: "25 min",
      solved: 456,
    },
    {
      id: 64,
      title: "Search Insert Position",
      difficulty: "easy",
      topic: "Binary Search",
      description:
        "Given a sorted array of distinct integers and a target value, return the index if the target is found.",
      problemStatement: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [1,3,5,6], target = 5
Output: 2

Example 2:
Input: nums = [1,3,5,6], target = 2
Output: 1

Example 3:
Input: nums = [1,3,5,6], target = 7
Output: 4

Constraints:
• 1 ≤ nums.length ≤ 10⁴
• -10⁴ ≤ nums[i] ≤ 10⁴
• nums contains distinct values sorted in ascending order.
• -10⁴ ≤ target ≤ 10⁴`,
      time: "15 min",
      solved: 987,
    },
    {
      id: 65,
      title: "Search a 2D Matrix",
      difficulty: "medium",
      topic: "Binary Search",
      description:
        "You are given an m x n integer matrix matrix with the following two properties:",
      problemStatement: `You are given an m x n integer matrix matrix with the following two properties:

• Each row is sorted in non-decreasing order.
• The first integer of each row is greater than the last integer of the previous row.

Given an integer target, return true if target is in matrix or false otherwise.

You must write a solution in O(log(m * n)) time complexity.

Example 1:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true

Example 2:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false

Constraints:
• m == matrix.length
• n == matrix[i].length
• 1 ≤ m, n ≤ 100
• -10⁴ ≤ matrix[i][j], target ≤ 10⁴`,
      time: "20 min",
      solved: 567,
    },

    // Two Pointers
    {
      id: 66,
      title: "Valid Palindrome",
      difficulty: "easy",
      topic: "Two Pointers",
      description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      problemStatement: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

Example 1:
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

Example 3:
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.

Constraints:
• 1 ≤ s.length ≤ 2 * 10⁵
• s consists only of printable ASCII characters.`,
      time: "15 min",
      solved: 1123,
    },
    {
      id: 67,
      title: "Two Sum II",
      difficulty: "easy",
      topic: "Two Pointers",
      description:
        "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
      problemStatement: `Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Let these two numbers be numbers[index1] and numbers[index2] where 1 <= index1 < index2 <= numbers.length.

Return the indices of the two numbers, index1 and index2, added by one as an integer array [index1, index2] of length 2.

The tests are generated such that there is exactly one solution. You may not use the same element twice.

Your solution must use only constant extra space.

Example 1:
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].

Example 2:
Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].

Example 3:
Input: numbers = [-1,0], target = -1
Output: [1,2]
Explanation: The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].

Constraints:
• 2 ≤ numbers.length ≤ 3 * 10⁴
• -1000 ≤ numbers[i] ≤ 1000
• numbers is sorted in non-decreasing order.
• -1000 ≤ target ≤ 1000
• The tests are generated such that there is exactly one solution.`,
      time: "15 min",
      solved: 876,
    },
    {
      id: 68,
      title: "3Sum",
      difficulty: "medium",
      topic: "Two Pointers",
      description:
        "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      problemStatement: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.

Example 2:
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.

Constraints:
• 3 ≤ nums.length ≤ 3000
• -10⁵ ≤ nums[i] ≤ 10⁵`,
      time: "35 min",
      solved: 534,
    },
    {
      id: 69,
      title: "Container With Most Water",
      difficulty: "medium",
      topic: "Two Pointers",
      description:
        "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      problemStatement: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container that can hold the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

Example 2:
Input: height = [1,1]
Output: 1

Constraints:
• n == height.length
• 2 ≤ n ≤ 10⁵
• 0 ≤ height[i] ≤ 10⁴`,
      time: "25 min",
      solved: 678,
    },
    {
      id: 70,
      title: "Trapping Rain Water",
      difficulty: "hard",
      topic: "Two Pointers",
      description:
        "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      problemStatement: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example 1:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.

Example 2:
Input: height = [4,2,0,3,2,5]
Output: 9

Constraints:
• n == height.length
• 1 ≤ n ≤ 2 * 10⁴
• 0 ≤ height[i] ≤ 3 * 10⁴`,
      time: "40 min",
      solved: 345,
    },

    // Sliding Window
    {
      id: 71,
      title: "Best Time to Buy and Sell Stock",
      difficulty: "easy",
      topic: "Sliding Window",
      description:
        "You are given an array prices where prices[i] is the price of a given stock on the ith day.",
      problemStatement: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
• 1 ≤ prices.length ≤ 10⁵
• 0 ≤ prices[i] ≤ 10⁴`,
      time: "20 min",
      solved: 1098,
    },
    {
      id: 72,
      title: "Longest Substring Without Repeating",
      difficulty: "medium",
      topic: "Sliding Window",
      description:
        "Given a string s, find the length of the longest substring without repeating characters.",
      problemStatement: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

Constraints:
• 0 ≤ s.length ≤ 5 * 10⁴
• s consists of English letters, digits, symbols and spaces.`,
      time: "30 min",
      solved: 567,
    },
    {
      id: 73,
      title: "Longest Repeating Character Replacement",
      difficulty: "medium",
      topic: "Sliding Window",
      description:
        "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character.",
      problemStatement: `You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

Example 1:
Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with two 'B's or vice versa.

Example 2:
Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
The substring "BBBB" has the longest repeating letters, which is 4.
There may exists other ways to achieve this answer too.

Constraints:
• 1 ≤ s.length ≤ 10⁵
• s consists of only uppercase English letters.
• 0 ≤ k ≤ s.length`,
      time: "35 min",
      solved: 445,
    },
    {
      id: 74,
      title: "Minimum Window Substring",
      difficulty: "hard",
      topic: "Sliding Window",
      description:
        "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
      problemStatement: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".

The testcases will be generated such that the answer is unique.

Example 1:
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.

Example 2:
Input: s = "a", t = "a"
Output: "a"
Explanation: The entire string s is the minimum window.

Example 3:
Input: s = "a", t = "aa"
Output: ""
Explanation: Both 'a's from t must be included in the window.
Since the largest window of s only has one 'a', return empty string.

Constraints:
• m == s.length
• n == t.length
• 1 ≤ m, n ≤ 10⁵
• s and t consist of uppercase and lowercase English letters.

Follow up: Could you find an algorithm that runs in O(m + n) time?`,
      time: "45 min",
      solved: 234,
    },
    {
      id: 75,
      title: "Sliding Window Maximum",
      difficulty: "hard",
      topic: "Sliding Window",
      description:
        "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.",
      problemStatement: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

Example 1:
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation: 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7

Example 2:
Input: nums = [1], k = 1
Output: [1]

Constraints:
• 1 ≤ nums.length ≤ 10⁵
• -10⁴ ≤ nums[i] ≤ 10⁴
• 1 ≤ k ≤ nums.length`,
      time: "40 min",
      solved: 267,
    },

    // String Manipulation
    {
      id: 76,
      title: "Reverse String",
      difficulty: "easy",
      topic: "String Manipulation",
      description:
        "Write a function that reverses a string. The input string is given as an array of characters s.",
      problemStatement: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

Example 2:
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]

Constraints:
• 1 ≤ s.length ≤ 10⁵
• s[i] is a printable ascii character.`,
      time: "10 min",
      solved: 1456,
    },
    {
      id: 77,
      title: "First Unique Character",
      difficulty: "easy",
      topic: "String Manipulation",
      description:
        "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
      problemStatement: `Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.

Example 1:
Input: s = "leetcode"
Output: 0

Example 2:
Input: s = "loveleetcode"
Output: 2

Example 3:
Input: s = "aabb"
Output: -1

Constraints:
• 1 ≤ s.length ≤ 10⁵
• s consists of only lowercase English letters.`,
      time: "15 min",
      solved: 1123,
    },
    {
      id: 78,
      title: "Valid Anagram",
      difficulty: "easy",
      topic: "String Manipulation",
      description:
        "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      problemStatement: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Example 1:
Input: s = "anagram", t = "nagaram"
Output: true

Example 2:
Input: s = "rat", t = "car"
Output: false

Constraints:
• 1 ≤ s.length, t.length ≤ 5 * 10⁴
• s and t consist of lowercase English letters.

Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?`,
      time: "15 min",
      solved: 987,
    },
    {
      id: 79,
      title: "Group Anagrams",
      difficulty: "medium",
      topic: "String Manipulation",
      description:
        "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      problemStatement: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Example 1:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

Example 2:
Input: strs = [""]
Output: [[""]]

Example 3:
Input: strs = ["a"]
Output: [["a"]]

Constraints:
• 1 ≤ strs.length ≤ 10⁴
• 0 ≤ strs[i].length ≤ 100
• strs[i] consists of lowercase English letters.`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 80,
      title: "Longest Palindromic Substring",
      difficulty: "medium",
      topic: "String Manipulation",
      description:
        "Given a string s, return the longest palindromic substring in s.",
      problemStatement: `Given a string s, return the longest palindromic substring in s.

Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:
Input: s = "cbbd"
Output: "bb"

Constraints:
• 1 ≤ s.length ≤ 1000
• s consist of only digits and English letters.`,
      time: "30 min",
      solved: 456,
    },

    // Math
    {
      id: 81,
      title: "Happy Number",
      difficulty: "easy",
      topic: "Math",
      description: "Write an algorithm to determine if a number n is happy.",
      problemStatement: `Write an algorithm to determine if a number n is happy.

A happy number is a number defined by the following process:
• Starting with any positive integer, replace the number by the sum of the squares of its digits.
• Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
• Those numbers for which this process ends in 1 are happy.

Return true if n is a happy number, and false if not.

Example 1:
Input: n = 19
Output: true
Explanation:
1² + 9² = 82
8² + 2² = 68
6² + 8² = 100
1² + 0² + 0² = 1

Example 2:
Input: n = 2
Output: false

Constraints:
• 1 ≤ n ≤ 2³¹ - 1`,
      time: "20 min",
      solved: 876,
    },
    {
      id: 82,
      title: "Plus One",
      difficulty: "easy",
      topic: "Math",
      description:
        "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer.",
      problemStatement: `You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading zeros.

Increment the large integer by one and return the resulting array of digits.

Example 1:
Input: digits = [1,2,3]
Output: [1,2,4]
Explanation: The array represents the integer 123.
Incrementing by one gives 123 + 1 = 124.
Thus, the result should be [1,2,4].

Example 2:
Input: digits = [4,3,2,1]
Output: [4,3,2,2]
Explanation: The array represents the integer 4321.
Incrementing by one gives 4321 + 1 = 4322.
Thus, the result should be [4,3,2,2].

Example 3:
Input: digits = [9]
Output: [1,0]
Explanation: The array represents the integer 9.
Incrementing by one gives 9 + 1 = 10.
Thus, the result should be [1,0].

Constraints:
• 1 ≤ digits.length ≤ 100
• 0 ≤ digits[i] ≤ 9
• digits does not contain any leading zeros.`,
      time: "15 min",
      solved: 1234,
    },
    {
      id: 83,
      title: "Pow(x, n)",
      difficulty: "medium",
      topic: "Math",
      description:
        "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
      problemStatement: `Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).

Example 1:
Input: x = 2.00000, n = 10
Output: 1024.00000

Example 2:
Input: x = 2.10000, n = 3
Output: 9.26100

Example 3:
Input: x = 2.00000, n = -2
Output: 0.25000
Explanation: 2^-2 = 1/2² = 1/4 = 0.25

Constraints:
• -100.0 < x < 100.0
• -2³¹ ≤ n ≤ 2³¹-1
• n is an integer.
• Either x is not zero or n > 0.
• -10⁴ ≤ x^n ≤ 10⁴`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 84,
      title: "Sqrt(x)",
      difficulty: "easy",
      topic: "Math",
      description:
        "Given a non-negative integer x, return the square root of x rounded down to the nearest integer.",
      problemStatement: `Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.

You must not use any built-in exponent function or operator.

For example, do not use pow(x, 0.5) in c++ or x ** 0.5 in python.

Example 1:
Input: x = 4
Output: 2
Explanation: The square root of 4 is 2, so we return 2.

Example 2:
Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.

Constraints:
• 0 ≤ x ≤ 2³¹ - 1`,
      time: "20 min",
      solved: 789,
    },
    {
      id: 85,
      title: "Reverse Integer",
      difficulty: "medium",
      topic: "Math",
      description:
        "Given a signed 32-bit integer x, return x with its digits reversed.",
      problemStatement: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).

Example 1:
Input: x = 123
Output: 321

Example 2:
Input: x = -123
Output: -321

Example 3:
Input: x = 120
Output: 21

Constraints:
• -2³¹ ≤ x ≤ 2³¹ - 1`,
      time: "20 min",
      solved: 654,
    },

    // Bit Manipulation
    {
      id: 86,
      title: "Single Number",
      difficulty: "easy",
      topic: "Bit Manipulation",
      description:
        "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
      problemStatement: `Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.

Example 1:
Input: nums = [2,2,1]
Output: 1

Example 2:
Input: nums = [4,1,2,1,2]
Output: 4

Example 3:
Input: nums = [1]
Output: 1

Constraints:
• 1 ≤ nums.length ≤ 3 * 10⁴
• -3 * 10⁴ ≤ nums[i] ≤ 3 * 10⁴
• Each element in the array appears twice except for one element which appears only once.`,
      time: "15 min",
      solved: 1123,
    },
    {
      id: 87,
      title: "Number of 1 Bits",
      difficulty: "easy",
      topic: "Bit Manipulation",
      description:
        "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
      problemStatement: `Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).

Note:
• Note that in some languages, such as Java, there is no unsigned integer type. In this case, the input will be given as a signed integer type. It should not affect your implementation, as the integer's internal binary representation is the same, whether it is signed or unsigned.
• In Java, the compiler represents the signed integers using 2's complement notation. Therefore, in Example 3, the input represents the signed integer. -3.

Example 1:
Input: n = 00000000000000000000000000001011
Output: 3
Explanation: The input binary string 00000000000000000000000000001011 has a total of three '1' bits.

Example 2:
Input: n = 00000000000000000000000010000000
Output: 1
Explanation: The input binary string 00000000000000000000000010000000 has a total of one '1' bit.

Example 3:
Input: n = 11111111111111111111111111111101
Output: 31
Explanation: The input binary string 11111111111111111111111111111101 has a total of thirty one '1' bits.

Constraints:
• The input must be a binary string of length 32.

Follow up: If this function is called many times, how would you optimize it?`,
      time: "15 min",
      solved: 987,
    },
    {
      id: 88,
      title: "Counting Bits",
      difficulty: "easy",
      topic: "Bit Manipulation",
      description:
        "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.",
      problemStatement: `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.

Example 1:
Input: n = 2
Output: [0,1,1]
Explanation:
0 --> 0
1 --> 1
2 --> 10

Example 2:
Input: n = 5
Output: [0,1,1,2,1,2]
Explanation:
0 --> 0
1 --> 1
2 --> 10
3 --> 11
4 --> 100
5 --> 101

Constraints:
• 0 ≤ n ≤ 10⁵

Follow up:
• It is very easy to come up with a solution with a runtime of O(n log n). Can you do it in linear time O(n)?
• Can you do it without using any built-in function (i.e., like __builtin_popcount in C++)?`,
      time: "20 min",
      solved: 765,
    },
    {
      id: 89,
      title: "Missing Number",
      difficulty: "easy",
      topic: "Bit Manipulation",
      description:
        "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
      problemStatement: `Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.

Example 1:
Input: nums = [3,0,1]
Output: 2
Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.

Example 2:
Input: nums = [0,1]
Output: 2
Explanation: n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.

Example 3:
Input: nums = [9,6,4,2,3,5,7,0,1]
Output: 8
Explanation: n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 8 is the missing number in the range since it does not appear in nums.

Constraints:
• n == nums.length
• 1 ≤ n ≤ 10⁴
• 0 ≤ nums[i] ≤ n
• All the numbers of nums are unique.

Follow up: Could you implement a solution using only O(1) extra space complexity and O(n) runtime complexity?`,
      time: "15 min",
      solved: 876,
    },
    {
      id: 90,
      title: "Reverse Bits",
      difficulty: "easy",
      topic: "Bit Manipulation",
      description: "Reverse bits of a given 32 bits unsigned integer.",
      problemStatement: `Reverse bits of a given 32 bits unsigned integer.

Note:
• Note that in some languages, such as Java, there is no unsigned integer type. In this case, both input and output will be given as a signed integer type. They should not affect your implementation, as the integer's internal binary representation is the same, whether it is signed or unsigned.
• In Java, the compiler represents the signed integers using 2's complement notation. Therefore, in Example 2 above, the input represents the signed integer -3 and the output represents the signed integer -1073741825.

Example 1:
Input: n = 00000010100101000001111010011100
Output:    00111001011110000010100101000000
Explanation: The input binary string 00000010100101000001111010011100 represents the unsigned integer 43261596, so return 964176192 which its binary representation is 00111001011110000010100101000000.

Example 2:
Input: n = 11111111111111111111111111111101
Output:   10111111111111111111111111111111
Explanation: The input binary string 11111111111111111111111111111101 represents the unsigned integer 4294967293, so return 3221225471 which its binary representation is 10111111111111111111111111111111.

Constraints:
• The input must be a binary string of length 32

Follow up: If this function is called many times, how would you optimize it?`,
      time: "20 min",
      solved: 654,
    },

    // Greedy
    {
      id: 91,
      title: "Maximum Subarray",
      difficulty: "easy",
      topic: "Greedy",
      description:
        "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      problemStatement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

Constraints:
• 1 ≤ nums.length ≤ 10⁵
• -10⁴ ≤ nums[i] ≤ 10⁴

Follow up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.`,
      time: "20 min",
      solved: 789,
    },
    {
      id: 92,
      title: "Jump Game",
      difficulty: "medium",
      topic: "Greedy",
      description:
        "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.",
      problemStatement: `You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.

Example 1:
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.

Example 2:
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

Constraints:
• 1 ≤ nums.length ≤ 10⁴
• 0 ≤ nums[i] ≤ 10⁵`,
      time: "25 min",
      solved: 556,
    },
    {
      id: 93,
      title: "Jump Game II",
      difficulty: "medium",
      topic: "Greedy",
      description:
        "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0].",
      problemStatement: `You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0].

Each element nums[i] represents the maximum length of a forward jump from index i. In order words, if you are at nums[i], you can jump to any nums[i + j] where:
• 0 <= j <= nums[i] and
• i + j < n

Return the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can reach nums[n - 1].

Example 1:
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.

Example 2:
Input: nums = [2,3,0,1,4]
Output: 2

Constraints:
• 1 ≤ nums.length ≤ 10⁴
• 0 ≤ nums[i] ≤ 1000
• It's guaranteed that you can reach nums[n - 1].`,
      time: "30 min",
      solved: 445,
    },
    {
      id: 94,
      title: "Gas Station",
      difficulty: "medium",
      topic: "Greedy",
      description:
        "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].",
      problemStatement: `There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.

Example 1:
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation:
Start at station 3 (index 3) and fill up with 4 units of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.

Example 2:
Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
Explanation:
You can't start at station 0 or 1, as there is not enough gas to travel to the next station.
Let's start at station 2 and fill up with 4 units of gas. Your tank = 0 + 4 = 4
Travel to station 0. Your tank = 4 - 3 + 2 = 3
Travel to station 1. Your tank = 3 - 3 + 3 = 3
You cannot travel back to station 2, as it requires 4 units of gas but you only have 3.
Therefore, you can't travel around the circuit once no matter where you start.

Constraints:
• n == gas.length == cost.length
• 1 ≤ n ≤ 10⁵
• 0 ≤ gas[i], cost[i] ≤ 10⁴`,
      time: "30 min",
      solved: 389,
    },
    {
      id: 95,
      title: "Hand of Straights",
      difficulty: "medium",
      topic: "Greedy",
      description:
        "Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.",
      problemStatement: `Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.

Given an integer array hand where hand[i] is the value written on the ith card and an integer groupSize, return true if she can rearrange the cards, or false otherwise.

Example 1:
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
Explanation: Alice's hand can be rearranged as [1,2,3],[2,3,4],[6,7,8]

Example 2:
Input: hand = [1,2,3,4,5], groupSize = 4
Output: false
Explanation: Alice's hand can't be rearranged into groups of 4.

Constraints:
• 1 ≤ hand.length ≤ 10⁴
• 0 ≤ hand[i] ≤ 10⁹
• 1 ≤ groupSize ≤ hand.length

Note: This question is the same as 1296: https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/`,
      time: "35 min",
      solved: 334,
    },

    // Union Find
    {
      id: 96,
      title: "Number of Connected Components",
      difficulty: "medium",
      topic: "Union Find",
      description:
        "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.",
      problemStatement: `You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.

Return the number of connected components in the graph.

Example 1:
Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2

Example 2:
Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1

Constraints:
• 1 ≤ n ≤ 2000
• 1 ≤ edges.length ≤ 5000
• edges[i].length == 2
• 0 ≤ ai <= bi < n
• ai != bi
• There are no repeated edges.`,
      time: "30 min",
      solved: 445,
    },
    {
      id: 97,
      title: "Redundant Connection",
      difficulty: "medium",
      topic: "Union Find",
      description:
        "In this problem, a tree is an undirected graph that is connected and has no cycles.",
      problemStatement: `In this problem, a tree is an undirected graph that is connected and has no cycles.

You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed. The graph is represented as an array edges of length n where edges[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the graph.

Return an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.

Example 1:
Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]

Example 2:
Input: edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
Output: [1,4]

Constraints:
• n == edges.length
• 3 ≤ n ≤ 1000
• edges[i].length == 2
• 1 ≤ ai < bi ≤ edges.length
• ai != bi
• There are no repeated edges.
• The given graph is connected.`,
      time: "30 min",
      solved: 389,
    },
    {
      id: 98,
      title: "Accounts Merge",
      difficulty: "medium",
      topic: "Union Find",
      description:
        "Given a list of accounts where each element accounts[i] is a list of strings, where the first element accounts[i][0] is a name, and the rest of the elements are emails representing emails of the account.",
      problemStatement: `Given a list of accounts where each element accounts[i] is a list of strings, where the first element accounts[i][0] is a name, and the rest of the elements are emails representing emails of the account.

Now, we would like to merge these accounts. Two accounts definitely belong to the same person if there is some common email to both accounts. Note that even if two accounts have the same name, they may belong to different people as people could have the same name. A person can have any number of accounts initially, but all of their accounts definitely have the same name.

After merging the accounts, return the accounts in the following format: the first element of each account is the name, and the rest of the elements are emails in sorted order. The accounts themselves can be returned in any order.

Example 1:
Input: accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
Explanation:
The first and second John's are the same person as they have the common email "johnsmith@mail.com".
The third John and Mary are different people as none of their email addresses are used by other accounts.
We could return these lists in any order, for example the answer [['Mary', 'mary@mail.com'], ['John', 'johnnybravo@mail.com'], 
['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com']] would still be accepted.

Example 2:
Input: accounts = [["Gabe","Gabe0@m.co","Gabe3@m.co","Gabe1@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co","Kevin0@m.co"],["Ethan","Ethan5@m.co","Ethan4@m.co","Ethan0@m.co"],["Hanzo","Hanzo3@m.co","Hanzo1@m.co","Hanzo0@m.co"],["Fern","Fern5@m.co","Fern1@m.co","Fern0@m.co"]]
Output: [["Ethan","Ethan0@m.co","Ethan4@m.co","Ethan5@m.co"],["Gabe","Gabe0@m.co","Gabe1@m.co","Gabe3@m.co"],["Hanzo","Hanzo0@m.co","Hanzo1@m.co","Hanzo3@m.co"],["Kevin","Kevin0@m.co","Kevin3@m.co","Kevin5@m.co"],["Fern","Fern0@m.co","Fern1@m.co","Fern5@m.co"]]

Constraints:
• 1 ≤ accounts.length ≤ 1000
• 2 ≤ accounts[i].length ≤ 10
• 1 ≤ accounts[i][j].length ≤ 30
• accounts[i][0] consists of English letters.
• accounts[i][j] (for j > 0) is a valid email.`,
      time: "40 min",
      solved: 278,
    },

    // Intervals
    {
      id: 99,
      title: "Insert Interval",
      difficulty: "medium",
      topic: "Intervals",
      description:
        "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti.",
      problemStatement: `You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.

Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return intervals after the insertion.

Example 1:
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]

Example 2:
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].

Constraints:
• 0 ≤ intervals.length ≤ 10⁴
• intervals[i].length == 2
• 0 ≤ starti ≤ endi ≤ 10⁵
• intervals is sorted by starti in ascending order.
• newInterval.length == 2
• 0 ≤ start ≤ end ≤ 10⁵`,
      time: "25 min",
      solved: 567,
    },
    {
      id: 100,
      title: "Non-overlapping Intervals",
      difficulty: "medium",
      topic: "Intervals",
      description:
        "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
      problemStatement: `Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

Example 1:
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: [1,3] can be removed and the rest of the intervals are non-overlapping.

Example 2:
Input: intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: You need to remove two [1,2] to make the rest of the intervals non-overlapping.

Example 3:
Input: intervals = [[1,2],[2,3]]
Output: 0
Explanation: You don't need to remove any of the intervals since they're already non-overlapping.

Constraints:
• 1 ≤ intervals.length ≤ 10⁵
• intervals[i].length == 2
• -5 * 10⁴ ≤ starti < endi ≤ 5 * 10⁴`,
      time: "30 min",
      solved: 445,
    },
  ];

  const filteredProblems = problems.filter((problem) => {
    const topicMatch =
      selectedTopic === "all" || problem.topic === selectedTopic;
    const difficultyMatch =
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    return topicMatch && difficultyMatch;
  });

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "outline";
      case "medium":
        return "outline";
      case "hard":
        return "outline";
      default:
        return "default";
    }
  };

  const handleSolveClick = (problem: Problem) => {
    navigate(`/coding/problem/${problem.id}`);
  };

  const languages = [
    {
      id: "javascript",
      name: "JavaScript",
      template:
        "function solve() {\n    // Write your code here\n    return result;\n}",
    },
    {
      id: "python",
      name: "Python",
      template: "def solve():\n    # Write your code here\n    return result",
    },
    {
      id: "java",
      name: "Java",
      template:
        "public class Solution {\n    public int solve() {\n        // Write your code here\n        return result;\n    }\n}",
    },
    {
      id: "cpp",
      name: "C++",
      template:
        "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your code here\n        return result;\n    }\n};",
    },
    {
      id: "c",
      name: "C",
      template:
        "#include <stdio.h>\n\nint solve() {\n    // Write your code here\n    return result;\n}",
    },
    {
      id: "sql",
      name: "SQL",
      template: "-- Write your SQL query here\nSELECT * FROM table_name;",
    },
  ];

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const selectedLang = languages.find((lang) => lang.id === language);
    if (selectedLang) {
      setCode(selectedLang.template);
    }
  };

  const handleRunCode = () => {
    if (!isAuthenticated ) {
      setOutput("Please log in to run code and submit solutions.");
      return;
    }

    setIsRunning(true);
    // Simulate code execution with sample output
    setTimeout(() => {
      const sampleOutput =
        selectedLanguage === "python"
          ? "Hello World\n42\n[1, 2, 3]"
          : selectedLanguage === "java"
          ? "Hello World\n42"
          : "Hello World\n42\n[1, 2, 3]";

      setOutput(
        `Execution completed:\n\n${sampleOutput}\n\n--- Debug Info ---\nLanguage: ${selectedLanguage}\nExecution time: 1.2s\nMemory used: 15.4 MB`
      );
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmitCode = () => {
    if (!isAuthenticated) {
      setOutput("Please log in to submit solutions.");
      return;
    }

    if (!code.trim()) return;

    setIsRunning(true);

    // Simulate running test cases
    setTimeout(() => {
      if (selectedQuestion) {
        const questionData = getDetailedQuestionData(selectedQuestion);
        const testCases = questionData.testCases || [];

        // Simulate test case execution with improved logic
        let passedTests = 0;
        const testResults = [];

        // Simulate more realistic test execution based on code quality
        const codeQuality =
          (code.length > 50 && code.includes("function")) ||
          code.includes("def") ||
          code.includes("class")
            ? 0.8
            : 0.4;

        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          // Better simulation based on code content
          const passed = Math.random() < codeQuality;
          if (passed) passedTests++;

          testResults.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.output,
            actual: passed ? testCase.output : "Wrong output",
            passed: passed,
          });
        }

        const allPassed = passedTests === testCases.length;
        const submissionTime = new Date().toISOString();

        let output = `🔍 TEST RESULTS\n\n`;
        output += `Passed: ${passedTests}/${testCases.length} test cases\n`;
        output += `Submission Time: ${new Date(
          submissionTime
        ).toLocaleString()}\n\n`;

        testResults.forEach((result, index) => {
          const status = result.passed ? "✅ PASS" : "❌ FAIL";
          output += `Test Case ${result.testCase}: ${status}\n`;
          output += `Input: ${result.input}\n`;
          output += `Expected: ${result.expected}\n`;
          output += `Your Output: ${result.actual}\n\n`;
        });

        // Enhanced solution storage system
        const solution = {
          id: `${selectedQuestion.id}_${Date.now()}`,
          problemId: selectedQuestion.id,
          title: selectedQuestion.title,
          difficulty: selectedQuestion.difficulty,
          topic: selectedQuestion.topic,
          language: selectedLanguage,
          code: code,
          timestamp: submissionTime,
          testsPassed: passedTests,
          totalTests: testCases.length,
          passed: allPassed,
          runtime: `${(Math.random() * 1000 + 100).toFixed(0)}ms`,
          memory: `${(Math.random() * 20 + 10).toFixed(1)} MB`,
          status: allPassed ? "Accepted" : "Failed",
        };

        // Store in localStorage (will be Supabase database later)
        const savedSolutions = JSON.parse(
          localStorage.getItem("codingSolutions") || "[]"
        );
        savedSolutions.unshift(solution); // Add to beginning

        // Keep only last 50 submissions to avoid storage bloat
        if (savedSolutions.length > 50) {
          savedSolutions.splice(50);
        }

        localStorage.setItem("codingSolutions", JSON.stringify(savedSolutions));

        if (allPassed) {
          output += `🎉 CONGRATULATIONS!\n`;
          output += `All test cases passed! Your solution has been saved.\n\n`;
          output += `📊 Submission Details:\n`;
          output += `• Problem: ${selectedQuestion.title}\n`;
          output += `• Difficulty: ${selectedQuestion.difficulty}\n`;
          output += `• Language: ${selectedLanguage}\n`;
          output += `• Runtime: ${solution.runtime}\n`;
          output += `• Memory: ${solution.memory}\n`;
          output += `• Status: ${solution.status}\n\n`;
          output += `💾 Solution saved to your profile!\n`;

          // Also update problem-specific statistics
          const problemStats = JSON.parse(
            localStorage.getItem("problemStats") || "{}"
          );
          if (!problemStats[selectedQuestion.id]) {
            problemStats[selectedQuestion.id] = {
              attempts: 0,
              solved: false,
              bestTime: null,
              languages: [],
            };
          }

          problemStats[selectedQuestion.id].attempts += 1;
          problemStats[selectedQuestion.id].solved = true;
          problemStats[selectedQuestion.id].bestTime = solution.runtime;

          if (
            !problemStats[selectedQuestion.id].languages.includes(
              selectedLanguage
            )
          ) {
            problemStats[selectedQuestion.id].languages.push(selectedLanguage);
          }

          localStorage.setItem("problemStats", JSON.stringify(problemStats));
        } else {
          output += `❌ SOLUTION INCOMPLETE\n`;
          output += `${testCases.length - passedTests} test case(s) failed.\n`;
          output += `💡 Hints:\n`;
          output += `• Check your logic against the failed test cases\n`;
          output += `• Consider edge cases and boundary conditions\n`;
          output += `• Verify your algorithm's correctness\n\n`;
          output += `📊 Submission Details:\n`;
          output += `• Status: ${solution.status}\n`;
          output += `• Runtime: ${solution.runtime}\n`;
          output += `• Memory: ${solution.memory}\n\n`;
          output += `💾 Attempt saved to your history.\n`;
        }

        setOutput(output);

        // Store attempt even if failed
        const problemStats = JSON.parse(
          localStorage.getItem("problemStats") || "{}"
        );
        if (!problemStats[selectedQuestion.id]) {
          problemStats[selectedQuestion.id] = {
            attempts: 0,
            solved: false,
            bestTime: null,
            languages: [],
          };
        }
        problemStats[selectedQuestion.id].attempts += 1;
        localStorage.setItem("problemStats", JSON.stringify(problemStats));
      }
      setIsRunning(false);
    }, 3000);
  };

  const getDetailedQuestionData = (question: Problem) => {
    // Comprehensive question data for all problems
    const questionData: Record<number, QuestionData> = {
      // Arrays
      1: {
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
          },
          {
            input: "nums = [3,3], target = 6",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
          },
        ],
        constraints: [
          "2 ≤ nums.length ≤ 10⁴",
          "-10⁹ ≤ nums[i] ≤ 10⁹",
          "-10⁹ ≤ target ≤ 10⁹",
          "Only one valid answer exists.",
        ],
        hints: [
          "Use a hash map to store values and their indices",
          "For each element, check if target - element exists in the map",
          "Return indices when complement is found",
        ],
        approach: "Hash Map",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        testCases: [
          { input: "[2,7,11,15], 9", output: "[0,1]" },
          { input: "[3,2,4], 6", output: "[1,2]" },
          { input: "[3,3], 6", output: "[0,1]" },
        ],
      },
      2: {
        description:
          "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        examples: [
          {
            input: "prices = [7,1,5,3,6,4]",
            output: "5",
            explanation:
              "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
          },
          {
            input: "prices = [7,6,4,3,1]",
            output: "0",
            explanation:
              "In this case, no transactions are done and the max profit = 0.",
          },
        ],
        constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
        hints: [
          "Keep track of the minimum price seen so far",
          "Calculate profit for each day",
          "Track maximum profit achieved",
        ],
        approach: "One Pass",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        testCases: [
          { input: "[7,1,5,3,6,4]", output: "5" },
          { input: "[7,6,4,3,1]", output: "0" },
          { input: "[1,2,3,4,5]", output: "4" },
        ],
      },
      3: {
        description:
          "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        examples: [
          {
            input: "nums = [1,2,3,1]",
            output: "true",
            explanation: "The element 1 occurs at indices 0 and 3.",
          },
          {
            input: "nums = [1,2,3,4]",
            output: "false",
            explanation: "All elements are distinct.",
          },
          {
            input: "nums = [1,1,1,3,3,4,3,2,4,2]",
            output: "true",
            explanation: "Multiple duplicates exist.",
          },
        ],
        constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
        hints: [
          "Use a set to track seen elements",
          "Return true immediately when duplicate found",
          "Consider sorting approach as alternative",
        ],
        approach: "Hash Set",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        testCases: [
          { input: "[1,2,3,1]", output: "true" },
          { input: "[1,2,3,4]", output: "false" },
        ],
      },
    };

    // Generate default data for questions without specific details
    const defaultData = {
      description: `Solve this ${question.topic.toLowerCase()} problem: ${
        question.description
      }`,
      examples: [
        {
          input: "Example input will be provided",
          output: "Expected output",
          explanation: "Detailed explanation of the solution approach.",
        },
      ],
      constraints: [
        "Constraints will be specified based on problem requirements",
      ],
      hints: [
        "Analyze the problem requirements",
        "Consider edge cases",
        "Optimize for time and space complexity",
      ],
      approach: "Problem-specific approach",
      timeComplexity: "To be determined",
      spaceComplexity: "To be determined",
      testCases: [
        { input: "Test case 1", output: "Expected result 1" },
        { input: "Test case 2", output: "Expected result 2" },
      ],
    };

    return questionData[question.id] || defaultData;
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="max-w-2xl mx-auto text-center">
  //         <Card className="p-8">
  //           <div className="flex justify-center mb-4">
  //             <Lock className="w-16 h-16 text-muted-foreground" />
  //           </div>
  //           <CardTitle className="text-2xl mb-4">
  //             Authentication Required
  //           </CardTitle>
  //           <CardDescription className="text-lg mb-6">
  //             Please log in to access coding problems, run code, and submit
  //             solutions.
  //           </CardDescription>
  //           <Alert>
  //             <Lock className="w-4 h-4" />
  //             <AlertDescription>
  //               Coding practice requires authentication to save your progress
  //               and submissions.
  //             </AlertDescription>
  //           </Alert>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Data Structures & Algorithms
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master coding interviews with our comprehensive collection of DSA
            problems. Practice with problems from easy to advanced difficulty
            levels.
          </p>
        </div>

        {/* Stats Cards */}
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, value: "500+", label: "Problems" },
            { icon: Code, value: "12", label: "Topics" },
            { icon: Clock, value: "15-60", label: "Minutes" },
            { icon: Users, value: "5000+", label: "Solved" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card
                key={i}
                className="flex items-center justify-center h-40" // ✅ Fixed height for balance
              >
                <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full">
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <div className="text-2xl font-bold text-foreground">
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Topics Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Choose Your Topic
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topics.map((topic) => (
              <Card
                key={topic}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                  selectedTopic === topic ? "ring-2 ring-primary shadow-md" : ""
                } flex items-center justify-center h-28`} // ✅ Centered + equal height
                onClick={() => setSelectedTopic(topic)}
              >
                <CardContent className="flex items-center justify-center text-center p-4 h-full">
                  <div className="text-sm font-medium text-foreground">
                    {topic}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setSelectedTopic("all");
              setSelectedDifficulty("all");
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Practice Problems ({filteredProblems.length})
          </h2>

          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {problem.title}
                      </h3>
                      <Badge variant={getDifficultyVariant(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline">{problem.topic}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{problem.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{problem.solved} solved</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        navigate(`/solve/${problem.id}`, { state: { problem } })
                      }
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Solve Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Question Detail Modal - Full Screen Layout */}

        {/* Solutions Viewer */}
        <SolutionsViewer
          isOpen={isSolutionsViewerOpen}
          onOpenChange={setIsSolutionsViewerOpen}
        />
      </div>
    </div>
  );
};

export default Coding;
