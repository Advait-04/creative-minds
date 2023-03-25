import Message from "components/message";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "utils/firebase";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

export default function Details() {
    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessage] = useState([]);

    //submit a mesage
    const submitMessage = async () => {
        if (!auth.currentUser) return router.push("/auth/login");
        if (!message) {
            toast.error("Dont leave an empty message :(", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });

            return;
        }

        const docRef = doc(db, "posts", routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });

        setMessage("");
    };

    //get comments
    const getComments = async () => {
        const docRef = doc(db, "posts", routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllMessage(snapshot.data().comments);
        });
        // const docSnap = await getDoc(docRef);
        // setAllMessage(docSnap.data().comments);
    };

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    }, [router.isReady]);

    return (
        <div>
            <Message {...routeData}></Message>
            <div className="my-4">
                <div className="flex">
                    <input
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        type="text"
                        value={message}
                        placeholder="Send a message"
                        className="bg-gray-800 w-full p-2 text-white text-sm"
                    />

                    <button
                        onClick={submitMessage}
                        className="bg-cyan-500 text-white py-2 px-4 text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div className="py-6">
                <h2 className="font-bold">Comments</h2>
                {allMessage?.map((message) => (
                    <div
                        key={message.time}
                        className="bg-white p-4 my-4 border-2"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                className="w-10 rounded-full"
                                src={message.avatar}
                                alt=""
                            />
                            <h2>{message.userName}</h2>
                        </div>
                        <h2>{message.message}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
