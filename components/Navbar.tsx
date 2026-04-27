import { Box } from 'lucide-react'
import React from 'react'
import Button from './ui/Button';
import { useOutletContext } from 'react-router';

const Navbar = () => {

    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();
    const handelAuthClick = async() => {
        if(isSignedIn){
            try {
                await signOut();
            } catch (error) {
                console.log(`Puter sign out failed ${error}`)
            }
            return;
        }
        try {
            await signIn();
        } catch (error) {
            console.log(`Puter sign in failed ${error}`)
        }
    }

  return (
    <header className='navbar'>
        <nav className='inner'>
            <div className='left'>
                <div className='brand'>
                    <Box className='logo'/>
                    <span className='name'>RoomDalla</span>
                </div>
                <ul className='links'>
                    <a href='#'>Product</a>
                    <a href='#'>Pricing</a>
                    <a href='#'>Community</a>
                    <a href='#'>Enterprices</a>
                </ul>
            </div>
            <div className='actions'>
                {isSignedIn ? (
                    <>
                        <span className='greeting'>
                            {userName ? `Hi, ${userName}` : `Signed In`}
                        </span>
                        <Button size='sm' onClick={handelAuthClick} className='btn'>Log Out</Button>
                    </>
                ):(
                    <>
                        <Button onClick={handelAuthClick} size='sm' variant='ghost'>Log In</Button>
                        <a href='#uplode' className='cta'>Get Started</a>
                    </>
                )}
                
            </div>
        </nav>
    </header>
  )
}

export default Navbar