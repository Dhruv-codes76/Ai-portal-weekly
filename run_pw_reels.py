from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812}) # mobile viewport
    page.goto('http://localhost:3000')
    page.screenshot(path='homepage_reels_updated.png')
    browser.close()
