# Brief: Near Earth Asteroid Monitor

## Objective

Complete dashboard for monitoring near earth asteroids, with real-time data visualization, alerts, and educational resources.

## Stack
- Backend: FastAPI, Python, PostgreSQL
- Frontend: Next.js, Shadcn UI
- Visualization: Recharts
- API Integration: NASA's Near Earth Object Web Service (NeoWs)

## Main Components
- Real-time asteroid tracking
- Data visualization of asteroid trajectories and characteristics
- Alert system for potentially hazardous asteroids
- Educational resources about asteroids and space safety
- User-friendly interface for exploring asteroid data
- Responsive design for accessibility on various devices
- Asteroid list with filtering and sorting options (size, distance, velocity, etc.)
- Detailed asteroid profiles with information on name, minimum distance (km), estimated size (m), velocity (km/h), trajectory, and potential impact risk
- Interactive 3D visualization of asteroid trajectories (using Three.js or similar library)
- Alert system with customizable thresholds for distance and size of asteroids
- Graphics and visual elements to make the dashboard engaging and informative
- scatter or line chart for live nearing asteroids, with size representing estimated size and color representing velocity
- Map visualization showing the trajectory of asteroids relative to Earth
- Educational section with articles, videos, and infographics about asteroids, their impact on Earth, and space safety measures
- Every asteroid has a profile page with detailed information, including name, minimum distance (km), estimated size (m), velocity (km/h), trajectory, and potential impact risk (endpoint: /neo/{id} must pass through the proxy backend to fetch data from NASA's API and cache it for future requests)
- Skeleton loading states for all data visualizations and asteroid profiles to enhance user experience during data fetching
- Clear messages and indicators for loading states, errors, and empty states in the UI
- UI like anime style, with dark mode and space-themed design elements to make the dashboard visually appealing and engaging for users interested in space and asteroids
- sound effects for alerts and interactions to enhance user engagement and create an immersive experience when monitoring near earth asteroids


## Constraints
- Must be responsive and accessible on various devices (desktop, tablet, mobile)
- Must provide real-time updates on asteroid data without requiring page refreshes
- Must be visually engaging and informative, with clear data visualizations and educational resources
- Must handle errors gracefully, with clear messages for users when data cannot be fetched or when there are issues with the API
- Must be developed using open-source libraries and tools, without relying on paid services for core functionality
- Must prioritize performance and optimize data fetching and rendering to ensure a smooth user experience, especially when dealing with real-time data updates and visualizations
- Must implement a caching mechanism to store recent asteroid data and serve it efficiently, reducing the number of API calls to NASA's NeoWs and ensuring compliance with rate limits
- Must provide an intuitive and user-friendly interface for exploring asteroid data, with clear navigation and interactive elements to enhance user engagement and facilitate learning about near earth asteroids and space safety measures
- Must implement a robust alert system that allows users to set customizable thresholds for distance and size of asteroids, providing timely notifications for potentially hazardous asteroids based on real-time data updates from NASA's API
- Must ensure that all data visualizations are accurate and up-to-date, reflecting the latest information on near earth asteroids as provided by NASA's NeoWs API, while also providing clear indicators for loading states, errors, and empty states to enhance user experience and maintain transparency about the status of data fetching and rendering processes


## Expected Output
- An HTML Prototype of the dashboard that demonstrates the core functionality, including real-time asteroid tracking, data visualizations, alert system, and educational resources, while also showcasing the responsive design and user-friendly interface, don't build the entire app without human review and feedback, as the prototype should serve as a proof of concept for the final product and allow for iterative improvements based on user testing and feedback