import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    単語帳
                </Link>
                <div className="space-x-4">
                    <Button asChild variant="ghost">
                        <Link href="/create">問題を作成</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/solve">問題を解く</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
