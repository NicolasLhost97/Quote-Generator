# Quote Generator Application

This application retrieves a random quote for users.

## Installation and Running

1. **Download** the project.
2. **Navigate** to the project folder.
3. **Docker**: Ensure you have Docker installed and opened. If not, you can download it [here](https://docs.docker.com/get-docker/).
4. **Open a terminal** within the project directory.
5. **Execute the following commands**:

  ```
  docker-compose build
  docker-compose up
  ```

## Frontend Features

- **Memory Cache**: The application retains the last 100 quotes to ensure users don't frequently encounter the same ones.
- **Dynamic Background**: With every new quote, the background changes to enable better screenshots. Two circles randomly change their positions while ensuring one is always on the left and the other on the right.
- **Error Notifications**: Any errors are displayed at the top right of the application to inform users promptly.
- **Component Decomposition**: The code has been broken down into different components. However, due to the project's size, they reside within the same file.

## Backend Features

- **API Token**: A mock API token has been implemented to secure the application and send unauthorized access errors when necessary.
- **Error Handling**: 
  - Errors from the quotable.io API are logged in the backend (using `console.log` for this project, but a Logger would be ideal for real-world applications). Generic errors are sent to the frontend to avoid revealing too much information.
  - Two middlewares handle route errors and more global errors, ensuring consistent error messages are sent to the frontend.

## Testing

Unit and integration tests have been carried out for both the frontend and the backend.
To execute the tests for either the frontend or backend:

1. Navigate to the respective directory (`back` or `front`).
2. Run the command:

```
npm test
```

This will initiate the testing process and display the results in the terminal.