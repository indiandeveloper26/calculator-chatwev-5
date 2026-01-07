import { Suspense } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamic imports (Spring lazy @Autowired jaisa feel)
const FastStats = dynamic(() => import("../src/compoent/fast"), {
    suspense: true,
});

const SlowUsers = dynamic(() => import("../src/compoent/slow"), {
    suspense: true,
});

export default function Page() {
    return (
        <div style={{ padding: 20 }}>
            <h1>🚀 Next.js Streaming + Suspense</h1>

            {/* Fast data – pehle aayega */}
            <Suspense fallback={<p>Loading stats...</p>}>
                <FastStats />
            </Suspense>

            {/* Slow data – baad me stream hoga */}
            <Suspense fallback={<p>Loading users (slow)...</p>}>
                <SlowUsers />
            </Suspense>
        </div>
    );
}
