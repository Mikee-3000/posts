from selenium import webdriver
from datetime import datetime as dt
from pathlib import Path
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from time import sleep
import sqlite3
import os

driver = webdriver.Firefox()
username = 'user1'
password = 'abc12345'
invalid_username = 'u'
invalid_password = 'p'
incorrect_username = 'user2'
existing_username = 'admin'
admin_username = 'admin'
admin_password = 'admin123'
report_dir = Path('tests/reports')

def timestamp():
    return dt.now().strftime('%Y-%m-%dT%H%M%S')

def removeUserFromDB(username):
    current_path = Path(os.getcwd())
    db_path = Path(current_path, "db.sqlite")
    print(db_path)
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    cur.execute(f"DELETE FROM users WHERE name = '{username}'")
    con.commit()
    con.close()

def deleteAllPosts():
    current_path = Path(os.getcwd())
    db_path = Path(current_path, "db.sqlite")
    print(db_path)
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    cur.execute(f"DELETE FROM posts")
    con.commit()
    con.close()

def write_report(usecase, flow, test_start_time, passed, message):
    with open(Path(report_dir, f'{usecase}.report.{test_start_time}.txt'), 'a') as f:
        f.write(f'{test_start_time} {usecase} ({flow}): {passed}, {message}\n')

def removeDBFile():
    db_path = Path('db.sqlite')
    if db_path.exists():
        db_path.unlink()

def appStartCheck(test_start_time, app_process):
    # wait for the page to load, check if the apps starts
    try:
        sleep(1)
        driver.get("localhost:4000")
        h2_element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//h2[text()="Posts"]')))
    except (TimeoutException, WebDriverException) as e:
        print("App did not start properly, exiting...")
        print(e)
        write_report("App Start", "", test_start_time, "failed", "App did not start properly.")
        app_process.kill()
        driver.quit()
        os._exit(1)

def register(username, password):
    driver.get("localhost:4000/register")
    uname = driver.find_element(by=By.NAME, value="uname")
    psw = driver.find_element(by=By.NAME, value="psw")
    submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
    uname.send_keys(username)
    psw.send_keys(password)
    submit_button.click()

def login(username, password):
    driver.get("localhost:4000/login")
    uname = driver.find_element(by=By.NAME, value="uname")
    psw = driver.find_element(by=By.NAME, value="psw")
    submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
    uname.send_keys(username)
    psw.send_keys(password)
    submit_button.click()

def post(text):
    post_ta = driver.find_element(by=By.ID, value="postText")
    post_ta.send_keys(text)
    send_button = driver.find_element(by=By.ID, value="postButton")
    send_button.click()