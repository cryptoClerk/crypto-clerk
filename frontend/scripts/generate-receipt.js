const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(1500);
    
    // Fill tx hash
    await page.fill('input[id="txHash"]', '0xabc123def4567890123456789012345678901234567890123456789012345678');
    
    // Click Fetch
    await page.click('button:has-text("Fetch")');
    await page.waitForTimeout(1500);
    
    // Fill client name and description
    await page.fill('input[id="clientName"]', 'Acme DAO');
    await page.fill('input[id="description"]', 'Landing page design');
    
    // Click Generate Receipt
    await page.click('button:has-text("Generate Receipt")');
    await page.waitForTimeout(2000);
    
    // Screenshot the receipt preview
    const receipt = await page.$('#receipt-preview');
    if (receipt) {
      await receipt.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/sample-receipt-preview.png' });
      console.log('Receipt preview saved');
    } else {
      console.log('Receipt preview not found, screenshotting full page');
      await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/sample-receipt-fullpage.png', fullPage: true });
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/debug-page.png', fullPage: true });
    console.log('Debug screenshot saved');
  }
  
  await browser.close();
})();
