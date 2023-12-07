from selenium.webdriver.common.by import By
from selenium import webdriver
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
USECASE = "UC4"

# remove existing posts from the database
tconf.deleteAllPosts()

# delete the test user (we'll re-register them later, this is to eleminate ucertainty about the user's existence)
tconf.removeUserFromDB(tconf.username)

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# add some posts so that there is something to delete
# register the non-admin user
tconf.register(tconf.username, tconf.password)

# login first as a regular user
tconf.login(tconf.username, tconf.password)

# creates some dummy text
posts = [
    "post 1",
    "post 2",
    "post 3",
    "post 4",
    "post 5",
    "post 6",
    "post 7"
]

for post in posts:
    tconf.post(post)

# start with the alternate flow this time, before we log in as admin
flow = 'A5'
try:
    deleteButtons = driver.find_elements(by=By.XPATH, value="//*[starts-with(@id, 'deleteButton')]")
    assert len(deleteButtons) == 0
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "passed", "The regular user cannot see a delete button.")
    print(f"{USECASE} alternate flow {flow} test passed")
except AssertionError:
    tconf.write_report(f"{USECASE}", f"alternate flow {flow}", test_start_time, "failed", "The regular user can see a delete button.")
    print(f"{USECASE} alternate flow {flow} test failed")

# close and start the server to start a new session (logout has not yet been tested and driver.quite() doesn't seem to work)
app_process.kill()
sleep(1)
app_process = subprocess.Popen(["node", "app.js"])
# tconf.appStartCheck(test_start_time, app_process)


# Normal flow
# login as admin
tconf.login(tconf.admin_username, tconf.admin_password)

# randomly select a post to delete
text_to_delete = random.choice(posts)

# delete the post
try:
    post_to_delete = driver.find_element(by=By.XPATH, value=f"//label[text()='{text_to_delete}']")
    try:
        post_id = post_to_delete.find_element(by=By.XPATH, value=".//ancestor::div[contains(@class, 'post')]").get_attribute("id")
        try:
            delete_button = driver.find_element(by=By.ID, value=f"deleteButton{post_id}")
            delete_button.click()
            driver.implicitly_wait(0.5)
            try:
                post_to_delete = driver.find_element(by=By.XPATH, value=f"//label[text()='{text_to_delete}']")
                tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "The post was not deleted.")
                print(f"{USECASE} normal flow test failed")
            except NoSuchElementException:
                tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "passed", "The post was deleted.")
                print(f"{USECASE} normal flow test passed")
        except:
            tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the delete button.")
            print(f"{USECASE} normal flow test failed")
    except NoSuchElementException:
        tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the post id.")
        print(f"{USECASE} normal flow test failed")
except NoSuchElementException:
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the post to delete.")
    print(f"{USECASE} normal flow test failed")

driver.quit()
app_process.kill()
