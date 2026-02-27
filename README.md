## The Awesome Transcendence Project

### Instructions for developers:
- Run dev: `docker compose up -d`
- View logs `docker compose logs frontend -f` 
- Stop dev: `docker compose down` 
(replace "frontend" with "backend" if you wish)

Both frontend and backend are automatically hot-reloaded when you save files. 

#### If you want to install new npm package
- Sh into the container: `docker compose exec frontend sh`
- And then install the desired package `npm i <package name>`  
package.json and node_modules are automatically updated in your host machine

Happy developing! :) 
