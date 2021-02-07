# Local HTTP file server
This is a light weight simple node server to serve any local file via HTTP for avoiding CORS issues while integrating file related tasks during front-end development.

## Highlights
- No dependencies used. Only core packages provided by Node.js is used. So no need to run `npm install`.

## Requirements
- Node.js

## Running the project
- Just run `node app.js` command to run the server. Default port will be 3000
- If you need to change the port; run `node app.js <PORT_OF_YOUR_CHOICE>`. E.g.; node app.js 8080
- Use the url `http://localhost:PORT/file?fileFullPath=<your_desired_file_location_with_file_name>`
