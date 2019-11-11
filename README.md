# Welcome to Matcha !

There will be a public link to this project soon but right now, if you want to launch the project locally, you'd need a few rules to reach it.

## 1 - Clone the project

`git clone https://github.com/Jcharloi/42-Matcha.git matcha`

## 2 - Install dependencies

Go to **client** and **server** folders and make `npm i` inside both of them

## 3 - Create needed files

At this point, if you launch `npm start` in **server** folder, you will get two errors because you need to create the two necessary files that I won't push on Github.

- Make `cd server/sql/`, create a file named `dbKeys.json` and put a template like this inside : `{"userName": userNamedB, "password": passwordDb}`, then write your right credentials so postgresSql can connect to the database named **matcha**. Make sure this database exists before.

- At the root of **server**, you will also need a file named `keys.json` (with all my API keys) but you will have to ask me 'cause I won't write my keys here 🤔

## 4 - Launch the seed to create fake users

Well.... You are about to use my social dating website but... Can you really match if there is nobody ? The answer is no !

You will need to launch my seed, make `npm run setup:database` in **server** folder, this will take approximately **2 minutes** to finish

> My free OpenCage API can't handle more than 2500 users per day

## 4 - Launch the servers

Well.... Now you can having fun matching people I guess, just make `npm start` inside **client** and **server** folders and let's maaattccchh !
