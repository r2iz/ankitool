import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <h1 className="text-4xl font-bold">単語帳へようこそ</h1>
            <p className="text-xl max-w-2xl">
                身内向けのものであり、完璧な動作を保証するものではありません。
            </p>
            <div className="flex space-x-4">
                <Button asChild size="lg">
                    <Link href="/create">問題を作成する</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/solve">問題を解く</Link>
                </Button>
            </div>
        </div>
    );
}
