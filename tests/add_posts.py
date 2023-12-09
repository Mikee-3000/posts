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
USECASE = "UC3"

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# login first
tconf.login(tconf.admin_username, tconf.admin_password)

tconf.addPosts(50)
driver.quit()
app_process.kill()