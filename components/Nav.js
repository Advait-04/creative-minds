import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

export default function Nav() {
    const [user, loading] = useAuthState(auth);
    console.log(user);
    return (
        <nav className="flex justify-between items-center py-10 px-10">
            <Link href={"/"}>
                <button className="text-lg font-medium">Creative Minds</button>
            </Link>
            <ul className="flex items-center gap-10">
                {!user && (
                    <Link href={"/auth/login"} legacyBehavior>
                        <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
                            Join Now
                        </a>
                    </Link>
                )}

                {user && (
                    <div className="flex items-center gap-6">
                        <Link href={"/post"}>
                            <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-mg text-sm">
                                Post
                            </button>
                        </Link>
                        <Link href={"/dashboard"}>
                            {/* <Image
                                className="w-11 rounded-full cursor-pointer"
                                src={user.photoURL}
                                alt=""
                                width={50}
                                height={50}
                            /> */}
                            <img
                                className="w-11 rounded-full cursor-pointer"
                                src={user.photoURL}
                                alt=" "
                            />
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    );
}
