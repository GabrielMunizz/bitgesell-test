# Solution Overview

## 1. Approach

### Backend

#### Blocking I/O

- Replaced blocking file system operations with an asynchronous readFileAsync function using fs.promises.readFile to avoid blocking the event loop.
- Refactored all routes that accessed the file system to use async/await, improving server responsiveness under load.

#### Performance

- I created a getStats function that caches the stats based on the file's last modified timestamp using fs.promises.stat.
- The idea is to avoid unnecessary disk reads. Whenever someone hits the /api/stats endpoint, the function checks if the file has changed since the last read.
- If it hasn’t changed, we just return the cached data.
- If it has, we read the file again, recalculate the stats, and update the cache.
- This helps keep the API responsive, especially if the endpoint is hit frequently.

#### Memory Leak

- The issue was that the fetchItems function was still trying to update state even after the component had unmounted, which can cause a memory leak.
- To fix this, I used an AbortController and passed its signal to the fetchItems call so the request could be cancelled if the component unmounts.
- Since the fetch logic runs inside a useEffect, I just had to update its cleanup function to invoke controller.abort() when the component unmounts.

#### Pagination & Search

- Updated the backend to support pagination by accepting page and limit as query parameters, both in the Elasticsearch query and in the fallback logic.
- Modified the backend response to include results, total, page, and limit so the frontend could display paginated data correctly.
- Fixed a bug in the frontend fetch URL where limit was being ignored due to a missing & separator in the query string.
- Built a pagination component on the frontend using Array.from() to generate page numbers, and added a visual indicator (underline) for the active page.

#### Performance

- Integrated react-window to virtualize the item list and ensure smooth UI performance when rendering large datasets.
- Created an ItemList component using FixedSizeList from react-window to efficiently render visible items only.
- Added a fallback message "No items found" when no results are passed via props.

## 2. Features Implemented

- Server-side pagination with search (q query param)
- Virtualized item list using react-window for better performance with large datasets
- Elasticsearch integration for efficient search (fallback to local filtering if it fails)
- Fallback if Elasticsearch fails
- Loading indicator and error handling for improved UX
- Automated tests for both backend and frontend (using Jest and Testing Library)

## 3. Trade-offs

- I used components and hooks (useState, useEffect) to manage state and side effects.
- Code was split into small reusable components like ItemList, Pagination, and Loader, improving readability and maintainability.
- I didn’t style the app much to deliver on time because my schedule is tight. If I had more time, I’d use Tailwind to make it look better. For now, I focused on making it work well.
- Added mocks so tests could run properly without API dependency.
- I chose to use Elasticsearch because I noticed the filter function was marked as “sub-optimal.” Added a fallback for safety.

## 4. How to Run

To benefit from Elasticsearch use the command bellow in the terminal before start the application:

- $ docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.12.1

If don't have docker installed, don't worry. It will take just a little longer to render items.

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```
