# CryptoBooks MCP Server

AI agent access to CryptoBooks through the Model Context Protocol (MCP).

## What This Does

Lets AI assistants (Claude, Cursor, etc.) use CryptoBooks tools directly — generate receipts, create invoices, track wallets, and more.

## Setup

### 1. Get an API Key

1. Go to [CryptoBooks](https://crypto-clerk.onrender.com)
2. Sign up and go to Dashboard → API Keys
3. Generate a key (shown once — save it!)

### 2. Install

```bash
npm install -g @cryptobooks/mcp-server
```

### 3. Configure

Set environment variables:

```bash
export CRYPTOBOOKS_API_KEY="cb_your_key_here"
export CRYPTOBOOKS_BASE_URL="https://crypto-clerk.onrender.com/api/v1"
```

### 4. Use with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "cryptobooks": {
      "command": "npx",
      "args": ["-y", "@cryptobooks/mcp-server"],
      "env": {
        "CRYPTOBOOKS_API_KEY": "cb_your_key_here",
        "CRYPTOBOOKS_BASE_URL": "https://crypto-clerk.onrender.com/api/v1"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

Claude will now have access to CryptoBooks tools.

## Available Tools

| Tool | What It Does |
|------|-------------|
| `generate_receipt` | Create a receipt from a transaction hash |
| `create_statement` | Generate a bank-style statement from wallets |
| `get_statement_history` | View previously generated statements |
| `create_invoice` | Create a new invoice for a client |
| `list_invoices` | List all invoices |
| `get_invoice` | Get details of a specific invoice |
| `download_invoice_pdf` | Get PDF download URL for an invoice |
| `add_wallet` | Add a wallet to track |
| `list_wallets` | List all tracked wallets |
| `remove_wallet` | Remove a wallet from tracking |
| `get_usage` | Check usage and plan limits |

## Example Conversation

Once connected, you can ask Claude:

- "Generate a receipt for transaction 0xabc... on Ethereum. The client was Acme Corp for website design work."
- "Create a monthly statement from my tracked wallets for June 2026."
- "Show me all unpaid invoices."
- "Create a $5,000 USDC invoice for Acme Corp due in 30 days."

## Development

```bash
npm install
npm run build
npm start
```

## License

MIT
