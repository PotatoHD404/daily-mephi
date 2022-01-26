import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from "next-auth/react"
//https://next-auth.js.org/configuration/options

export default function Component() {
    const {data: session} = useSession()
    if (session) {

            return (
                <>
                    Signed in as {session.user?.email ?? 'wha'} <br/>
                    <button onClick={() => signOut()}>Sign out</button>
                </>
            )
    }
    return (
        <>
            Not signed in <br/>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}
