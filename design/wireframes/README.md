# CryptoBooks — Wireframes

## Landing Page

```
+----------------------------------------------------------+
|  [Logo]  Features  Pricing  [Sign In]  [Get Started]    |
+----------------------------------------------------------+
|                                                          |
|      Financial docs for freelancers paid in crypto       |
|                                                          |
|   [ Paste transaction hash here                ] [Go]   |
|                                                          |
|      Try it free. No signup required.                   |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|   [Receipt Icon]     [Statement Icon]    [Invoice Icon] |
|   Receipt Generator  Bank-Style         Invoice Builder |
|                      Statements                         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|   Free / Pro ($19) / Business ($49)                     |
|                                                          |
+----------------------------------------------------------+
```

## Receipt Generator (No Auth)

```
+----------------------------------------------------------+
|  [Logo]                                          [Sign In]|
+----------------------------------------------------------+
|                                                          |
|   Generate Receipt                                       |
|                                                          |
|   Transaction Hash *                                     |
|   [0xabc123...                                   ]      |
|                                                          |
|   [Generate]                                             |
|                                                          |
|   +------------------------+                             |
|   |  Transaction Details   |                             |
|   |  Chain: Ethereum       |                             |
|   |  Amount: 2,500 USDC    |                             |
|   |  USD Value: $2,500.00  |                             |
|   |  Date: Jun 15, 2025    |                             |
|   |  From: 0xabc...        |                             |
|   |  To: 0xdef...          |                             |
|   +------------------------+                             |
|                                                          |
|   Client Name *                                          |
|   [Acme DAO                                      ]      |
|                                                          |
|   Description *                                          |
|   [Landing page design                           ]      |
|                                                          |
|   [Download PDF]                                         |
|                                                          |
+----------------------------------------------------------+
```

## Dashboard (Signed In)

```
+----------------------------------------------------------+
| [Logo]  Receipts | Statements | Invoices | Settings      |
+----------------------------------------------------------+
|                                                          |
|  Welcome back, Alex              [+ Generate Receipt]    |
|                                                          |
|  +------------------+  +------------------+             |
|  | This Month       |  | Quick Actions    |             |
|  | Income: $8,500   |  | - New Receipt    |             |
|  | Receipts: 4      |  | - New Statement  |             |
|  | Statements: 1    |  | - New Invoice    |             |
|  +------------------+  +------------------+             |
|                                                          |
|  Recent Receipts                                         |
|  +--------------------------------------------------+   |
|  | Date       | Client     | Amount    | Action      |   |
|  | Jun 28     | Acme DAO   | 2,500 USDC| [Download]  |   |
|  | Jun 25     | Nike       | 3,000 USDC| [Download]  |   |
|  +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Statement Generator

```
+----------------------------------------------------------+
| [Logo]  Receipts | Statements | Invoices | Settings      |
+----------------------------------------------------------+
|                                                          |
|  Generate Statement                                      |
|                                                          |
|  Wallets                                                 |
|  [0x123... (Ethereum)  x] [+ Add Wallet]                |
|                                                          |
|  Date Range                                              |
|  [Last Month v]                                          |
|  (or custom: [Start] to [End])                           |
|                                                          |
|  [Generate Statement]                                    |
|                                                          |
|  Preview:                                                |
|  +--------------------------------------------------+   |
|  |  CRYPTOBOOKS STATEMENT                           |   |
|  |  Alex Design Co                                  |   |
|  |  Period: June 2025                               |   |
|  |                                                  |   |
|  |  Date        | Description     | Amount | Balance|   |
|  |  Jun 01      | Opening         | --     | $5,000|   |
|  |  Jun 15      | Acme DAO        | +2,500 | $7,500|   |
|  |  Jun 28      | Nike            | +3,000 | $10,500|   |
|  |  Jun 30      | Closing         | --     | $10,500|   |
|  +--------------------------------------------------+   |
|                                                          |
|  [Download PDF]  [Download CSV]                          |
|                                                          |
+----------------------------------------------------------+
```

---

## Mobile Adaptations

All pages stack vertically on mobile:
- Sidebar becomes hamburger menu
- Tables become card lists
- Forms are single-column
- PDF preview is full-width
