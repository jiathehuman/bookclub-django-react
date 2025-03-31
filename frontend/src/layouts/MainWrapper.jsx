import {useEffect, useState} from "react";
import {setUser} from "../utils/auth";

// Functional component that takes object as a prop, as soon as project is mounted, this code is called
const MainWrapper = ({children}) => { // object deconstructed to extract children prop (nested components)
    // Use React's useState Hook to manage a loading state
    // If loading is true, component assumes data is still loading
    // setLoading is function to update loading
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const handler = async () => {
            setloading(true)
            await setUser() // async authentication
            setloading(false) // loading process is complete
        }
        handler();

    },[]);
    // React Fragment <> </> with conditional rendering
    return <>{loading ? null : children}</>
};

export default MainWrapper;