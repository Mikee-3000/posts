from selenium.webdriver.common.by import By
import tconf 
from time import sleep
import random
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
USECASE = "UC5"

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# login as admin, this alone should ensure that there are logs
tconf.login(tconf.admin_username, tconf.admin_password)

# Normal flow
# go to the logs page
try:
    logs_link = driver.find_element(by=By.XPATH, value="//a[text()='Logs']")
    logs_link.click() 
    try:
        logs_header = driver.find_element(by=By.XPATH, value="//h1[text()='Logs']")
        tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "passed", "Admin user can see the logs.")
    except NoSuchElementException:
        tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Admin user can't find the logs page.")
        print(f"{USECASE} normal flow test failed")
except NoSuchElementException:
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Admin user can't find the logs link.")
    print(f"{USECASE} normal flow test failed")

# Alternative flow A6 non-admin user can't access the logs page
flow = "A6"

# close and start the server to start a new session (logout has not yet been tested and driver.quite() doesn't seem to work)
app_process.kill()
sleep(1)
app_process = subprocess.Popen(["node", "app.js"])
# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# Normal flow
# login as a regular user
tconf.login(tconf.username, tconf.password)
try:
    logs_link = driver.find_element(by=By.XPATH, value="//a[text()='Logs']")
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "failed", "Regular user can see the logs link.")
    print(f"{USECASE} normal {flow} test failed")
except NoSuchElementException:
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "Regular user can't see the logs link.")
    print(f"{USECASE} normal {flow} test passed")   

driver.quit()
app_process.kill()