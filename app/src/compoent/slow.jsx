async function getUsers() {
    await new Promise((r) => setTimeout(r, 8000)); // slow (4 sec)
    return ["Rahul", "Aman", "Neha", "Pooja"];
}

export default async function SlowUsers() {
    const users = await getUsers();

    return (
        <div>
            <h3>👥 Users</h3>
            <ul>
                {users.map((u) => (
                    <li key={u}>{u}</li>
                ))}
            </ul>
        </div>
    );
}
