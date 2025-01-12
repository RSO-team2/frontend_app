# Frontend Application of the Fast Food Times Application

Application endpoints:
- `/` - Basic Page
- `/login` - Login Interface
- `/register` - Register Interface
- `/register/restaurant` - Follow up page for registering a restaurant, this is where they insert their restaurant info and curate their menu.
- `/home` - Home Page (for both users and restaurants) where the users access their relevant features.
- `manage_order/:id` - The page for users when they want to order food from the restaurant with the id `:id`.

## Local Development

This is the frontend application only, and thus requires the specific microservices and the website to be running. To set it up locally, you can clone this repository, create a `.env` file in it with the following variables:
```
REACT_APP_LOGIN_ENDPOINT="..."
REACT_APP_RESTURANT_ENDPOINT="..."
REACT_APP_RESERVATION_ENDPOINT="..."
REACT_APP_ORDER_ENDPOINT="..."
```
Running  `npm install` and `npm start` should get you started, locally.

## Deployment

The application is deployed through DigitalOcean App Platform. It is deployed automatically whenever a new commit is pushed to the `main` branch. Note that in order to deploy, you need to first build the project using `npm run build` in your local directory.