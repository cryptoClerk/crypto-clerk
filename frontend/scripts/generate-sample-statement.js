const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    // Go to statements - wallets should already be added
    await page.goto('http://localhost:3001/dashboard/statements');
    await page.waitForTimeout(2000);
    
    // Click the first wallet checkbox (force click to bypass viewport issues)
    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      await checkbox.evaluate(el => el.click());
      await page.waitForTimeout(500);
    }
    
    // Click second wallet checkbox
    const checkboxes = await page.$$('input[type="checkbox"]');
    if (checkboxes.length > 1) {
      await checkboxes[1].evaluate(el => el.click());
      await page.waitForTimeout(500);
    }
    
    // Click Generate Statement
    await page.click('button:has-text("Generate Statement")');
    await page.waitForTimeout(3000);
    
    // Screenshot the statement preview
    const statement = await page.$('#statement-preview');
    if (statement) {
      await statement.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/sample-statement.png' });
      console.log('Statement screenshot saved');
    }
    
    // Full page screenshot
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/sample-statement-full.png', fullPage: true });
    console.log('Full page screenshot saved');
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/Users/argylebot/.openclaw/workspace/cryptobooks/debug-statement-error2.png', fullPage: true });
  }
  
  await browser.close();
})();
