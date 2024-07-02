--------------------------------
## How to setup
--------------------------------

## for local setup
1. Install the required dependencies. (`Yarn` is the recommended package manager, but you can use `npm`, just delete first the `package.lock.json`)
    ex. `yarn install`
2. Run the app `npm start`
3. Go to `http://localhost:3000/`

## production: 
1. You can access the production build here: `https://profile-mgnt-frontend.vercel.app/`


--------------------------------
### Bug Identification and Fixes 
--------------------------------

1. Inefficient `key` usage in list rendering. Using `Math.random()` as a key for React list items is not recommended. It can cause unnecessary re-renders. Use `item.id` instead.

2. The `generateDataItems()` function should be placed in a utility file or module to keep the codebase well-organized and separate from React components. This approach ensures that utility functions remain modular and easily reusable across different parts of the application.

3. It looks like these two functions `generateDataItems()` & `processedItems()` require expensive computation and depend on specific inputs: `count` , `dataItems` & `searchTerm`. To avoid unnecessary re-computations and ensure the functions only re-run when these inputs change, we should `memoize` them using the `useMemo` hook. Memoizing these functions can significantly improve performance, especially if dataItems or searchTerm change infrequently.

4. In the original `processedItems()` function, the accumulator (`acc`) is spread into a new array on every iteration, which can be inefficient. Instead, directly pushing to the accumulator is more performance-friendly. Using `Array.push()` instead of the spread operator within each iteration of reduce can significantly improve performance, especially when dealing with large arrays. The spread operator creates a new array each time, which involves allocating new memory and copying all elements from the old array to the new one. This process is computationally expensive. In contrast, `Array.push()` modifies the existing array in place, thereby avoiding the overhead associated with creating new arrays and copying elements, resulting in more efficient memory and time usage.

5. In the original function, it was defined as an IIFE (Immediately Invoked Function Expression). The issue with an IIFE is that it executes immediately when it is defined, meaning the `processedItems()` function is computed every time the component renders, regardless of whether dataItems or searchTerm have changed. This can lead to unnecessary computations and recomputes on every render, potentially causing performance issues, especially with large datasets.

6. The `total()` function has several issues. First, it doesn't return a value, making total `undefined`. Being an IIFE (Immediately Invoked Function Expression), it executes immediately, leading to unnecessary computations and recomputes on every render. Additionally, the reduce method is misused, and mapping dataItems to extract numbers before reducing is redundant. This can be handled directly within reduce.
To improve this function, we should refactor it to avoid using an IIFE and ensure it only recalculates the total when necessary. By using `useMemo`, we can memoize the computed total, ensuring that it is only recalculated when dataItems changes. This approach avoids unnecessary recomputations and enhances performance, especially with large datasets.

7. I noticed that the `getAllProfiles()` and `createProfile()` functions use an interface (`IUserProfile`) from the backend. To maintain separation between the frontend and backend, I created distinct interfaces for the frontend. This ensures that changes in the backend schema don't immediately impact the frontend. Additionally, the frontend may only require a subset of the data or represent it differently. For example, sensitive information such as passwords should never be exposed in the frontend. This approach keeps the frontend and backend decoupled, enhancing security and flexibility.

8. I added the tags property to the `IUserProfile` interface, which is needed in the UserProfileForm component. This addition ensures that the form can handle user tags, enhancing its functionality and aligning with the interface definition. This change allows for the inclusion of tags when creating or editing user profiles, providing a more comprehensive and flexible user management experience. I also  include an optional `_id` field (_id?: string). This adjustment is necessary because the `_id` is not required when adding a new user

9. The error in `UserProfileForm` is that `handleChange` needs to handle different types of inputs properly, particularly the number type for the age field. Additionally, it should ensure correct value types for controlled components

10. Move the `UserProfileList`, `UserProfileForm` & `DataTable` components to separate files. Separating components into different files makes the project more organized and manageable. It improves code readability and maintainability, ensuring each file remains concise and focused. This modular approach reduces the risk of accidental changes to other components, enhances reusability, and promotes the DRY (Don't Repeat Yourself) principle.

--------------------------------
## Performance Optimizations
--------------------------------

1. While the app is currently simple, using local state is sufficient and requires no extra dependencies. However, as the application grows, state management can become increasingly complex and harder to maintain. This is where Redux, especially with Redux Toolkit, becomes beneficial. Redux centralizes state management, making the state of the entire application easier to manage and debug. It ensures predictable state updates, enhancing stability. Redux Toolkit with RTK Query streamlines data fetching and API requests with mutations, incorporating built-in caching mechanisms. These tools further simplifies the setup and reduces boilerplate, making the codebase more maintainable. 

2. Implemented `debounce` logic on the search input to prevent excessive re-renders and data processing as the user types.

3. Implemented useMemo and useCallbacks:
    - Memoizing `generateDataItems(count)` ensures that the data items are only regenerated when count changes, not on every render.
    - Memoizing the `processedItems` ensures that the filtering and transformation logic only runs when dataItems or debouncedSearchTerm change.
    - Memoizing the `total` calculation ensures that calcTotal only runs when processedItems changes, not on every render.
    - Memoizing the `paginated items` ensures that the pagination logic only runs when processedItems, currentPage, or itemsPerPage change.
    - Memoizing `handleSearch` ensures that the function identity remains stable, preventing unnecessary re-renders of components that depend on this handler.
    - Memoizing `handlePageChange` ensures that the function identity remains stable, preventing unnecessary re-renders of components that depend on this handler.

4. Implement `Suspense` and `React.lazy`:
    - By splitting the code into smaller chunks, the initial load time of the application will be reduced. This is especially beneficial for larger applications with many routes and components. It will only load what is necessary at any given time, reducing the amount of JavaScript that needs to be parsed and executed on initial load and we can also display a spinner animation while components are loading.
5. Used `RTK Query` for data fetching instead of axios because it has built-in caching, 
    automatic re-fetching, reduced boilerplate and enhance type safety with generated hooks for API endpoints

--------------------------------
## Identifying Other Issues 
--------------------------------

1. Use useMemo to memoize the filtered and processed data to improve performance by avoiding unnecessary recalculations on every render
2. Use CSS utility libraries like TailwindCSS to enhance the UI and ensure responsiveness across different platforms. TailwindCSS offers a range of pre-defined classes that streamline styling and layout adjustments, making it easier to create a consistent, responsive design without writing custom CSS for each element. This approach not only speeds up development but also maintains a clean and maintainable codebase.
3. To keep the project organized and maintainable, place the TypeScript interfaces in a dedicated folder. This centralizes the type definitions, making them easier to manage and reuse across different parts of the application. This approach enhances code readability and consistency, ensuring that type definitions are easily accessible and modifiable as the project evolves.

**For Future Improvement**
- Set up a continuous integration and deployment pipeline to automate deployment, ensuring consistent code quality and quicker release cycles.
- Create a docker setup and deploy in docker container
- Create unit test for each components
- Add Login Functionality and Authorization handling

### Optional Enhancements
1. Added CRUD functionality for user profiles.
2. Added modal dialog for the add & update functionality using the 
    the same modal component for code reusability
3. Added pagination to DataTable & UserProfile table for better performance with large datasets.
4. Created custom error handling in all API calls
5. Created custom input validation (helpers.ts)
6. Enhance the tags and set different colors based on tag value
7. Added Searchbox and Pagination components that can be shared by diffrent components
8. Added an animated success message after adding/updating user


* * Due to time constraints during the exam, I was unable to implement the `Login` functionality `(Authentication & Authorization)` in the application. While these features are crucial for securing access and managing user permissions, they were omitted to focus on other aspects of the application within the limited time available. :-)