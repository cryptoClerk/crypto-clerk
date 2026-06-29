const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    // Screenshot Dashboard
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/phase2-dashboard.png', fullPage: true });
    console.log('Dashboard screenshot saved');
    
    // Screenshot Wallets page
    await page.goto('http://localhost:3001/dashboard/wallets');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/phase2-wallets.png', fullPage: true });
    console.log('Wallets screenshot saved');
    
    // Screenshot Statements page
    await page.goto('http://localhost:3001/dashboard/statements');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/phase2-statements.png', fullPage: true });
    console.log('Statements screenshot saved');
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
})();
