from selenium.webdriver.common.by import By
import tconf 
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
USECASE = "UC6"

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# login as admin, this alone should ensure that there are logs
tconf.login(tconf.admin_username, tconf.admin_password)

# Normal flow
# find the logout link
try:
    logout_link = driver.find_element(by=By.ID, value="logoutLink")
    try:
        logout_link.click()
        login_button = driver.find_element(by=By.XPATH, value="//button[normalize-space()='Login']")
        try:
            # try access a place that requires login
            driver.get("localhost:4000/posts")
            # if everything works as it should, we are still on the login page
            driver.implicitly_wait(0.5)
            login_button = driver.find_element(by=By.XPATH, value="//button[normalize-space()='Login']")
            tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "passed", "Logout successful.")
            print(f"{USECASE} normal flow test passed")
        except NoSuchElementException:
            tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Posts found after logout.")
            print(f"{USECASE} normal flow test failed")
    except NoSuchElementException:
        tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Login button not found after logout.")
        print(f"{USECASE} normal flow test failed")
except NoSuchElementException:
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the logout link.")
    print(f"{USECASE} normal flow test failed")

driver.quit()
app_process.kill()