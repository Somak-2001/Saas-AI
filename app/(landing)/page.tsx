import { Button } from "@/components/ui/button";
import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <h1 className="text-xl text-green-600 m-5">This is landing page (Unprotected)</h1>
      <div>
        <Link href='/sign-in'>
          <Button>
            Log in
          </Button>
        </Link>
        
        <Link href='/sign-up'>
          <Button>
            Register
          </Button>
        </Link>
      </div>
    </div>
  )
}
