import "./App.css"

import { Editor } from "@monaco-editor/react"
import { useRef, useMemo, useState, useEffect } from "react"
import { MonacoBinding } from "y-monaco"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

function App() {

    const editorRef = useRef(null)
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState(() => {
        return new URLSearchParams(window.location.search).get("username") || ""
    })

    const ydoc = useMemo(() => new Y.Doc(), [])
    const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

    const handleMount = (editor) => {
        editorRef.current = editor
        const monacoBinding  = new MonacoBinding(
                yText,
                editorRef.current.getModel(),
                new Set([editorRef.current]),
            )
        
    }

    const handleJoin = (e) => {
        e.preventDefault();

        setUsername(e.target.username.value)
        window.history.pushState({}, "", "?username=" + e.target.username.value)
    }

    useEffect(() => {
        if(username) {
            // connects user with the server
            const provider = new SocketIOProvider(
                "/", // since the dist will be inside the backend folder runs on same port
                "monaco",
                ydoc,
                { autoConnect: true }
            )

            // awareness -> tracks user presence and state
            // 1 user -> 1 state

            // setLocalStateField -> sets the local state of the user
            provider.awareness.setLocalStateField("user", {username})

            // change event -> triggered when the state of any user changes
            provider.awareness.on("change", () => {

                const states = Array.from(provider.awareness.getStates().values())
                setUsers(
                    states
                    .filter(state => state.user && state.user.username)
                    .map(state => state.user)
                )
            })

            // beforeunload event -> triggered when the user closes the page
            function handleBeforeUnload() {
                provider.awareness.setLocalStateField("user", null)
            }

            window.addEventListener("beforeunload", handleBeforeUnload)

            

            return () => {
                provider.destroy()
                window.removeEventListener("beforeunload", handleBeforeUnload)
            }
        }
    },[
        username
    ])

    if(!username){
        return(
            <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
                <form 
                onSubmit={handleJoin}
                className="flex flex-col gap-4"
                >
                    <input 
                    type="text" 
                    placeholder="Enter your username" 
                    name="username"
                    className="p-2 rounded-lg bg-gray-800 text-white"
                    />
                    <button className="p-2 rounded-lg bg-amber-50 text-gray-950 font-bold">
                        Join
                    </button>
                </form>
            </main>
        )
    }

  return (
    <main 
    className="h-screen w-full bg-[#0a0e1a] flex">
        <aside
        className="h-full w-72 bg-[#1a1f2e] border-r border-slate-800/50 flex flex-col backdrop-blur-xl"
        >
            <div className="px-6 py-5 border-b border-slate-800/50">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
                        Collaborators
                    </h2>
                    <div className="px-2.5 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <span className="text-xs font-medium text-blue-400">
                            {users.length} online
                        </span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Active in this session</p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {users.map((user, index) => (
                    <li 
                    key={index} 
                    className="list-none px-3 py-2.5 bg-slate-800/30 rounded-lg border border-slate-700/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20 ring-2 ring-slate-700/50">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1a1f2e] shadow-sm"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-slate-200 block truncate">
                                    {user.username}
                                </span>
                                <span className="text-xs text-slate-500">
                                    Viewing code
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </div>
        </aside>
        
        <section
        className="flex-1 bg-[#1e1e1e] pt-4">
            <Editor 
                height="100%"
                defaultLanguage="javascript"
                defaultValue="// write your code here"
                theme="vs-dark"
                onMount={handleMount}
            />
        </section>
    </main>
  )
}

export default App
