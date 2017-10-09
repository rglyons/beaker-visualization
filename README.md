# Beaker Visualization Tool

## Who made it? What's it for?
This web tool was created by Robert Lyons at Applied Micro Circuits. It is intended to present and visualize lab data collected by the Beaker automation framework for at-a-glance information and problem diagnosis.

## How to run it
1. Install Node.js version 6.11+
2. Clone this repository
3. run `npm install`
4. run `npm run all` to run the dev frontend server with the production backend server. This is a single script to run everything for quick and easy development.
5. For a production experience, run `npm run build`. This signals Node to tell Webpack to build the application entry page. Then, run `npm run prod` to run the production version of the application on localhost:3000

## Technologies
- Node.js
- Express.js
- Vue.js
- Vuetify.js
