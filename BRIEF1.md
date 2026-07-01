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
- Proxy backend caching data from NASA's API to optimize performance and reduce API calls (FastAPI cache or Redis)
- Responsive design for accessibility on various devices
- Asteroid list with filtering and sorting options (size, distance, velocity, etc.)
- Detailed asteroid profiles with information on name, minimum distance (km), estimated size (m), velocity (km/h), trajectory, and potential impact risk
- Interactive 3D visualization of asteroid trajectories (using Three.js or similar library)
- Alert system with customizable thresholds for distance and size of asteroids
- API accepts max 7 days of data, so implement a caching mechanism to store and serve recent data without hitting the API limit
- Graphics and visual elements to make the dashboard engaging and informative
- scatter or line chart for live nearing asteroids, with size representing estimated size and color representing velocity
- Map visualization showing the trajectory of asteroids relative to Earth
- Educational section with articles, videos, and infographics about asteroids, their impact on Earth, and space safety measures
- User authentication and personalized settings for alerts and data visualization preferences (optional, depending on time constraints)
- Every asteroid has a profile page with detailed information, including name, minimum distance (km), estimated size (m), velocity (km/h), trajectory, and potential impact risk (endpoint: /neo/{id} must pass through the proxy backend to fetch data from NASA's API and cache it for future requests)
- Skeleton loading states for all data visualizations and asteroid profiles to enhance user experience during data fetching
- Clear messages and indicators for loading states, errors, and empty states in the UI
- UI like anime style, with dark mode and space-themed design elements to make the dashboard visually appealing and engaging for users interested in space and asteroids
- sound effects for alerts and interactions to enhance user engagement and create an immersive experience when monitoring near earth asteroids


## Constraints
- NASA's API has a rate limit of 1000 requests per hour, so implement caching to minimize API calls and ensure the dashboard remains responsive
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
- A fully functional dashboard that provides real-time updates on near earth asteroids, with interactive data visualizations, educational resources, and a robust alert system, all while ensuring performance, accessibility, and compliance with NASA's API rate limits
- Real-time tracking of near earth asteroids with accurate and up-to-date information
- Engaging and informative visualizations of asteroid trajectories, characteristics, and potential impact risks
- A user-friendly interface that allows users to explore asteroid data, set customizable alerts, and access educational resources about asteroids and space safety measures
- A caching mechanism that efficiently stores and serves recent asteroid data, minimizing API calls to NASA's NeoWs and ensuring compliance with rate limits while maintaining a responsive user experience
- Clear messages and indicators for loading states, errors, and empty states in the UI to enhance user experience and maintain transparency about the status of data fetching and rendering processes
- An immersive and visually appealing design that captures the interest of users interested in space and asteroids, with sound effects for alerts and interactions to enhance user engagement and create an engaging experience when monitoring near earth asteroids.
- A proxy backend that caches data from NASA's API to optimize performance and reduce API calls, ensuring that the dashboard remains responsive and up-to-date with the latest asteroid information while adhering to NASA's API rate limits.
- Customizable alert system that allows users to set thresholds for distance and size of asteroids, providing timely notifications for potentially hazardous asteroids based on real-time data updates from NASA's API, while also ensuring that the alert system is robust and reliable in delivering notifications to users.
- Interactive 3D visualization of asteroid trajectories that provides users with an engaging and informative way to explore the paths of near earth asteroids relative to Earth, while also ensuring that the visualizations are accurate and up-to-date based on real-time data from NASA's API.
- Customizable theme options, including dark mode and space-themed design elements, to enhance the visual appeal of the dashboard and create an immersive experience for users interested in space and asteroids, while also ensuring that the design is user-friendly and accessible across various devices.
