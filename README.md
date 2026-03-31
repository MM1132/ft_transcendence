<i>This project has been created as part of the 42 curriculum by [**rreimann**](https://github.com/MM1132), [**cmakario**](https://github.com/conmak8), [**kkaratsi**](https://github.com/karatsioris), [**nlewicki**](https://github.com/nlewicki) and [**chuhlig**](https://github.com/cuhlig42)</i>
## The Awesome Transcendence Project

## Description
Ever wanted to play the good old snake game online with your friends? Our project (named **BLACK MAMBA**) is **THE** choice for you! Log into https://snake.reimann.ee, invite your best friend(s), and beat them in the ultimate snake showdown! 

## Installation instructions:
- Make sure you have Docker installed. Check out Docker's official website: [LINK](https://www.docker.com)
- Clone the project: `git clone https://github.com/MM1132/ft_transcendence.git`
- Get into the project directory: `cd ft_transcendence`
- Copy-paste `.env.example` file and rename it `.env`: `cp .env.example .env`
- Default settings from `.env.example` file work for local setup out of the box, you can change them depending on your specific needs. 
- Run the project: `docker compose up -d --build`
- In the browser, go to `http://localhost`
- View logs `docker compose logs frontend -f` 
- Stop the app: `docker compose down`

Both frontend and backend are automatically hot-reloaded when you save files. 

As a developer, you can also access the PostgreSQL database directly, see `docker-compose.yml` file for the connection details. 

### Install new npm packages during development:
- Sh into the container: `docker compose exec frontend sh`
- And then install the desired package `npm i <package name>`  
package.json and node_modules are automatically updated in your host machine

Happy developing! :) 

## Team Formation

| Member Name | Role | Responsibilities |
| --- | --- | --- |
| [**rreimann**](https://github.com/MM1132) | PO (Project Owner) | Setting up the project. Backend REST API, continous deployment. Monitoring the development processes and guiding the team. |
| [**nlewicki**](https://github.com/nlewicki) | PM (Project Manager) | Developing lots of frontend, finding and fixing bugs. Responsive web design. Testing the application vigorously. |
| [**kkaratsi**](https://github.com/karatsioris) | UI/UX Lead | Creating the website styling guidelines, leading the frontend team with exemplary coding practices. Making sure that frontend developers do their job right. |
| [**cmakario**](https://github.com/conmak8) | Frontend Dev | The frontend for the most important part of the project - game itself in both multiplayer and singleplayer. |
| [**chuhlig**](https://github.com/cuhlig42) | Backend Dev | Developing backend for the game, rooms, and the real-time chatting capabilities. |

## Project Management
Semi-regular standup-style team meetings in the early mornings before Nico had to go to uni and Robert to Level 3. 
### Tools
- Github: Issues, Pull Requests with reviews, Webhooks for CI/CD
- Figma: Creating frontend styles
- Discord: Our main communication channel

## Technical Stack
There are 4 parts of our application, each of them playing a critical role in the functioning of the application as a whole:
- Backend: Using the [Fastify](https://fastify.dev) framework, responsible for the core logic of the application. REST API and WebSockets for communication. Fastify was chosen for it's speed and low boilerplate code requirements. Talks to Nginx and Database. 
- Frontend: Coded with [Svelte](https://svelte.dev) framework. Makes requests towards our Nginx, cannot access Backend or Database directly. Svelte was choses for it's speed and simplicity compared to the most-popular web framework React. 
- Database: Using the open source [PostgreSQL](https://www.postgresql.org) to store all our data. It was chosen because it is open source and easy to work with. Also, knowing how to use a relational database was good knowledge for us. 
- Reverse proxy: [Nginx](https://nginx.org), works as a security layer, as all the requests towards our application must go through it! Nginx was chosen for being the most popular and videly adopted industry standard. 

## Database Schema
```mermaid
---
title: Transcendence Database Visualization
config:
  theme: 'forest'
---
erDiagram
	direction LR

	
```

## Features List
TODO

## Modules
TODO

## Individual Contributions
TODO

## Resources
> AI was used with care and comfort. No chatbots were harmed in the creation of this project.  
### We used AI <u>only</u> for:
- All backend Websocket/Chat/Rooms/Game parts
- Generating SQL statements
- Helping to fix and find bugs in our code
- The software development design patterns and best practices
- Nginx configuration and CI/CD to snake.reimann.ee
- Reviewing our Pull Requests with copilot  
### AI was NOT used for:
- Writing this Readme
