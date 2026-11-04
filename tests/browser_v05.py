"""Offline Chromium smoke test. Uses set_content to work inside restricted environments."""
from pathlib import Path
import asyncio
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parent.parent
async def run():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  page=await browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  await page.set_content((ROOT/'PLAY.html').read_text('utf8'),wait_until='domcontentloaded')
  await page.wait_for_timeout(600)
  assert await page.locator('#pixelCanvas').evaluate('(e)=>[e.width,e.height]')==[480,270]
  assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
  await page.evaluate('scrollTo(0,0)')
  await page.screenshot(path=str(ROOT/'screenshot_desktop.png'))
  await page.locator('[data-cmd="preset"][data-value="balanced"]').click()
  await page.locator('[data-cmd="queue-remove"][data-value="9"]').click()
  assert await page.locator('[data-cmd="queue-target"][data-value="9"]').count()==1
  await page.locator('[data-cmd="queue-add"][data-value="research"]').click()
  assert await page.evaluate('window.YG_APP.game.s.schedule[9]')=='research'
  await page.evaluate('window.YG_APP.game.beginEncounter("v5_walk_02",true,"walk",12);window.YG_APP.render();scrollTo(0,0)')
  assert await page.locator('#storyChoices .choice-card').count()==2
  assert await page.locator('#sceneTitle').inner_text()=='길고양이의 기지개'
  await page.screenshot(path=str(ROOT/'screenshot_encounter.png'))
  await page.locator('#storyChoices [data-cmd="event-choice"][data-value="0"]').click()
  assert (await page.locator('#storyChoices').inner_text()).find('선택의 결과')>=0
  await page.locator('#storyChoices [data-cmd="close-notice"]').click()
  await page.evaluate('window.YG_APP.game.debugGhost("driver");window.YG_APP.game.s.scene={title:"강령 성공",body:"응답한 목소리가 가까워진다.",action:"ghost",tone:"ghost",day:1,hour:21};window.YG_APP.render();scrollTo(0,0)')
  await page.wait_for_timeout(120)
  await page.screenshot(path=str(ROOT/'screenshot_ghost.png'))
  await page.evaluate('const g=window.YG_APP.game;g.s.phase="night";g.s.pending={kind:"report",title:"결산",body:""};g.openShop();window.YG_APP.render();scrollTo(0,0)')
  assert await page.locator('#storyChoices .choice-card').count()>=2
  await page.screenshot(path=str(ROOT/'screenshot_shop.png'))
  await page.set_viewport_size({'width':390,'height':844})
  await page.evaluate('scrollTo(0,0)')
  await page.wait_for_timeout(100)
  assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
  await page.screenshot(path=str(ROOT/'screenshot_mobile.png'),full_page=True)
  assert not errs,errs
  print('BROWSER PASS: initial, fixed schedule, encounter, ghost, shop, mobile, no JS exceptions')
  await browser.close()
asyncio.run(run())
