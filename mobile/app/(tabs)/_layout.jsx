import { Redirect, Stack } from 'expo-router'
import {useAuth} from '@clerk/clerk-expo'

const TabsLayout = () => {
  const {isSignedIn} = useAuth();

  if(!isSignedIn) return  <Redirect href={"/mobile/app/(auth)/sign-in.jsx"}/>
  return (
    <Stack/>
  )
}

export default TabsLayout