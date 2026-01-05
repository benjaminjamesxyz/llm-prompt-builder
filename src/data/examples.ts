import { ModelExamples } from '../types';
import { uuid } from '../utils/uuid';

export const MODEL_EXAMPLES: ModelExamples = {
  generic: [
    {
      name: "Chain of Thought",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "You are an expert problem solver with a focus on logical deduction." },
        { id: uuid(), tag: "TASK", content: "Analyze the input and provide a solution." },
        { id: uuid(), tag: "METHODOLOGY", content: "Use Chain of Thought reasoning. Break down the problem into steps before concluding." }
      ]
    },
    {
      name: "Code Analysis",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "Senior Software Engineer" },
        { id: uuid(), tag: "OBJECTIVE", content: "Refactor the provided code for performance and readability." },
        {
          id: uuid(), tag: "CONSTRAINTS", isList: true, content: "", children: [
            { id: uuid(), tag: "ITEM", content: "Maintain original functionality" },
            { id: uuid(), tag: "ITEM", content: "Use modern syntax" },
            { id: uuid(), tag: "ITEM", content: "Add type hints" }
          ]
        },
        { id: uuid(), tag: "INPUT_CODE", content: "// Paste code here" }
      ]
    },
    {
      name: "Bug Fixer",
      nodes: [
        { id: uuid(), tag: "CONTEXT", content: "A user is reporting a crash in the application." },
        { id: uuid(), tag: "ERROR_LOG", content: "Paste stack trace here" },
        { id: uuid(), tag: "INSTRUCTION", content: "Identify the root cause and propose a fix." }
      ]
    },
    {
      name: "Tree of Thought (Basic)",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "You are an expert problem solver using Tree of Thought reasoning." },
        {
          id: uuid(), tag: "TOT_PROBLEM", content: "What is the most efficient route to deliver 100 packages across 50 locations, minimizing fuel consumption and delivery time?"
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: Optimize by geographical clustering", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Group locations into geographical clusters" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Use nearest-neighbor algorithm within each cluster" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Assign multiple vehicles to parallelize delivery" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Reduces overall distance, easy to understand\nCons: May not optimize for time constraints" }
          ]
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: Optimize by delivery time windows", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Sort locations by delivery time deadline" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Build route backward from latest deadline" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Use dynamic routing based on traffic patterns" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Guarantees on-time delivery\nCons: May increase total distance traveled" }
          ]
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: Hybrid approach with AI optimization", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Use machine learning to predict traffic and demand" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Apply genetic algorithm for route optimization" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Real-time adjustment based on GPS data" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Adapts to changing conditions, optimal balance\nCons: Complex to implement, requires real-time data" }
          ]
        },
        { id: uuid(), tag: "TOT_SOLUTION", content: "Use hybrid approach: initial clustering by geography, then optimize time windows within clusters. Implement ML-based dynamic routing for real-time adjustments. Expected efficiency gain: 15-20% reduction in fuel and 10-15% faster delivery." }
      ]
    },
    {
      name: "Embedded Systems - Timing Issue (ToT)",
      nodes: [
        { id: uuid(), tag: "ROLE", content: "You are an embedded systems engineer specializing in ARM Cortex-M microcontrollers and real-time systems." },
        { id: uuid(), tag: "CONTEXT", content: "STM32F4 microcontroller with 168MHz clock, using HAL library. Timer configured for 1kHz interrupt but measuring only ~750Hz." },
        {
          id: uuid(), tag: "TOT_PROBLEM", content: "TIM2 interrupt not firing at expected 1kHz frequency. Configuration: prescaler 167, auto-reload 999, APB1 timer clock set to 84MHz. Expected frequency: 84MHz/(167+1)/(999+1) = 500Hz. Additional configuration: timer clock source is internal clock, no external trigger."
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: System Clock Configuration Error", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Verify HSI (16MHz internal RC) vs HSE (8MHz external crystal) selection" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Check PLL configuration: PLL_M, PLL_N, PLL_P, PLL_Q values" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Confirm APB1 prescaler is correct for 84MHz output" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Most common issue, easy to verify with RCC registers\nCons: Would affect entire system, not just timer" }
          ]
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: Timer Clock Mismatch", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Check RCC->DCKCFGR for timer clock source selection" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Verify APB1 timer multiplication (if APB1 prescaler != 1)" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Calculate actual timer input clock vs expected 84MHz" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Direct impact on timer frequency\nCons: Would affect other timers on APB1" }
          ]
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: ISR Overrun or Priority Issue", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Measure ISR execution time with DWT counter" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Check NVIC priority for TIM2_IRQn vs other interrupts" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Verify interrupt flag clearing in ISR" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Could cause missed interrupts, common bug\nCons: Usually causes more variability, not consistent 25% drop" }
          ]
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: Prescaler/Auto-reload Value Error", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Check if prescaler is 167 or 166 (off-by-one error)" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Verify auto-reload is 999 or 1000" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Confirm values written to PSC and ARR registers" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Direct impact on frequency calculation\nCons: Simple arithmetic error, should be obvious in code review" }
          ]
        },
        {
          id: uuid(), tag: "TOT_BRANCH", content: "Branch: APB1 Clock Frequency Issue", children: [
            { id: uuid(), tag: "TOT_THOUGHT", content: "Verify APB1 maximum frequency limit is 42MHz on STM32F4" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Check APB1 prescaler: if 2, timer clock doubles to 84MHz" },
            { id: uuid(), tag: "TOT_THOUGHT", content: "Measure actual APB1 frequency using MCO or debugger" },
            { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Matches observed 25% frequency difference\nCons: Requires understanding of APB timer clock multiplier" }
          ]
        },
        {
          id: uuid(), tag: "TOT_SOLUTION", content: "Root cause: APB1 peripheral clock is 42MHz, not 84MHz. When APB1 prescaler is 2, timer clock multiplies to 84MHz. However, if prescaler is set to 1, timer clock remains 42MHz.\n\nFix: Configure APB1 prescaler to 2 in RCC->CFGR. Verify with HAL_RCC_GetPCLK1Freq() returns 42MHz and timer input clock is 84MHz.\n\nUpdated calculation: 84MHz/(167+1)/(999+1) = 500Hz.\n\nFor 1kHz, use PSC=83, ARR=999: 84MHz/84/1000 = 1000Hz."
        }
      ]
    },
    { name: "Empty", nodes: [] }
  ],
  gemini: [
    {
      name: "Content Creator",
      nodes: [
        { id: uuid(), tag: "SYSTEM_INSTRUCTIONS", content: "You are a creative content strategist. Your goal is to draft engaging content." },
        { id: uuid(), tag: "USER_INPUT", content: "Product: AI-powered coffee maker.\nTarget Audience: Developers." },
        { id: uuid(), tag: "MODEL_OUTPUT", content: "(Draft a LinkedIn post...)" }
      ]
    },
    {
      name: "Multimodal Analysis",
      nodes: [
        { id: uuid(), tag: "SYSTEM_INSTRUCTIONS", content: "Analyze the provided image input and output a structured description." },
        {
          id: uuid(), tag: "USER_INPUT", content: "[Image Data Placeholder]", children: [
            { id: uuid(), tag: "CONTEXT", content: "This is a UI screenshot." }
          ]
        },
        { id: uuid(), tag: "MODEL_OUTPUT", content: "JSON format with keys: 'header', 'sidebar', 'content'." }
      ]
    },
    {
      name: "Tree of Thought Analysis",
      nodes: [
        { id: uuid(), tag: "SYSTEM_INSTRUCTIONS", content: "You are a critical thinking expert. Use Tree of Thought methodology to analyze complex problems by exploring multiple solution branches." },
        {
          id: uuid(), tag: "USER_INPUT", content: "Problem: Our e-commerce platform has a 40% cart abandonment rate. We need to reduce this to 25% within 3 months while maintaining customer satisfaction.\n\nCurrent data:\n- Average time to checkout: 8 minutes\n- Shipping costs: $12 average\n- Payment options: Credit card only\n- Mobile users: 65% of traffic"
        },
        {
          id: uuid(), tag: "MODEL_OUTPUT", content: "", children: [
            { id: uuid(), tag: "TOT_PROBLEM", content: "Reduce cart abandonment from 40% to 25% within 3 months" },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Improve User Experience (UX)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Streamline checkout process from 8 minutes to under 4 minutes" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Implement one-click checkout for returning customers" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Add progress indicator and guest checkout option" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Direct impact on conversion, measurable\nCons: Requires development resources, 2-3 month timeline" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Pricing Strategy Changes", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Introduce free shipping threshold ($50 minimum)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Add dynamic discount for abandoned carts (10% off)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Offer subscription models with lower shipping" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Quick implementation, visible to users\nCons: Reduces margins, may not address UX issues" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Payment and Trust Improvements", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Add PayPal, Apple Pay, Google Pay options" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Display trust badges prominently during checkout" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Implement save-for-later functionality" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Reduces friction, improves trust\nCons: Integration costs, payment processing fees" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Mobile Optimization Focus", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Optimize checkout for mobile (65% of users)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Implement biometric authentication for payments" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Add mobile wallet integration (Apple Wallet, Google Wallet)" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Addresses majority user base, competitive advantage\nCons: May not help desktop users, extensive mobile testing required" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Hybrid approach combining UX improvements with payment options:\n1. Implement guest checkout + one-click buy (2 weeks)\n2. Add PayPal and Apple Pay (4 weeks)\n3. Introduce free shipping threshold at $50 (immediate)\n4. Optimize mobile checkout flow (6 weeks)\n\nExpected impact: 12% reduction from UX + 8% from payment options + 5% from free shipping = 25% total.\n\nPhase rollout to measure incremental impact and A/B test free shipping threshold ($45 vs $50)."
            }
          ]
        }
      ]
    }
  ],
  claude: [
    {
      name: "Complex Reasoning (XML)",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are Claude, an expert analyst. Use XML tags to structure your analysis." },
        {
          id: uuid(), tag: "USER", content: "Analyze the contract.", children: [
            {
              id: uuid(), tag: "documents", content: "", children: [
                { id: uuid(), tag: "contract", content: "[Paste Contract Text Here]" }
              ]
            },
            { id: uuid(), tag: "instructions", content: "Think step-by-step before providing the final risk assessment." }
          ]
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "thinking", content: "I will first read the liability clause..." }
          ]
        }
      ]
    },
    {
      name: "Tree of Thought (XML-based)",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are Claude, an expert analytical thinker. Use Tree of Thought methodology with XML tags to structure your reasoning process." },
        {
          id: uuid(), tag: "USER", content: "Analyze this business decision: Our SaaS company is considering moving from a free trial model to a freemium model. Current: 30-day free trial, then $99/mo. Proposed: Free tier with limited features, Pro tier $79/mo, Enterprise tier $199/mo.\n\nMetrics:\n- Current conversion: 25% of free trials convert to paid\n- Free trial signups: 1000/month\n- Churn rate: 15% after 3 months\n- CAC: $45 per user", children: [
            { id: uuid(), tag: "context", content: "Company has 10k users, $5M ARR, 30-person team" }
          ]
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "thinking", content: "I need to analyze this pricing model change using Tree of Thought. Let me explore multiple approaches." },
            {
              id: uuid(), tag: "TOT_PROBLEM", content: "Determine whether switching from free trial to freemium model will improve revenue and growth"
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Revenue Impact Analysis", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Calculate current MRR: 1000 * 0.25 * $99 = $24,750/month" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Estimate freemium signups: 5000/month (5x increase due to no commitment)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Project freemium conversion: 10% to Pro ($79), 5% to Enterprise ($199)" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Lower barrier to entry, larger user base\nCons: Lower per-user revenue, need higher volume" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Market Positioning", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Free tier creates market awareness and viral growth" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Competitor analysis: 3/5 competitors use freemium" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Brand perception: freemium may signal lower quality" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Competitive parity, network effects\nCons: Brand positioning risk, commoditization" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Customer Lifetime Value (CLV)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Current CLV: $99/month / 0.15 churn = $660/year" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Freemium Pro CLV: $79/month / 0.12 churn (engaged users) = $658/year" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Freemium Enterprise CLV: $199/month / 0.08 churn = $2,487/year" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Higher CLV for Enterprise, better customer segmentation\nCons: Free tier users dilute metrics, higher support costs" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Recommendation: Proceed with freemium model with careful implementation.\n\nRevenue Projection:\n- Free tier: 5000 users/month, support cost $2/user/month = $10k/month\n- Pro: 500 users/month ($39.5k/month MRR)\n- Enterprise: 250 users/month ($49.75k/month MRR)\n- Net revenue: $79.25k/month vs current $24.75k/month = 3.2x increase\n\nImplementation Strategy:\n1. Free tier: 5 users, limited features, no support\n2. Pro: Unlimited users, core features, email support\n3. Enterprise: Unlimited everything, priority support, SLA\n4. Offer migration path for existing free trial users\n5. A/B test with 20% of new signups first\n\nRisks: Support costs (hire 5 more staff), feature creep (strict limits), brand positioning (maintain Pro quality)."
            }
          ]
        }
      ]
    }
  ],
  openai: [
    {
      name: "System Persona",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are a helpful assistant that speaks like a 17th-century pirate." },
        { id: uuid(), tag: "USER", content: "Explain quantum physics to me." }
      ]
    },
    {
      name: "Few-Shot Classification",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "Classify the sentiment of the user's text." },
        { id: uuid(), tag: "USER", content: "I love this product!" },
        { id: uuid(), tag: "ASSISTANT", content: "Positive" },
        { id: uuid(), tag: "USER", content: "This is terrible." },
        { id: uuid(), tag: "ASSISTANT", content: "Negative" }
      ]
    },
    {
      name: "Tree of Thought Reasoning",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an analytical problem solver. Use Tree of Thought methodology to break down complex problems by exploring multiple solution paths and evaluating each systematically." },
        {
          id: uuid(), tag: "USER", content: "Problem: Our startup's API is experiencing intermittent timeouts (2-5% of requests). Need to diagnose root cause and implement fix within 1 week.\n\nEnvironment:\n- Node.js/Express API on AWS EC2\n- PostgreSQL database (RDS)\n- Redis for caching\n- Load balancer with 3 instances\n- Peak load: 500 requests/second"
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "TOT_PROBLEM", content: "Diagnose and fix 2-5% intermittent API timeout issue" },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Database Connection Pool Issues", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check connection pool size vs concurrent queries" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify connection pool exhaustion during peaks" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor connection acquisition timeout settings" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Common cause of intermittent timeouts\nCons: Would likely show pattern at specific times, not random 2-5%" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: DNS Resolution Latency", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check if DNS resolution is slow for external API calls" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify DNS cache TTL settings" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Test with hardcoded IPs vs domain names" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Can cause unpredictable delays\nCons: Usually affects all external calls, not just 2-5%" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Garbage Collection Pauses", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor V8 heap usage and GC events" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check memory leaks causing frequent GC" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Profile GC pause duration vs request timeout" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Can cause sporadic blocking, Node.js specific\nCons: GC pauses usually visible in logs" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Network Layer Issues", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check for packet loss or latency spikes in AWS VPC" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify ENA driver configuration" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor network timeouts at TCP level" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Matches random 2-5% pattern\nCons: Would affect other instances if infrastructure issue" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Application-Level Race Conditions", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Look for resource contention (file locks, semaphores)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check for circular dependencies in middleware chain" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify async/await blocking patterns" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Can cause unpredictable behavior\nCons: Hard to reproduce, requires code review" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Root cause: Connection pool starvation due to Redis connection leak.\n\nInvestigation findings:\n1. Connection pool exhaustion observed in logs (matches 2-5% pattern)\n2. Redis connections not properly closed in error handlers\n3. Peak load triggers connection pool timeouts\n\nFixes to implement:\n1. Add connection pool monitoring (New Relic agent)\n2. Fix Redis connection cleanup in all error paths\n3. Implement connection pool timeout: 30s\n4. Add retry logic with exponential backoff for failed requests\n5. Increase connection pool size from 10 to 50\n6. Add circuit breaker pattern for external service calls\n\nImplementation: 3 days\nTesting: 2 days (load testing with 1000 req/s)\nDeployment: Canary rollout (10% -> 50% -> 100%)"
            }
          ]
        }
      ]
    }
  ],
  deepseek: [
    {
      name: "DeepSeek-R1 Reasoning",
      nodes: [
        { id: uuid(), tag: "USER", content: "How many Rs are in the word Strawberry?" },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "think", content: "The user is asking for the count of the letter 'r' in 'Strawberry'.\n\n1. S-t-r-a-w-b-e-r-r-y\n2. Count: r (3rd), r (8th), r (9th).\n3. Total is 3." },
            { id: uuid(), tag: "RESPONSE", content: "There are 3 Rs in Strawberry." }
          ]
        }
      ]
    },
    {
      name: "ToT with DeepSeek Reasoning",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an expert problem solver combining DeepSeek's reasoning capabilities with Tree of Thought methodology." },
        {
          id: uuid(), tag: "USER", content: "Analyze this algorithmic optimization problem: We have a distributed system that processes 1 million events per hour. Current architecture uses a single Kafka topic with 3 partitions. Need to increase throughput to 10 million events/hour with sub-second latency."
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "think", content: "This is a distributed systems scaling problem. Let me apply Tree of Thought to explore different architectural approaches.\n\nKey constraints:\n- 10x throughput increase (1M → 10M events/hour)\n- Sub-second latency requirement\n- Current: 1 topic, 3 partitions\n- Consumer group: 5 consumers\n\nI need to consider:\n1. Partition scaling\n2. Consumer scaling\n3. Network and I/O bottlenecks\n4. Ordering guarantees\n5. Fault tolerance implications" },
            {
              id: uuid(), tag: "TOT_PROBLEM", content: "Scale event processing system from 1M to 10M events/hour with sub-second latency"
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Vertical Partition Scaling", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Increase partitions from 3 to 30 (10x)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Scale consumers to match partitions (30 consumers)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Optimize batch size and poll interval" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Simple scaling, maintains ordering per partition\nCons: Consumer overhead, rebalancing complexity at 30 nodes" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Topic Sharding (Multi-Topic)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Split events by category into 10 topics" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Each topic has 3 partitions, 15 consumers total" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Routing logic at producer level" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Natural event segregation, easier monitoring\nCons: Routing complexity, uneven load distribution risk" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Hybrid Approach (Partitions + Batching)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Increase to 10 partitions with optimized batching" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Implement micro-batching (100ms windows)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Use async processing pipeline with backpressure" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Balances throughput and latency, efficient resource usage\nCons: More complex implementation, batching adds latency" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Stream Processing Framework", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Migrate to Apache Flink or Spark Streaming" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Leverage automatic scaling and state management" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Implement exactly-once semantics" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Production-grade, built-in scaling and fault tolerance\nCons: Learning curve, operational complexity, migration overhead" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Recommended approach: Hybrid vertical scaling with optimized batching.\n\nArchitecture:\n1. Increase partitions: 3 → 15 (5x, not 10x)\n2. Increase consumers: 5 → 15 (match partitions)\n3. Enable compression (snappy) for network efficiency\n4. Optimize batch size: 10KB → 50KB, reduce fetch interval 100ms → 50ms\n5. Implement async processing with proper backpressure\n6. Add monitoring for partition skew and consumer lag\n\nPerformance projection:\n- Throughput: 10M events/hour achievable\n- Latency: <500ms average (within sub-second requirement)\n- Consumer load: ~66k events/hour/consumer (manageable)\n- Network overhead: Reduced by 30% with compression\n\nRollout plan:\n1. Week 1: Add partitions (no downtime)\n2. Week 2: Deploy new consumers with canary\n3. Week 3: Optimize batch settings with A/B testing\n4. Week 4: Full cutover with rollback plan"
            }
          ]
        }
      ]
    }
  ],
  llama: [
    {
      name: "Llama 3 Instruct",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are a helpful, respectful, and honest assistant. You excel at breaking down complex problems using Tree of Thought reasoning." },
        { id: uuid(), tag: "USER", content: "Write a python script to scrape a website." },
        { id: uuid(), tag: "ASSISTANT", content: "I can help with that. Here is a basic example using BeautifulSoup..." }
      ]
    },
    {
      name: "Tree of Thought (Llama Instruct)",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an analytical assistant skilled at Tree of Thought reasoning. Break down problems systematically, explore multiple approaches, and provide well-reasoned solutions." },
        {
          id: uuid(), tag: "USER", content: "Problem: We're building a recommendation system for an e-commerce platform with 100k products and 500k users. Need to choose between:\n1. Collaborative Filtering (CF)\n2. Content-Based Filtering (CBF)\n3. Hybrid approach\n\nRequirements:\n- Cold-start problem: New users, new products\n- Real-time recommendations: <100ms\n- Scalability: Handle 10k requests/second\n- Accuracy: Improve from current 60% to 75%+"
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "TOT_PROBLEM", content: "Select optimal recommendation algorithm for e-commerce platform" },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Collaborative Filtering (CF)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Matrix Factorization (SVD) for user-item interactions" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Address cold-start with popularity fallback" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Precompute recommendations nightly for speed" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: High accuracy for engaged users, proven approach\nCons: Cold-start problem severe, sparse data issues" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Content-Based Filtering (CBF)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Use product metadata (category, price, features)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "TF-IDF or embeddings for similarity matching" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Works for new products, good for cold-start" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: No cold-start for products, explainable\nCons: Limited discovery, lower accuracy, metadata quality dependency" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Hybrid Approach", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Combine CF and CBF with weighted scoring" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "CF for warm users, CBF for cold-start users" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Use neural network for feature fusion (Deep Hybrid)" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Best of both worlds, handles cold-start well\nCons: Complex implementation, higher compute cost" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Deep Learning (Neural CF)", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Use neural collaborative filtering (NCF)" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Pre-train on historical data, fine-tune online" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "GPU inference for real-time recommendations" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: State-of-the-art accuracy, captures complex patterns\nCons: High infrastructure cost, harder to explain" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Recommendation: Hybrid approach with phased implementation.\n\nPhase 1 (Month 1-2):\n- Implement Matrix Factorization for warm users (60% users)\n- Implement Content-Based for cold-start users (40%)\n- Use popularity-based for new products\n- Expected accuracy: 70%\n\nPhase 2 (Month 3-4):\n- Implement weighted hybrid model (CF 0.7, CBF 0.3)\n- Add item-based CF for cold-start product discovery\n- Optimize precomputation pipeline\n- Expected accuracy: 75%\n\nPhase 3 (Month 5-6):\n- Explore Neural Collaborative Filtering for top 10% users\n- A/B test hybrid weights\n- Implement real-time updates for new interactions\n- Expected accuracy: 78%\n\nTech Stack:\n- CF: Spark MLlib matrix factorization\n- CBF: Elasticsearch with vector search\n- Serving: Redis cache + API gateway\n- Monitoring: MLflow for model performance\n\nPerformance:\n- Latency: 50ms (cache hit), 200ms (cache miss)\n- Throughput: 10k req/s achievable with Redis cluster\n- Accuracy improvement: 60% → 75% (25% uplift)"
            }
          ]
        }
      ]
    }
  ],
  qwen: [
    {
      name: "Qwen Coding",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an expert programmer." },
        {
          id: uuid(), tag: "USER", content: "Fix the memory leak in this C++ code snippet.", children: [
            { id: uuid(), tag: "CODE", content: "void func() { int* p = new int[10]; }" }
          ]
        }
      ]
    },
    {
      name: "Tree of Thought for Coding",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an expert programmer specializing in debugging and optimization. Use Tree of Thought methodology to analyze code problems systematically." },
        {
          id: uuid(), tag: "USER", content: "Problem: Our Python web application has a memory leak. Memory usage grows from 200MB to 2GB over 24 hours, then crashes.\n\nContext:\n- Flask application with Gunicorn (4 workers)\n- Using Celery for background tasks\n- Redis as message broker\n- PostgreSQL database\n- Profiling shows memory growth in the worker processes\n\nCode snippet causing suspicion:\n```python\ndef process_events(events):\n    cache = {}\n    for event in events:\n        key = event['user_id']\n        if key not in cache:\n            cache[key] = load_user_data(key)\n        process_user(cache[key], event)\n    return results\n```"
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "TOT_PROBLEM", content: "Fix memory leak in Flask/Celery application causing 2GB growth over 24 hours" },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Cache Not Being Cleared", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Analyze the cache dictionary in process_events" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Cache grows indefinitely with unique user_ids" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "No cleanup mechanism for old entries" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Directly matches memory growth pattern\nCons: Would be visible in code review, obvious bug" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Celery Task Retention", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check Celery task result retention settings" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify CELERY_RESULT_BACKEND configuration" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor Redis memory usage for task results" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Common Celery configuration issue\nCons: Would affect Redis, not application memory" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Database Connection Pool", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check SQLAlchemy connection pool size" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify pool recycling settings" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor for connection leaks in long-running tasks" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Can cause gradual memory growth\nCons: Usually plateaus, doesn't grow indefinitely" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Global Variable Accumulation", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Search for global variables or module-level caches" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check for singleton pattern implementations" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify functools.lru_cache usage without maxsize" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Matches unlimited growth pattern\nCons: Need to find which specific global/ cache" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Circular References in Closures", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check for closures capturing large objects" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Look for event handlers or callbacks" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Use gc module to detect uncollectable objects" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Subtle bug, hard to detect\nCons: Usually grows slowly, not 10x in 24 hours" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Root cause: Multiple issues combining to cause memory leak.\n\nPrimary Issue: Cache Dictionary (process_events)\nThe `cache` dictionary in process_events grows unbounded:\n- Called 100k times/hour\n- Average 50 unique users/hour\n- Cache retains user_data objects (average 2KB each)\n- Growth: 50 * 2KB * 24 = 2.4GB/day\n\nSecondary Issues Found:\n1. `@lru_cache` decorator without maxsize on load_user_data\n2. Celery result_expires set to None (infinite retention)\n\nFix Implementation:\n\n```python\ndef process_events(events):\n    from collections import OrderedDict\n    \n    # LRU cache with max 1000 entries\n    cache = OrderedDict()\n    \n    for event in events:\n        key = event['user_id']\n        if key not in cache:\n            cache[key] = load_user_data(key)\n            # Remove oldest if cache too large\n            if len(cache) > 1000:\n                cache.popitem(last=False)\n        process_user(cache[key], event)\n    return results\n\n# Fix lru_cache\n@lru_cache(maxsize=1000)\ndef load_user_data(user_id):\n    # ... implementation\n```\n\nCelery config fix:\n```python\nCELERY_RESULT_EXPIRES = 3600  # 1 hour retention\nCELERY_TASK_RESULT_MAX_AGE = 3600\n```\n\nMonitoring additions:\n- Add memory profiling with memory_profiler\n- Set up Prometheus metrics for memory usage\n- Alert if memory > 500MB for >5 minutes\n\nExpected outcome:\n- Memory stabilizes at ~300MB (from 2GB)\n- Cache hit rate ~80% for repeated users\n- No impact on performance (LRU cache is fast)"
            }
          ]
        }
      ]
    }
  ],
  glm: [
    {
      name: "ChatGLM Dialogue",
      nodes: [
        { id: uuid(), tag: "USER", content: "你好 (Hello)" },
        { id: uuid(), tag: "ASSISTANT", content: "你好！有什么我可以帮你的吗？ (Hello! How can I help you?)" }
      ]
    },
    {
      name: "Tree of Thought for Coding",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are an expert programmer specializing in debugging and optimization. Use Tree of Thought methodology to analyze code problems systematically." },
        {
          id: uuid(), tag: "USER", content: "Problem: Our Python web application has a memory leak. Memory usage grows from 200MB to 2GB over 24 hours, then crashes.\n\nContext:\n- Flask application with Gunicorn (4 workers)\n- Using Celery for background tasks\n- Redis as message broker\n- PostgreSQL database\n- Profiling shows memory growth in the worker processes\n\nCode snippet causing suspicion:\n```python\ndef process_events(events):\n    cache = {}\n    for event in events:\n        key = event['user_id']\n        if key not in cache:\n            cache[key] = load_user_data(key)\n        process_user(cache[key], event)\n    return results\n```"
        },
        {
          id: uuid(), tag: "ASSISTANT", content: "", children: [
            { id: uuid(), tag: "TOT_PROBLEM", content: "Fix memory leak in Flask/Celery application causing 2GB growth over 24 hours" },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Cache Not Being Cleared", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Analyze the cache dictionary in process_events" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Cache grows indefinitely with unique user_ids" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "No cleanup mechanism for old entries" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Directly matches memory growth pattern\nCons: Would be visible in code review, obvious bug" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Celery Task Retention", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check Celery task result retention settings" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify CELERY_RESULT_BACKEND configuration" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor Redis memory usage for task results" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Common Celery configuration issue\nCons: Would affect Redis, not application memory" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Database Connection Pool", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check SQLAlchemy connection pool size" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify pool recycling settings" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Monitor for connection leaks in long-running tasks" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Can cause gradual memory growth\nCons: Usually plateaus, doesn't grow indefinitely" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Global Variable Accumulation", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Search for global variables or module-level caches" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check for singleton pattern implementations" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Verify functools.lru_cache usage without maxsize" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Matches unlimited growth pattern\nCons: Need to find which specific global/ cache" }
              ]
            },
            {
              id: uuid(), tag: "TOT_BRANCH", content: "Branch: Circular References in Closures", children: [
                { id: uuid(), tag: "TOT_THOUGHT", content: "Check for closures capturing large objects" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Look for event handlers or callbacks" },
                { id: uuid(), tag: "TOT_THOUGHT", content: "Use gc module to detect uncollectable objects" },
                { id: uuid(), tag: "TOT_EVALUATION", content: "Pros: Subtle bug, hard to detect\nCons: Usually grows slowly, not 10x in 24 hours" }
              ]
            },
            {
              id: uuid(), tag: "TOT_SOLUTION", content: "Root cause: Multiple issues combining to cause memory leak.\n\nPrimary Issue: Cache Dictionary (process_events)\nThe `cache` dictionary in process_events grows unbounded:\n- Called 100k times/hour\n- Average 50 unique users/hour\n- Cache retains user_data objects (average 2KB each)\n- Growth: 50 * 2KB * 24 = 2.4GB/day\n\nSecondary Issues Found:\n1. `@lru_cache` decorator without maxsize on load_user_data\n2. Celery result_expires set to None (infinite retention)\n\nFix Implementation:\n\n```python\ndef process_events(events):\n    from collections import OrderedDict\n    \n    # LRU cache with max 1000 entries\n    cache = OrderedDict()\n    \n    for event in events:\n        key = event['user_id']\n        if key not in cache:\n            cache[key] = load_user_data(key)\n            # Remove oldest if cache too large\n            if len(cache) > 1000:\n                cache.popitem(last=False)\n        process_user(cache[key], event)\n    return results\n\n# Fix lru_cache\n@lru_cache(maxsize=1000)\ndef load_user_data(user_id):\n    # ... implementation\n```\n\nCelery config fix:\n```python\nCELERY_RESULT_EXPIRES = 3600  # 1 hour retention\nCELERY_TASK_RESULT_MAX_AGE = 3600\n```\n\nMonitoring additions:\n- Add memory profiling with memory_profiler\n- Set up Prometheus metrics for memory usage\n- Alert if memory > 500MB for >5 minutes\n\nExpected outcome:\n- Memory stabilizes at ~300MB (from 2GB)\n- Cache hit rate ~80% for repeated users\n- No impact on performance (LRU cache is fast)"
            }
          ]
        }
      ]
    }
  ],
  image: [
    {
      name: "Midjourney Photorealism",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A weary astronaut sitting in a diner on Mars, looking out the window at a dust storm." },
        { id: uuid(), tag: "STYLE", content: "Cinematic, photorealistic, 8k, shot on 35mm film." },
        { id: uuid(), tag: "LIGHTING", content: "Neon sign reflection, moody atmosphere, volumetric dust." },
        { id: uuid(), tag: "PARAMETERS", content: "--ar 16:9 --v 6.0 --stylize 250" }
      ]
    },
    {
      name: "Stable Diffusion Anime",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "Cyberpunk girl with glowing headphones standing in rain." },
        { id: uuid(), tag: "STYLE", content: "Anime style, Makoto Shinkai, vibrant colors, detailed background." },
        { id: uuid(), tag: "NEGATIVE_PROMPT", content: "low quality, bad anatomy, missing fingers, blurry." },
        { id: uuid(), tag: "PARAMETERS", content: "Steps: 30, Sampler: Euler a, CFG scale: 7" }
      ]
    },
    {
      name: "Google Imagen (Nano Banana)",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A close-up portrait of an iridescent beetle on a fern leaf." },
        { id: uuid(), tag: "STYLE", content: "Macro photography, shallow depth of field, hyper-realistic, vivid colors." },
        { id: uuid(), tag: "LIGHTING", content: "Natural morning sunlight, soft bokeh." },
        { id: uuid(), tag: "PARAMETERS", content: "--aspect_ratio 4:3 --safety_filter_level block_few" }
      ]
    },
    {
      name: "DALL-E 3 Vector Art",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A futuristic robot playing chess against an old man in a park." },
        { id: uuid(), tag: "STYLE", content: "Flat vector art, minimal design, clean lines, pastel color palette." },
        { id: uuid(), tag: "AESTHETIC", content: "Whimsical, modern, tech-meets-nature." },
        { id: uuid(), tag: "PARAMETERS", content: "--size 1024x1024 --quality hd" }
      ]
    },
    {
      name: "Commercial Product Photo",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A luxury perfume bottle made of amber glass sitting on a black reflective surface." },
        { id: uuid(), tag: "LIGHTING", content: "Studio lighting, sharp rim light, soft fill, water droplets on the bottle." },
        { id: uuid(), tag: "CAMERA", content: "100mm macro lens, f/2.8, eye-level angle." },
        { id: uuid(), tag: "STYLE", content: "High-end advertising, elegant, crisp details." }
      ]
    }
  ],
  video: [
    {
      name: "Google Veo Cinematic",
      nodes: [
        { id: uuid(), tag: "SCENE", content: "A slow, expansive drone flyover captures the breathtaking, hyper-realistic spectacle of a technologically advanced eco-city cascading down a massive, verdant cliff face." },
        {
          id: uuid(), tag: "VISUALS", content: "Primary subject is an immense, vertical city composed of sleek bio-domes.", children: [
            { id: uuid(), tag: "ENVIRONMENT", content: "Misty canyon, rugged rock face, dense jungle canopy at the base." },
            { id: uuid(), tag: "LIGHTING", content: "Bright, natural daylight (high noon, slightly overcast), National Geographic style." },
            { id: uuid(), tag: "COLOR_PALETTE", content: "Deep emerald greens, stark white architecture, cyan blue water." },
            { id: uuid(), tag: "AESTHETIC", content: "Hyper-realistic, grand, and awe-inspiring eco-futurism." }
          ]
        },
        {
          id: uuid(), tag: "CAMERA", content: "", children: [
            { id: uuid(), tag: "SHOT_TYPE", content: "Extreme wide shot / establishing shot." },
            { id: uuid(), tag: "ANGLE", content: "High-angle (drone view), slowly panning downward." },
            { id: uuid(), tag: "MOVEMENT", content: "Slow, steady drone flyover descending and panning across the vertical landscape." }
          ]
        },
        { id: uuid(), tag: "AUDIO", content: "Blend of immense natural forces and subtle technological hum." },
        {
          id: uuid(), tag: "SFX", isList: true, content: "", children: [
            { id: uuid(), tag: "ITEM", content: "Powerful roar of waterfalls echoing." },
            { id: uuid(), tag: "ITEM", content: "Rush and spray of water hitting the basin." },
            { id: uuid(), tag: "ITEM", content: "Subtle low-frequency hum of infrastructure." },
            { id: uuid(), tag: "ITEM", content: "Distant cry of a jungle bird." }
          ]
        },
        { id: uuid(), tag: "MUSIC", content: "Minimalist, ambient electronic score with subtle pads and high-register string swell." }
      ]
    },
    {
      name: "Cinematic Drone Shot",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "A sweeping view of a futuristic eco-city built into a cliffside." },
        { id: uuid(), tag: "MOTION", content: "Slow drone flyover, panning down to reveal waterfalls." },
        { id: uuid(), tag: "STYLE", content: "National Geographic style, hyper-realistic, lush greenery." },
        { id: uuid(), tag: "PARAMETERS", content: "--video_duration 5s --motion_bucket_id 127" }
      ]
    },
    {
      name: "Character Performance (Gen-3)",
      nodes: [
        { id: uuid(), tag: "SUBJECT", content: "An elderly woman reading a handwritten letter by a window." },
        { id: uuid(), tag: "MOTION", content: "Subtle facial micro-expressions. A single tear rolls down her cheek. Her hand trembles slightly holding the paper." },
        { id: uuid(), tag: "LIGHTING", content: "Soft, diffused afternoon window light. Dust motes dancing in the air." },
        { id: uuid(), tag: "CAMERA", content: "Extreme close-up on face, shallow depth of field, sharp focus on eyes." }
      ]
    },
    {
      name: "Nature Time-Lapse",
      nodes: [
        { id: uuid(), tag: "SCENE", content: "A rare orchid blooming in a dark rainforest." },
        { id: uuid(), tag: "MOTION", content: "Fast-forward time-lapse. The petals unfurl smoothly over 5 seconds." },
        { id: uuid(), tag: "VISUALS", content: "Vibrant purple and neon pink colors against a dark, blurry green background." },
        { id: uuid(), tag: "CAMERA", content: "Static macro shot, locked off." }
      ]
    }
  ]
};
