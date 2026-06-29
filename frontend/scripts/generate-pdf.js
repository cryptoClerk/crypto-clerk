const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
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
    
    // Click Download PDF and capture the download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      page.click('button:has-text("Download PDF")')
    ]);
    
    await download.saveAs('/Users/argylebot/.openclaw/workspace/cryptobooks/sample-receipt.pdf');
    console.log('PDF saved successfully');
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/debug-pdf.png', fullPage: true });
    console.log('Debug screenshot saved');
  }
  
  await browser.close();
})();
