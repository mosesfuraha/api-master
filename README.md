# ApiMaster

## Project Description

ApiMaster is an Angular application designed for managing posts with CRUD (Create, Read, Update, Delete) operations. It features:

- Environment-specific API configurations
- Robust error handling using Angular Material's MatSnackBar
- Integration with a RESTful API (using JSONPlaceholder for development)
- Responsive design for various device sizes

**Deployed Application:** [https://api-master-eta.vercel.app/](https://api-master-eta.vercel.app/)

## Setup and Run Instructions

1. Clone the repository
2. Install dependencies using npm
3. Run the development server
4. Open your browser and navigate to `http://localhost:4200/`

## Available npm Scripts

- `npm start`: Starts the development server
- `npm run build`: Builds the project for production
- `npm test`: Runs unit tests using Jest
- `npm run lint`: Lints the project files

## Project Structure and Key Features

### Project Structure

The project follows a standard Angular application structure with components, services, models, and interceptors organized in their respective directories under the `src/app/` folder. Environment configurations are stored in the `src/environments/` directory.

### Key Features

1. **Environment-specific Configurations**:

   - Allows for different API URLs and settings for development, staging, and production

2. **CRUD Operations**:

   - Provides methods for fetching, creating, updating, and deleting posts

3. **Error Handling**:

   - Centralized error handling service
   - Uses Angular Material's MatSnackBar for user-friendly error messages

4. **Interceptors**:

   - HTTP interceptor for adding headers and handling global HTTP-related tasks

5. **Responsive Design**:

   - Utilizes Angular Material and custom CSS for a responsive layout

6. **Lazy Loading**:
   - Implements lazy loading for optimized performance on larger applications
