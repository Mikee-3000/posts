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

# delete all posts so that there is no interference
tconf.deleteAllPosts()

# wait for the page to load, check if the apps starts
tconf.appStartCheck(test_start_time, app_process)

# login first
tconf.login(tconf.admin_username, tconf.admin_password)

# Normal flow
text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

try: 
    # find the post text area and put text in it
    post_ta = driver.find_element(by=By.ID, value="postText")
    post_ta.send_keys(text)
    try:
        # send the post
        send_button = driver.find_element(by=By.ID, value="postButton")
        send_button.click()
        try:
            # check if the post is there
            driver.implicitly_wait(0.5)
            posts = driver.find_elements(by=By.CLASS_NAME, value='postText')
            try:
                for post in posts:
                    if post.text == text:
                        tconf.write_report(USECASE, "normal flow", test_start_time, "passed", "The test post was sent and found in the post list.")
                        print(f"{USECASE} normal flow test passed")
                        break
                else:
                    raise NoSuchElementException
            except NoSuchElementException:
                tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "The test post was not found in the post list.")
                print(f"{USECASE} normal flow test failed")
        except NoSuchElementException:
            tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the posts.")
            print(f"{USECASE} normal flow test failed")
    except NoSuchElementException:
        tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the post button.")
        print(f"{USECASE} normal flow test failed")
except NoSuchElementException:
    tconf.write_report(f"{USECASE}", "normal flow", test_start_time, "failed", "Couldn't find the post text area.")
    print(f"{USECASE} normal flow test failed")

# Exceptional flow - database can't be accessed has already been tested in UC1

driver.quit()
app_process.kill()