# Soccer API

This project is an Express.js application that provides a GraphQL API for handling soccer-related data. It integrates with the [football-data.org](https://www.football-data.org/) API to fetch league, team, player, and coach information and stores it in a mongoDB database.


## 📜 How to Run the Project

1. Unzip project file `soccer-api.zip`

2. Make sure docker is running on your machine (you need to have installed docker and docker compose)

3. Go to project directory and run:
   ```sh
   docker-compose up --build

4. Access and test the API at:
   ```sh
   http://localhost:4000/graphql


## 📌 Project Overview

- **Importing Leagues:** Fetch league details from football-data API and store them in a database.

- **Fetching Teams and Players:** Query teams and their associated players using GraphQL.

- **Handling API Rate Limits:** Efficiently manage external API calls while staying within football-data's free token usage limits.

- **Unit Testing:** Ensures data consistency and API reliability using Jest and Supertest.


## ✅ Implemented Features

- **GraphQL API Endpoints**
  - `importLeague(leagueCode: String!): ImportLeagueResponse`
  - `team(name: String!): Team`
  - `players(leagueCode: String!, teamName: String): [Player]`

- **Unit Tests**
  - Tests for `importLeague` mutation
  - Tests for `team` and `players` queries
  - Uses Jest to mock Axios responses for API calls.


## 🛠️ Tech Stack

- **TypeScript**
- **Node.js & Express.js**
- **GraphQL & Apollo Server**
- **MongoDB & Mongoose**
- **Axios**
- **Bottleneck**
- **Jest & Supertest**


### Why MongoDB/NoSQL?

1. **Flexible Schema:** Soccer data structures can change over time, and NoSQL allows for easy modifications without migrations.

2. **Nested Relationships:** Data like teams, players, and coaches can be stored as embedded documents, improving query efficiency.

3. **High Read Performance:** NoSQL databases optimize read-heavy applications like querying team and player data.

4. **Scalability:** MongoDB provides horizontal scalability, making it suitable for handling large datasets.


### What about other tech stack decisions?

1. **TypeScript:** By specifying types, we are able to catch potential errors during development.

2. **Express.js:** Robust and well documented framework over node.js. Another approach could have been Nest.js.

3. **Apollo Server:** Provides easy setup, compatibility and reduce amount of code required to implement GraphQL.

4. **Mongoose:** Provides schema definition and query operations that reduce complexity to use mongoDB.


## 🚀 Possible Enhancements

Considering this project as a real product, we could add the following features (in order of importance):

- **Use/Migrate to AWS**: AWS services will allow to auto-scalate our product, and also add several useful services for caching, load-balancing, implement microservices, message queueing, logging, and many more.

- **Caching**: Use Apollo features for caching responses. Other alternative is Redis to cache API responses and reduce redundant API calls.

- **Pagination & Sorting**: Optimize queries for large datasets.

- **Extend/create new queries**: Allow users to query more information regarding specific players stats, records, matches and possibly win percentages. This feature will probably require to also add more mutations to allow fetch additional data from football-data endpoints into our database.

- **Authentication & Authorization**: Secure API access with JWT.

- **User Accounts**: Allow users to save their queries, teams, players, etcetera.


## 📜 Things to consider about this challenge

- Most tech stack decisions were decided because of the benefits from each technology. I considered implementing a better arquitecture (probably using AWS), but given time constraints I stick with this approach.

- I gived it a try using most of these technologies and features on weekend with the time I had (about 6-7 hours) to build most of the project. Talking with the recruiter I managed to have some more time, so I worked about 3-4 more hours, mostly configuring and adding unit tests and TypeScript.

- Current unit tests and their configuration are something that could improve a lot. I am not proud of the current state for unit testing, but again, given time constraints I was not able to configure them efficiently and properly add tests for all main flows, so I just added a couple of them for each mutation/query to showcase the path to follow to complete them.


#
# Thanks!! 🚀