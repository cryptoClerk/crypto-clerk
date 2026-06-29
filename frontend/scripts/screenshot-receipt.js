const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  
  try {
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(1500);
    
    await page.fill('input[id="txHash"]', '0xabc123def4567890123456789012345678901234567890123456789012345678');
    await page.click('button:has-text("Fetch")');
    await page.waitForTimeout(1500);
    
    await page.fill('input[id="clientName"]', 'Acme DAO');
    await page.fill('input[id="description"]', 'Landing page design');
    await page.click('button:has-text("Generate Receipt")');
    await page.waitForTimeout(2000);
    
    // Scroll to receipt and screenshot just that area
    const receipt = await page.$('#receipt-preview');
    if (receipt) {
      await receipt.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await receipt.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/sample-receipt.png' });
      console.log('Clean receipt screenshot saved');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
