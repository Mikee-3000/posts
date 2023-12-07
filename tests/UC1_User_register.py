from selenium.webdriver.common.by import By
import tconf 
from time import sleep
import subprocess

# MAKE SURE THAT YOU RUN THIS FILE FROM THE ROOT OF THE PROJECT, NOT FROM THE TESTS FOLDER  
# MAKE SURE THAT NOTHING ELSE ON YOUR SYSTEM IS USING PORT 4000 (do `sudo lsof -i :4000` to check on Linux)

# start the node app
app_process = subprocess.Popen(["node", "app.js"])
driver = tconf.driver

# prep
test_start_time = tconf.timestamp()
driver.implicitly_wait(0.5)
USECASE = "UC1"

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# make sure that the test user is not in the database
tconf.removeUserFromDB(tconf.username)

# Normal flow
driver.get("localhost:4000/register")
uname = driver.find_element(by=By.NAME, value="uname")
psw = driver.find_element(by=By.NAME, value="psw")
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
uname.send_keys(tconf.username)
psw.send_keys(tconf.password)
submit_button.click()

message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "Registration successful, please login with your new details."
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "passed", "Registration successful")
    print(f"{USECASE} normal flow test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Registration failed")
    print(f"{USECASE} normal flow test failed")
    print("AssertionError: " + text)

# Alternative flow A1 too short username or password
flow = "A1"
driver.get("localhost:4000/register")
driver.implicitly_wait(0.5)
uname = driver.find_element(by=By.NAME, value="uname")
psw = driver.find_element(by=By.NAME, value="psw")
uname.send_keys(tconf.invalid_username)
psw.send_keys(tconf.invalid_password)
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
submit_button.click()
driver.implicitly_wait(0.5)
message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "Username must be at least 4 characters long."
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "Too short a username was not permitted.")
    print("{USECASE} {flow} username test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "failed", "Too short a username was permitted")
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

# Alternative flow A2 user already exists
flow = "A2"
driver.get("localhost:4000/register")
driver.implicitly_wait(0.5)
uname = driver.find_element(by=By.NAME, value="uname")
psw = driver.find_element(by=By.NAME, value="psw")
uname.send_keys(tconf.existing_username)
psw.send_keys(tconf.password)
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
submit_button.click()
driver.implicitly_wait(0.5)
message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "Registration Error. Please choose different details."
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "Existing username was not permitted for new user registration.")
    print(f"{USECASE} {flow} test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "failed", "Existing username was permitted for new user registration")
    print(f"{USECASE} {flow} test failed")
    print("AssertionError: " + text)

# Exceptional flow E1 database can't be accessed
flow = "E1"
tconf.removeDBFile()
driver.get("localhost:4000/register")
uname = driver.find_element(by=By.NAME, value="uname")
psw = driver.find_element(by=By.NAME, value="psw")
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")
uname.send_keys(tconf.username)
psw.send_keys(tconf.password)
submit_button.click()

message = driver.find_element(by=By.CLASS_NAME, value="message")
text = message.text
try:
    assert text == "An error occurred while registering. Please try again, if error persists contact the administrator."
    tconf.write_report(f"{USECASE}", f"Exceptional flow {flow}", test_start_time, "passed", "DB not accessible, expected message found.")
    print(f"{USECASE} {flow} test passed")
except AssertionError:
    tconf.write_report("{USECASE}", f"Exceptional flow {flow}", test_start_time, "failed", "DB not accessible, expecected message not found.")
    print(f"{USECASE} {flow} test failed")
    print("AssertionError: " + text)

driver.quit()
app_process.kill()