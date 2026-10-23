/**
 * StudySync Default Data Seeder
 * High quality curated academic notes, flashcards, quizzes, and discussions.
 */

const DEFAULT_NOTES = [
    {
        id: "note-cs-201",
        title: "CS 201: Data Structures & Algorithms Mastery Notes",
        subject: "Computer Science",
        category: "Computer Science",
        courseCode: "CS 201",
        university: "Stanford University",
        author: {
            name: "Alex Chen",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "Teaching Assistant"
        },
        description: "Complete cheat sheet and comprehensive breakdown of Big-O complexity, Trees, Graphs, BFS/DFS, Heaps, and Dynamic Programming templates.",
        date: "2026-09-15",
        rating: 4.9,
        reviewsCount: 142,
        upvotes: 524,
        downloads: 1480,
        pages: 18,
        fileType: "PDF + Markdown",
        resourceType: "Comprehensive Notes",
        tags: ["algorithms", "data-structures", "python", "interview-prep", "graph-theory"],
        content: `
# CS 201: Data Structures & Algorithms Mastery Guide

## 1. Asymptotic Complexity (Big-O Cheat Sheet)
Understanding how algorithms scale is fundamental to systems and software engineering.

| Data Structure / Algorithm | Access | Search | Insertion | Deletion |
| :--- | :--- | :--- | :--- | :--- |
| **Array** | O(1) | O(n) | O(n) | O(n) |
| **Hash Table** (Avg) | - | O(1) | O(1) | O(1) |
| **Binary Search Tree** | O(log n) | O(log n) | O(log n) | O(log n) |
| **Stack / Queue** | O(n) | O(n) | O(1) | O(1) |

> **Crucial Rule:** In amortized analysis (e.g., dynamic resizing arrays like Python list or C++ std::vector), appending is **O(1)** amortized, though reallocations cost O(n).

---

## 2. Graph Traversals: BFS vs DFS

### Breadth-First Search (BFS)
- **Data Structure**: Queue (FIFO)
- **Best For**: Finding the shortest path in unweighted graphs, level-order tree traversal.
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)

\`\`\`python
from collections import deque

def bfs(graph, start_node):
    visited = set([start_node])
    queue = deque([start_node])
    traversal_order = []

    while queue:
        vertex = queue.popleft()
        traversal_order.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return traversal_order
\`\`\`

### Depth-First Search (DFS)
- **Data Structure**: Stack (LIFO) or Recursion Call Stack.
- **Best For**: Cycle detection, topological sorting, connected components, maze solving.
- **Time Complexity**: O(V + E)

---

## 3. Dynamic Programming (DP) 4-Step Framework
1. **Define Subproblems**: Let \`dp[i]\` denote the optimal solution for state \`i\`.
2. **Identify Recurrence Relation**: How \`dp[i]\` relates to prior states (e.g., \`dp[i-1] + dp[i-2]\`).
3. **Establish Base Cases**: Define starting points (e.g., \`dp[0] = 0\`, \`dp[1] = 1\`).
4. **Determine Order of Computation**: Bottom-up tabulation vs top-down memoization.
        `,
        flashcards: [
            {
                question: "What is the average time complexity for searching an element in a Hash Table?",
                answer: "O(1) average time complexity, assuming a good hash function with low collision rate."
            },
            {
                question: "Which data structure is fundamentally utilized to implement Breadth-First Search (BFS)?",
                answer: "A Queue (First-In, First-Out)."
            },
            {
                question: "What is the worst-case time complexity of QuickSort and when does it occur?",
                answer: "O(n^2), which occurs when the pivot chosen is consistently the smallest or largest element (e.g., already sorted array without random pivot)."
            },
            {
                question: "What is the difference between Tabulation and Memoization in Dynamic Programming?",
                answer: "Memoization is Top-Down with recursion and caching; Tabulation is Bottom-Up starting from base cases using iterative arrays."
            }
        ],
        quiz: [
            {
                question: "Which graph traversal algorithm guarantees finding the shortest path in an unweighted graph?",
                options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Pre-order Traversal", "Dijkstra with negative weights"],
                correctIndex: 1,
                explanation: "BFS explores nodes level by level, ensuring that the first time a target vertex is reached, the shortest path from the start vertex has been traversed."
            },
            {
                question: "What is the space complexity of a balanced Binary Search Tree with N nodes during recursive traversal?",
                options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                correctIndex: 1,
                explanation: "A balanced BST has a height of log N, so the recursion call stack takes O(log N) auxiliary space."
            }
        ]
    },
    {
        id: "note-math-152",
        title: "MATH 152: Multivariable Calculus & Vector Analysis Cheat Sheet",
        subject: "Mathematics",
        category: "Mathematics",
        courseCode: "MATH 152",
        university: "MIT",
        author: {
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "Math Olympiad Scholar"
        },
        description: "Essential vector fields, partial derivatives, double & triple integrals, Green's Theorem, Stokes' Theorem, and Divergence Theorem with diagrams.",
        date: "2026-09-20",
        rating: 5.0,
        reviewsCount: 210,
        upvotes: 892,
        downloads: 3120,
        pages: 6,
        fileType: "Cheat Sheet",
        resourceType: "Formula Sheet",
        tags: ["calculus", "vector-calculus", "greens-theorem", "mit-math", "stem"],
        content: `
# MATH 152: Multivariable Calculus Formula Sheet & Intuitions

## 1. Gradient, Divergence, and Curl

### Gradient ($\\nabla f$)
The gradient vector points in the direction of greatest rate of increase of a scalar field $f(x,y,z)$:
$$\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)$$
- The magnitude $|\\nabla f|$ is the maximum directional derivative.
- The gradient is always **orthogonal** to level surfaces $f(x,y,z) = c$.

### Divergence ($\\nabla \\cdot \\mathbf{F}$)
Measures the net outward flux of a vector field per unit volume (source vs sink):
$$\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y} + \\frac{\\partial F_3}{\\partial z}$$

### Curl ($\\nabla \\times \\mathbf{F}$)
Measures the microscopic rotation of a fluid or vector field around a point. If $\\nabla \\times \\mathbf{F} = 0$, the vector field is **conservative** (irrotational).

---

## 2. Fundamental Integral Theorems

### Green's Theorem (2D Plane)
Relates a line integral around a simple closed curve $C$ to a double integral over the enclosed plane region $D$:
$$\\oint_C (L\\,dx + M\\,dy) = \\iint_D \\left( \\frac{\\partial M}{\\partial x} - \\frac{\\partial L}{\\partial y} \\right) dA$$

### Stokes' Theorem (3D Space)
Generalization of Green's theorem to surfaces in 3D:
$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$

### Divergence Theorem (Gauss's Theorem)
Relates the outward flux of a vector field through a closed surface to volume integral:
$$\\iint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_V (\\nabla \\cdot \\mathbf{F}) \\, dV$$
        `,
        flashcards: [
            {
                question: "What physical intuition does the Divergence of a vector field represent?",
                answer: "The net rate at which flow expands or diverges from a point (sources emit positive divergence, sinks have negative divergence)."
            },
            {
                question: "If the curl of a smooth vector field is zero everywhere in a simply connected domain, what is true about the field?",
                answer: "The vector field is conservative, meaning it can be written as the gradient of a potential scalar function (F = grad f), and line integrals are path-independent."
            },
            {
                question: "What does Green's theorem connect?",
                answer: "A counter-clockwise circulation line integral along a closed 2D boundary curve to a double integral over the interior domain."
            }
        ],
        quiz: [
            {
                question: "What direction does the gradient vector $\\nabla f$ point at any given point?",
                options: ["Direction of minimum change", "Tangent to the level curve", "Direction of steepest rate of ascent", "Opposite to the contour line"],
                correctIndex: 2,
                explanation: "The gradient vector $\\nabla f$ always points in the direction of maximum directional derivative, orthogonal to the contour or level curve."
            }
        ]
    },
    {
        id: "note-bio-301",
        title: "BIO 301: Molecular & Cellular Biology Comprehensive Review",
        subject: "Biology",
        category: "Medical & Bio",
        courseCode: "BIO 301",
        university: "Harvard University",
        author: {
            name: "Maya Patel",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "Pre-Med Mentor"
        },
        description: "High-yield summary of DNA replication, transcription, translation, CRISPR-Cas9 genome editing, and cellular respiration energy balances for midterm prep.",
        date: "2026-09-18",
        rating: 4.8,
        reviewsCount: 89,
        upvotes: 342,
        downloads: 890,
        pages: 24,
        fileType: "PDF",
        resourceType: "Exam Summary",
        tags: ["biology", "genetics", "cellular-biology", "mcat-prep", "biochemistry"],
        content: `
# BIO 301: Molecular & Cellular Biology Master Review

## 1. Central Dogma of Molecular Biology
$$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Protein}$$

### Transcription (Nucleus in Eukaryotes)
1. **Initiation**: RNA Polymerase II binds to the promoter sequence (TATA box) assisted by transcription factors.
2. **Elongation**: RNA polymerase synthesizes 5' to 3' complementary pre-mRNA strand using template DNA.
3. **Termination**: Polyadenylation signal sequence triggers cleavage.
4. **Post-transcriptional Modifications**:
   - 5' 7-methylguanylate cap addition (stability & nuclear export).
   - 3' Poly-A tail (prevents exonuclease degradation).
   - Spliceosome removes introns and splices exons together.

---

## 2. Cellular Respiration & ATP Yield Summary
Complete oxidation of 1 molecule of glucose yields approximately **30 to 32 ATP**:
- **Glycolysis** (Cytoplasm): 2 ATP (net) + 2 NADH
- **Pyruvate Oxidation** (Mitochondrial Matrix): 2 NADH + 2 CO2
- **Krebs / Citric Acid Cycle** (Matrix): 2 ATP + 6 NADH + 2 FADH2
- **Electron Transport Chain & Chemiosmosis** (Inner Mitochondrial Membrane): ~26-28 ATP via ATP Synthase proton gradient.
        `,
        flashcards: [
            {
                question: "What are the three essential post-transcriptional RNA modifications in eukaryotic cells?",
                answer: "1) Addition of 5' methylguanosine cap, 2) Addition of 3' poly-A tail, 3) Splicing out introns by spliceosomes."
            },
            {
                question: "In what cellular compartment does the Krebs Cycle occur in eukaryotes?",
                answer: "The mitochondrial matrix."
            }
        ],
        quiz: [
            {
                question: "Which enzyme is primarily responsible for synthesizing the leading and lagging DNA strands during eukaryotic replication?",
                options: ["DNA Ligase", "DNA Polymerase", "Topoisomerase", "RNA Primase"],
                correctIndex: 1,
                explanation: "DNA Polymerase adds complementary deoxyribonucleotides in the 5' to 3' direction."
            }
        ]
    },
    {
        id: "note-chem-211",
        title: "CHEM 211: Organic Chemistry Reaction Mechanisms & Synthesis",
        subject: "Chemistry",
        category: "Chemistry",
        courseCode: "CHEM 211",
        university: "UC Berkeley",
        author: {
            name: "Sophia Rodriguez",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "Chemistry Dept Tutor"
        },
        description: "Master SN1, SN2, E1, and E2 substitution and elimination reactions with decision trees, stereochemical inversion rules, and common reagent lists.",
        date: "2026-09-22",
        rating: 4.9,
        reviewsCount: 175,
        upvotes: 671,
        downloads: 2050,
        pages: 15,
        fileType: "PDF + Diagram",
        resourceType: "Cheat Sheet",
        tags: ["organic-chemistry", "mechanisms", "synthesis", "pre-med", "sn1-sn2"],
        content: `
# CHEM 211: Organic Chemistry Reaction Mechanisms & Decision Matrix

## 1. SN1 vs SN2 vs E1 vs E2 Decision Framework

| Criterion | SN2 | SN1 | E2 | E1 |
| :--- | :--- | :--- | :--- | :--- |
| **Substrate Preference** | $1^\\circ > 2^\\circ$ (unhindered) | $3^\\circ > 2^\\circ$ (carbocation) | $3^\\circ > 2^\\circ > 1^\\circ$ | $3^\\circ > 2^\\circ$ |
| **Nucleophile/Base** | Strong nucleophile | Weak nucleophile | Strong bulky base | Weak base |
| **Solvent** | Polar aprotic (DMSO, Acetone) | Polar protic (H2O, EtOH) | Polar aprotic | Polar protic |
| **Kinetics** | Rate = $k[R-X][Nu]$ | Rate = $k[R-X]$ | Rate = $k[R-X][Base]$ | Rate = $k[R-X]$ |
| **Stereochemistry** | Inversion (Walden) | Racemization | Anti-periplanar E/Z | Zaitsev rule alkene |

> **Key Rule of Thumb:** If you have a primary halide with a strong unhindered base/nucleophile (like $NaOH$ or $NaOCH_3$), SN2 predominates. If using a bulky strong base like $KOtBu$, E2 occurs even on primary substrates!
        `,
        flashcards: [
            {
                question: "What stereochemical outcome occurs during a classic SN2 substitution reaction?",
                answer: "Complete Walden Inversion (umbrella inversion of configuration) due to backside attack."
            },
            {
                question: "Why do polar protic solvents favor SN1 over SN2 reactions?",
                answer: "Polar protic solvents stabilize both the carbocation intermediate and the leaving group anion through hydrogen bonding, lowering activation energy."
            }
        ],
        quiz: [
            {
                question: "Which of the following reaction conditions will exclusively favor an E2 elimination over SN2 on a secondary alkyl bromide?",
                options: ["NaCN in DMSO", "Potassium tert-butoxide (KOtBu) in t-butanol", "H2O at room temperature", "Sodium acetate in ethanol"],
                correctIndex: 1,
                explanation: "KOtBu is a sterically hindered strong base that cannot easily perform nucleophilic backside attack, forcing an E2 anti-periplanar proton abstraction."
            }
        ]
    },
    {
        id: "note-ai-deep",
        title: "AI & Machine Learning: Neural Networks, Transformers & LLMs",
        subject: "Computer Science",
        category: "Computer Science",
        courseCode: "CS 224N",
        university: "Carnegie Mellon University",
        author: {
            name: "Jason Vance",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "AI Research Fellow"
        },
        description: "In-depth guide to modern deep learning: Backpropagation, Self-Attention mechanism, Scaled Dot-Product, Positional Encodings, and LLM fine-tuning strategies.",
        date: "2026-09-25",
        rating: 5.0,
        reviewsCount: 310,
        upvotes: 1120,
        downloads: 4200,
        pages: 16,
        fileType: "Interactive Notes",
        resourceType: "Lecture Notes",
        tags: ["machine-learning", "deep-learning", "transformers", "python", "nlp"],
        content: `
# Deep Learning & Modern Transformer Architectures

## 1. The Core Attention Formula
The seminal paper *"Attention Is All You Need"* (Vaswani et al.) introduced Scaled Dot-Product Attention:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V$$

Where:
- $Q$ is the Query matrix (what we are looking for)
- $K$ is the Key matrix (what each token offers)
- $V$ is the Value matrix (the contextual information to extract)
- $d_k$ is the dimension of the keys (used as scale factor to avoid vanishing gradients in softmax)

\`\`\`python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v, mask=None):
    d_k = q.size(-1)
    scores = torch.matmul(q, k.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, v), weights
\`\`\`

---

## 2. Multi-Head Attention Advantage
Instead of performing a single attention function, Multi-Head Attention projects Queries, Keys, and Values $h$ times with learned linear projections. This allows the model to jointly attend to information from different representation subspaces at different positions.
        `,
        flashcards: [
            {
                question: "Why do we divide QK^T by sqrt(d_k) in Scaled Dot-Product Attention?",
                answer: "To prevent the dot products from growing excessively large for high dimensions, which would push softmax into regions with extremely small gradients."
            },
            {
                question: "Why do Transformer models require Positional Encodings?",
                answer: "Because self-attention is permutation-invariant; without positional encodings, the model cannot distinguish token order in a sentence."
            }
        ],
        quiz: [
            {
                question: "What is the computational complexity of standard self-attention with sequence length N and embedding dimension D?",
                options: ["O(N * D)", "O(N^2 * D)", "O(N^3)", "O(D^2)"],
                correctIndex: 1,
                explanation: "Computing the QK^T matrix requires comparing each token with every other token, which is O(N^2) in sequence length, multiplied by dimension D."
            }
        ]
    },
    {
        id: "note-phys-101",
        title: "PHYS 101: Classical Mechanics & Thermodynamics Quick Revision",
        subject: "Physics",
        category: "Physics",
        courseCode: "PHYS 101",
        university: "Princeton University",
        author: {
            name: "Sarah Jenkins",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "Graduate Assistant"
        },
        description: "Conservation of momentum, rotational inertia tensors, simple harmonic motion, First and Second laws of thermodynamics, and Carnot cycle equations.",
        date: "2026-09-28",
        rating: 4.9,
        reviewsCount: 118,
        upvotes: 432,
        downloads: 1350,
        pages: 10,
        fileType: "PDF",
        resourceType: "Exam Summary",
        tags: ["physics", "mechanics", "thermodynamics", "engineering", "stem"],
        content: `
# PHYS 101: Mechanics & Heat Fundamentals

## 1. Rotational Dynamics Analogies
Linear mechanics directly translates into rotational dynamics:
- Mass $m \\rightarrow$ Moment of Inertia $I = \\int r^2 dm$
- Velocity $v \\rightarrow$ Angular velocity $\\omega$
- Force $\\mathbf{F} = m\\mathbf{a} \\rightarrow$ Torque $\\boldsymbol{\\tau} = \\mathbf{r} \\times \\mathbf{F} = I\\boldsymbol{\\alpha}$
- Kinetic Energy $K = \\frac{1}{2}mv^2 \\rightarrow K_{rot} = \\frac{1}{2}I\\omega^2$
- Momentum $\\mathbf{p} = m\\mathbf{v} \\rightarrow$ Angular Momentum $\\mathbf{L} = \\mathbf{r} \\times \\mathbf{p} = I\\boldsymbol{\\omega}$

---

## 2. Laws of Thermodynamics
1. **First Law**: $\\Delta U = Q - W$ (Conservation of Energy; internal energy change equals heat added minus work done by system).
2. **Second Law**: In an isolated system, total entropy $\\Delta S \\ge 0$. Heat cannot spontaneously flow from colder to hotter bodies.
3. **Carnot Engine Maximum Efficiency**:
$$\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}$$
*(where temperatures must be expressed in Kelvin)*
        `,
        flashcards: [
            {
                question: "What is the theoretical maximum efficiency formula of a heat engine operating between hot reservoir Th and cold reservoir Tc?",
                answer: "Efficiency = 1 - (Tc / Th), where temperatures are strictly in absolute Kelvin scale."
            },
            {
                question: "When is angular momentum conserved for a system?",
                answer: "When the net external torque acting on the system is zero."
            }
        ],
        quiz: [
            {
                question: "If the temperature of the cold reservoir is 300K and hot reservoir is 600K, what is the maximum Carnot efficiency?",
                options: ["25%", "50%", "75%", "100%"],
                correctIndex: 1,
                explanation: "eta = 1 - (300 / 600) = 1 - 0.5 = 0.5 (50%)."
            }
        ]
    },
    {
        id: "note-econ-102",
        title: "ECON 102: Macroeconomic Principles & Fiscal Policy Breakdown",
        subject: "Economics",
        category: "Business & Law",
        courseCode: "ECON 102",
        university: "London School of Economics",
        author: {
            name: "Liam Wilson",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "Econ Honors Student"
        },
        description: "Monetary policy vs fiscal policy, aggregate demand/supply curve shifts, Keynesian multiplier, Phillips curve trade-offs, and central banking.",
        date: "2026-09-12",
        rating: 4.7,
        reviewsCount: 64,
        upvotes: 215,
        downloads: 620,
        pages: 12,
        fileType: "PDF",
        resourceType: "Lecture Notes",
        tags: ["macroeconomics", "finance", "monetary-policy", "exam-prep"],
        content: `
# ECON 102: Macroeconomics & Fiscal Analysis

## 1. Keynesian Expenditure Multiplier
When autonomous government spending increases by $\\Delta G$, total output $Y$ multiplies by:
$$k = \\frac{1}{1 - \\text{MPC}} = \\frac{1}{\\text{MPS}}$$
Where $\\text{MPC}$ is Marginal Propensity to Consume. For example, if $\\text{MPC} = 0.8$, the multiplier is $1 / 0.2 = 5$.

---

## 2. Monetary Policy Transmission Channels
When the Central Bank lowers the policy interest rate:
1. Commercial bank lending rates decrease.
2. Cost of borrowing for consumer loans and capital investment drops.
3. Domestic currency typically depreciates, boosting net exports.
4. Aggregate demand shifts rightward, stimulating economic growth while posing upward inflation risks.
        `,
        flashcards: [
            {
                question: "What is the relationship between Marginal Propensity to Consume (MPC) and the government expenditure multiplier?",
                answer: "Multiplier = 1 / (1 - MPC). A higher MPC leads to a larger multiplier effect on total output."
            }
        ],
        quiz: [
            {
                question: "What happens to aggregate demand when the central bank conducts an open-market purchase of government bonds?",
                options: ["Money supply contracts and AD shifts left", "Money supply expands, interest rates fall, and AD shifts right", "Government debt is forgiven immediately", "Inflation permanently drops to zero"],
                correctIndex: 1,
                explanation: "Purchasing bonds injects reserves into the banking system, lowering rates and shifting aggregate demand to the right."
            }
        ]
    },
    {
        id: "note-hist-240",
        title: "HIST 240: Modern European History (1870-1945) Summary & Essay Guide",
        subject: "History",
        category: "Humanities",
        courseCode: "HIST 240",
        university: "Oxford University",
        author: {
            name: "Emma Watson-Smith",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
            verified: true,
            role: "History Fellow"
        },
        description: "Chronological timelines, alliance systems leading up to WWI (M-A-I-N), Treaty of Versailles repercussions, Weimar Republic collapse, and sample essay blueprints.",
        date: "2026-09-10",
        rating: 4.8,
        reviewsCount: 53,
        upvotes: 190,
        downloads: 480,
        pages: 20,
        fileType: "Document",
        resourceType: "Comprehensive Notes",
        tags: ["history", "world-war", "essay-guide", "humanities", "oxford"],
        content: `
# HIST 240: Modern European History Analysis

## 1. The Causes of World War I (The M-A-I-N Framework)
- **Militarism**: Arms race between Imperial Germany and the British Empire (Dreadnought naval race).
- **Alliances**: Complex web of mutual defense treaties (Triple Entente vs Triple Alliance).
- **Imperialism**: Scramble for Africa and Balkan rivalry between Austro-Hungarian and Russian empires.
- **Nationalism**: Pan-Slavism in the Balkans acting as the powder keg of Europe.

## 2. Consequences of the 1919 Treaty of Versailles
- Article 231 ("War Guilt Clause") placed sole moral culpability on Germany.
- Massive financial reparations (132 billion gold marks).
- Territorial amputations (Alsace-Lorraine restored to France, Polish Corridor created).
- Sowed systemic grievances exploited during the Great Depression.
        `,
        flashcards: [
            {
                question: "What does the mnemonic M-A-I-N stand for regarding the causes of World War I?",
                answer: "Militarism, Alliances, Imperialism, Nationalism."
            },
            {
                question: "What was the significance of Article 231 in the Treaty of Versailles?",
                answer: "The 'War Guilt' clause that assigned full legal and financial responsibility for the war to Germany and its allies."
            }
        ],
        quiz: [
            {
                question: "Which crisis directly triggered the outbreak of World War I in the summer of 1914?",
                options: ["The Moroccan Crisis", "The assassination of Archduke Franz Ferdinand in Sarajevo", "The annexation of Bosnia in 1908", "The sinking of the Lusitania"],
                correctIndex: 1,
                explanation: "The assassination of Archduke Franz Ferdinand by Gavrilo Princip set off the July Crisis and mobilized the alliance network."
            }
        ]
    }
];

const DEFAULT_COMMENTS = {
    "note-cs-201": [
        {
            id: "c-101",
            author: "Marcus Brody",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
            university: "UC Berkeley",
            date: "3 days ago",
            content: "This cheat sheet helped me pass my technical interview at Google yesterday! The DP tabulation explanation is crystal clear.",
            likes: 24
        },
        {
            id: "c-102",
            author: "Elena Rostova",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
            university: "Stanford",
            date: "1 week ago",
            content: "Could you add a section on Dijkstra vs A* search in the next revision? Otherwise 10/10 notes!",
            likes: 11
        }
    ],
    "note-math-152": [
        {
            id: "c-201",
            author: "Chloe Bennett",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
            university: "Columbia University",
            date: "5 days ago",
            content: "The geometric intuition for Stokes theorem finally made it click for me. Thank you David!",
            likes: 19
        }
    ]
};

const DEFAULT_COMMUNITY_THREADS = [
    {
        id: "thread-1",
        title: "Looking for Spring 2026 CS 229 Machine Learning Homework 2 solutions / study group?",
        author: "Devon Ray",
        university: "Stanford University",
        repliesCount: 8,
        tags: ["cs229", "study-group", "machine-learning"],
        timeAgo: "2 hours ago",
        upvotes: 14
    },
    {
        id: "thread-2",
        title: "Best mnemonic techniques for organic chemistry reaction mechanisms?",
        author: "Samantha Wu",
        university: "Johns Hopkins",
        repliesCount: 15,
        tags: ["organic-chem", "memorization", "pre-med"],
        timeAgo: "6 hours ago",
        upvotes: 32
    },
    {
        id: "thread-3",
        title: "Anyone have comprehensive lecture notes for Econometrics (Greene textbook)?",
        author: "Tariq Mansoor",
        university: "NYU Stern",
        repliesCount: 4,
        tags: ["economics", "notes-request", "statistics"],
        timeAgo: "1 day ago",
        upvotes: 9
    }
];
