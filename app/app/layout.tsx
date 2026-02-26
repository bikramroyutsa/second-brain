"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Search from "@/components/Search";
const navItems = [
  { name: "Dashboard", href: "/app/dashboard" },
  { name: "Notes", href: "/app/notes" },
  { name: "Map", href: "/app/map" },
  { name: "Quiz", href: "/app/quiz" },
  {name: "Chat", href: "/app/chat"}
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const pathname = usePathname();
  const navBtn =
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors text-slate-400 hover:bg-slate-200";
  return (
    <div className="grid h-screen grid-cols-[250px_1fr]">
      {openSearch && <Search open={openSearch} onClose={()=>setOpenSearch(false)}/>}
      <aside className="border-r p-4">
        <nav className="flex flex-col gap-2">
           <button
              onClick={() => setOpenSearch(true)}
              className={`${navBtn} text-left`}
            >
              Search
            </button>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:bg-slate-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}