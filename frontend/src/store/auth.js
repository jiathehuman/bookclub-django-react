// Check for login status from user

// Zustand is a store to track distributed information
import {create} from 'zustand'

import {mountStoreDevtool} from 'simple-zustand-devtools'

// Keep track of Auth Stores
const userAuthStore = create((set, get)=>({
    allUserData: null, // user not logged in if null
    loading: false, // track loading state

    // Function gets information from allUserData, returns user_id and username
    // get().allUserData?.user_id uses optional chaining ?.
    // if undefined or null, return undefined
    // || null ensures that if user_id is undefined, defaults to null
    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),
    // Pass in user object and set user info
    setUser: (user) => set({
        allUserData: user
    }),
    // Set loading status to be true or false
    setLoading: (loading) => set({
        loading
    }),
    // Check if allUserData is not Null
    isLoggedIn: () => get().allUserData !== null
}))

// Dev tool to identify and fix issues with store
if(import.meta.env.DEV){ // check if environment variable DEV is set to true
    mountStoreDevtool("Store", userAuthStore); // initialise store
}

export {userAuthStore};