from selenium.webdriver.common.by import By
import tconf 
from time import sleep
import subprocess
from selenium.common.exceptions import NoSuchElementException


# MAKE SURE THAT YOU RUN THIS FILE FROM THE ROOT OF THE PROJECT, NOT FROM THE TESTS FOLDER  
# MAKE SURE THAT NOTHING ELSE ON YOUR SYSTEM IS USING PORT 4000 (do `sudo lsof -i :4000` to check on Linux)

# start the node app
app_process = subprocess.Popen(["node", "app.js"])
driver = tconf.driver

# prep
test_start_time = tconf.timestamp()
driver.implicitly_wait(0.5)
USECASE = "UC2"

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# make sure that the incorrect test username is not in the database
tconf.removeUserFromDB(tconf.incorrect_username)

# Normal flow
tconf.login(tconf.admin_username, tconf.admin_password)
# look for the post logout link, if it's there, then the login was successful
try: 
    driver.implicitly_wait(0.5)
    logout_link = driver.find_element(by=By.ID, value="logoutLink")
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "passed", "Login successful")
    print(f"{USECASE} normal flow test passed")
except NoSuchElementException:
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Login failed")
    print(f"{USECASE} normal flow test failed")

# Alternative flow A3 too short username or password
flow = "A3"
tconf.login(tconf.invalid_username, tconf.invalid_password)
driver.implicitly_wait(0.5)
message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "Username must be at least 4 characters long."
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "Too short a username was not permitted.")
    print(f"{USECASE} {flow} username test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", "alternate flow {flow}", test_start_time, "failed", "Too short a username was permitted")
    print(f"{USECASE} {flow} username test failed")
    print("AssertionError: " + text)
uname = driver.find_element(by=By.NAME, value="uname")
psw = driver.find_element(by=By.NAME, value="psw")
uname.clear()
psw.clear()
uname.send_keys(tconf.username)
psw.send_keys(tconf.invalid_password)
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
submit_button.click()
message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "Password must be at least 8 characters long."
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "Too short a password was not permitted.")
    print(f"{USECASE} {flow} password test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "failed", "Too short a password was permitted.")
    print(f"{USECASE} {flow} password test failed")
    print("AssertionError: " + text)
    sleep(100)

# Alternative flow A4 credentials don't match stored credentials
flow = "A4"
tconf.login(tconf.incorrect_username, tconf.password)
driver.implicitly_wait(0.5)
message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "Authentication failed, please check your username and password."
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "Incorrect credentials resulted in expected message.")
    print(f"{USECASE} {flow} test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "failed", "Incorrect credentials did not result in expected message.")
    print(f"{USECASE} {flow} test failed")
    print("AssertionError: " + text)

# Exceptional flow - database can't be accessed has already been tested in UC1

driver.quit()
app_process.kill()