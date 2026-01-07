async function getStats() {
    await new Promise((r) => setTimeout(r, 5000)); // fast
    return { users: 120, sales: 54 };
}

export default async function FastStats() {
    const stats = await getStats();

    return (
        <div>
            <h3>📊 Stats</h3>
            <p>Users: {stats.users}</p>
            <p>Sales: {stats.sales}</p>
        </div>
    );
}
