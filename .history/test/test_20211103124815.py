from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select



import os, json
from selenium import webdriver

options = webdriver.ChromeOptions()
options.add_argument("--auto-open-devtools-for-tabs")
driver = webdriver.Chrome('./chromedriver', options=options)
driver.get("http://127.0.0.1:8000/newevent")

inputs = [
	{
	"name": "title", 
	"value": "Game 4"
	},
	{
	"name": "id", 
	"value": "04"
	},
	{
	"name": "date", 
	"value": "01012021"
	}, 
	{
	"name": "hours-start", 
	"value": "0101a"
	},
	{
	"name": "hours-end", 
	"value": "0102p"
	},
	{
	"name": "workHours-start", 
	"value": "0101a"
	},
	{
	"name": "workHours-end", 
	"value": "0102p"
	},
]

selectors = [
	{
	"name": "category", 
	"value": "SPORT"
	},
	{
	"name": "subcategory", 
	"value": "FOOTBALL"
	},
]
for selectorData in selectors: 
	# print(selectorData["name"])
	selector = Select(driver.find_element_by_name(selectorData["name"]))
	selector.select_by_value(selectorData["value"])

for inputData in inputs:
	# print(inputData["name"])
	driver.find_element_by_name(inputData["name"]).send_keys(inputData["value"])

driver.find_element_by_id("submit").click()



