## Project Overview

- This website helps users to track their budget and manage their expenditure in a convenient, intuitive way.

## How to Use

1\. If you do not have MongoDB installed, follow steps 1-4. These steps assume you are running Mac OS. If you are running Windows, please visit: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
First, ensure you have xcode command line tools installed

	xcode-select --install

2\. Tap the MongoDB Homebrew tap by running the code below. This assumes you have homebrew installed. If not, visit: https://brew.sh/#install

	brew tap mongodb/brew

3\. Update Homebrew

	brew update

4\. Install MongoDB

	brew install mongodb-community@5.0

5\. To ease the process of starting and stopping the mongod process, open up your bash profile

	nano ~/.bash_profile

6\. Create an alias to start the mongod process by entering the following line in your bash profile

	alias mongodbstart='brew services start mongodb-community@5.0'

7\. Create an alias to stop the mongod process by entering the following line in your bash profile

	alias mongodbstop='brew services stop mongodb-community@5.0'

8\. Save and close your bash profile

9\. Clone the repository to your local machine

	git clone https://github.com/Kieran-Arul/budgeting-website

10\. Navigate into the project directory

	cd budgeting-website

11\. Run the following command to install the necessary dependencies

	npm install

12\. Start the mongod process

	mongodbstart

12\. Run the following command to start a server on Port 8080:

  	npm start

13\. Open up your internet browser and go to:

http://localhost:8080/

14\. You should now be able to browse the website

15\. When you are finished, stop the server from running by hitting CTRL-C

16\. Terminate the mongod process:

  	mongodbstop
